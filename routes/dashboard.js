const express = require('express');
const router = express.Router();

// Middleware to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/google');
}

// Dashboard route
router.get('/', ensureAuthenticated, (req, res) => {
    res.send(`Welcome, ${req.user.displayName}!`);
});

module.exports = router;
