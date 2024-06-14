//get the model
const Product = require('../models/product');

const getAllProductsStatic = async(req, res) => {
  /* //test error and the string can be seen in the log
  throw new Error('testing async errors'); */

  /* //filter with specific info such as company name or featured = true
  const products = await Product.find({
    company: ['ikea', 'caressa'], 
    featured: true
  });
  res.status(200).json({products, nbHits: products.length}); */

  /* //name and $regex and $options
  const search = 'ab';
  const products = await Product.find({
    //query operator {$regex: /pattern/, $options: option}
    //$options: 'i' = i stands for case insensitive
    name: {$regex: search, $options: 'i'}
  });
  res.status(200).json({products, nbHits: products.length}); */

  /* //sort
  const products = await Product.find({})
  .sort('name price') //sort with name and price in ascending order (put -name -price for descending)
  ;
  res.status(200).json({products, nbHits: products.length}); */

  /* //select
  const products = await Product.find({})
  .select('name price'); //show certain field / property
  res.status(200).json({products, nbHits: products.length});
 */

  //limit, skip & numeric filter
  //find only items with price greater than 30 and less than 100
  const products = await Product.find({price: {$gt: 30, $lt: 100}})
  .sort('price')
  .select('name price')
  .limit(10) //show products with certain limit
  .skip(5); //skip 5 products from top but still have 10 products
  res.status(200).json({products, nbHits: products.length});
};

const getAllProducts = async(req, res) => {
  //filter the products by acessing query string parameters using req.query
  //can also put query or search or etc.
  const {featured, company, name, sort, fields, numericFilters} = req.query;
  //setup empty object
  const queryObject = {};

  //numeric filters
  if (numericFilters) {
    //change from mongoose to user friendly operator
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '<': '$lt',
      '<=': '$lte',
      '=': '$eq'
    }
    //set regex
    const regEx = /\b(<|>|<=|>=|=)\b/g;

    //if match then replace it with '-operator-'
    //eg result = price-$gt-40,rating-$gte-4
    let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-` );

    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      //array destructuring for filter with '-'
      const [field, operator, value] = item.split('-');

      //if either price or rating included in the field
      if (options.includes(field)) {
        //pass field property(priceorrating) in queryObject with operators:value
        queryObject[field] = {[operator]:Number(value)};
      }
    });
  }
  console.log(queryObject);

  //filter featured
  if (featured) {
    //if there is featured property in req.query, check wether it is true or not
    //pass the property and its value to queryObject
    //if property is not feature pass empty object
    queryObject.featured = featured === 'true' ? true : false;
  }

  //filter company
  if (company) {
    queryObject.company = company;
  }
  //filter name
  if (name) {
    queryObject.name = {$regex: name, $options: 'i'};
  }

  //pass queryObject in find()
  let result = Product.find(queryObject);
  if (sort) {
    //to sort multiple property eg: sort(name price)
    //split into array and join back with space between
    const sortList = sort.split(',').join(' ');
    //to make sure we chained the other properties such as limit, select, sort
    result = result.sort(sortList);
  }

  if (fields) {
    //select certain property or fields
    //split into array and join back with space between
    const fieldsList = fields.split(',').join(' ');
    //to make sure we chained the other properties such as limit, select, sort
    result = result.select(fieldsList);
  }
  
  else {
    //if no sort
    result = result.sort('createdAt');
  }

  //req.query return a string
  //no noeed destructuring, just add the property
  const page = Number(req.query.page) || 1; 
  //however there is no .page property in mongoose
  //therefore .limit and .skip is use for pagination
  const limit = Number(req.query.limit) || 10;
  const skip = Number(page - 1) * limit;
  //eg: limit = 7 per page
  //for page 1, skip 0 items
  // page 2, skip 7 items and page 3 skip 14 items and..

  result = result.skip(skip).limit(limit);

  //return the document with await after completed result
  const products = await result;
  res.status(200).json({products, nbHits: products.length});
};

module.exports = {
  getAllProductsStatic, 
  getAllProducts
};
