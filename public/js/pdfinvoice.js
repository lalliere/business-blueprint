// get session storage of invoice id
// const fs = require("fs");
const invoiceID = sessionStorage.getItem("id");
const orderSubReportContainer = document.getElementById("order-table-body");
const paymentSubrptContainer = document.getElementById("payment-table-body");
// variables for invoice footer/summary
let totalInvoiceAmt;
let discount;
let totalPaidAmt = 0;

// show invoice number
document.getElementById( "invoice-number" ).innerHTML = `INVOICE No. ${invoiceID}`;
// # show sub reports 'sales order'
// ## get order id of the invoice
axios.get(`/api/invoices/${invoiceID}`).then(invoice => {
  console.log("Invoice: ", invoice);
  console.log("order id: ", invoice.data.salesorder_id);
  // INVOICE FOOTER
  discount = invoice.data.discount;
  if (discount === null) {
    discount = 0;
  }
  console.log("discount: ", discount);

  console.log("discount: ", discount);
  // .... get order info
  axios.get(`api/salesorders/${invoice.data.salesorder_id}`).then(order => {
    // render order info to html page
    renderSalesOrder(order.data[0], orderSubReportContainer);

    // INVOICE FOOTER
    totalInvoiceAmt = order.data[0].amount;
    console.log("Orders", order)

    console.log("Total Invoice Amt: ", totalInvoiceAmt);

    // # Show sub report 'payments'
    //  - get payment IDs of the invoice
    //  - render payment info
    axios.get("/api/payments").then(res => {
      const results = [];
      console.log(res);
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].invoice_id === parseInt(invoiceID)) {
          results.push(res.data[i]);
          totalPaidAmt = totalPaidAmt + parseFloat(res.data[i].amount);
        }
      }
      console.log("Results: ", results[0]);
      console.log("total paid: ", totalPaidAmt);
      renderPaymentSubRpt(results, paymentSubrptContainer);

      // INVOICE FOOTER/SUMMARY
      let color;
      showInvoiceFooter();
      async function showInvoiceFooter() {
        const invoiceTotal = document.getElementById("invoice-total");
        const paidAmount = document.getElementById("paid-amount");
        const discountEl = document.getElementById("discounted-amount");
        const balanceDue = document.getElementById("balance-due");
        if (balanceDue > 0)
          color = "red";
        else
          color = "green";

        const totalInvoice = totalInvoiceAmt;
        const discountAmt = discount;
        const totalPaid = totalPaidAmt;

        // show footer
        invoiceTotal.innerHTML = "$" + parseFloat(totalInvoice);
        paidAmount.innerHTML = "$" + totalPaid;
        discountEl.innerHTML = "$" + discountAmt;
        balanceDue.innerHTML =
          "$" + (totalInvoiceAmt - totalPaid - discountAmt);
      }

      // PRINT PDF
      document.getElementById("pdf-btn").addEventListener("click", function() {
        // convertToPDF();
        // open in new tap;
        // order_report = document.getElementById('order-sub-report').innerHTML;
        // console.log(order_report)
        // const order_no = document.getElementById('order-id').innerHTML
        // const description = document.getElementById('order-desc').innerHTML
        // const amount = document.getElementById('order-amt').innerHTML

        // const invoice_no = document.getElementById('payment-id').innerHTML
        // const paid_date = document.getElementById('payment-create').innerHTML
        // const paid_amount = document.getElementById('payment-amt').innerHTML

        const invoiceTotal = document.getElementById("invoice-total").innerHTML;
        const paidAmount = document.getElementById("paid-amount").innerHTML;
        const discountEl = document.getElementById("discounted-amount").innerHTML;
        const balanceDue = document.getElementById("balance-due").innerHTML;

        let docDef = {
          content: [
            {text: 'Sales Orders', style: 'header'},
            {
              style: 'tableExample',
              table: {
                widths: [150, 'auto', 150],
                body: [
                  [{text: 'Order #', fillColor: 'grey', color: 'white'}, {text: 'Description', fillColor: 'grey', color: 'white'}, {text: 'Amount', fillColor: 'grey', color: 'white'}],
                  [order.data[0].id, order.data[0].description, `$ ${order.data[0].amount}`]
                ]
              }
            },
            {text: 'Payment', style: 'header'},
            {
              style: 'tableExample',
              table: {
                widths: [150, 'auto', 150],
                body: [
                  [{text: 'Invoice #', fillColor: 'grey', color: 'white'}, {text: 'Paid Date', fillColor: 'grey', color: 'white'}, {text: 'Paid Amount', fillColor: 'grey', color: 'white'}],
                  [results[0].invoice_id, results[0].createdAt, `$ ${results[0].amount}`]
                ]
              }
            },
            {text: 'Invoice Details', style: 'header'},
            {
              style: 'tableExample',
              table: {
                widths: ['auto', 'auto', 'auto', 'auto'],
                body: [
                  [{text: 'Invoice Total', fillColor: 'grey', color: 'white'}, {text: 'Paid Amount', fillColor: 'grey', color: 'white'}, {text: 'Discount', fillColor: 'grey', color: 'white'}, {text: 'Balance Due', fillColor: 'grey', color: color}],
                  [`$ ${invoiceTotal}`, `$ ${paidAmount}`, `$ ${discountEl}`, `$ ${balanceDue}`]
                ]
              }
            }
          ]
        }

        pdfMake.createPdf(docDef).download();
      });
    });
  });
});

function renderSalesOrder(order, orderSubReportContainer) {
  // show result the found sales order
  orderSubReportContainer.innerHTML = `<tr>
                                        <td>${order.id}</td>
                                        <td> ${order.description} </td>
                                        <td> ${order.amount}</td>
                                      </tr>`;
}

function renderPaymentSubRpt(data, paymentSubrptContainer) {
  const innerHTML = data.map(function(payment) {
    return `<tr>
              <td>${payment.invoice_id}</td>
              <td>${payment.createdAt}</td>
              <td> ${payment.amount} </td>
            </tr>`;
  });
  paymentSubrptContainer.innerHTML = innerHTML.join("\n");
}