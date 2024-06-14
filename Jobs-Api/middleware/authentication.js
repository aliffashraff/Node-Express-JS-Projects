const User = require('../models/User');
const jwt= require("jsonwebtoken");
const {UnauthenticatedError} = require('../errors/index');

const authMiddleware = async(req, res, next) => {
  //before accessing the job route, the token is put from local storage to headers.authorization
  //get authorization headers from the req
  const authHeader = req.headers.authorization;
  //check authHeader exist
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication Invalid');
  }

  //get the token in proper format
  const token = authHeader.split(' ')[1];

  try {
    //verify the token with the correct secret
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    //get the payload from the token
    const {userId, name} = payload;
    //create user property in req object with the value
    //attach the user to the job routes
    req.user = {userId, name};

    /* //other option 
    //instead of creating object inside req.user
    //select('-password') - omit from sending password
    const user = await User.findById(payload.userId).select('-password');
    req.user = user; */

    next(); //pass to the job route
  } catch (error) {
    throw new UnauthenticatedError('Not authorized to access this route');
  }
};

module.exports = authMiddleware;