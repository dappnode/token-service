import express from "express";
import rateLimit from "express-rate-limit";

import addToken from "./utils/addToken";
import checkSignature from "./utils/checkSignature";
import getBalance from "./utils/getBalance";
import getToken from "./utils/getToken";

// Load configuration
const config = require("./config");

class ExpectedError extends Error {}

const app = express();

// Trust NGINX proxy
app.enable("trust proxy");

// Apply the rate limit to all requests
const limiter = rateLimit({
  max: parseInt(config.limit_rate, 10),
  message: JSON.stringify({
    message: `Too many requests from this IP, please try again after ${config.limit_window} minutes.`
  }),
  windowMs: parseInt(config.limit_window, 10) * 60 * 1000
});
app.use(limiter);

app.get("/gettoken", async (req, res) => {
  try {
    const sigparam = req.query.signature;
    if (!sigparam) {
      throw new ExpectedError("Please provide a signature.");
    }
    const address = checkSignature(sigparam);
    const balance = await getBalance(address);
    if (balance <= 0) {
      throw new ExpectedError("Address without NFT balance.");
    }
    const token = getToken(address);
    res.status(200).send(token);
  } catch (e) {
    if (!(e instanceof ExpectedError)) {
      console.log(e.stack);
    }
    res.status(400).send(e.message);
  }
});

app.get("/addtoken", (req, res) => {
  try {
    const tokenparam = req.query.token;
    const secretparam = req.query.secret;
    addToken(tokenparam, secretparam);
    res.status(200).send("Token added successfully");
  } catch (e) {
    if (!(e instanceof ExpectedError)) {
      console.log(e.stack);
    }
    res.status(400).send(e.message);
  }
});

// Middleware to return JSON header
// app.use('/',function (req: Request, res, next) {
//     res.header('Content-Type', 'application/json');
//     next();
// });

app.listen(config.server.port, (err: Error) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
  console.log(`Running on port ${config.server.port}...`);
});
