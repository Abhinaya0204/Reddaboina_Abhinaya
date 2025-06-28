require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');
const emailRoutes=require('./routes/emailRoutes');
const router=express.Router();

const app = express();
//const PORT = 5000;
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/',emailRoutes);

// MySQL Connection
const db = mysql.createConnection({
  host:     process.env.DB_HOST,     
  user:     process.env.DB_USER,     
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Registration Route
app.post('/register', upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'collegeCard', maxCount: 1 }
]), (req, res) => {
  const { fullName, email, phone, collegeName, collegeId } = req.body;
  const password = crypto.randomBytes(4).toString('hex');

  const profilePic = req.files.profilePic[0].filename;
  const collegeCard = req.files.collegeCard[0].filename;

  const query =`INSERT INTO users (fullName, email, phone, collegeName, collegeId, profilePic, collegeCard, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [fullName, email, phone, collegeName, collegeId, profilePic, collegeCard, password];

  db.query(query, values, (err) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    // Email Configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: 'beautysleep0211@gmail.com',
      to: email,
      subject: 'Exam Portal Password',
      text: `Hi ${fullName},\n\nYour login password is: ${password}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
        return res.status(500).json({ success: false, message: 'Email error' });
      }
      res.json({ success: true, message: 'Registered successfully. Please check your email for login credentials.' });
    });
  });
});

// Login Route
app.post('/login', (req, res) => {
  let { email, password } = req.body;

  email = email.trim();
  password = password.trim();

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (results.length > 0) {
      const user = results[0];
      return res.json({
        success: true,
        user: {
          fullName: user.fullName,
          email: user.email,
          profilePic: user.profilePic
        }
      });
    } else {
      return res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// Get list of courses
app.get('/courses', (req, res) => {
  const courses = [
    { id: 1, name: 'GATE 2025 - Computer Science' },
    { id: 2, name: 'GATE 2025 - Mathematics' }
  ];
  res.json(courses);
});

// Get tests by course ID
app.get('/courses/:courseId/tests', (req, res) => {
  const { courseId } = req.params;
  const tests = {
    1: [
      { id: 101, title: 'Test 1: Algebra' },
      { id: 102, title: 'Test 2: Calculus' }
    ],
    2: [
      { id: 201, title: 'Test 1: Data Structures' },
      { id: 202, title: 'Test 2: Algorithms' }
    ]
  };
  res.json(tests[courseId] || []);
});

// Sample questions route (10 questions)
// Sample questions route with answers
app.get('/test.html',(req,res)=> {
  res.sendFile(path.join(__dirname,'public','test.html'));
})
app.get("/tests", (req, res) => {
  const questions = [
    {
      id: 1,
      question: "Which data structure uses FIFO?",
      type: "MCQ",
      options: {
        A: "Stack",
        B: "Queue",
        C: "Tree",
        D: "Graph"
      },
      answer: "B"
    },
    {
      id: 2,
      question: "Solve: 25 + 17",
      type: "NAT",
      answer: "42"
    },
    {
      id: 3,
      question: "Which protocol is used to send email?",
      type: "MCQ",
      options: {
        A: "FTP",
        B: "SMTP",
        C: "HTTP",
        D: "SSH"
      },
      answer: "B"
    },
    {
      id: 4,
      question: "Solve: 100 / 4",
      type: "NAT",
      answer: "25"
    },
    {
      id: 5,
      question: "Which of the following is NOT a programming language?",
      type: "MCQ",
      options: {
        A: "Python",
        B: "Java",
        C: "HTML",
        D: "C++"
      },
      answer: "C"
    },
    {
      id: 6,
      question: "Solve: 50 - 12",
      type: "NAT",
      answer: "38"
    },
    {
      id: 7,
      question: "What does CSS stand for?",
      type: "MCQ",
      options: {
        A: "Computer Style Sheets",
        B: "Cascading Style Sheets",
        C: "Creative Style Syntax",
        D: "Custom Style System"
      },
      answer: "B"
    },
    {
      id: 8,
      question: "Solve: 7 × 8",
      type: "NAT",
      answer: "56"
    },
    {
      id: 9,
      question: "Which company developed the Java language?",
      type: "MCQ",
      options: {
        A: "Microsoft",
        B: "Apple",
        C: "Sun Microsystems",
        D: "Google"
      },
      answer: "C"
    },
    {
      id: 10,
      question: "Solve: 99 + 1",
      type: "NAT",
      answer: "100"
    },
    {
      id: 11,
      question: "Which company developed the MSword?",
      type: "MCQ",
      options: {
        A: "Microsoft",
        B: "Apple",
        C: "Sun Microsystems",
        D: "Google"
      },
      answer: "A"
    },
    {
      id: 12,
      question: "What is the full form of AWS?",
      type: "MCQ",
      options: {
        A: "Amazon web services",
        B: "Apple web services",
        C: "Adding web services",
        D: "Amazon super services"
      },
      answer: "A"
    },
    {
      id: 13,
      question: "What is the full form of AI?",
      type: "MCQ",
      options: {
        A: "Amazon Intelligence",
        B: "Apple Intelligence",
        C: "Artificial Intelligence",
        D: "Adding Intelligence"
      },
      answer: "C"
    },
    {
     id: 14,
      question: "Solve: 7 × 7",
      type: "NAT",
      answer: "49"
    },
    {
     id: 15,
      question: "Solve: 100+100",
      type: "NAT",
      answer: "200"
    }
  ];

  res.json(questions);
});
//app.get('/test-mail', (req, res) => {
const transporter = nodemailer.createTransport({
  service: 'gmail',
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.Email_PASS
  }
});
function sendSimpleEmail(toEmail) {
  const mailOptions = {
    //from: 'beautysleep0211@gmail.com',
    from: process.env.EMAIL_USER,
    to: toEmail, 
    subject: 'Test Submitted',
    text: `Thank you for attending the test.All the best!.`
  };
  transporter.sendMail(mailOptions,function(error,info) {
    if (error) {
      console.log('❌ Email error:', error);
    } else {
       console.log('✅ Email sent:', info.response);
    }
  });
 }
 //✅ Submit Test Route
app.post('/submit-test', (req, res) => {
  const { email, answers } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  const transporter = nodemailer.createTransport({ /* your Gmail + app password */ });
  const mailOptions = {
    from: 'your@gmail.com',
    to: email,
    subject: 'Thank You for Attending the Test',
    text: 'Thank you for attending the test. All the best!'
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Email error:", err);
      return res.status(500).json({ success: false, message: "Email failed" });
    }
    console.log("Email sent:", info.response);
    res.json({ success: true, message: "Email sent" });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});