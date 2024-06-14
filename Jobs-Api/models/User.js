const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50
  },

  email: {
    type: String,
    required: [true, 'Please provide email'],
    //to match the regex for email
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'],
    //create unique index - not a validator
    //if there is an email already in use when creating /registering a user, duplicate error will pop up
    unique: true
  },

  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    //maxlength: 12
  }
});

//pre hooks middleware 
//before a document of the User model is saved to the database, this function will be executed.
//use regular function not arrow function so that 'this' always point to the docs / schema
UserSchema.pre('save', async function() {
  const salt = await bcrypt.genSalt(10);
  //this refer to UserSchema
  this.password = await bcrypt.hash(this.password, salt);
  //next(); //no need to call next if put async;
});

//Schema instance methods - create token
UserSchema.methods.createJWT = function() {
  //use property name - userId so it will not confuse
  return jwt.sign({userId: this.id, name: this.name}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
  //JWT_SECRET key can use online key generator
  //expiresIn option is set in .env 
}

//Schema instance methods - compare / check password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);