require('dotenv').config();

//async error wrapper
require('express-async-errors');

const express = require('express');
const app = express();

// import extra security packages
const helmet = require('helmet');
const cors = require('cors');
//xss-clean is deprecated - no longer supported
//const xss = require('xss-clean'); 
const rateLimit = require('express-rate-limit');

// connectDB
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//import authentication middleware
const authenticateUser = require('./middleware/authentication');

//parse JSON - convert JSON string to Javascript object
app.use(express.json());

//to tell Express that it is running behind a reverse proxy (e.g., Nginx, Heroku, AWS ELB)
app.set('trust proxy', 1 /* number of proxies between user and server */)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, //Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));
app.use(helmet());
app.use(cors());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
