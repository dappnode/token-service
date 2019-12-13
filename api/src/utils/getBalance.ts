import { ethers } from "ethers";

ethers.errors.setLogLevel("error");

import abi from "../abi/nft.json";

const config = require("../config");

export default async function getBalance(address: string, provider: ethers.providers.JsonRpcProvider): Promise<number> {
  let contract: ethers.Contract = new ethers.Contract(config.nft_contract, abi, provider);
  try {
    return contract.balanceOf(address);
  } catch (err) {
    throw Error("Error getting balance of contract:");
  }
}
