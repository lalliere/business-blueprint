// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const { Router } = require("express");
const route = Router();
// Requiring our custom middleware for checking if a user is logged in


route.get("/", function(req, res) {
  // If the user already has an account send them to the members page
  /*if (req.user) {
    res.redirect("/something");
  }*/
  res.sendFile(path.join(__dirname, "../public/home.html"));
});

// Here we've add our isAuthenticated middleware to this route.
// If a user who is not logged in tries to access this route they will be redirected to the signup page
route.get("/members", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/members.html"));
});

route.get("/search", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/search.html"));
});

route.get("/add-new", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/addNew.html"));
});

route.get("/create-customer", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/create-customer.html"));
});

route.get("/create-invoice", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/create-invoice.html"));
});

route.get("/create-sales-order", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/create-sales-order.html"));
});

route.get("/pdf-invoice", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/pdf-invoice.html"));
});

route.get("/search-invoice", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/search-invoice.html"));
});

route.get("/stat-invoice", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/stat-invoice.html"));
});
module.exports = route;
