import { R, D, A, G, B, pipe } from '@mobily/ts-belt'
import localforage from 'localforage'
import { getEventHash, nip04, signEvent } from 'nostr-tools'
import { EV_NOT_FOUND } from '~/constants/Errors'
import relayStore, { DEFAULT_RELAYS } from '~/stores/relayStore'
import { NostrEvent, NostrFilter, User, UserMeta } from '~/types'
import nip07 from './nip07'

function createFilter(pub: string, kind: number): NostrFilter
function createFilter(pubs: string[], kinds: number[]): NostrFilter
function createFilter(arg1: unknown, arg2: unknown): NostrFilter {
  const isArg1StringArr = pipe(
    arg1,
    G.isArray,
    B.and(A.all(arg1 as unknown[], (xs) => G.isString(xs)))
  )

  const isArg2NumberArr = pipe(
    arg2,
    G.isArray,
    B.and(A.all(arg1 as unknown[], (xs) => G.isNumber(xs)))
  )

  if (isArg1StringArr && isArg2NumberArr) {
    return {
      authors: [...(arg1 as string[])],
      kinds: [...(arg2 as number[])],
    }
  }

  return {
    authors: [arg1 as string],
    kinds: [arg2 as number],
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

export const signEventAdapter = async (user: User, event: NostrEvent) => {
  let temp: NostrEvent
  if (user.useExt) {
    temp = await nip07.signEvent(event)
    return temp
  }
  temp = event
  temp.sig = signEvent(event, user.priv)
  return temp
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
    .list(relayStore.relayList(), [createFilter(pub, 0)])

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
    .list(relayStore.relayList(), [createFilter(pub, 3)])

  const res = R.fromNullable(kind3s.at(-1), EV_NOT_FOUND)
  if (R.isOk(res)) {
    const userRelays = D.keys(JSON.parse(R.toUndefined(res)?.content as string))
    localforage.setItem('userRelays', userRelays)
    return userRelays as string[]
  }
  localforage.setItem('userRelays', DEFAULT_RELAYS)
  return DEFAULT_RELAYS
}

export const createProjectEvent = async (user: User) => {
  let event: NostrEvent = {
    pubkey: user.pub,
    created_at: Math.round(Date.now() / 1000),
    content: '',
    kind: 30078,
    tags: [['d', 'nosban-project-create']],
    id: '',
    sig: '',
  }
  event.id = getEventHash(event)
  event = await signEventAdapter(user, event)
  return event
}

export const initGroupEvent = async (user: User, eventId: string) => {
  let secret: string

  if (user.useExt) {
    secret = await nip07.encryptMsg(user.pub, JSON.stringify(['p', user.pub]))
  } else {
    secret = JSON.stringify(['p', user.pub])
  }

  let event: NostrEvent = {
    pubkey: user.pub,
    created_at: Math.round(Date.now() / 1000),
    content: secret,
    kind: 30000,
    tags: [
      ['d', 'nosban-project-groupmember'],
      ['e', eventId],
    ],
    id: '',
    sig: '',
  }
  event.id = getEventHash(event)
  event = await signEventAdapter(user, event)
  return event
}
