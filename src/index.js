import { startAuthentication, startRegistration } from "https://cdn.jsdelivr.net/npm/@simplewebauthn/browser/+esm";

const registerButton = document.getElementById("reg-btn");
const magicLinkButton = document.getElementById("magic-link-btn");
const logInButton = document.getElementById("log-btn");
const emailInput = document.getElementById("email");
const roleInput = document.getElementById("role");


registerButton.addEventListener("click", register);
magicLinkButton.addEventListener("click", magicLink);
logInButton.addEventListener("click", login);

// Cool Down Time for requesting magic link (30 seconds)
const COOLDOWN_TIME = 30000;

/*
 * 	A note on SimpleWebAuthn and mobile implementation.
 *
 *	SimpleWebAuthn requires either https connection with the server
 *	(or a localhost connection) in order for it to work. If you try
 *	register on a mobile (ie through connecting by your local ip a-
 *	ddress, you will find that it will log an error, "WebAuthn is
 *	not supported in this browser". You will also encounter this e-
 *	rror if you go to http://YOURIPADDRESS:5000/ on the device run-
 *	ning the server.
 *
 *	We thus need Azure running to test on mobile devices, but furt-
 *	hermore, we will need our Azure server to use a secure connect-
 *	ion, if we intend to access the website at all on it Azure.
 * 
 */

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed', err));
}

async function login() {
	try {
		const email = emailInput.value.trim();
		const response = await fetch(`/authentication?email=${email}`,
			{ credentials: "include" }
		);
		const options = await response.json();
		console.log(options);

		const authJSON = await startAuthentication({ optionsJSON: options });

		console.log(authJSON);
		const verifyResponse = await fetch("/verify-auth", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(authJSON),
		});

		const verification = await verifyResponse.json();

	}
	catch (error) {
		console.log(error);
	}
}


async function register() {	// register
	try {
		const email = emailInput.value.trim();
		const role = roleInput.value;

		// Check that the email field is not empty
		if (!email) {
			console.log("Email field is empty")
			return;
		}

		// Check that the role field is not empty
		if (!role) {
			console.log("Role field is empty")
		}

		// fetch register page
		const initResponse = await fetch(`/register?email=${email}`,
			{ credentials: "include" }
		);	

		// Check if initResponse was successful
		if (!initResponse.ok) {
			throw new Error('Something went wrong')
		}

		const options = await initResponse.json();	// wait for response
		
		// alert('debug0');

		const regJSON = await startRegistration({ optionsJSON: options }); // pass-key authenticator
		
		// alert('debug1');

		const verResponse = await fetch('/verify-reg', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(regJSON),
		});

		// Check if verResponse was successful
		if (!verResponse.ok) {
			throw new Error('Something went wrong')
		}

		const verificationJSON = await verResponse.json();
		console.log(verificationJSON);
		
	} catch (error) {
		alert(error); 
		console.log("An error occurred during registration.")
	}
}

// Log in with MagicLink
async function magicLink() {
	try {
		const email = emailInput.value.trim();

		// Check that the email field is not empty
		if (!email) {
			console.log("Email field is empty")
			return;
		}

		// Check time of last magic link request
		const lastRequestTime = localStorage.getItem("LastMagicLinkRequest");

		if (lastRequestTime) {
			const time = Date.now() - Number(lastRequestTime);

			// If the cool down has not passed, return an error
			if (time < COOLDOWN_TIME) {
				const remainingTime = Math.ceil((COOLDOWN_TIME - time) / 1000);
				console.log(`Please wait ${remainingTime} seconds before requesting another magic link.`)
				return;
			}
		}

		// Store the current request time
		localStorage.setItem("LastMagicLinkRequest", Date.now().toString());

		// Generate Magic Link
		const initResponse = await fetch(`/generate-magic-link?email=${email}`,
			{ credentials: "include" }
		);

		// Check if initResponse was successful
		if (!initResponse.ok) {
			throw new Error('Something went wrong')
		}

		const responseJSON = await initResponse.json();
		const magicLinkURL = responseJSON.magicLinkURL;

		// Send email to user with the magic link URL
		const templateParms = {
			magicLinkURL: magicLinkURL,
			to_email: email,
		};
		emailjs.send("service_3ce86jc", "template_viqc7ln", templateParms)
	} catch (error) {
		console.log("An error occurred.")
	}
}

// Test /check-auth endpoint when loading login/register page
window.addEventListener("DOMContentLoaded", async () => {
	try {
	  	const res = await fetch("/check-auth", {
			method: "GET",
			credentials: "include"
	  	});
  
	  	const result = await res.json();
		// TODO - When implementing on actual frontend,
		// we should check result.user.role and redirect accordingly
	  	if (result.loggedIn) {
			window.location.href = "/appointments.html";
	  	}
	} catch (error) {
	  	console.error("Auth check failed:", error);
	}
});