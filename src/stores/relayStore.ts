import { SimplePool } from 'nostr-tools'
import { createSignal, createRoot } from 'solid-js'

export const DEFAULT_RELAYS = [
  'wss://nostr.island.network',
  'wss://spore.ws',
  'wss://nostr.zkid.social',
  'wss://nostr.mom',
  'wss://relay.current.fyi',
  'wss://lbrygen.xyz',
]

function relayStore() {
  const [relayPool] = createSignal(
    new SimplePool({ getTimeout: 250, eoseSubTimeout: 1000 })
  )
  const [relayList, setRelayList] = createSignal(DEFAULT_RELAYS)
  return { relayPool, relayList, setRelayList }
}

export default createRoot(relayStore)
