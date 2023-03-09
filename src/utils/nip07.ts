/* eslint-disable no-undef */
// @ts-nocheck
export const hasNip07 = () => !!globalThis.nostr
export const getPubkey = () => globalThis.nostr.getPublicKey()
