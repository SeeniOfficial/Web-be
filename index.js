const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo'); // For storing sessions in MongoDB

require('dotenv').config();
require('./passportConfig')

// Initialize Express app
const app = express();

// Setup express-session middleware
app.use(session({
    secret: process.env.SESSION_KEY, // Use a secure key
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // Store session in MongoDB
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Your routes and other middleware go here...
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Start the server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
