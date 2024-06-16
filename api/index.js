const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Posts');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

const app = express();
const saltRounds = 10;
const secret = process.env.JWT_SECRET || 'default_secret'; // Use environment variable for secret

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect("mongodb+srv://tonnel:tonnel@cluster0.eyeqbwd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0ssl=true");

// Handle MongoDB connection error
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Check if username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = new User({ username, password: hashedPassword });
      const userDoc = await newUser.save();

      // Return user details without password
      res.status(201).json({ id: userDoc._id, username: userDoc.username });
  } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Registration failed' });
  }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.findOne({ username });
        if (!userDoc) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, userDoc.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) {
                console.error('Error generating token:', err);
                return res.status(500).json({ message: 'Login failed' });
            }
            // Set token as cookie
            res.cookie('token', token, { httpOnly: true }).json({ id: userDoc._id, username });
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.json({ id: info.id, username: info.username });
    });
});

app.post('/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out successfully' });
});

// Other routes like /post handling are assumed to be similar with authentication checks

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
