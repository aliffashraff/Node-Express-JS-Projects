const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

//can just extend from Error class instead of CustomAPiError

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedError;
