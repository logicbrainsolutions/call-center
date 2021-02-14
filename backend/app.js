const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');


const exerciseRoutes = require('./api/routes/exercise');
const userRoutes = require('./api/routes/user');
const departmentRoutes = require('./api/routes/department')
mongoose.connect('mongodb://127.0.0.1:27017/fitness', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise
mongoose.connection.on('connected', () => console.log('Connected'));
mongoose.connection.on('error', () => console.log('Connection failed with - ',err));

app.use(morgan('dev'));
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Any url containing stepCounter 
// will be handled by stepcounterroutes
app.use('/exercise', exerciseRoutes);
app.use('/user', userRoutes);
app.use('/department', departmentRoutes);
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app; 