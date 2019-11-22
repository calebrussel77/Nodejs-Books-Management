'use strict';
module.exports = (sequelize, DataTypes) => {
  const reserve = sequelize.define('reserve', {
    reserved_date: DataTypes.DATE,
    id_user: DataTypes.INTEGER,
    id_book: DataTypes.INTEGER
  }, {});
  reserve.associate = function(models) {
    // associations can be defined here
  };
  return reserve;
};