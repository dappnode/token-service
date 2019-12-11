import { ethers } from "ethers";

ethers.errors.setLogLevel("error");
const abi = require("../abi/nft.json");

export default async function getBalance(address: string): Promise<number> {
  const provider = new ethers.providers.JsonRpcProvider(config.web3_provider);
  console.log(
    `Web3 connected (ethers ${ethers.version}): ${config.web3_provider}`
  );

  let contract: ethers.Contract = new ethers.Contract(
    config.nft_contract,
    abi,
    provider
  );
  try {
    return contract.balanceOf(address);
  } catch (err) {
    throw Error("Error getting balance of contract:");
  }
}
