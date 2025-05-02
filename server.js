const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Abhi0204#', // Add password if you have one
  database: 'test_portal'
});

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Registration Route
app.post('/register', upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'collegeCard', maxCount: 1 }
]), (req, res) => {
  console.log("Form submitted");
  console.log("Body:",req.body);
  console.log("Files:",req.files);
  const { fullName, email, phone, collegeName, collegeId } = req.body;

  if (!req.files || !req.files.profilePic || !req.files.collegeCard) {
    return res.status(400).json({ message: 'File upload missing' });
  }

  const profilePic = req.files.profilePic[0].filename;
  const collegeCard = req.files.collegeCard[0].filename;
  const password = crypto.randomBytes(4).toString('hex'); // 8-char password

  const query = `
    INSERT INTO users (fullName, email, phone, collegeName, collegeId, profilePic, collegeCard, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [fullName, email, phone, collegeName, collegeId, profilePic, collegeCard, password];

  db.query(query, values, (err) => {
    if (err) {
      console.error('MySQL Insert Error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your email here', // Replace
        pass: 'Your  email app password here '     // Replace with app password
      }
    });
    console.log("Email being sent to:",email);
    console.log("Name:",fullName);
    console.log("Generated password:",password);

    const mailOptions = {
      from: 'your email here',
      to: email,
      subject: 'Your Test Portal Login Password',
      text: `Hi ${fullName},\n\nYour password is: ${password}\n\nPlease use this to login.`
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Email Error:', error);
        return res.status(500).json({ message: 'Email failed to send' });
      }
     console.log("Email sent successfully to:",email);
      res.status(200).json({ message: 'Registration successful. Check email.' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
    });
