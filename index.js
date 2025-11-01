const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const Student = require('./Student');
const Company = require('./Company');
const Internship = require('./Internship'); // <-- Internship Model Imported

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Allows frontend running on a different port to talk to your backend

// MongoDB connection
mongoose.connect('mongodb+srv://habeebalialhamed000_db_user:habeeb6@cluster0.h1ajf4x.mongodb.net/?appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('GrowTern backend is running!');
});

// ===================================
// STUDENT REGISTRATION ROUTE (Secure)
// ===================================
app.post('/api/register-student', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await Student.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = new Student({ 
        name, 
        email, 
        password: hashedPassword 
    });
    await newStudent.save();
    res.status(201).json({ message: 'Student registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong during student registration' });
  }
});

// ===================================
// COMPANY REGISTRATION ROUTE (Secure)
// ===================================
app.post('/api/register-company', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await Company.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCompany = new Company({ 
        name, 
        email, 
        password: hashedPassword 
    });
    await newCompany.save();
    res.status(201).json({ message: 'Company registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong during company registration' });
  }
});


// ===================================
// STUDENT LOGIN ROUTE
// ===================================
app.post('/api/student/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Student.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials (Email not found)' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials (Incorrect password)' });
        }
        res.status(200).json({ 
            message: 'Student logged in successfully!', 
            userId: user._id,
            name: user.name
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed' });
    }
});


// ===================================
// COMPANY LOGIN ROUTE
// ===================================
app.post('/api/company/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Company.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials (Email not found)' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials (Incorrect password)' });
        }
        res.status(200).json({ 
            message: 'Company logged in successfully!', 
            userId: user._id,
            name: user.name
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed' });
    }
});


// ===================================
// INTERNSHIP POSTING ROUTE <-- NEW CORE FEATURE
// ===================================
app.post('/api/internships', async (req, res) => {
    try {
        // We expect the Company's ID and Name to be sent in the request body
        const { companyId, companyName, title, location, stipend, duration, description } = req.body;

        if (!companyId || !title || !description) {
            return res.status(400).json({ message: 'Missing required internship fields.' });
        }

        const newInternship = new Internship({
            companyId,
            companyName,
            title,
            location,
            stipend,
            duration,
            description
        });

        await newInternship.save();

        res.status(201).json({ message: 'Internship posted successfully!', internship: newInternship });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to post internship.' });
    }
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 GrowTern backend running on http://localhost:${PORT}`);
});

// GET ALL INTERNSHIPS (FOR STUDENT DASHBOARD/JOB BOARD)
app.get('/api/internships', async (req, res) => {
    try {
        // Find all internships and sort them by the newest first
        const internships = await Internship.find().sort({ createdAt: -1 });
        
        // Respond with a 200 OK status and the list of internships
        res.status(200).json(internships);
    } catch (err) {
        console.error('Error fetching internships:', err);
        // Respond with a 500 status if something crashed
        res.status(500).json({ message: 'Failed to fetch internships from the database.' });
    }
});
