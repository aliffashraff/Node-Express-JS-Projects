const jwt = require('jsonwebtoken');
//import Unauthorized
const {Unauthorized} = require('../errors/index');

const authMiddleware = async(req, res, next) => {
  //headers.authorization created in the frontend
  const authHeader = req.headers.authorization;
  //check if authHeader not exist
  //or authHeader not starts with Bearer<space>
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //usually throw strings 'invalid credentials or access disroute
    throw new Unauthorized('No token provided');
  }

  //get the token
  //split on a space and look for second value at index 1
  const token = authHeader.split(' ')[1];

  try {
    //jwt.verify(token value, secret string in .env)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    //console.log(decoded); //where decoded = { id: 1718095659568, username: 'aliff', iat: 1718049088, exp: 1720641088 } 
    //where we sign the token randomm id, name, secret and expiresIn

    const {id, username} = decoded;
    //create user property in req object to be used in controller
    req.user = {id, username};//destructured from decoded
    //same as req.user.id = id
    //same as req.user.usernams = username

    next(); //only pass to dashboard route if successful
  } catch (error) {
    throw new Unauthorized('Not authorized to access this route');
  }
};

module.exports = authMiddleware;