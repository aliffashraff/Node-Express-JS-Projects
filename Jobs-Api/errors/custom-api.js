class CustomAPIError extends Error {
  constructor(message) {
    super(message)
  }
}

module.exports = CustomAPIError

//can actually delete this CustomAPIError and make all of the other errors extend from Error class
