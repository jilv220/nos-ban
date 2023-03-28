import { A, useNavigate } from 'solid-start'
import userStore from '~/stores/userStore'
import { User } from '~/types'
import { createSignal, onMount } from 'solid-js'
import login, { initAppState, notSignedIn } from '~/utils/login'
import { Toaster } from 'solid-toast'
import { PROJECTS } from '~/constants/RouteNames'

export default function Home() {
  const [secret, setSecret] = createSignal('')
  const navigate = useNavigate()

  onMount(() => {
    const pub = localStorage.getItem('pub')
    const priv = localStorage.getItem('priv')

    if (notSignedIn(pub, priv)) return
    userStore.setUser({
      pub: pub as string,
      priv: login.isSignedInNip07(pub, priv) ? '' : priv,
      useExt: login.isSignedInNip07(pub, priv),
    } as User)
    navigate(PROJECTS)
  })

  const signInNip07 = async () => {
    const res = await login.signInNip07()
    if (res) {
      initAppState()
      navigate(PROJECTS)
    }
  }

  const signInSecret = async () => {
    login.signInSecret(secret())
    initAppState()
    navigate(PROJECTS)
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
      <Toaster position="bottom-right" />
    </>
  )
}
