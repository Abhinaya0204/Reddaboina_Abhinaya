function showTempMessage(elementId) {
  const messageBox = document.getElementById(elementId);
  messageBox.style.display = "block";

  setTimeout(() => {
    messageBox.style.display = "none";
  }, 3000);
}

document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();
  showTempMessage("signupMessage");
});

document.getElementById("signinForm").addEventListener("submit", function (e) {
  e.preventDefault();
  showTempMessage("signinMessage");
});
