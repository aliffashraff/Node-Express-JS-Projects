//setup express
const express = require('express');
const app = express();

//import router
const tasks = require('./routes/tasks');

//connect database
const connectDB = require('./db/connect');
require('dotenv').config();

//route not found middleware
const notFound = require('./middleware/not-found');

//error handling middleware
const errorHandler = require('./middleware/error-handler');

//middleware

//not store caching middeleware
app.use((req, res, next) => {
  res.set({'Cache-Control': 'no-store'});
  next();
});

//static assets
app.use(express.static('./public'));

//parse json
app.use(express.json());

//routes
//1. .get('/api/v1/tasks')       - to get all the tasks
//2. .post(/api/v1/tasks)        - to create new tasks
//3. .delete(/api/v1/tasks/:id)  - to delete tasks
//4. .get(/api/v1/tasks/:id)     - to get one single task
//5. .patch(/api/v1/tasks/:id)   - to edit(update) tasks

app.use('/api/v1/tasks', tasks);

//custom route not found response
app.use(notFound);

//custom error handler
app.use(errorHandler);

//port variable 
//if it is set, will go with that port value(when deployed), if not, the port will be 3000
const port = process.env.PORT || 3000;

//use async as connectDB return a promise
async function start() {
  try {
    //invoke connectDB(), if success, start the server
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  }
  //databse connection not successful
  catch (error) {
    console.log(error);
  }
}

start();

