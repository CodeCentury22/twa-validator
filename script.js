// Global placeholder for the native message port channel
let nativeCommunicationPort = null;

// 1. Listen for the structural handshake port from Android Custom Tabs
window.addEventListener("message", (event) => {
    // Check if the initialization payload carries native ports
    if (event.ports && event.ports.length > 0) {
        nativeCommunicationPort = event.ports[0];
        console.log("PORT CONNECTION HANDSHAKE SUCCESSFUL!");

        // Set up the message router directly on this isolated port channel
        nativeCommunicationPort.onmessage = (portEvent) => {
            console.log("Data payload received from Android:", portEvent.data);
            
            const targetDiv = document.getElementById("native-output");
            if (targetDiv) {
                targetDiv.innerText = "Received: " + portEvent.data;
            }
        };
        return;
    }

    // Direct fallback layer for string broadcasts
    if (typeof event.data === "string" && !event.data.includes("webpack")) {
        console.log("Direct event listener caught:", event.data);
        const targetDiv = document.getElementById("native-output");
        if (targetDiv) {
            targetDiv.innerText = "Received: " + event.data;
        }
    }
});

// 2. Transmit string objects directly into the secure native port
function sendToApp(msg) {
    if (nativeCommunicationPort) {
        nativeCommunicationPort.postMessage(msg);
        console.log("Message pushed directly to native communication channel:", msg);
    } else {
        console.warn("Channel port uninitialized. Verification pending.");
    }
}

// 3. Attach layout buttons once the document renders completely
document.addEventListener("DOMContentLoaded", () => {
    const actionButton = document.getElementById("send-btn");
    const textInputField = document.getElementById("message-input");

    if (actionButton && textInputField) {
        actionButton.addEventListener("click", () => {
            sendToApp(textInputField.value);
        });
    }
});
