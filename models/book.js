'use strict';
module.exports = (sequelize, DataTypes) => {
  const book = sequelize.define('book', {
    quantity: DataTypes.INTEGER,
    book_name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    is_reserved: DataTypes.BOOLEAN,
    description: DataTypes.STRING,
    path_image: DataTypes.STRING,
    id_type: DataTypes.INTEGER
  }, {});
  book.associate = function(models) {
    // associations can be defined here
    //   book.belongsTo(models.type);
    //   book.hasMany(models.reserve);
  };
  return book;
};