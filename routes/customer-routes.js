// Requiring our models and passport as we've configured it
const db = require("../models");
const { Router } = require("express");

const customer = Router();

//Tested
//get a specific customer
customer.post("/customers/updatedelete", function(req, res) {
  db.Customer.findAll({
    where: {
      first_name: req.body.first_name,
      last_name: req.body.last_name
    }
  }).then(function(dbCustomer) {
    res.json(dbCustomer);
  });
});

//get all customers
customer.post("/customers/", function(req, res) {
  console.log(req.body);
  db.Customer.findAll({
    where: {
      first_name: req.body.first_name,
      last_name: req.body.last_name
    }
  }).then(function(dbCustomer) {
    res.json(dbCustomer);
  });
});



//get a specific customer by id
customer.get("/customers/:id", function(req, res) {
  db.Customer.findAll({
    where: {
      id: req.params.id
    }
  }).then(function(dbCustomer) {
    res.json(dbCustomer);
  });
});

//Tested
// POST route for saving a new customer
customer.post("/customer/addNew", function(req, res) {
  console.log(req.body);
  let str = req.body.CuPhone;
  let newStr = str.replace(/-/g, "");
  console.log(newStr);
  db.Customer.create({
    first_name: req.body.CuFirstName,
    last_name: req.body.CuLastName,
    email: req.body.CuEmail,
    phone_number: parseInt(newStr)
  }).then(function(dbPost) {
    res.json(dbPost);
  });
});


// DELETE route for deleting posts
customer.delete("/customer/posts/:id", function(req, res) {
  db.Post.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(dbPost) {
    res.json(dbPost);
  });
});

module.exports = customer;
