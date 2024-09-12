const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'vendor'], default: 'user' },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number] },    
    },
    businessName: { type: String, required: function() { return this.role === 'vendor'; } },
    serviceType: { type: String, required: function() { return this.role === 'vendor'; } },
    businessAddress: { type: String },
    operatingHours: {
        open: { type: String }, 
        close: { type: String }, 
    },
    ratings: {
        averageRating: { type: Number, default: 0 },
        numberOfRatings: { type: Number, default: 0 },
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorCode: { type: String },
    twoFactorExpires: { type: Date },
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });


userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
