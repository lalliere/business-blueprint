M.AutoInit();
//$(document).ready(function(){
//$('.collapsible').collapsible();
//$('input#input_text, textarea#textarea2').characterCounter();
// $('select').formSelect();
//can not get the all of these to work
//select is for drop down selection of states that is unused currently
//});

$("#client-form").submit(function(event) {
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
    url: "/customer/addNew",
    method: "POST",
    data: values
  }).then(function(response) {
    console.log(response);
  });
});

$("#item-form").submit(function(event) {
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

  $.ajax({
    url: "/item/addNew",
    method: "POST",
    data: values
  }).then(function(response) {
    console.log(response);
  });
});
