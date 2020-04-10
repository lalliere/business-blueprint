// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const { Router } = require("express");
const route = Router();
const secured = require("../config/middleware/isAuthenticated");
// Requiring our custom middleware for checking if a user is logged in

// Here we've add our isAuthenticated middleware to this route.
// If a user who is not logged in tries to access this route they will be redirected to the signup page
route.get("/members", secured(), function(req, res) {
  res.sendFile(path.join(__dirname, "../public/members.html"));
});

route.get("/searchsalesorder", secured(), function(req, res) {
  res.sendFile(path.join(__dirname, "../public/searchsalesorder.html"));
});

route.get("/search", secured(), function(req, res) {
  res.sendFile(path.join(__dirname, "../public/search.html"));
});

route.get("/addnew", secured(), function(req, res) {
  res.sendFile(path.join(__dirname, "../public/addNew.html"));
});

route.get("/updatedelete", secured(), function(req, res) {
  res.sendFile(path.join(__dirname, "../public/updateDelete.html"));
});

route.get("/createcustomer", secured(), function(req, res) {
  res.sendFile(path.join(__dirname, "../public/createcustomer.html"));
});

route.get("/createinvoice", secured(), function(req, res) {
  res.sendFile(path.join(__dirname, "../public/createinvoice.html"));
});

route.get("/createsalesorder", secured(), function(req, res) {
  res.sendFile(path.join(__dirname, "../public/createsalesorder.html"));
});

route.get("/pdfinvoice", secured(), function(req, res) {
  res.sendFile(path.join(__dirname, "../public/pdfinvoice.html"));
});

route.get("/searchinvoice", secured(), function(req, res) {
  res.sendFile(path.join(__dirname, "../public/searchinvoice.html"));
});

route.get("/statinvoice", secured(), function(req, res) {
  res.sendFile(path.join(__dirname, "../public/statinvoice.html"));
});

route.get("/", function(req, res) {
  // If the user already has an account send them to the members page
  /*if (req.user) {
    res.redirect("/something");
  }*/
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = route;
