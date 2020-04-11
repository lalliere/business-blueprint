const orderSubReportContainer = document.getElementById("table-body");
const paidOrder = document.getElementById("paid-btn");
const unpaidOrder = document.getElementById("unpaid-btn");

axios.get("/api/invoice/report")
    .then(res => {
        console.log(res.data)

        const paidInvoices = res.data.paid;
        const unpaidInvoices = res.data.unpaid;

        paidInvoices.forEach(paid => {
            unpaidInvoices.forEach((unpaid, idx) => {
                if (paid.salesorder_id == unpaid.salesorder_id) {
                    unpaidInvoices.splice(idx, 1)
                }
            });
        });
        
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        // Draw the chart and set the chart values
        function drawChart() {
        var data = google.visualization.arrayToDataTable([
        ['ORDER STATUS', 'COUNT'],
        ['Paid', res.data.paid.length],
        ['Unpaid', res.data.unpaid.length]
        ]);

        // Optional; add a title and set the width and height of the chart
        var options = {'title':'Paid VS Unpaid', 'width':700, 'height':400};

        // Display the chart inside the <div> element with id="piechart"
        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
        }

        paidOrder.addEventListener("click", () => {
            document.getElementById("report-area").classList.remove("hidden");
            renderPaymentSubRpt(paidInvoices, orderSubReportContainer);
        })
        unpaidOrder.addEventListener("click", () => {
            document.getElementById("report-area").classList.remove("hidden");
            renderPaymentSubRpt(unpaidInvoices, orderSubReportContainer)
        })
    })
    .catch(err => console.log(err))


function renderPaymentSubRpt(data, paymentSubrptContainer) {
    const innerHTML = data.map(function(order) {
        return `<tr>
                    <td>${order.id}</td>
                    <td>${order.salesorder_id}</td>
                    <td>${order.total_amount}</td>
                    <td>${order.discount}</td>
                    <td>${order.amount_paid}</td>
                </tr>`
    });
    paymentSubrptContainer.innerHTML = innerHTML.join('\n');
}
      
// `<div class="row table-header">
/* <div class="col-2 text-center"> Order Id: </div>
<div class="col-2 text-center"> Sales Order Id: ${order.salesorder_id}</div>
<div class="col-2 text-center"> Total Amount: ${order.total_amount}</div>
<div class="col-2 text-center"> Discount: ${order.discount}</div>
<div class="col-2 text-center"> Amount Paid: ${order.amount_paid}</div>
<div class="col-2 text-center"> Order Created: </div>
</div>`; */