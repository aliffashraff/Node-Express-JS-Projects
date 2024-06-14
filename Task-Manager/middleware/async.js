//wrap the controller so that we can remove try & catch block in the controller
//instead create the asyncwrapper, can install express-async-errors package
function asyncWrapper(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    }

    catch (error) {
      next(error);
    }
  }
}

module.exports = asyncWrapper;