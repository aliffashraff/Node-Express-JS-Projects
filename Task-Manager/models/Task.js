const mongoose = require('mongoose');

//setup schema - structure of the data
const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    //add more validators to make sure name is provided
    //to add custom message, make it equal to array
    required: [true, 'must provide a name'],
    trim: true,
    maxlength: [20, 'name cannot be more than 20']
  },

  completed: {
    type: Boolean,
    default: false
  }
});

//setup model
module.exports = mongoose.model('Task', TaskSchema);