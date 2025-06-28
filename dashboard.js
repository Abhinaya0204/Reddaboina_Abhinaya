document.addEventListener("DOMContentLoaded", () => {
  console.log("Dashboard JS Loaded");
  const userName = localStorage.getItem("userName") || "User";
  const profilePic = localStorage.getItem("profilePic");
  document.getElementById("userName").innerText = userName;

  if (profilePic) {
    document.getElementById("userProfile").src =`http://localhost:5000/uploads/${profilePic}`;
  }

  // My Courses click handler
  //document.getElementById("myProfileLink").addEventListener("click",() => {
    //window.location.href="profile.html"; 
  //document.getElementById("changePasswordLink").addEventListener("click",()=> {
    //window.location.href="change-password.html";
  //document.getElementById("logoutLink").addEventListener("click",()=> {
    //localStorage.clear();
    //window.location.href="login.html";
    //});
  document.getElementById("myCoursesLink").addEventListener("click", () => {
    fetch("http://localhost:5000/courses")
      .then(res => res.json())
      .then(data => {
        console.log("Courses received:",data);
        const courseSection = document.getElementById("coursesSection");
        const courseList = document.getElementById("courseList");
        courseList.innerHTML = ""; // clear old list
        data.forEach(course => {
          const courseDiv = document.createElement("div");
          courseDiv.innerHTML = `
            <p>${course.name}</p>
            <button onclick="startTest('${course.name}')">Start Test</button>
          `;
          courseList.appendChild(courseDiv);
        });
        courseSection.style.display="block";
      })
      .catch(err => {
        console.error("Error loading courses:",err);
    });
  });
});
  function startTest(courseName) {
    //alert(`Starting test for: ${courseName}`);
    localStorage.setItem("selectedCourse",courseName);
      window.open("instruction.html", "instructionsWindow","width=1000,height=800");
  }
  function loadTests(courseId, courseName) {
 fetch(`http://localhost:5000/courses/${courseId}/tests`)
    .then(res => res.json())
    .then(tests => {
      const courseList = document.getElementById("courseList");
      courseList.innerHTML =`<h3>${courseName} - Tests</h3>`;
      if (tests.length === 0) {
        courseList.innerHTML +=`<p>No tests available.</p>`;
        return;
      }
      tests.forEach(test => {
        const testDiv = document.createElement("div");
       testDiv.innerHTML = `
         <p>${test.title}</p>
          <button onclick="startTest('${test.title}')">Start Test</button>
        `;
        courseList.appendChild(testDiv);
      });
      const courseSection=document.getElementById("coursesSection");
      courseSection.style.display = "block";
   })
   .catch(err => console.error("Error loading tests:", err));
  }
  function logout() {
  localStorage.clear();
  alert("Logged out successfully!");
  window.location.href = "login.html";
}
