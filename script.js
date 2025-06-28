// script.js

document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname;

  // ----------------- REGISTER ------------------
  if (currentPage.includes("register.html")) {
    const registerForm = document.getElementById("signupForm");

    if (registerForm) {
      registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(registerForm);

        fetch("http://localhost:5000/register", {
          method: "POST",
          body: formData
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              alert("Registered successfully! Check your email for the password.");
              window.location.href = "login.html";
            } else {
              alert("Registration failed. Try again.");
            }
          })
          .catch(err => {
            console.error("Registration Error:", err);
            alert("Something went wrong during registration.");
          });
      });
    }
  }

  // ----------------- LOGIN ------------------
  if (currentPage.includes("login.html")) {
    const loginForm = document.getElementById("signinForm");

    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.querySelector("input[name='email']").value;
        const password = document.querySelector("input[name='password']").value;

        fetch("http://localhost:5000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              localStorage.setItem("userName", data.user.fullName);
              localStorage.setItem("profilePic", data.user.profilePic);
              localStorage.setItem("useremail",data.user.email);
              window.location.href = "dashboard.html";
            } else {
              alert("Invalid credentials. Please try again.");
            }
          })
          .catch(err => {
            console.error("Login Error:", err);
            alert("Login failed. Please try again.");
          });
      });
    }
  }

  // ----------------- DASHBOARD ------------------
  if (currentPage.includes("dashboard.html")) {
    const userName = localStorage.getItem("userName");
    const profilePic = localStorage.getItem("profilePic");

    if (userName && document.getElementById("userName")) {
      document.getElementById("userName").innerText = userName;
    }

    if (profilePic && document.getElementById("profilePic")) {
      document.getElementById("profilePic").src =`uploads/${profilePic}`;
    }

    // Fetch and show courses (optional if needed)
    const myCoursesBtn = document.getElementById("myCoursesBtn");
    const coursesList = document.getElementById("coursesList");

    if (myCoursesBtn && coursesList) {
      myCoursesBtn.addEventListener("click", () => {
        fetch("http://localhost:5000/courses")
          .then(res => res.json())
          .then(courses => {
            coursesList.innerHTML = "";
            courses.forEach(course => {
              const courseDiv = document.createElement("div");
              courseDiv.innerHTML = `
                <h4>${course.name}</h4>
                <button onclick="startTest(${course.id})">Start Test</button>
              `;
              coursesList.appendChild(courseDiv);
            });
          });
      });
    }
  });
// ----------------- TEST REDIRECT ------------------
function startTest(courseId) {
  localStorage.setItem("selectedCourse", courseId);
  window.location.href = "instruction.html";
}