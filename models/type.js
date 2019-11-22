'use strict';
module.exports = (sequelize, DataTypes) => {
  const type = sequelize.define('type', {
    type_name: DataTypes.STRING
  }, {});
  type.associate = function(models) {
    // associations can be defined here
    //   type.hasMany(models.book);
  };
  return type;
};