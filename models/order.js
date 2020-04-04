module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  });
  Order.associate = function(models) {
    models.Customer.belongsTo(models.Customer);
  };
  Order.associate = function(models) {
    models.Customer.hasOne(models.Invoice);
  };
  return Order;
};
