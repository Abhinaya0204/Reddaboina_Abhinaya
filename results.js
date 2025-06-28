document.addEventListener('DOMContentLoaded', () => {
  const resultData = JSON.parse(localStorage.getItem('testResults') || '{}');
  if (!resultData.questions) return;

  const { score, totalQuestions, questions } = resultData;
  const percentage = ((score / totalQuestions) * 100).toFixed(2);

  document.getElementById('score').textContent = `${score} / ${totalQuestions}`;
  document.getElementById('percentage').textContent = `${percentage}%`;

  const solutionContainer = document.getElementById('solutions'); // ✅ Match the HTML ID

  questions.forEach((q, i) => {
    const isCorrect = q.userAnswer === q.correctAnswer;
    const div = document.createElement("div");
    div.classList.add("solution-block");
    div.innerHTML = `
      <h4>Q${i + 1}: ${q.question}</h4>
      <p><span class="highlight">Correct Answer:</span> ${q.correctAnswer}</p>
      <p><span class="highlight">Your Answer:</span> ${q.userAnswer || "Not Answered"}</p>
      <p style="color:${isCorrect ? 'green' : 'red'}">
        ${isCorrect ? 'Correct ✅' : 'Incorrect ❌'}
      </p>
    `;
    solutionContainer.appendChild(div);
  });
  const email = localStorage.getItem('email');         // Must be stored earlier at login
  const name = localStorage.getItem('userName') || "User";

  if (email) {
    fetch("http://localhost:5000/submit-test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: userEmail,
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data.sucess){
      console.log("✅ Email sent successfully!");
    } else {
      console.error("Failed to send email.",data.message);
    }
  })
    .catch(err => console.error("❌ Failed to send result email:", err));
  }
});
