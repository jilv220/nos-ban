import { pipe, R, B } from '@mobily/ts-belt'
import localforage from 'localforage'
import { getPublicKey, nip19 } from 'nostr-tools'
import toast from 'solid-toast'
import errorToast from '~/components/ErrorToast'
import relayStore from '~/stores/relayStore'
import userStore from '~/stores/userStore'
import { User } from '~/types'
import { getUserMeta, getUserRelays } from './events'
import { isNsec, notValid } from './key'
import { getPubkey } from './nip07'

const autoSignInNip07 = (pub: string) => {
  userStore.setUser({
    pub,
    priv: '',
    useExt: true,
  } as User)
  localStorage.setItem('pub', pub as string)
}

export const signInNip07 = async () => {
  const pub = pipe(await R.fromPromise(getPubkey()), R.toUndefined)
  pipe(
    R.fromNullable(pub, 'user rejected'),
    R.tap(() => autoSignInNip07(pub as string)),
    R.tapError((err) => {
      toast.custom(() => errorToast({ errorMsg: err }))
    })
  )
  return pub
}

const autoSignInSecret = (pub: string, priv: string) => {
  userStore.setUser({
    pub,
    priv,
    useExt: false,
  } as User)
  localStorage.setItem('pub', pub)
  localStorage.setItem('priv', priv)
}

export const signInSecret = (secret: string) => {
  let priv = secret
  if (notValid(secret)) {
    toast.custom(() => errorToast({ errorMsg: 'Secret not valid' }))
    return
  }

  if (isNsec(secret)) {
    const decodeErr = pipe(
      R.fromExecution(() => nip19.decode(secret)),
      R.tapError(() => {
        toast.custom(() => errorToast({ errorMsg: 'Secret not valid' }))
      }),
      R.isError
    )
    if (decodeErr) {
      return
    }
    priv = nip19.decode(priv).data as unknown as string
  }

  const pub = getPublicKey(priv)
  autoSignInSecret(pub, priv)
}

export const isSignedInNip07 = (pub: string | null, priv: string | null) => {
  return pipe(
    pipe(R.fromNullable(pub, 'no pub key found'), R.isOk),
    B.and(pipe(R.fromNullable(priv, 'no priv key found'), R.isError))
  )
}

export const isSignedInSecret = (pub: string | null, priv: string | null) => {
  return pipe(
    pipe(R.fromNullable(pub, 'no pub key found'), R.isOk),
    B.and(pipe(R.fromNullable(priv, 'no priv key found'), R.isOk))
  )
}

export const autoSignIn = (pub: string, priv: string) => {
  if (isSignedInNip07(pub, priv)) {
    autoSignInNip07(pub as string)
  } else if (isSignedInSecret(pub, priv)) {
    autoSignInSecret(pub as string, priv as string)
  }
}

export const initAppState = async () => {
  relayStore.setRelayList(await getUserRelays(userStore.user().pub))
  userStore.setUserMeta(await getUserMeta(userStore.user().pub))
}

export const signOut = () => {
  localStorage.clear()
  localforage.clear()
}

export const notSignedIn = (pub: string | null, priv: string | null) => {
  return !isSignedInNip07(pub, priv) && !isSignedInSecret(pub, priv)
}

export default {
  signInNip07,
  signInSecret,
  autoSignIn,
  initAppState,
  signOut,
  isSignedInNip07,
  isSignedInSecret,
  notSignedIn,
}
