const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Posts');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer'); // Import multer

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
    db.once('open', () => {
      console.log('Connected to MongoDB');
    });
  })

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });


app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    const userDoc = await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ username, id: userDoc._id }, secret, { expiresIn: '1h' });

    // Set token as cookie
    res.cookie('token', token, { httpOnly: true }).json({ id: userDoc._id, username });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username exists in the database
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords using bcrypt
    const passwordMatch = await bcrypt.compare(password, userDoc.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ username, id: userDoc._id }, secret, { expiresIn: '1h' });

    // Set token as cookie (assuming you're using cookie-parser middleware)
    res.cookie('token', token, { httpOnly: true }).json({ id: userDoc._id, username });

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
      // Fetch user profile from MongoDB
      User.findById(info.id)
          .select('-password') // Exclude password from the response
          .then(user => {
              if (!user) {
                  return res.status(404).json({ message: 'User not found' });
              }
              res.json({ id: user._id, username: user.username });
          })
          .catch(error => {
              console.error('Error fetching user profile:', error);
              res.status(500).json({ message: 'Failed to fetch user profile' });
          });
  });
});


app.post('/create', upload.single('file'), async (req, res) => {
  const { title, summary, content } = req.body;

  try {
    // Create new post
    const newPost = new Post({
      title,
      summary,
      content,
      cover: req.file ? req.file.path : null, // save file path if uploaded
    });

    const postDoc = await newPost.save();
    console.log('Post saved:', postDoc); // Log the saved post document
    res.status(201).json(postDoc);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});


app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Fetch all posts, sorted by createdAt desc
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});



app.post('/logout', (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out successfully' });
});


// Other routes like /post handling are assumed to be similar with authentication checks

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
