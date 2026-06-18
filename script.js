// 1. Receive messages from the Android App
window.addEventListener("message", (event) => {
    console.log("App says:", event.data);
    
    // Dynamically update the UI text with data sent from Android
    const outputDiv = document.getElementById("native-output");
    if (outputDiv) {
        outputDiv.innerText = "Received: " + event.data;
    }
});

// 2. Send a message to the Android App via the injected bridge
function sendToApp(msg) {
    if (window.android && typeof window.android.postMessage === 'function') {
        window.android.postMessage(msg);
        console.log("Message successfully dispatched to Android framework:", msg);
    } else {
        console.warn("Android native bridge ('window.android') is not available in this environment.");
        alert("Bridge not detected! Make sure you are running inside the TWA app, not a standard browser.");
    }
}

// 3. Hook up the HTML button to our function
document.addEventListener("DOMContentLoaded", () => {
    const sendButton = document.getElementById("send-btn");
    const messageInput = document.getElementById("message-input");

    if (sendButton && messageInput) {
        sendButton.addEventListener("click", () => {
            const currentMessage = messageInput.value;
            sendToApp(currentMessage);
        });
    }
});

