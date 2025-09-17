// function to test /update-profile
async function updateProfile(profileData) {
    try {
        const response = await fetch("/update-profile", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(profileData)
        });
  
        const result = await response.json();
  
        if (!response.ok) {
            throw new Error("Failed to update profile");
        }
  
        console.log("Profile updated: ", result.user);
    } catch (error) {
        console.error("Update failed: ", error);
    }
}

// function to test /delete-passkey
async function deletePasskey(passkeyId) {
    try {
        const response = await fetch(`/delete-passkey/${passkeyId}`, {
            method: "DELETE",
            credentials: "include"
        });
  
        const result = await response.json();
  
        if (!response.ok) {
            throw new Error("Failed to delete passkey");
        }
  
        console.log("Passkey deleted:", passkeyId);
    } catch (error) {
        console.error("Error deleting passkey:", error);
    }
}

// Allow to use in console for testing
window.updateProfile = updateProfile;
window.deletePasskey = deletePasskey;