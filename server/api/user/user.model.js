'use strict';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  });
/*
  User
    .sync({force: true})
    .then(function (){
      return User.create({
        username: 'admin',
        password: 'admin'
      });
    });
*/
  return User;
};
