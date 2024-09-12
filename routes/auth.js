const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google Auth Route
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google Auth Callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.json({
            message: 'Authentication successful!',
            user: req.user 
        });
    });

// Logout
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) { return next(err); }
        res.json({
            message: 'Logout successful!'
        });
    });
});

// Route to get the current user's information
router.get('/current-user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user); 
    } else {
        res.status(401).json({ message: 'Not authenticated' }); 
    }
});

module.exports = router;
