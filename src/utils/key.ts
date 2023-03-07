import { generatePrivateKey, getPublicKey } from "nostr-tools";

export const generateKeyPair = () => {
    let priv = generatePrivateKey()
    let pub = getPublicKey(priv)
    return {priv, pub}
}