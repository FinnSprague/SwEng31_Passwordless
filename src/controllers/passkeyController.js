const User = require("../models/users");

/*
    This controller only contains getPasskeys, deletePasskey, and passkeyStatus.
    For registration and authentication controllers, see authController.
*/

exports.getPasskeys = async (req, res) => {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);
      
      // User isn't registered
      if (!user) {
        return res.json({ passkeys: [] });
      }
  
      const passkeys = user.passkeys.map(passkey => ({
        id: passkey.id,
        createdAt: passkey._id.getTimestamp(),
        lastUsed: passkey.lastUsed || null
      }));
  
      return res.json({ passkeys });
    } catch (error) {
      console.error("Error fetching passkeys:", error);
      return res.status(500).json({ message: "Server error" });
    }
}

exports.deletePasskey = async (req, res) => {
    try {
        const userId = req.user.userId;
        const passkeyId = req.params.passkeyId;
  
        if (!passkeyId) {
            return res.status(400).json({ message: "Passkey ID is required" });
        }
  
        const result = await User.findByIdAndUpdate(
            userId,
            { $pull: 
                { passkeys: { id: passkeyId } } 
            },
            { new: true }
        );
  
        if (!result) {
            return res.status(404).json({ message: "User not found or passkey not removed" });
        }
      
        res.json({ message: "Passkey deleted" });
    } catch(error) {
        console.error("Eror deleting passkey:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getPasskeyStatus = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email || !email.trim()) {
        return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.passkeys?.length) {
        return res.status(404).json({ message: "No passkeys found" });
    }

    const passkeys = user.passkeys.map((p) => ({
      id: p.id,
      createdAt: p.createdAt || null
      // Optionally include more fields:
      // deviceType: p.deviceType,
      // lastUsed: p.lastUsed (if tracked)
    }));

    res.json({ passkeys });
  } catch (error) {
    console.error("Error fetching passkey status:", error);
    res.status(500).json({ message: "Server error" });
  }
};