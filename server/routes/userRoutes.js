const express = require('express');
const { registerUser, loginUser, logoutUser, profile, refreshToken } = require('../controllers/userControllers');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/you', protect, profile)
router.post('/refresh-token', refreshToken)


module.exports = router;