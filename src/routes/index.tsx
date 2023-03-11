import { A, useNavigate } from 'solid-start'
import userStore from '~/stores/userStore'
import { User } from '~/types'
import { createSignal } from 'solid-js'
import login from '~/utils/login'
import { isNsec, notValid } from '~/utils/key'
import { pipe, R } from '@mobily/ts-belt'
import { nip19, getPublicKey } from 'nostr-tools'
import toast from 'solid-toast'
import errorToast from '~/components/ErrorToast'

export default function Home() {
  const [secret, setSecret] = createSignal('')
  const navigate = useNavigate()

  const signInNip07 = async () => {
    const res = await login.signInNip07()
    if (res) {
      navigate('/projects')
    }
  }

  const signInSecret = () => {
    let priv = secret()

    if (notValid(secret())) {
      toast.custom(() => errorToast({ errorMsg: 'Secret not valid' }))
      return
    }

    if (isNsec(secret())) {
      const decodeErr = pipe(
        R.fromExecution(() => nip19.decode(priv)),
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
    userStore.setUser({
      pub,
      priv,
      useExt: false,
    } as User)
    localStorage.setItem('pub', pub)
    localStorage.setItem('priv', priv)
    navigate('/projects')
  }

  return (
    <>
      <div class="p-8">
        <h1 class="text-primary font-h1">Nosban!</h1>
      </div>
      <main class="flex-center text-center mx-auto p-4">
        <div class="card bg-neutral/40 shadow-xl p-8 lg:w-4/12">
          <div class="flex flex-col gap-4">
            <label class="font-bold text-3xl"> Login </label>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Your Secret</span>
              </label>
              <input
                type="text"
                placeholder="nsec/hex"
                class="input input-bordered"
                value={secret()}
                onChange={(e) =>
                  setSecret((e.target as HTMLInputElement).value)
                }
              />
            </div>
            <div class="mt-2 flex">
              <button
                class="btn btn-primary mr-2"
                onClick={() => {
                  signInSecret()
                }}
              >
                Login
              </button>
              <button class="btn btn-primary grow" onClick={signInNip07}>
                Log in with Extension
              </button>
            </div>
            <div class="divider text-sm my-2">OR</div>
            <A class="btn btn-primary" href="/new">
              Generate Key
            </A>
          </div>
        </div>
      </main>
    </>
  )
}
