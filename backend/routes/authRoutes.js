const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { authUser, getUserProfile, registerUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/me', protect, getUserProfile);

// ─── Google OAuth ─────────────────────────────────────────────────────────────
// Step 1: Redirect user to Google login
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({ message: 'Google OAuth is not configured on this server.' });
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

// Step 2: Google redirects back here with the code
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
    if (err || !user) {
      console.error('Google OAuth error:', err?.message || 'No user');
      return res.redirect(`${frontendUrl}/login?error=google_failed`);
    }
    // Encode the full user object (including token) and send to frontend
    const payload = encodeURIComponent(JSON.stringify(user));
    return res.redirect(`${frontendUrl}/auth/google/success?data=${payload}`);
  })(req, res, next);
});

module.exports = router;
