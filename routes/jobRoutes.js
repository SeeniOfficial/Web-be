const express = require('express');
const { getAllJobs, getJobById, postNewJob } = require('../controllers/jobController');
const authenticate = require('../middleware/authenticate'); 
const router = express.Router();


router.get('/', authenticate, getAllJobs);


router.get('/:id', authenticate, getJobById);


router.post('/', authenticate, postNewJob);

module.exports = router;
