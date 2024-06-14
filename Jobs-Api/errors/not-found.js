const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

//can just extend from Error class instead of CustomAPiError

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
