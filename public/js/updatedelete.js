M.AutoInit();
// const custSearchResults = document.getElementById("custSearchResults");

// document
//   .getElementById("cust-send-btn")
//   .addEventListener("click", function(event) {

//Update Delete for customers
let id;
let itemID;

function addDashes(str)
{
   // in_val = str.replace(/\D[^\.]/g, "");
    val = str.slice(0,3)+"-"+str.slice(3,6)+"-"+str.slice(6);
    return val ;
}

$("#cust-send-btn").click(function(req, res) {
  event.preventDefault();
  // Get all the forms elements and their values in one step
  var $inputs = $("#client-form :input");
  console.log($inputs);

  // get an associative array of just the values.
  var values = {};
  $inputs.each(function() {
    values[this.id] = $(this).val();
  });
  console.log(values);

  $.ajax({
    url: "/customers/updatedelete",
    method: "POST",
    data: values
  }).then(function(response) {
    console.log(response[0]);
    //$("#custSearchResults").text(JSON.stringify(response));
    M.updateTextFields();
    $("#uCustFirst").val(response[0].first_name);
    $("#uCustLast").val(response[0].last_name);
    $("#uCustEmail").val(response[0].email);
    let phoneNumber = addDashes( "" + response[0].phone_number)
    $("#uCustPhone").val(phoneNumber);
    $("#hiddenCustId").val(response[0].id);

    id = response[0].id;

  });
});


$("#updCustBtn1").click(function(req, res) {
  event.preventDefault();
  // Get all the forms elements and their values in one step
  var $inputs = $("#update-customer-form :input");
  console.log($inputs);

  // get an associative array of just the values.
  var values = {};
  $inputs.each(function() {
    values[this.id] = $(this).val();
  });
  console.log(values);
  console.log("ID" + id)
  updateUrl = "/customers/update/" + id;

  $.ajax({
    url: updateUrl,
    method: "PUT",
    data: values
  }).then(function(response) {
    console.log(response);
  });
});

$("#delCustBtn1").click(function(req, res) {
  event.preventDefault();
  deleteUrl = "/customers/delete/" + id;

  $.ajax({
    url: deleteUrl,
    method: "DELETE"
  }).then(function(response) {
    console.log("Success!")
  })
});


//Update delete for Items
//Get Item
$("#item-search-btn").click(function(req, res) {
  event.preventDefault();
  // Get all the forms elements and their values in one step
  var $inputs = $("#item-form :input");
  console.log($inputs);

  // get an associative array of just the values.
  var values = {};
  $inputs.each(function() {
    values[this.id] = $(this).val();
  });
  console.log(values.udItemName);

  $.ajax({
    url: "/items/" + values.udItemName,
    method: "GET",
  }).then(function(response) {
    console.log(response);
    $("#uItemName").val(response.item_name);
    $("#uItemPrice").val(response.cost);
    itemID = response.id;
  });
});

//Update Item
$("#updCustBtn2").click(function(req, res) {
  event.preventDefault();
  // Get all the forms elements and their values in one step
  var $inputs = $("#item-form :input");
  console.log($inputs);

  // get an associative array of just the values.
  var values = {};
  $inputs.each(function() {
    values[this.id] = $(this).val();
  });
  console.log(values);
  console.log("ID" + itemID)
  updateUrl = "/items/update/" + itemID;

  $.ajax({
    url: updateUrl,
    method: "PUT",
    data: values
  }).then(function(response) {
    console.log(response);
  });
});

$("#delCustBtn2").click(function(req, res) {
  event.preventDefault();
  deleteUrl = "/items/delete/" + itemID;

  $.ajax({
    url: deleteUrl,
    method: "DELETE"
  }).then(function(response) {
    console.log("Success!")
  })
});