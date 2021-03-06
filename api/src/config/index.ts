const config = {
  server: {
    port: process.env.API_PORT || "3000"
  },
  secret: process.env.API_SECRET || "somerandomsecret",
  signature_prefix: process.env.SIGNATURE_PREFIX || "\x1dDappnode Signed Message:\n",
  signed_message: process.env.SIGNED_MESSAGE || "test.dnp.dappnode.eth:TOKEN_REQUEST",
  nft_contract: process.env.NFT_CONTRACT || "0xccc014e5735bbd21928384142e6460b452f63a26",
  web3_provider: process.env.WEB3_PROVIDER || "https://mainnet.infura.io/v3/bb15bacfcdbe45819caede241dcf8b0d",
  token_regex:
    process.env.TOKEN_REGEX ||
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*:[A-Za-z0-9]{94}$",
  limit_rate: process.env.API_LIMIT_RATE || 5,
  limit_window: process.env.API_LIMIT_WINDOW || 10
};

module.exports = config;
