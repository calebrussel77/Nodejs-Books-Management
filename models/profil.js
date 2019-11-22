'use strict';
module.exports = (sequelize, DataTypes) => {
  const profil = sequelize.define('profil', {
    is_admin: DataTypes.BOOLEAN
  }, {});
  profil.associate = function(models) {
    // associations can be defined here
    //   profil.hasMany(models.User);
  };
  return profil;
};