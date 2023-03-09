/* eslint-disable no-undef */
// @ts-nocheck
export const hasNip07 = () => globalThis.nostr ? true : false
export const getPubkey = () => globalThis.nostr.getPublicKey()