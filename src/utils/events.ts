import { getEventHash, signEvent, SimplePool } from 'nostr-tools'
import relayStore from '~/stores/relayStore'
import { NostrEvent, User } from '~/types'

export const initKind0Json = (fullName: string, userName: string) => {
  return JSON.stringify({
    display_name: fullName,
    username: userName,
    about: '',
    picture: '',
  })
}

export const initKind0Event = (
  user: User,
  fullName: string,
  userName: string
) => {
  const event: NostrEvent = {
    pubkey: user.pub,
    created_at: Math.round(Date.now() / 1000),
    content: initKind0Json(fullName, userName),
    kind: 0,
    tags: [],
    id: '',
    sig: '',
  }
  event.id = getEventHash(event)
  event.sig = signEvent(event, user.priv)
  return event
}

export const getKind0Event = async (pub: string) => {
  const pool = new SimplePool()
  const sub = pool.sub(relayStore.relayPool(), [
    {
      authors: [pub],
      kinds: [0],
    },
  ])

  let kind0: any
  sub.on('event', (event: any) => {
    kind0 = JSON.parse(event.content)
  })

  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(kind0)
    }, 400)
  })
}
