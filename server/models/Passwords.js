const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require("../../dataBase/dataBase");  
const Users = require('./Users'); 

const Passwords = sequelize.define('Passwords', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  hashedPassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  // hooks: {
  //   beforeCreate: async (passwordRecord) => {
  //     if (passwordRecord.hashedPassword) {
  //       passwordRecord.hashedPassword = await bcrypt.hash(passwordRecord.hashedPassword, 10);
  //     }
  //   },
  //   beforeUpdate: async (passwordRecord) => {
  //     if (passwordRecord.hashedPassword) {
  //       passwordRecord.hashedPassword = await bcrypt.hash(passwordRecord.hashedPassword, 10);
  //     }
  //   },
  // },
});

Passwords.belongsTo(Users, { foreignKey: 'userId' });

module.exports = Passwords;
