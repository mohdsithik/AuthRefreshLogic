const express = require('express');
const cors = require('cors'); 

const morgan = require('morgan');
const createError = require('http-errors');
require('dotenv').config()
require('./helpers/init_mongodb');
require('./helpers/init_redis')

const AuthRoute = require('./routes/auth.routes');
const {verifyAccessToken} = require('./helpers/jwt_helper')

const app = express();
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const corsOptions = {
    credentials: true,
    origin: ['http://localhost:3000', 'https://2935-27-7-14-156.ngrok-free.app'] // Whitelist the domains you want to allow
};

app.use(cors(corsOptions)); // Use the cors middleware with your options



app.get('/hello', async (req, res, next) => {
    res.send('Hello ALL')
})



app.use('/auth', AuthRoute);

app.use(async (req, res, next) => {
    next(createError.NotFound('This route does not exist'))
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        }
    })
})


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})