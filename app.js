/* eslint-disable no-console */
require('dotenv').config();
require('express-async-errors');

const express = require('express');

const app = express();

//  **  CONNECT TO MONGODB ATLAS  **  //
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log('Database running');
});

//  **  PARSE REQUEST BODY TO JSON  **  //
app.use(express.json());

// ** ENABLE CORS ** //
const cors = require('cors');

const corsOptions = {
  origin: 'https://testably-co-front-end.vercel.app',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};
app.use(cors(corsOptions));

//  **  COOKIE PARSER MIDDLEWARE  **  //
const cookieParser = require('cookie-parser');

app.use(cookieParser());

//  **  USER MODULE  **  //
const userRoutes = require('./user/user.routes');

app.use('/user', userRoutes);

//  **  TOKEN MODULE  **  //
const tokenRoutes = require('./token/token.routes');

app.use('/token', tokenRoutes);

//  **  ABTEST MODULE  **  //
const abtestRoutes = require('./abtest/abtest.routes');

app.use('/abtest', abtestRoutes);

//  **  VARIATION MODULE  **  //
const variationRoutes = require('./variation/variation.routes');

app.use('/variation', variationRoutes);

//  **  STRIPE MODULE  **  //
const stripeRoutes = require('./stripe/stripe.routes');

app.use('/stripe', stripeRoutes);

//  **  ERROR HANDLER  **  //
const errorHandler = require('./middleware/errorHandler');

app.use(errorHandler);

//  **  INIT SERVER  **  //

app.listen(process.env.PORT, () => {
  console.log('App running');
});
