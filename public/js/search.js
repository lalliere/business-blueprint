M.AutoInit();

$("#search-form").submit(function(event) {
    event.preventDefault();
    var $inputs = $("#search-form :input");
    console.log($inputs);
  
    // get an associative array of just the values.
    var values = {};
    $inputs.each(function() {
      values[this.id] = $(this).val();
    });
    console.log(values);

    $.ajax({
        url: "/customers/",
        method: "POST",
        data: values
      }).then(function(response) {
        console.log(response);
        $('#resultsBody').text(JSON.stringify(response));
      });

})