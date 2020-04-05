module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define("Invoice", {
    discount: {
      type: DataTypes.INTEGER
    },
    payment_status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  Invoice.associate = function(models) {
    models.Invoice.belongsTo(models.Order);
  };
  return Invoice;
};
