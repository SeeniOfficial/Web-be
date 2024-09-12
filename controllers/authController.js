const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');


const createToken = (id, role, expiresIn = '72h') => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn });
};


exports.register = async (req, res) => {
    const { firstName, lastName, email, phone, password, role } = req.body;
    if(!firstName || !lastName|| !email || !phone || !password){
        res.status(404).json({message: "body invalid"})
    }
    else{
        try {
            const userExists = await User.findOne({ email });
            console.log(userExists)
            if (userExists) return res.status(400).json({ message: 'User already exists' });
    
            const newUser = new User({ firstName, lastName, email, phone, password, role });
            await newUser.save();
    
            const token = createToken(newUser._id);
            const verifyUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;
            await sendEmail(newUser.email, 'Verify your email', `Click here to verify your email: ${verifyUrl}`);
    
            res.status(201).json({ message: 'User registered. Check your email to verify your account' });
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ message: 'Server error' });
        }
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    if(email == '' || password ==''){
        res.status(404).json({message: "body invalid"})
    }
    else{
        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ message: 'User not found' });
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
            if (!user.isEmailVerified) return res.status(403).json({ message: 'Email not verified' });
    
            const token = createToken(user._id, user.role);
            res.json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    };
    }


exports.verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isEmailVerified = true;
        await user.save();
        res.json({ message: 'Email verified' });
    } catch (error) {
        res.status(500).json({ message: 'Invalid or expired token' });
    }
};


exports.resendVerificationEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.isEmailVerified) return res.status(400).json({ message: 'Email already verified' });

        const token = createToken(user._id);
        const verifyUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;
        await sendEmail(user.email, 'Resend Verification', `Click here to verify your email: ${verifyUrl}`);

        res.json({ message: 'Verification email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 
        await user.save();

        const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;
        await sendEmail(user.email, 'Password Reset Request', `Click here to reset your password: ${resetUrl}`);

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ message: 'Password successfully reset' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password successfully changed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


exports.roleAuth = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};


exports.fetchUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


exports.forgotPasswordRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5,
    message: 'Too many requests, please try again later'
});

exports.loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5,
    message: 'Too many login attempts, please try again later'
});


exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token missing' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const newAccessToken = createToken(decoded.id, decoded.role, '1h');
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};
