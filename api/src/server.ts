import express from 'express';
import { Request } from 'express-serve-static-core';
import rateLimit from 'express-rate-limit';
import checkSignature from './utils/checkSignature';
import getBalance from './utils/getBalance';

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

app.get('/tokenrequest/:signature',  async function (req, res) {

    const { signature } = req.params;

    const address = checkSignature(signature);
    if (!address) {
        return res.status(400).send("Failed to verify signature.");
    }

    const balance: number | null = await getBalance(address);
    if (! balance) {
        return res.status(400).send(`Error getting balance of: ${address}`);
    }
    if (balance <= 0) {
        return res.status(400).send("Address without NFT balance.");
    }

    //const token: string | null = await getToken(address);

    //res.status(200).send(token);
});

// Middleware to return JSON header
app.use('/',function (req: Request, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});

app.listen(config.server.port, (err: Error) => {
    if (err) {
		console.error(err.message);
		process.exit(1);
	}
    console.log(`Running on port ${config.server.port}...`);
});
