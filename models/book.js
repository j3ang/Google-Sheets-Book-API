"use strict";

module.exports = function(sequelize, DataTypes) {
  var Book = sequelize.define('Book', {
    bookName: {type: DataTypes.STRING, allowNull: false},
    bookAuthor: {type: DataTypes.STRING, allowNull: false}
  });

  return Book;
};
