const Job = require('../models/jobModel');
const Application = require('../models/applicationModel');


const createJob = async (req, res) => {
    const { title, description, location, salary, jobType, remote, skillsRequired } = req.body;

    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            jobType,
            remote,
            skillsRequired,
            user: req.user._id  
        });

        await newJob.save();
        return res.status(201).json({ message: 'Job created successfully', job: newJob });
    } catch (error) {
        console.error('Error creating job:', error);
        return res.status(500).json({ message: 'Error creating job' });
    }
};


const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('user', 'name email'); 
        return res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return res.status(500).json({ message: 'Error fetching jobs' });
    }
};


const getJobsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const jobs = await Job.find({ user: userId });
        return res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs for user:', error);
        return res.status(500).json({ message: 'Error fetching jobs' });
    }
};


const updateJob = async (req, res) => {
    const { jobId } = req.params;
    const { title, description, location, salary, jobType, remote, skillsRequired } = req.body;

    try {
        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            { title, description, location, salary, jobType, remote, skillsRequired },
            { new: true }  
        );

        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        return res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
    } catch (error) {
        console.error('Error updating job:', error);
        return res.status(500).json({ message: 'Error updating job' });
    }
};


const deleteJob = async (req, res) => {
    const { jobId } = req.params;

    try {
        const deletedJob = await Job.findByIdAndDelete(jobId);

        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        return res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        return res.status(500).json({ message: 'Error deleting job' });
    }
};


const applyForJob = async (req, res) => {
    const { jobId } = req.params;  
    const { profile, coverLetter } = req.body;

    try {

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const existingApplication = await Application.findOne({
            user: req.user._id,
            job: jobId,
        });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }


        const newApplication = new Application({
            user: req.user._id,  
            job: jobId,
            profile,
            coverLetter,
        });

        await newApplication.save();
        return res.status(201).json({ message: 'Job application submitted successfully', application: newApplication });
    } catch (error) {
        console.error('Error applying for job:', error);
        return res.status(500).json({ message: 'Error applying for job' });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobsByUser,
    updateJob,
    deleteJob,
    applyForJob
};
