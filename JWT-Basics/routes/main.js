const express = require('express');
const router = express.Router();

//import route
const {
  login,
  dashboard
} = require('../controllers/main');

//import authMiddleware
const authMiddleware = require('../middleware/auth');


//restricted access
//every time the dashboard route accessed, will go through authMiddleware first, then dashboard
router.route('/dashboard').get(authMiddleware, dashboard);
//public access
router.route('/login').post(login);

module.exports = router;