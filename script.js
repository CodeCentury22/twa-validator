// Send a message to the Android App
function sendToApp(msg) {
  if (window.android && window.android.postMessage) {
    window.android.postMessage(msg);
  }
}

// Receive messages from the Android App
window.addEventListener("message", (event) => {
  console.log("App says:", event.data);
});
