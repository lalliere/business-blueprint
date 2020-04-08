const db = require("../models");
const router = require("express").Router();

async function postCustomerApi(req, res) {
  const dbCustomer = await db.Customer.create(req.body);
  res.json(dbCustomer);
}

// function for creating a new sales order
async function postOrderApi (req, res) {
  const dbOrder = await db.Order.create(req.body);
  res.json(dbOrder);
}

// function for creating a new invoice
async function postInvoiceApi (req, res) {
  const dbInvoice = await db.Invoice.create(req.body);
  const salesorderId = dbInvoice.dataValues.salesorder_id;
  // automatically assign the amount of the invoice based on the amount of the given sales order
  const dbOrders = await db.Order.findAll({ where: { id: salesorderId } });
  const amount = dbOrders[0].amount;
  const dbInvoice2 = await db.Invoice.update(
    { total_amount: amount },
    { where: { id: dbInvoice.dataValues.id } }
  );
  res.json({ dbInvoice, dbInvoice2 });
}

// function for creating a new payment
async function postPaymentApi (req, res) {
  const dbPayment = await db.Payment.create(req.body);
  const invoiceId = dbPayment.dataValues.invoice_id;
  // after a new payment is created, grab all the payments for the given invoice and calculate how much has been paid toward that invoice
  const dbPayments = await db.Payment.findAll({
    where: { invoice_id: invoiceId }
  });
  let totalPaid = 0;
  for (let i = 0; i < dbPayments.length; i++) {
    const amount = parseFloat(dbPayments[i].amount);
    totalPaid = totalPaid + amount;
  }
  const dbInvoices = await db.Invoice.findAll({ where: { id: invoiceId } });
  // evaluate whether the invoice has been paid in full
  let isPaid;
  if (dbInvoices[0].total_amount - req.body.discount - totalPaid > 0) {
    isPaid = false;
  } else {
    isPaid = true;
  }
  await db.Invoice.update(
    { amount_paid: totalPaid, paid: isPaid },
    { where: { id: invoiceId } }
  );
  res.json(dbPayment);
}



router.get("/api/customers", function(req, res) {
  db.Customer.findAll({}).then(function(dbCustomers) {
    res.json(dbCustomers);
  });
});

// Get a customer
router.get("/api/customers/:id", function(req, res) {
  db.Customer.findAll({ where: { id: req.params.id } })
    .then(function(dbCustomers) {
      res.json(dbCustomers);
    });
});

// Create a new customer
router.post("/api/customers", postCustomerApi);

// Get all sales orders
router.get("/api/salesorders", function(req, res) {
  db.Order.findAll({}).then(function(dbOrder) {
    res.json(dbOrder);
  });
});

// Get a sales order
router.get("/api/salesorders/:id", function(req, res) {
  db.Order.findAll({ where: { id: req.params.id } }).then(function( dbOrders ) {
    res.json(dbOrders);
  });
});

// Create a new sales order
router.post("/api/salesorders", postOrderApi);

// Get all invoices
router.get("/api/invoices", function(req, res) {
  db.Invoice.findAll({}).then(function(dbInvoice) {
    res.json(dbInvoice);
  });
});

// Get an invoice
router.get("/api/invoices/:id", function(req, res) {
  db.Invoice.findAll({ where: { id: req.params.id } }).then(function( dbInvoices ) {
    res.json(dbInvoices[0]);
  });
});

// Get Paid and Unpaid Invoice report
router.get("/api/invoice/report", (req, res) => {
  db.Invoice.findAll({ where: { paid: true } }).then(report1 => {
    if (report1) {
      let paidreport = report1.map(item => item.dataValues);
      db.Invoice.findAll({ where: { paid: false } }).then(report2 => {
        let unpaidreport = report2.map(item => item.dataValues);
        let report = {
          "unpaid": unpaidreport,
          "paid": paidreport
        };
        res.json(report);
      });
    }
  });
});

// Create a new invoice
router.post("/api/invoices", postInvoiceApi);

