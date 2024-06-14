//import model
const Task = require('../models/Task');

//asyncWrapper middleware
const asyncWrapper = require('../middleware/async');

//custom error class
const {createCustomError} = require('../errors/custom-error');

const getAllTasks = asyncWrapper(async (req, res) => {
  //try {
    //model.find() is aquery. Although it can use await and callbacks with .then(), query IS NOT a promise
    //model.find({}) filter and find all documents
    const tasks = await Task.find({});

    res.status(200).json({tasks});

    //other styles of response
    //res.status(200).json({tasks, amount: tasks.length});
    // res.status(200).json({status:'success', data: {tasks, nbhits: tasks.length}});
  //}

  /* catch (error) {
    res.status(500).json({msg: error});
  } */
});

const createTask = asyncWrapper(async (req, res) => {
  //try {
    //req data from req.body is passed into the Task model by using Task(model).create
    const task = await Task.create(req.body);
    res.status(201).json({task});
  //}

  /* catch(error) {
    res.status(500).json({msg: error});
  } */
  
  //the object from req.body will be stored in the mongoDB cloud database
  //with database name 'TASK MANAGER'
  //and collection name 'tasks'(because mongoose will look the plural and lowercase version of Task model)

  /* 
  // Manually reorder the properties
  const orderedTask = {
    _id: task._id,
    name: task.name,
    completed: task.completed,
    __v: task.__v
  };
  
  // Send the response with the reordered task object
  res.status(201).json({ task: orderedTask }); 
  */
});

const getTask = asyncWrapper(async (req, res, next) => {
  //try{
    //{id:TaskId} is destructuring id from req.params and store it in taskId variable
    const {id:taskId} = req.params;
    const task = await Task.findOne({_id: taskId});

    if (!task) {
      //if we have correct syntax for the id but we cannot find the item, it will show below error
      /* const error = new Error('Not Found');
      error.status = 404;
      return next(error); */

      return next(createCustomError(`No task with id: ${taskId}`, 404));
    }

    res.status(200).json({task});
  //}

  /* catch (error) {
    //if the id has wrong syntax
    res.status(500).json({msg: error});
  } */
});

const deleteTask = asyncWrapper(async (req, res) => {
  //try {
    const {id: taskId} = req.params;
    const task = await Task.findOneAndDelete({_id: taskId});
    
    if (!task) {
      //return res.status(404).json({msg: `No task with id: ${taskId}`});

      return next(createCustomError(`No task with id: ${taskId}`, 404));
    }
    
    res.status(200).json({task});
    
    //common way to return delete response
    //res.status(200).send();
    //res.status(200).json({task: null, status: 'success'});
  //}
  
  /* catch (error) {
    res.status(500).json({msg: error});
  } */
});

const updateTask = asyncWrapper(async (req, res) => {
  //try {
    const{id: taskId} = req.params;
    const data = req.body;

    //findOneAndUpdate({conditions}, update, options)
    const task = await Task.findOneAndUpdate({_id: taskId}, data, {new: true, runValidators: true});

    if (!task) {
      //return res.status(404).json({msg: `No task with id: ${taskId}`});

      return next(createCustomError(`No task with id: ${taskId}`, 404));
    }

    res.status(200).json({task})
  //}

 /*  catch (error) {
    res.status(500).json({msg: error});
  } */
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask
};