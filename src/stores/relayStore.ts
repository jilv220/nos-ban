import { SimplePool } from 'nostr-tools'
import { createSignal, createRoot } from 'solid-js'

const RELAYS = [
  'wss://nostr.island.network',
  'wss://spore.ws',
  'wss://nostr.zkid.social',
  'wss://nostr.mom',
  'wss://relay.current.fyi',
  'wss://lbrygen.xyz',
]

function relayStore() {
  const [relayPool] = createSignal(new SimplePool())
  const [relayList, setRelayList] = createSignal(RELAYS)
  return { relayPool, relayList, setRelayList }
}

export default createRoot(relayStore)