// Update an invoice
router.put("/api/invoices/:id", function(req, res) {
  if (req.body.salesorder_id) {
    db.Invoice.update(
      { salesorder_id: req.body.salesorder_id },
      { where: { id: req.params.id } }
    ).then(function(dbInvoice) {
      if (req.body.discount) {
        // if we are updating the discount, we have to reevaluate whether the invoice has been paid in full
        db.Invoice.findAll({ where: { id: req.params.id } }).then(function( dbInvoices ) {
          let isPaid;
          if (
            dbInvoices[0].total_amount -
              req.body.discount -
              dbInvoices[0].amount_paid >
            0
          ) {
            isPaid = false;
          } else {
            isPaid = true;
          }
          db.Invoice.update(
            { discount: req.body.discount, paid: isPaid },
            { where: { id: req.params.id } }
          ).then(function(dbInvoice) {
            res.json(dbInvoice);
          });
        });
      } else {
        res.json(dbInvoice);
      }
    });
  } else if (req.body.discount) {
    db.Invoice.findAll({ where: { id: req.params.id } }).then(function(
      dbInvoices
    ) {
      // if we are updating the discount, we have to reevaluate whether the invoice has been paid in full
      let isPaid;
      if (
        dbInvoices[0].total_amount -
          req.body.discount -
          dbInvoices[0].amount_paid >
        0
      ) {
        isPaid = false;
      } else {
        isPaid = true;
      }
      db.Invoice.update(
        { discount: req.body.discount, paid: isPaid },
        { where: { id: req.params.id } }
      ).then(function(dbInvoice) {
        res.json(dbInvoice);
      });
    });
  }
});

// Delete an invoice by id
router.delete("/api/invoices/:id", function(req, res) {
  db.Invoice.destroy({ where: { id: req.params.id } }).then(function(
    dbInvoice
  ) {
    res.json(dbInvoice);
  });
});

// Get all payments
router.get("/api/payments", function(req, res) {
  db.Payment.findAll({}).then(function(dbPayment) {
    res.json(dbPayment);
  });
});

// Get a payment
router.get("/api/payments/:id", function(req, res) {
  db.Payment.findAll({ where: { id: req.params.id } }).then(function( dbPayments ) {
    res.json(dbPayments[0]);
  });
});

// Create a new payment
router.post("/api/payments", postPaymentApi);

