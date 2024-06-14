//const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    //set as default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, 
    msg: err.message || 'Something went wrong try again later'
  };

  /* //not need the customAPIError anymore bcs already have customError object above. Will produce same result
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  } */

  //validation error (missing name, email or password in registering)
  if(err.name === 'ValidationError') {
    console.log((Object.values(err.errors)));
    //Object.values - returns an array of a given object's own enumerable property values
    //eg: obj={a:10} it will return [10]
    //map((item) => item.message).join('. ') - just to get the message errors inside name, email & password
    customError.msg = Object.values(err.errors).map((item) => item.message).join('. ');
    Number
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  //duplicate email error 
  //if this condition not match, will use customError
  if (err.code && err.code === 11000) {
    // overwrite the customError msg
    //Object.keys(err.keyValue) to get array for the object(err.keyValue) key / property name
    //eg: obj={a:10} it will return [a]
    //Object.keys(err.keyValue) - to get 'email' key
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  //cast error - if syntax for /:id is not correct
  // name and value from err object
  if (err.name === 'CastError') {
    customError.msg = `No job found with id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  //uncomment below to get big detail error response
  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
