const Job = require('../models/Job'); 

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.postNewJob = async (req, res) => {
    try {
        const { title, description, location, salary } = req.body;
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            user: req.user.id,  
        });

        await newJob.save();
        res.status(201).json({ message: 'Job posted successfully', job: newJob });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
