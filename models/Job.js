const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    salary: {
        type: Number,
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship'],
        default: 'full-time',
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
    remote: {
        type: Boolean,
        default: false,
    },
    skillsRequired: [{ 
        type: String 
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
