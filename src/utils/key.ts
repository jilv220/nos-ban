import { generatePrivateKey, getPublicKey, nip19 } from 'nostr-tools'
import { S } from '@mobily/ts-belt'

export const generateKeyPair = () => {
  const priv = generatePrivateKey()
  const pub = getPublicKey(priv)
  return { priv, pub }
}

export const toNip19 = (priv: string, pub: string) => {
  const nsec = nip19.nsecEncode(priv)
  const npub = nip19.npubEncode(pub)
  return { nsec, npub }
}

export const fromNip19 = (nsec: string, npub: string) => {
  const priv = nip19.decode(nsec)
  const pub = nip19.decode(npub)
  return { priv, pub }
}

export const isNsec = (secret: string) => {
  return S.startsWith(secret, 'nsec')
}

export const isHex = (secret: string) => {
  const hexRegex = /^[0-9a-fA-F]+$/
  return hexRegex.test(secret)
}

export const notValid = (secret: string) => {
  return !isNsec(secret) && !isHex(secret)
}
