const express = require('express');
const {
    register,
    login,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    fetchUserDetails,
    refreshToken,
    forgotPasswordRateLimiter,
    loginRateLimiter
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authenticate.js'); 
const router = express.Router();


router.post('/register', register); 
router.post('/login', loginRateLimiter, login); 
router.get('/verify-email', verifyEmail);
router.post('/resend-verification-email', resendVerificationEmail); 

router.post('/forgot-password', forgotPasswordRateLimiter, forgotPassword); 
router.post('/reset-password/:token', resetPassword); 


router.use(authenticate); 
router.post('/change-password', changePassword); 
router.get('/me', fetchUserDetails); 
router.post('/refresh-token', refreshToken); 

module.exports = router;
