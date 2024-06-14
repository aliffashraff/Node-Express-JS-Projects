const mongoose = require('mongoose');

//setup schema
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'product name must be provided']
  },
  price: {
    type: Number,
    required: [true, 'product price must be provided'] 
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 4.5 //setting not set, it will be 4.5
  },
  createdAt: {
    type: Date,
    default: Date.now() //if date not set, it will be current date
  },
  company: {
    type: String,
    //enum define a set of allowed values
    enum: {
      values: ['ikea', 'liddy', 'caressa', 'marcos'],
      //error with the user input value
      message: '{VALUE} is not supported'
    }
    //enum: ['ikea', 'liddy', 'caressa', 'marcos']
  }
});

//export schema with schema nam= 'Product'
module.exports = mongoose.model('Product', ProductSchema);