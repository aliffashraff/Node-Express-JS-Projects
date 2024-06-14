const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

//can just extend from Error class instead of CustomAPiError

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
