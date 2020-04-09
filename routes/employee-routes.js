// Requiring our models and passport as we've configured it
const db = require("../models");
const { Router } = require("express");

const item = Router();

// POST route for saving a new item
item.post("/employee/addNew", function(req, res) {
  console.log(req.body);
  db.Employee.create({
    item_name: req.body.itemName,
    cost: parseInt(req.body.itemPrice)
  }).then(function(dbPost) {
    res.json(dbPost);
  });
});
