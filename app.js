const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const dotenv = require('dotenv'); // Import dotenv
dotenv.config(); // Load environment variables from .env file
const cors = require('cors'); // Import cors package
const User = require('./models/user');
const app = express();
// Enable CORS for all requests
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
const { protect } = require('./middlewares/authMiddleware');

// Connect to MongoDB Atlas using environment variable
mongoose.connect(process.env.DB_HOST)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error);
    });


// Routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/auth', authRoutes);
// Apply Authentication Middleware to Post Routes
app.use('/posts', postRoutes);

const PORT = process.env.PORT || 3000; // Use environment variable for port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
