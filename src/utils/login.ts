import { pipe, R, B } from '@mobily/ts-belt'
import toast from 'solid-toast'
import errorToast from '~/components/ErrorToast'
import userStore from '~/stores/userStore'
import { User } from '~/types'
import { getPubkey } from './nip07'

export const signInNip07 = async () => {
  const pub = pipe(await R.fromPromise(getPubkey()), R.toUndefined)
  pipe(
    R.fromNullable(pub, 'user rejected'),
    R.tap(() => {
      userStore.setUser({
        pub,
        priv: '',
        useExt: true,
      } as User)
      localStorage.setItem('pub', pub as string)
    }),
    R.tapError((err) => {
      toast.custom(() => errorToast({ errorMsg: err }))
    })
  )
  return pub
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

export const notSignedIn = (pub: string | null, priv: string | null) => {
  return !isSignedInNip07(pub, priv) && !isSignedInSecret(pub, priv)
}

export default {
  signInNip07,
  isSignedInNip07,
  isSignedInSecret,
  notSignedIn,
}
