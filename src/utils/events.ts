import { R, D, A } from '@mobily/ts-belt'
import localforage from 'localforage'
import { getEventHash, signEvent } from 'nostr-tools'
import { EV_NOT_FOUND } from '~/constants/Errors'
import relayStore, { DEFAULT_RELAYS } from '~/stores/relayStore'
import { NostrEvent, User, UserMeta } from '~/types'

export const simpleFilter = (pub: string, kind: number) => {
  return {
    authors: [pub],
    kinds: [kind],
  }
}

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

  const kind0s = await relayStore
    .relayPool()
    .list(relayStore.relayList(), [simpleFilter(pub, 0)])

  const kind0sAsc = A.sort(kind0s, (a, b) =>
    a.created_at < b.created_at ? -1 : 1
  )

  const res = R.fromNullable(kind0sAsc.at(-1), EV_NOT_FOUND)
  if (R.isOk(res)) {
    const userMeta = JSON.parse(
      R.toUndefined(res)?.content as string
    ) as UserMeta
    localforage.setItem('userMeta', userMeta)
    return userMeta
  }
  localforage.setItem('userMeta', initUserMeta())
  return initUserMeta()
}

export const getUserRelays = async (pub: string): Promise<string[]> => {
  const userRelaysRes = R.fromNullable(
    await localforage.getItem('userRelays'),
    'local userRelays not found'
  )
  if (R.isOk(userRelaysRes)) {
    return R.toUndefined(userRelaysRes) as string[]
  }
  const kind3s = await relayStore
    .relayPool()
    .list(relayStore.relayList(), [simpleFilter(pub, 3)])

  const res = R.fromNullable(kind3s.at(-1), EV_NOT_FOUND)
  if (R.isOk(res)) {
    const userRelays = D.keys(JSON.parse(R.toUndefined(res)?.content as string))
    localforage.setItem('userRelays', userRelays)
    return userRelays as string[]
  }
  localforage.setItem('userRelays', DEFAULT_RELAYS)
  return DEFAULT_RELAYS
}
