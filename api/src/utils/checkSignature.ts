import { ethers } from "ethers";

export default function checkSignature(signature: string): string {
  const fullMessage =
    config.signature_prefix +
    String(config.signed_message.length) +
    config.signed_message;
  const messageBytes = ethers.utils.toUtf8Bytes(fullMessage);
  try {
    return ethers.utils.recoverAddress(
      ethers.utils.keccak256(messageBytes),
      signature
    );
  } catch (err) {
    throw Error("Error trying to get address from signature:");
  }
}
