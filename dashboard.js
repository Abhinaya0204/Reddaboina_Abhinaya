// On page load, fetch user's profile image from backend
window.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:5000/user-profile", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      const profilePic = document.getElementById("profilePic");
      if (data.profilePic) {
        profilePic.src = http://localhost:5000/uploads/${data.profilePic};
      }
    })
    .catch((err) => {
      console.error("Error loading profile picture:", err);
    });
});