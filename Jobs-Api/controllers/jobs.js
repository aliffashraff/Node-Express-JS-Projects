const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError, BadRequestError} = require('../errors/index');

//get all jobs which associated to the user
const getAllJobs = async(req, res) => {
  //find createdBy property with req.user.userId value
  const jobs = await Job.find({createdBy: req.user.userId}).sort('-updatedAt');
  res.status(StatusCodes.OK).json({jobs, count: jobs.length});
};

//get single job
const getJob = async(req, res) => {
  //nested destructuring to get userId in the user object from req object
  //nested destructuring to get id and rename to jobId in the params object from req object
  //will get userId and jobId variable
  const {user: {userId}, params: {id: jobId}} = req;

  /* //other way to destructure 
  //save req.params.id to taskId variable
  //destructuring same as const jobId = req.params.id
  const {id: jobId} = req.params;
  //destructure userId from req.user
  const {userId} = req.user; */
  
  //JOB ID not userId for '/:id' route
  const job = await Job.findOne({
    _id: jobId, createdBy: userId
  });

  //error if no job found
  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`)
  }

  res.status(StatusCodes.OK).json({job});
};

//create job
const createJob = async(req, res) => {
  //userId from token payload are stored in req.user
  //get the userId and passed into creeatedBy property
  req.body.createdBy = req.user.userId;
  const job = await Job.create({...req.body});
  res.status(StatusCodes.CREATED).json({job});
};

//update / edit job
const updateJob = async(req, res) => {
  //has option to use nested destructuring for below 
  //destructure id = jobId from req.params.id
  const {id: jobId} = req.params;
  //destructure userId from req.user
  const {userId} = req.user;
  //destructure company and position from req.body
  const {company, position} = req.body;

  //error if company or position is empty
  if (company === '' || position === '') {
    throw new BadRequestError('Company or Position field cannot be empty');
  }

  //findOneAndUpdate({conditions}, updated data, options)
  const job = await Job.findOneAndUpdate(
    {_id: jobId, createdBy: userId},
    {...req.body},
    //new: true - returns the updated job
    //runValidators: true - ensures that the update operation applies the schema validators before making the update.
    {new: true, runValidators: true}
  );

  //error if no job found
  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`)
  }

  res.status(StatusCodes.OK).json({job});
};

//delete job
const deleteJob = async(req, res) => {
  const {
    user: {userId},
    params: {id: jobId}
  } = req;

  const job = await Job.findOneAndDelete({_id: jobId, createdBy: userId});

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }

  //to send back remaining jobs after deleted a job
  const remainingJobs = await Job.find({createdBy: userId}).sort('-updatedAt');

  res.status(StatusCodes.OK).json({remainingJobs, count: remainingJobs.length});
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
};