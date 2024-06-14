//check username, password in POST(login) request
//if exist create new JWT
//send back rsponse to front-end 
//setup authentication so only the request with JWT can access the dashboard

//import BadRequest
const {BadRequest} = require('../errors/index');
//import JWT package
const jwt = require('jsonwebtoken');

//for login - public
const login = async(req, res) => {
  //get username and password from req.body (post)
  const {username, password} = req.body;

  //3 options:
  //mongoose required validation - check value present, if not, will show error (when connected to databse - using schema)
  //Joi package - setup entire layer of validation
  //*current way - check in controller - check both values are provided, if not, send custom error
  
  if (!username || !password) {
    throw new BadRequest('Please provide username and password') //from index error
  }

  //dummy id, just for demo, normally provided by DB!!!!
  const id = new Date().getDate();

  //when username and password is provided, create token
  //do not send confidential info in payload(can send id)
  //then can get the data from the server that only belongs to the id
  //good idea to keep payload small, better UX
  //secret should be complex, long and unguessable string value
  //jwt.sign({payload}, secret, {options})
  const token = jwt.sign({id, username}, process.env.JWT_SECRET, {expiresIn: '30d'}); 

  //to see the token value
  res.status(200).json({msg: `user created`, token});
};

//for dashboard - restricted access
const dashboard = async(req, res) => {
  /* //moved to auth.js
  const authHeader = req.headers.authorization;
  //check if authHeader not exist
  //or authHeader not starts with Bearer<space>
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //usually throw strings 'invalid credentials or access disroute
    throw new CustomAPIError('No token provided', 401);
  }

  //get the token
  //split on a space and look for second value at index 1
  const token = authHeader.split(' ',)[1]; */

  /* //moved to auth.js
  //verify wether the token is valid for access
  try {
    //jwt.verify(token value, secret string in .env)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    //console.log(decoded); //where decoded = { id: 1718095659568, username: 'aliff', iat: 1718049088, exp: 1720641088 } 
    //where we sign the token randomm id, name, secret and expiresIn

    //Math.floor = round num down to nearest integer
    //Math.round = round number to nearet integer
    //Math.ceil = round num up to nearest integer
    //Math.random = random number between 0 & 1
    const luckyNumber = Math.floor(Math.random() * 100);
    res.status(200).json({
      msg: `Hello ${decoded.id}`,
      secret: `Here is your authorized data, your lucky number is ${luckyNumber}`
    });
  } catch (error) {
    throw new CustomAPIError('now authorizeed to access this route', 401);
  } */

  //only send below response if auth is successful
  //Math.floor = round num down to nearest integer
  //Math.round = round number to nearet integer
  //Math.ceil = round num up to nearest integer
  //Math.random = random number between 0 & 1
  const luckyNumber = Math.floor(Math.random() * 100);
  res.status(200).json({
    //user property created from auth
    msg: `Hello ${req.user.username}`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`
  });
};

module.exports = {
  login,
  dashboard
};