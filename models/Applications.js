const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true,
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',  
        required: true,
    },
    profile: {
        type: String,  
        required: true,
    },
    coverLetter: {
        type: String,  
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',  
    },
    appliedAt: {
        type: Date,
        default: Date.now,  
    },
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
