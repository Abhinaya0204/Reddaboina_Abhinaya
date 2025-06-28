let questions = [];
let currentQuestionIndex = 0;
let answers = {};
let timerInterval;
let totalTime = 60 * 60; // 1 hour in seconds

document.addEventListener("DOMContentLoaded", async () => {
  await loadQuestions();
  if (questions.length > 0) {
    startTimer();
    renderPalette();
    showQuestion(currentQuestionIndex);
  }

  document.getElementById("prevBtn").onclick = prevQuestion;
  document.getElementById("nextBtn").onclick = nextQuestion;
  document.getElementById("reviewBtn").onclick = markForReview;
  document.getElementById("submitBtn").onclick = submitTest;
});

async function loadQuestions() {
  try {
    const res = await fetch("http://localhost:5000/tests");
    questions = await res.json();
  } catch (err) {
    alert("Failed to load questions.");
    console.error("Error loading questions:", err);
  }
}

function startTimer() {
  const timerElement = document.getElementById("timer");
  timerInterval = setInterval(() => {
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    totalTime--;
    if (totalTime < 0) {
      clearInterval(timerInterval);
      alert("Time is up!");
      submitTest();
    }
  }, 1000);
}

function renderPalette() {
  const palette = document.getElementById("palette");
  palette.innerHTML = "";
  questions.forEach((q, index) => {
    const btn = document.createElement("button");
    btn.textContent = index + 1;
    btn.className = "not-visited";
    btn.id = `btn-${index}`;
    btn.onclick = () => {
      saveAnswer();
      currentQuestionIndex = index;
      showQuestion(index);
    };
    palette.appendChild(btn);
  });
}
  function showQuestion(index) {
  const q = questions[index];
  document.getElementById("questionBox").innerText =` ${index + 1}. ${q.question}`;
  const optionBox = document.getElementById("optionBox");
  optionBox.innerHTML = "";

  if (q.type === "MCQ") {
    for (let key in q.options) {
      const option = q.options[key];
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "option";
      input.value = key;

      // ✅ Pre-select if already answered
      if (answers[index] === key) {
        input.checked = true;
      }

      const label = document.createElement("label");
      label.appendChild(input);
      label.append(` ${key}: ${option}`);
      optionBox.appendChild(label);
      optionBox.appendChild(document.createElement("br"));
    }
  } else if (q.type === "NAT") {
    const input = document.createElement("input");
    input.type = "number";
    input.name = "natAnswer";
    input.autocomplete="off";
    //input.value = answers[index] || "";
    if(answers.hasOwnProperty(index) && answers[index]!==undefined) {
      input.value=answers[index];
    } else {
      input.value="";
    }
    optionBox.appendChild(input);
  }

  // ✅ Update palette status as visited
  updatePaletteStatus(index, "visited");
}
function saveAnswer() {
  const q = questions[currentQuestionIndex];
  if (q.type === "MCQ") {
    const selected = document.querySelector('input[name="option"]:checked');
    if (selected) {
      answers[currentQuestionIndex] = selected.value;
      updatePaletteStatus(currentQuestionIndex, "answered");
    }
  } else {
    const input = document.querySelector('input[name="natAnswer"]');
    if (input && input.value.trim()) {
      answers[currentQuestionIndex] = input.value.trim();
      updatePaletteStatus(currentQuestionIndex, "answered");
    }
  }
}

function markForReview() {
  updatePaletteStatus(currentQuestionIndex, "review");
  nextQuestion();
}

function nextQuestion() {
  saveAnswer();
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  }
}

function prevQuestion() {
  saveAnswer();
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion(currentQuestionIndex);
  }
}

function updatePaletteStatus(index, status) {
  const btn = document.getElementById(`btn-${index}`);
  if (btn) {
    btn.className = status;
  }
}
    function submitTest() {
      //const score=calculateScore();

    const confirmed=confirm("Are you sure you want to submit the test?");
    if(!confirmed) return;
  saveAnswer(); // Save the last answer

  let score = 0;
  const resultsData = {
    score: 0,
    totalQuestions: questions.length,
    questions: []
  };

  questions.forEach((q, index) => {
    const correctAnswer = q.answer;
    const userAnswer = answers[index] || "";

    if (userAnswer === correctAnswer) {
      score++;
    }

    resultsData.questions.push({
      question: q.question,
      correctAnswer: correctAnswer,
      userAnswer: userAnswer
    });
  });

  resultsData.score = score;

  // Save to localStorage
  localStorage.setItem("testResults", JSON.stringify(resultsData));
  if(localStorage.getItem("mainWindowShouldShowResults")) {
    localStorage.removeItem("mainWindowShouldShowResults");
    window.open("results.html","self"); 
  } else {
    window.location.href="results.html";
  }
  clearInterval(timerInterval);
  window.close();
  // After calculating score and user answers
const testResults = {
  score: score,
  totalQuestions: questions.length,
  questions: questions.map((q, i) => ({
    question: q.question,
    correctAnswer: q.answer,
    userAnswer: answers[i] || ""
  }))
};

localStorage.setItem("testResults", JSON.stringify(testResults));
clearInterval(timerInterval);
setTimeout(()=> {
window.location.href = "results.html";
}, 300);
}