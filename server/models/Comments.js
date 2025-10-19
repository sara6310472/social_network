const { DataTypes } = require('sequelize');
const sequelize = require("../../dataBase/dataBase"); 
const Posts = require('./Posts');

const Comments = sequelize.define('Comments', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Comments.belongsTo(Posts, { foreignKey: 'postId' });

module.exports = Comments;
