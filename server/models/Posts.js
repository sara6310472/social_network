const { DataTypes } = require('sequelize');
const sequelize = require("../../dataBase/dataBase");
const Users = require('./Users');

const Posts = sequelize.define('Posts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Posts.belongsTo(Users, { foreignKey: 'userId' });

module.exports = Posts;