// Update a payment
router.put("/api/payments/:id", function(req, res) {
  if (req.body.invoice_id) {
    db.Payment.findAll({ where: { id: req.params.id } }).then(function(
      dbPayment
    ) {
      // if we are changing the invoice to which a payment is routerlied, we have to recalculate how much has been paid on the original invoice as well as the new one, as well as determine whether they both have been paid in full
      const oldInvoiceId = dbPayment[0].invoice_id;
      db.Payment.update(
        { invoice_id: req.body.invoice_id },
        { where: { id: req.params.id } }
      ).then(function(dbPayment) {
        db.Payment.findAll({ where: { invoice_id: oldInvoiceId } }).then(
          function(dbPayments) {
            let totalPaid = 0;
            for (let i = 0; i < dbPayments.length; i++) {
              const amount = parseFloat(dbPayments[i].amount);
              totalPaid = totalPaid + amount;
            }
            db.Invoice.findAll({ where: { id: oldInvoiceId } }).then(
              function(dbInvoices) {
                let isPaid;
                if (
                  dbInvoices[0].total_amount -
                    dbInvoices[0].discount -
                    totalPaid >
                  0
                ) {
                  isPaid = false;
                } else {
                  isPaid = true;
                }
                db.Invoice.update(
                  { amount_paid: totalPaid, paid: isPaid },
                  { where: { id: oldInvoiceId } }
                ).then(function() {
                  db.Payment.findAll({
                    where: { invoice_id: req.body.invoice_id }
                  }).then(function(dbPayments) {
                    let totalPaid = 0;
                    for (let i = 0; i < dbPayments.length; i++) {
                      const amount = parseFloat(dbPayments[i].amount);
                      totalPaid = totalPaid + amount;
                    }
                    db.Invoice.findAll({
                      where: { id: req.body.invoice_id }
                    }).then(function(dbInvoices) {
                      let isPaid;
                      if (
                        dbInvoices[0].total_amount -
                          dbInvoices[0].discount -
                          totalPaid >
                        0
                      ) {
                        isPaid = false;
                      } else {
                        isPaid = true;
                      }
                      db.Invoice.update(
                        { amount_paid: totalPaid, paid: isPaid },
                        { where: { id: req.body.invoice_id } }
                      ).then(function() {
                        if (req.body.amount) {
                          // if changing the amount of a payment, reevaluate how much has been paid toward that invoice and whether it has been paid in full
                          db.Payment.update(
                            { amount: req.body.amount },
                            { where: { id: req.params.id } }
                          ).then(function() {
                            db.Payment.findAll({
                              where: { id: req.params.id }
                            }).then(function(dbPayment) {
                              const invoiceId = dbPayment[0].invoice_id;
                              db.Payment.findAll({
                                where: { invoice_id: invoiceId }
                              }).then(function(dbPayments) {
                                let totalPaid = 0;
                                for (
                                  let i = 0;
                                  i < dbPayments.length;
                                  i++
                                ) {
                                  const amount = parseFloat(
                                    dbPayments[i].amount
                                  );
                                  totalPaid = totalPaid + amount;
                                }
                                db.Invoice.findAll({
                                  where: { id: invoiceId }
                                }).then(function(dbInvoices) {
                                  let isPaid;
                                  if (
                                    dbInvoices[0].total_amount -
                                      dbInvoices[0].discount -
                                      totalPaid >
                                    0
                                  ) {
                                    isPaid = false;
                                  } else {
                                    isPaid = true;
                                  }
                                  db.Invoice.update(
                                    {
                                      amount_paid: totalPaid,
                                      paid: isPaid
                                    },
                                    { where: { id: invoiceId } }
                                  ).then(function() {
                                    res.json(dbPayment);
                                  });
                                });
                              });
                            });
                          });
                        } else {
                          res.json(dbPayment);
                        }
                      });
                    });
                  });
                });
              }
            );
          }
        );
      });
    });
  } else if (req.body.amount) {
    // if changing the amount of a payment, reevaluate how much has been paid toward that invoice and whether it has been paid in full
    db.Payment.update(
      { amount: req.body.amount },
      { where: { id: req.params.id } }
    ).then(function() {
      db.Payment.findAll({ where: { id: req.params.id } }).then(function(
        dbPayment
      ) {
        const invoiceId = dbPayment[0].invoice_id;
        db.Payment.findAll({ where: { invoice_id: invoiceId } }).then(
          function(dbPayments) {
            let totalPaid = 0;
            for (let i = 0; i < dbPayments.length; i++) {
              const amount = parseFloat(dbPayments[i].amount);
              totalPaid = totalPaid + amount;
            }
            db.Invoice.findAll({ where: { id: invoiceId } }).then(function(
              dbInvoices
            ) {
              let isPaid;
              if (
                dbInvoices[0].total_amount -
                  dbInvoices[0].discount -
                  totalPaid >
                0
              ) {
                isPaid = false;
              } else {
                isPaid = true;
              }
              db.Invoice.update(
                { amount_paid: totalPaid, paid: isPaid },
                { where: { id: invoiceId } }
              ).then(function() {
                res.json(dbPayment);
              });
            });
          }
        );
      });
    });
  }
});

// Delete a payment by id
router.delete("/api/payments/:id", function(req, res) {
  db.Payment.findAll({ where: { id: req.params.id } }).then(function(
    dbPayment
  ) {
    // after deleting a payment, we have to reevaluate how much has been paid toward an invoice and whether it has been paid in full
    const invoiceId = dbPayment[0].invoice_id;
    db.Payment.destroy({ where: { id: req.params.id } }).then(function(
      dbPayment
    ) {
      db.Payment.findAll({ where: { invoice_id: invoiceId } }).then(
        function(dbPayments) {
          let totalPaid = 0;
          for (let i = 0; i < dbPayments.length; i++) {
            const amount = parseFloat(dbPayments[i].amount);
            totalPaid = totalPaid + amount;
          }
          db.Invoice.findAll({ where: { id: invoiceId } }).then(function(
            dbInvoices
          ) {
            let isPaid;
            if (
              dbInvoices[0].total_amount - req.body.discount - totalPaid >
              0
            ) {
              isPaid = false;
            } else {
              isPaid = true;
            }
            db.Invoice.update(
              { amount_paid: totalPaid, paid: isPaid },
              { where: { id: invoiceId } }
            ).then(function() {
              res.json(dbPayment);
            });
          });
        }
      );
    });
  });
});

module.exports = router;
