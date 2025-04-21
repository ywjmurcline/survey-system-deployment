const usesMockDB = () => global.mockDB !== undefined;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Update your register route
router.post('/register', async (req, res) => {
  try {
    // Log incoming request for debugging
    console.log('Registration request received:', {
      name: req.body.name,
      email: req.body.email,
      hasPassword: Boolean(req.body.password)
    });
    
    const { name, email, password } = req.body;
    
    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Create new user
    user = new User({ name, email, password });
    
    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || '665eced222ba5d45aa7e3774cc8d30bb4fc122be7ef6c9e6ec31996bdd78e184a00460c1ab1436c615016dcfc4ece66d3f581fc41c7380adf154a850149ab7c7',
      { expiresIn: '7d' }
    );
    
    // Return success with token and user data (excluding password)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email
    };
    
    console.log('User registered successfully:', userResponse);
    res.status(201).json({ token, user: userResponse });
  } catch (err) {

    console.error('Registration error on server:', err);
    if (err.name === 'ValidationError' && err.errors?.email?.message === 'Please fill a valid email address') {
        return res.status(400).json({ message: 'Please fill a valid email address' });
    }
    else {
        res.status(500).json({ message: 'Server error during registration' });
    }
  }
});

// Update your login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Use mock DB if MongoDB is not available
    if (usesMockDB()) {
      console.log('Using mock DB for login');
      
      // Find user
      const user = global.mockDB.users.find(u => u.email === email);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Simple password check (mock)
      const isMatch = user.password === `hashed_${password}`;
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || '665eced222ba5d45aa7e3774cc8d30bb4fc122be7ef6c9e6ec31996bdd78e184a00460c1ab1436c615016dcfc4ece66d3f581fc41c7380adf154a850149ab7c7',
        { expiresIn: '7d' }
      );
      
      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    }
    
    // Regular MongoDB flow
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || '665eced222ba5d45aa7e3774cc8d30bb4fc122be7ef6c9e6ec31996bdd78e184a00460c1ab1436c615016dcfc4ece66d3f581fc41c7380adf154a850149ab7c7',
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update your verify route
router.get('/verify', async (req, res) => {
  try {
    if (!req.header('Authorization')) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || '665eced222ba5d45aa7e3774cc8d30bb4fc122be7ef6c9e6ec31996bdd78e184a00460c1ab1436c615016dcfc4ece66d3f581fc41c7380adf154a850149ab7c7'
    );
    
    // Use mock DB if MongoDB is not available
    if (usesMockDB()) {
      console.log('Using mock DB for verify');
      
      const user = global.mockDB.users.find(u => u._id === decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Exclude password
      const { password, ...userWithoutPassword } = user;
      
      return res.json({ user: userWithoutPassword });
    }
    
    // Regular MongoDB flow
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ user });
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: "Please authenticate" });
  }
});

module.exports = router;