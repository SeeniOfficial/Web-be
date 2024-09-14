const express = require('express');
const {
    createJob,
    getAllJobs,
    getJobsByUser,
    updateJob,
    deleteJob,
    applyForJob 
} = require('../controllers/jobController');
const router = express.Router();


router.post('/jobs', createJob);

router.get('/jobs', getAllJobs);

router.get('/jobs/user/:userId', getJobsByUser);

router.put('/jobs/:jobId', updateJob);

router.delete('/jobs/:jobId', deleteJob);

router.post('/jobs/:jobId/apply', applyForJob);

module.exports = router;
