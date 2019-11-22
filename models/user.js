'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    id_profil: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    //   User.belongsTo(models.profil);
    //   User.hasMany(models.reserve);
  };
  return User;
};