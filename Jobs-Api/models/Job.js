const { required } = require('joi');
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    maxlength: 50
  },

  position: {
    type: String,
    required: [true, 'Please provide position'],
    maxlength: 100
  },

  //status will be manipulae when we apply the job
  status: {
    type: String,
    //enum define a set of allowed values
    enum: ['interview', 'decline', 'pending'],
    default: 'pending',
  },

  //when job created, it will be assigned to one of user
  //tying the Job model to User model
  createdBy: {
    //type - objectId
    type: mongoose.Types.ObjectId,
    //the model name that we referencing
    ref: 'User',
    required: [true, 'Please provide a user']
  }
},{timestamps: true}); //timestamps - will have createdAt and updatedAt automatically managed by Mongoose

module.exports = mongoose.model('Job', JobSchema);