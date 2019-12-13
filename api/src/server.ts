import { ethers } from "ethers";
import express from "express";
import rateLimit from "express-rate-limit";

import addToken from "./utils/addToken";
import checkSignature from "./utils/checkSignature";
import getBalance from "./utils/getBalance";
import getToken from "./utils/getToken";
import logs from "./logs";

// Load configuration
const config = require("./config");

class ExpectedError extends Error {}

const app = express();

// Trust NGINX proxy
app.enable("trust proxy");

// Connect to Web3 provider
const provider = new ethers.providers.JsonRpcProvider(config.web3_provider);
logs.info(`Web3 connected (ethers ${ethers.version}): ${config.web3_provider}`);

// Apply the rate limit to /gettoken
const limiter = rateLimit({
  max: parseInt(config.limit_rate, 10),
  message: JSON.stringify({
    message: `Too many requests from this IP, please try again after ${config.limit_window} minutes.`
  }),
  windowMs: parseInt(config.limit_window, 10) * 60 * 1000
});
app.use("/gettoken/", limiter);

app.get("/gettoken", async (req, res) => {
  try {
    const sigparam = req.query.signature;
    if (!sigparam) {
      throw new ExpectedError("Please provide a signature.");
    }
    const address = checkSignature(sigparam);
    const balance = await getBalance(address, provider);
    if (balance <= 0) {
      throw new ExpectedError("Address without NFT balance.");
    }
    const token = getToken(address);
    if (token === "") {
      throw new ExpectedError("The token pool is empty.");
    }
    logs.info(`Token ${token} delivered to ${address}.`);
    res.status(200).send(token);
  } catch (e) {
    if (!(e instanceof ExpectedError)) {
      logs.error(e.stack);
    }
    res.status(400).send(e.message);
  }
});

app.get("/addtoken", (req, res) => {
  try {
    const tokenparam = req.query.token;
    const secretparam = req.query.secret;
    addToken(tokenparam, secretparam);
    logs.info(`Token added to pool:  ${tokenparam}`);
    res.status(200).send("Token added successfully");
  } catch (e) {
    if (!e.message.includes("Token already exists in pool.") || e.message.includes("Invalid secret provided.")) {
      logs.error(e.stack);
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
    logs.error(err.message);
    process.exit(1);
  }
  logs.info(`Running on port ${config.server.port}...`);
});
