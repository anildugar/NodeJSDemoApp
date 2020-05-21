'use strict';

//Setup Environment Variables
require('dotenv').config();

//Setup Requirements
var express = require('express');
var app = express();

const cors = require('cors');
var DatabaseService = require('./Services/databaseService');
global.dbService = new DatabaseService();

var userRoutes = require('./Routes/userRoutes');
var dbRoutes = require('./Routes/databaseRoutes');
var gameRoutes = require('./Routes/gameRoutes');

//Setup Middleware
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use('/api/user/', userRoutes);

app.use('/api/db/', dbRoutes);

app.use('/api/game/', gameRoutes);

//Setup Routes
app.get('/api', (req, res) => {
    res.status(200).json( {'message' : 'Welcome !!'});
});

var port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`Server listening on Port ${port}`);
});