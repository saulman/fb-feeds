'use strict';

module.exports = function(sequelize, DataTypes) {
  var Feed = sequelize.define("Feed", {
    url: DataTypes.STRING,
    name: DataTypes.STRING,
    text: DataTypes.BOOLEAN,
    image: DataTypes.BOOLEAN,
    video: DataTypes.BOOLEAN
  });
/*
  Feed
    .sync({force: true})
   .then(function (){
      return Feed.create({
        url: 'https://www.facebook.com/EikNamo2',
        name: 'Eik Namo2',
        text: true,
        image: true,
        video: true
      });

    });
*/
  return Feed;
};
