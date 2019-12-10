import express from 'express';

const rateLimit = require('express-rate-limit');

// Load configuration
const config = require('./config');

const app = express();

// Trust NGINX proxy
app.enable("trust proxy"); 

// Apply the rate limit to all requests
const limiter = rateLimit({
  windowMs: parseInt(config.limit_window) * 60 * 1000,
  max: parseInt(config.limit_rate),
  message: JSON.stringify({ message: `Too many requests from this IP, please try again after ${config.limit_window} minutes.` })
});
app.use(limiter);

app.get('/tokenrequest',  function (req, res) {

    // Check signature 

    // Check if Address is present in 'delivered'

    // If not present take a token from pool and add it to delivered 


    // res.status(200).send(req.ip)
});

// Middleware to return JSON header
app.use('/',function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});

app.listen(config.server.port, (err) => {
    if (err) {
		console.error(err.message);
		process.exit(1);
	}
    console.log(`Running on port ${config.server.port}...`);
});
