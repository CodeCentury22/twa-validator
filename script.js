let nativeCommunicationPort = null;

function processIncomingPayload(rawData) {
    try {
        const parsedData = JSON.parse(rawData);
        
        if (parsedData.type === "PERSON_DATA") {
            // Target the clean value inputs instead of an absolute text block container
            document.getElementById("input-name").value = parsedData.name || '';
            document.getElementById("input-age").value = parsedData.age || '';
            document.getElementById("input-location").value = parsedData.location || '';
            
            document.getElementById("status-banner").innerText = "Connection Status: Synced Successfully!";
            document.getElementById("status-banner").style.color = "#28a745";
            console.log("Successfully rendered structured profile framework objects.");
        }
    } catch (error) {
        if (!rawData.includes("webpack")) {
            document.getElementById("status-banner").innerText = "Data: " + rawData;
        }
    }
}

window.addEventListener("message", (event) => {
    if (event.ports && event.ports.length > 0) {
        nativeCommunicationPort = event.ports[0];
        console.log("Communication port bound.");
        nativeCommunicationPort.onmessage = (portEvent) => {
            processIncomingPayload(portEvent.data);
        };
        return;
    }
    if (event.data) {
        processIncomingPayload(event.data);
    }
});

function sendToApp(msg) {
    if (nativeCommunicationPort) {
        nativeCommunicationPort.postMessage(msg);
    } else {
        console.warn("Port channel is currently disconnected.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("send-btn")?.addEventListener("click", () => {
        sendToApp("REQUEST_PERSON");
    });
    document.getElementById("close-btn")?.addEventListener("click", () => {
        sendToApp("FINISH_SESSION");
    });
});
