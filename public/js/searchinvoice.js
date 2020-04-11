const searchStrEl = document.getElementById("search-term");
const searchByEl = document.getElementById("search-by");
// containers for showing search results
const resultHeaderEl = document.getElementById("result-header");
const resultContainerEl = document.getElementById("table-body");

// adds click event to the button 'search'
document
  .getElementById("search-btn")
  .addEventListener("click", function(event) {
    const searchByValue = searchByEl.value;
    if (searchStrEl.value === "") {
      // do thing if search term is blank
    } else {
      switch (searchByValue) {
        case "Invoice Number":
          axios.get(`/api/invoices/${searchStrEl.value}`).then(res => {
            console.log(res);
            showInvoicesResultHTML(res.data, resultContainerEl);
          });
          break;

        case "Sales Order Number":
          axios.get(`/api/salesorders/${searchStrEl.value}`).then(res => {
            console.log(res);
            showSalesResultHTML(res.data[0], resultContainerEl);
          });
          break;

        // default is 'Sales Order Number'
        default:
          axios
            .get(
              `/invoices/search-by-salesorder/${parseInt(searchStrEl.value)}`
            )
            .then(res => showResultHTML(res.data, resultContainerEl));
      }
    }
  });

// function that renders html with the search results
function showInvoicesResultHTML(data, resultContainer) {
  // shows the result header which was hidden on page load
  resultHeaderEl.setAttribute("class", "container-fluid");
  const arrayData = [data];
  const innerHTML = arrayData.map(function(invoice) {
    return `<tr id=${invoice.id}>
              <td> ${invoice.id}</td>
              <td> ${invoice.salesorder_id}</td>
              <td> ${invoice.createdAt}</td>
              <td> ${invoice.total_amount}</td>
            </tr>`;
  });
  resultContainer.innerHTML = innerHTML.join("\n");
  // add click event to each record of results
  const resultEl = document.querySelectorAll(".result-js");
  for (let i = 0; i < resultEl.length; i++) {
    resultEl[i].addEventListener("click", function(event) {
      const id = event.target.parentElement.getAttribute("id");
      sessionStorage.setItem("id", id);
      console.log("id: ", id);
      window.location.href = "./update-invoice.html";
    });
  }
}

function showSalesResultHTML(data, resultContainer) {
  // shows the result header which was hidden on page load
  resultHeaderEl.setAttribute("class", "container-fluid");
  const arrayData = [data];
  const innerHTML = arrayData.map(function(sales) {
    return `<tr id=${sales.id}>
              <td> ${sales.id}</td>
              <td> ${sales.customer_id}</td>
              <td> ${sales.createdAt}</td>
              <td> ${sales.amount}</td>
            </tr>`;
  });
  resultContainer.innerHTML = innerHTML.join("\n");
  // add click event to each record of results
  const resultEl = document.querySelectorAll(".result-js");
  for (let i = 0; i < resultEl.length; i++) {
    resultEl[i].addEventListener("click", function(event) {
      const id = event.target.parentElement.getAttribute("id");
      sessionStorage.setItem("id", id);
      console.log("id: ", id);
      window.location.href = "./update-invoice.html";
    });
  }
}