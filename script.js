// Global variable to hold the communication port sent by Android
let androidPort = null;

// 1. Listen for the secure communication channel from the Android app
window.addEventListener("message", (event) => {
    // Check if the incoming message contains communication ports
    if (event.ports && event.ports.length > 0) {
        androidPort = event.ports[0];
        console.log("SUCCESS: Android communication port bound securely!");

        // Set up an event listener directly on the port to handle future incoming data from Android
        androidPort.onmessage = (portEvent) => {
            console.log("App says:", portEvent.data);
            const outputDiv = document.getElementById("native-output");
            if (outputDiv) {
                outputDiv.innerText = "Received: " + portEvent.data;
            }
        };
        return;
    }

    // Fallback logic for simple string broadcasts (like your initial native greeting)
    if (typeof event.data === "string" && !event.data.includes("webpack")) {
        console.log("App says (direct broadcast):", event.data);
        const outputDiv = document.getElementById("native-output");
        if (outputDiv) {
            outputDiv.innerText = "Received: " + event.data;
        }
    }
});

// 2. Updated function to send a message back to the Android App
function sendToApp(msg) {
    if (androidPort) {
        // Post the message directly into the validated channel port
        androidPort.postMessage(msg);
        console.log("Message successfully dispatched into Android Port channel:", msg);
    } else {
        console.warn("Communication port is not ready yet. Ensure Digital Asset Links are verified.");
        alert("Android port not detected! Wait for the 'bridge open' log.");
    }
}

// 3. Hook up the HTML button interface element
document.addEventListener("DOMContentLoaded", () => {
    const sendButton = document.getElementById("send-btn");
    const messageInput = document.getElementById("message-input");

    if (sendButton && messageInput) {
        sendButton.addEventListener("click", () => {
            sendToApp(messageInput.value);
        });
    }
});
