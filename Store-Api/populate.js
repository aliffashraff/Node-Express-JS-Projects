//get dotenv package
require('dotenv').config();
//get connectDB
const connectDB = require('./db/connect');
//get the model
const Product = require('./models/product');
//get json products
const jsonProducts = require('./products.json');

//connect to database and use the model to automatically add the json products to the database
const start = async() => {
  try {
    await connectDB(process.env.MONGO_URI);
    //delete all the obejcts first (optional)
    await Product.deleteMany();
    //passing json products to the database
    await Product.create(jsonProducts);
    console.log('successfully connected to databse...');
    process.exit(0);
  } 
  
  catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();



