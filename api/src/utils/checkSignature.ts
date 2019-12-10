import { ethers } from "ethers";

export default function checkSignature(signature: string) : string | null {
    const fullMessage = config.signature_prefix + String(config.signed_message.length) + config.signed_message.length;
    const messageBytes = ethers.utils.toUtf8Bytes(fullMessage);
    try {
        return ethers.utils.recoverAddress(ethers.utils.keccak256(messageBytes), signature);
    } catch (err) {
        console.log("Error trying to get address from signature:", signature)
        return null
    }

}
