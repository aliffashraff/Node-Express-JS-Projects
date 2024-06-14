//get dotenv package
require('dotenv').config();

//get express-async-errors package
require('express-async-errors');

//async errors

//setup express
const express = require('express');
const app = express();

//import connectDB
const connectDB = require('./db/connect');

//import router
const productsRouter = require('./routes/products');

//import route not found middleware
const notFoundMiddleware = require('./middleware/not-found');

//import custom generic error handler middleware
const errorHandlerMiddleware = require('./middleware/error-handler');

//Middlewares

//not store caching middeleware
app.use((req, res, next) => {
  res.set({'Cache-Control': 'no-store'});
  next();
});

//parse json middleware
app.use(express.json());

//routes
app.get('/', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">Products Route</a>');
});

app.use('/api/v1/products', productsRouter);

//products route

//error middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//port variable
const port = process.env.PORT || 3000;

const start = async() => {
  //start async because mongoose return promise
  try {
    //connect database - pass connecton string
    await connectDB(process.env.MONGO_URI);

    //start server
    app.listen(port, () => console.log(`Server is listening to port ${port}...`));
  }

  catch (error) {
    console.log(error);
  }
};

start();


