const searchStrEl = document.getElementById("search-term");
const searchByEl = document.getElementById("search-by");
// containers for showing search results
const resultHeaderEl = document.getElementById("result-header");
const resultContainerEl = document.getElementById("table-body");

// adds click event to the button 'search'
document
  .getElementById("search-btn")
  .addEventListener("click", function(event) {
    document.getElementById("results").style["right"] = 0;
    document.getElementById("results").style["margin-right"] = "400px"
    
    const searchByValue = searchByEl.value;
    if (searchStrEl.value === "" || !parseInt(searchStrEl.value)) {
      // do thing if search term is blank or not a number
    } else {
      switch (searchByValue) {
        case "Order Number":
          axios.get(`/api/salesorders/${searchStrEl.value}`).then(res => {
            console.log(res);
            showResultHTML(res.data, resultContainerEl);
          });
          break;
        // default is 'Customer Account Number'
        default:
          // get all sales order from DB then loop through records to compare customer_id with the search term
          // when the customer_id is met, store matched records in the array 'results'
          axios.get("/api/salesorders").then(res => {
            const results = [];
            console.log(res);
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].customer_id === parseInt(searchStrEl.value)) {
                results.push(res.data[i]);
              }
            }
            showResultHTML(results, resultContainerEl);
          });
          break;
      }
    }
  });

// function that renders html with the search results
function showResultHTML(data, resultContainer) {
  // shows the result header which was hidden on page load
  resultHeaderEl.classList.remove("hidden")
  resultHeaderEl.setAttribute("class", "container-fluid");
  const innerHTML = data.map(function(order) {
    return `<tr>
              <td> ${order.id}</td>
              <td> ${order.customer_id}</td>
              <td> ${order.description}</td>
              <td> ${order.amount}</td>
              <td> ${order.createdAt}</td>
          </tr>`;
  });
  resultContainer.innerHTML = innerHTML.join("\n");
  // add click event to each record of results
  const resultEls = document.querySelectorAll(".results-js");
  for (let i = 0; i < resultEls.length; i++) {
    resultEls[i].addEventListener("click", function(event) {
      const id = event.target.parentElement.getAttribute("id");
      sessionStorage.setItem("id", id);
      console.log(sessionStorage.getItem("id"));
      window.location.href = "./update-sales-order.html";
    });
  }
}


// `<div id=${order.id} class="row sub-report-text sub-report-row py-1 results-js">
//       <div class="col-2"></div>
//       <div class="col-2"></div>
//       <div class="col-6">  </div>
//       <div class="col-2 text-right"> </div>
// </div>`