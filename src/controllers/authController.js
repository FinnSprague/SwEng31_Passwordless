const { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } = require("@simplewebauthn/server");

const User = require("../models/users");

const expOrigin = "http://localhost:5173";
//const expOrigin = "http://localhost:5000";

const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authentication = async (req, res) => {
	const qEmail = req.query.email;
	if (!qEmail) {
		return res.status(400).json({message: "Email is required"});
	}

	const queryResult = await User.findOne({ email: qEmail});
	if (!queryResult) {
		return res.status(404).json({message: "User not found"});
	}

	const options = await generateAuthenticationOptions({
		rpID: "localhost",
		allowCredentials: queryResult.passkeys.map((passkey) => ({
      id: passkey.id,
      type: "public-key",
      transports: passkey.transports,
    })),
	});
  
	res.cookie(
		"authInfo",
		JSON.stringify({
			userId: queryResult._id,
			challenge: options.challenge,
		}),
		{ httpOnly: true, maxAge: 60000 }
	);
  
	res.json(options);
};

exports.verifyAuthentication = async (req, res) => {

	const authInfo = JSON.parse(req.cookies.authInfo);
	console.log(authInfo);

	if (!authInfo) {
		return res.status(400).json({ message: "Authentication info not present" });
	}
  
	const user = await User.findOne({ _id: authInfo.userId});
	console.log(user, authInfo.userId);

	if (!user) {
		return res.status(400).json({ message: "Invalid user" });
	}

	//console.log(Buffer.from('pQECAyYgASFYIEAB0sgOl5RJnpJin36z8EYlKjRAYDk6BrAtIXIM+YFiIlggFkz/Eg5pRLgT+1fR+XIEeIae9z0KXbDiLCVcmq4qTUE=', 'base64'));
	console.log(new Uint8Array(user.passkeys.publicKey));

  const credentialId = req.body.id;
  if (!credentialId) {
    return res.status(400).json({ message: "No credential ID provided" });
  }
  
  const passkey = user.passkeys.find(p => p.id === credentialId);
  if (!passkey) {
    return res.status(400).json({ message: "Passkey not found for this user" });
  }

  console.log("Using passkey:", passkey);

	const verification = await verifyAuthenticationResponse({
		response: req.body,
		expectedChallenge: authInfo.challenge,
		expectedOrigin: expOrigin,
		expectedRPID: "localhost",
		//credentialPublicKey: new Uint8Array(user.publicKey),
		authenticator: {
			credentialID: passkey.id,
			//credentialPublicKey: new Uint8Array(user.publicKey),
			counter: passkey.counter,
			transports: passkey.transports
		},
		credential: {
			counter: passkey.counter,
			publicKey: new Uint8Array(passkey.publicKey),
			// PublicKey: new Uint8Array(user.publicKey),
		},
	});

	if (verification.verified) {
		res.clearCookie("authInfo");
		console.log("verified");
		// SET COOKIE HERE
		//
		const jwtToken = jwt.sign(
            // For testing: role is hardcoded to doctor
            // TODO : Make role dynamic
      			{ email: user.email, userId: user._id, role: "doctor" },
      			process.env.JWT_SECRET,
     			{ expiresIn: '1h' }
    		);
		
    		// Set the JWT in an HTTP-only cookie
    		res.cookie('token', jwtToken, {
      			httpOnly: true,
      			secure: true,
      			sameSite: 'Strict',
      			maxAge: 3600000  // 1 hour expiration
    		});
		
		return res.json({ verified: verification.verified, role: user.role });
	} else {
    return res.status(400).json({ message: "Authentication failed" });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, role } = req.query;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!role || !["doctor", "nurse", "patient"].includes(role.toLowerCase())) {
      return res.status(400).json({ message: "Valid role is required" });
    }

    const normalizedRole = role.toLowerCase();

    let user = await User.findOne({ email });

    const userPasskeys = user?.passkeys || [];

    const options = await generateRegistrationOptions({
      rpID: "localhost",
      rpName: "Sweng25",
      userName: email,
      userDisplayName: email,
      excludeCredentials: userPasskeys.map(passkey => ({
        id: passkey.id,
        transports: passkey.transports,
      })),
      excludeCredentials: userPasskeys.map(passkey => ({
        id: passkey.id,
        transports: passkey.transports,
      })),
    });

    // console.log("debug0");

    res.cookie(
      "reg",
      JSON.stringify({
        userId: options.user.id,
        email,
        role: normalizedRole, //  store role in cookie
        challenge: options.challenge,
      }),
      { httpOnly: true, maxAge: 120000 }
    );

    // console.log("debug1");

    res.status(200).json(options);

  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyRegistration = async (req, res) => {
  try {
    const regInfo = JSON.parse(req.cookies.reg);

    console.log(regInfo.email);

    // console.log("debug1");

    const verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge: regInfo.challenge,
      expectedOrigin: expOrigin,
      expectedRPID: "localhost",
    });

    // console.log("debug2");

    if (verification.verified) {
      const { registrationInfo } = verification;
      const { credential, credentialDeviceType, credentialBackedUp } = registrationInfo;

      let user = await User.findOne({ email: regInfo.email });

      if (user) {
        user.passkeys.push({
          email: regInfo.email,
          webAuthnUserID: regInfo.userId,
          id: credential.id,
          publicKey: Buffer.from(credential.publicKey),
          counter: credential.counter,
          transports: credential.transports,
          deviceType: credentialDeviceType,
          backedUp: credentialBackedUp
        });
        await user.save();
      } else {
        user = new User({
          email: regInfo.email,
          role: regInfo.role, //  store role in DB
          passkeys: [{
            email: regInfo.email,
            webAuthnUserID: regInfo.userId,
            id: credential.id,
            publicKey: Buffer.from(credential.publicKey),
            counter: credential.counter,
            transports: credential.transports,
            deviceType: credentialDeviceType,
            backedUp: credentialBackedUp
          }],
          isVerified: false
        });
        await user.save();
      }

      const token = jwt.sign(
        { email: regInfo.email, userId: user._id, role: regInfo.role }, // Use dynamic role
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Set the JWT in an HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 3600000  // 1 hour expiration
      });

      res.clearCookie("reg");
      return res.json({ verified: true, token });
    }

    res.status(400).json({ verified: false });
  } catch (error) {
    console.error("Error in /verify-reg:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");

    res.status(200).json({ message: "Logged out successfully" });
  } catch(error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.checkAuth = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ loggedIn: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      loggedIn: true,
      user: {
        email: decoded.email,
        role: decoded.role
      }
    });
  } catch (error) {
    return res.status(401).json({ loggedIn: false });
  }
};