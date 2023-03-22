/* eslint-disable no-undef */

import { NostrEvent } from '~/types'

// @ts-nocheck
export const hasNip07 = () => !!globalThis.nostr
export const getPubkey = () => globalThis.nostr.getPublicKey()
export const signEvent = async (e: NostrEvent): Promise<NostrEvent> =>
  globalThis.nostr.signEvent(e)
export const encryptMsg = async (pub: string, plaintext: string) =>
  globalThis.nostr.nip04.encrypt(pub, plaintext)

export default {
  hasNip07,
  getPubkey,
  signEvent,
  encryptMsg,
}
