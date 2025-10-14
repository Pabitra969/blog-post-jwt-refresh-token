const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const userControllers = {};

userControllers.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, user and password' });
    }
    //fetch user by email
    let user = await User.findByEmail(email)
    //checking if user already exists
    if (user) {
      return res.status(400).json({ message: 'User already exists' })
    }

    //create user
    //--> hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = await User.create(name, email, hashedPassword);

    res.status(201).json({ message: 'User registered successfully', user });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
}


userControllers.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    //fetch user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '3m' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Store the refreshToken in the database against the user
    await User.updateRefreshToken(user.id, refreshToken);

    // Remove password from user object before sending it in the response
    const { password: _, ...userWithoutPassword } = user;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ message: 'Login successful', accessToken, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
}


userControllers.refreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found' });
  }

  const refreshToken = cookies.refreshToken;
  
  // Find the user in the database who has this refresh token
  const foundUser = await User.findByRefreshToken(refreshToken);
  if (!foundUser) {
    // Detected a possible refresh token reuse/theft! 
    // As a precaution, we can try to verify the token to see who it belonged to
    // and clear all their refresh tokens.
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' }); // Tampered token
      // If we can decode it, clear the refresh token for that user in the DB
      await User.updateRefreshToken(decoded.id, null);
    });
    res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return res.status(403).json({ message: 'Forbidden' });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    // If token is invalid OR the user ID from the token doesn't match the user found in DB
    if (err || foundUser.id !== decoded.id) {
      // If there is a mismatch, it's a sign of token tampering.
      // Invalidate the user's current token as a security measure.
      if (foundUser) {
        await User.updateRefreshToken(foundUser.id, null);
      }
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Token is valid, issue a new refresh token and store it
    const newRefreshToken = jwt.sign({ id: decoded.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    await User.updateRefreshToken(decoded.id, newRefreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.status(200).json({ accessToken });
  });
};

userControllers.logoutUser = async (req, res) => {
  const cookies = req.cookies;
  if (cookies?.refreshToken) {
    const refreshToken = cookies.refreshToken;
    // Clear the refresh token from the database
    await User.clearRefreshTokenByToken(refreshToken);
  }

  res.cookie('refreshToken', '', {
    httpOnly : true,
    expires : new Date(0)
  })

  res.status(200).json({
    message : "Logout Successfully"
  })
}


userControllers.profile = (req, res) => {
  res.status(200).json({
    user : req.user
  })
  console.log(req.user);  
}

module.exports = userControllers;