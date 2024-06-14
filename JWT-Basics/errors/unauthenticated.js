//an object StatusCodes
const {StatusCodes} = require('http-status-codes');
const CustomAPIError = require("./custom-error");

//for unautherized error 401
class Unauthorized extends CustomAPIError {
  constructor(message) {
    super(message),
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

module.exports = Unauthorized;