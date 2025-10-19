const { DataTypes } = require('sequelize');
const sequelize = require("../../dataBase/dataBase");
const Users = require('./Users');

const Todos = sequelize.define('Todos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Todos.belongsTo(Users, { foreignKey: 'userId' });

module.exports = Todos;
