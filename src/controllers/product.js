import db from '../models';
import { accessLogStream } from '../index.js';

// An example to fetch all products from a table
const fetchProducts = (req, res) => {
  db.sequelize.query(
    "SELECT ID, NAME, DESC, PRICE FROM PRODUCTS",
  ).spread(function (results, metadata) {
    res.json(results);
  }).catch(function (err) {
    var error = String(err);
    res.json(error);
    accessLogStream.write(error);
  })
}

// An example to fetch a product image using ID
// Replacement is used to prevent SQL Injection
const fetchProductImage = (req, res) => {

  // Get prodId from request body
  const { prodId } = req.body;

  db.sequelize.query(
    "SELECT IMAGE FROM PRODUCTS WHERE ID=:prodId",
    {
      replacements: {prodId: prodId},
    }
  ).spread(function (results, metadata) {
    res.json(results);
  }).catch(function (err) {
    var error = String(err);
    res.json(error);
    accessLogStream.write(error);
  })
}


export {
  fetchProducts,
  fetchProductImage,
}