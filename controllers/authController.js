const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const generateToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME });
const generateUserDetails = (user) => {
    return {
        id: user._id,
        fullName: user.fullName,
        avatar: user.avatar,
        email: user.email,
        gender: user.gender,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }
}

exports.register = async (req, res) => {
    try {
        // Input Validation
        const { password, fullName, email, avatar, gender } = req.body;
        if (!password || !fullName || !email || !avatar || !gender) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        // * [1] Create a new user
        const user = await User.create({ fullName, email, password, avatar, gender });
        // * [2] Generate token
        const userDetails = generateUserDetails(user)
        const token = generateToken(userDetails);
        // * [3] Respond with success message
        res.status(201).json({ message: 'User registered successfully', user: userDetails, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // * [2] Check if the user is existing and check if password is correct
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Incorrect email or password' });
        // * [3] Generate token
        const userDetails = generateUserDetails(user)
        const token = generateToken(userDetails);
        // * [4] Set the token in response header or body
        res.status(200).json({ message: 'Login successful', user: userDetails, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.logout = (req, res) => {
    // Here you may clear the session or invalidate the token
    res.status(200).json({ message: 'Logout successful' });
};
