import { getEventHash, signEvent } from 'nostr-tools'
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
