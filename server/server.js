require('dotenv').config();

const express = require('express');
const cors = require("cors");

const Routes = require('./routers/router');

const sequelize = require('../dataBase/dataBase');

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.SERVER_PORT;
const hostname = process.env.SERVER_HOSTNAME;

app.use('/', Routes);

sequelize.sync().then(() => {
    app.listen(5000, () => console.log(`"Server is running on port ${port} hostname: ${hostname}"`));
});
