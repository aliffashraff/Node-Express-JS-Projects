const {CustomError} = require('../errors/custom-error');

//setup custom error handler //refer task.js(controller) and custom-error.js
function errorHandler (err, req, res, next) {
  //for error 404 eg: id not found
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({msg: err.message});
  }

  //for generic error 500
  return res.status(500).json({msg: 'Something went wrong, please try again'});
}

module.exports = errorHandler;