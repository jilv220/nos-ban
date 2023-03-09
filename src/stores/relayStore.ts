import { createSignal, createRoot } from "solid-js";

const RELAYS = [
  'wss://nostr.island.network',
  'wss://spore.ws',
  'wss://nostr.zkid.social',
  'wss://nostr.mom',
  'wss://relay.current.fyi',
  'wss://lbrygen.xyz',
]

function relayStore() {
  const [relayPool, setRelayPool] = createSignal(RELAYS)
  return { relayPool, setRelayPool }
}

export default createRoot(relayStore);