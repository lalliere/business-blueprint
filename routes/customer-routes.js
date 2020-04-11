// Requiring our models and passport as we've configured it
const db = require("../models");
const { Router } = require("express");

const customer = Router();

//WORKS
//get a specific customer
customer.post("/customers/updatedelete", function(req, res) {
  db.Customer.findAll({
    where: {
      first_name: req.body.udCustFirst,
      last_name: req.body.udCustLast
    }
  }).then(function(dbCustomer) {
    res.json(dbCustomer);
  });
});

//WORKS
//update a specific customer
customer.put("/customers/update/:id", function(req, res) {
  console.log(req.params.id);
  let str = req.body.uCustPhone;
  let newStr = str.replace(/-/g, "");
  db.Customer.update({
    first_name: req.body.uCustFirst,
    last_name: req.body.uCustLast,
    email: req.body.uCustEmail,
    phone_number: newStr
  }, {
    where: {
      id: req.params.id
    }
  }).then(function() {
    //res.json(dbCustomer);
    res.send(200);
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
customer.delete("/customers/delete/:id", function(req, res) {
  db.Customer.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(dbPost) {
    res.json(dbPost);
  });
});

module.exports = customer;
