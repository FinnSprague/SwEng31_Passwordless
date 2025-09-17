const createAppointmentBtn = document.getElementById("create-appointment")
const patientIdInput = document.getElementById("patientId")
const doctorIdInput = document.getElementById("doctorId")
const appointmentDateInput = document.getElementById("appointment-date")
const appointmentTimeInput = document.getElementById("appointment-time")
const appointmentReasonInput = document.getElementById("appointment-reason")

const logoutBtn = document.getElementById("logout-btn")

createAppointmentBtn.addEventListener("click", createAppointment)
logoutBtn.addEventListener("click", logout)

// Function to create an appointment
async function createAppointment() {
	console.log("Create Appointment");
	const appointmentData = {
		patientId: patientIdInput.value.trim(),
		doctorId: doctorIdInput.value.trim(),
		date: appointmentDateInput.value.trim(),
		time: appointmentTimeInput.value.trim(),
		reason: appointmentReasonInput.value.trim()
	};

	try {
		const response = await fetch("/create-appointment", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(appointmentData),
			credentials: "include"
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error("Failed to create appointment");
		}

		console.log("Appointment created:", result.appointment);

	} catch (error) {
		console.error("Error:", error);
	}
}

// Function to get appointments:
async function getAppointments() {
	try {
	  	const response = await fetch("/get-appointments", {
			method: "GET",
			credentials: "include"
	  	});
  
	  	const appointments = await response.json();
  
	  	if (!response.ok) {
			throw new Error("Failed to fetch appointments");
		}
		
		console.log(appointments);

	  	displayAppointments(appointments);
	} catch (error) {
	  	console.error("Error loading appointments:", error.message);
	}
}

// Function to display appointments in html for testing
function displayAppointments(appointments) {
	const tableBody = document.getElementById("appointments-body");
  
	appointments.forEach(appt => {
	  	const row = document.createElement("tr");
  
	  	row.innerHTML = `
			<td>${appt.doctor?.fullName || "N/A"} (${appt.doctor?.email || ""})</td>
			<td>${appt.patient?.fullName || "N/A"} (${appt.patient?.email || ""})</td>
			<td>${new Date(appt.date).toLocaleDateString()}</td>
			<td>${appt.time}</td>
			<td>${appt.description}</td>
	  	`;
  
	  	tableBody.appendChild(row);
	});
}

async function logout() {
	try {
	  	const response = await fetch("/logout", {
			method: "POST",
			credentials: "include"
		});
  
	  	if (!response.ok) {
			throw new Error("Logout failed");
	  	}
		
		// Redirect to log in page
	  	window.location.href = "/";
	} catch (error) {
		console.error("An error occurred: ", error);
	}
}

// Display appointments when page is refreshed
document.addEventListener("DOMContentLoaded", () => {
	getAppointments();
});