const express = require('express');
const router = express.Router();

//import controller
const {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask
} = require('../controllers/tasks');

/* router.get('/hello', (req, res) => {
  res.send('All items');
}); */

router.route('/').get(getAllTasks).post(createTask);
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask);

module.exports = router;