const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {UnauthenticatedError, BadRequestError} = require('../errors/index'); //('../errors') by default is index
//const bcrypt = require('bcryptjs'); //moved to models
// const jwt = require('jsonwebtoken');

//register
const register = async(req, res) => {
  /* //optional - the error message already in the schema
  const {name, email, password} = req.body;
  //custom error 
  if (!name || !email || !password) {
    throw new BadRequestError('Please provide name, email and password'); // from constructor(message)
  } */

  /* // moved to User model
  //hash the password before creating the user in db
  //create genSalt(num of random bytes)
  const salt = await bcrypt.genSalt(10); 
  //create hash password
  const hashPassword = await bcrypt.hash(password, salt);
  
  const tempUser = {name, email, password: hashPassword}; //name: name, email: email */

  /* // {...req.body} create new object copy of req.body, making it immune to further changes to req.body. //shallow copy
  const user = await User.create({...tempUser});
  //({user}) - wrap user value with an object called user
  res.status(StatusCodes.CREATED).json({user}); */

  //create user and save to DB
  const user = await User.create({...req.body});

  /* moved to User model
  //create token after user created
  //process.env can be use anywhere as dotenv package imported once in app.js 
  const token = jwt.sign({userId: user._id, name: user.name}, process.env.JWT_SECRET, {expiresIn:'30d'}); */

  //create token from User instance methods
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({user: {name: user.name}, token});
};

//login
const login = async(req, res) => {
  const {email, password} = req.body;

  //check if user provide email and password
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  //find the specific user from db using email entered
  const user = await User.findOne({email});
  
  //check if the email and the password same as in the db
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
    }
    
  //compare password (only when we have the user)
  //await bcs the function is async
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  //create token if user email is valid
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({user: {name: user.name}, token});

  //after creating the token, it is saved in localStoreage
  //to access the job route, need to get the token and verify
};

module.exports = {register, login};