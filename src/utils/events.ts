import { R } from '@mobily/ts-belt'
import localforage from 'localforage'
import { getEventHash, signEvent } from 'nostr-tools'
import relayStore from '~/stores/relayStore'
import { NostrEvent, User, UserMeta } from '~/types'

export const initUserMeta = (): UserMeta => {
  return {
    username: '',
    display_name: '',
    picture: '',
    about: '',
  }
}

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

export const getUserMeta = async (pub: string) => {
  const userMetaRes = R.fromNullable(
    await localforage.getItem('userMeta'),
    'local userMeta not found'
  )
  if (R.isOk(userMetaRes)) {
    return R.toUndefined(userMetaRes) as UserMeta
  }

  const kind0s = await relayStore.relayPool().list(relayStore.relayList(), [
    {
      authors: [pub],
      kinds: [0],
    },
  ])

  const res = R.fromNullable(kind0s.at(-1), 'event not found')
  if (R.isOk(res)) {
    const userMeta = JSON.parse(
      R.toUndefined(res)?.content as string
    ) as UserMeta
    localforage.setItem('userMeta', userMeta)
    return userMeta
  }
  return initUserMeta()
}
