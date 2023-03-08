import { generatePrivateKey, getPublicKey, nip19 } from "nostr-tools";

export const generateKeyPair = () => {
    let priv = generatePrivateKey()
    let pub = getPublicKey(priv)
    return {priv, pub}
}

export const toNip19 = (priv: string, pub: string) => {
    let nsec = nip19.nsecEncode(priv)
    let npub = nip19.npubEncode(pub)
    return {nsec, npub}
}