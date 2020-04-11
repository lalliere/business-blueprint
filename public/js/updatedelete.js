M.AutoInit();
// const custSearchResults = document.getElementById("custSearchResults");

// document
//   .getElementById("cust-send-btn")
//   .addEventListener("click", function(event) {

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
    console.log(response);
    $("#custSearchResults").text(JSON.stringify(response));
  });
});
