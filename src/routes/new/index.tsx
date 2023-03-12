import { createSignal, onCleanup, onMount } from 'solid-js'
import { useNavigate } from 'solid-start'
import { pipe, R, S, D } from '@mobily/ts-belt'
import { generateKeyPair, toNip19 } from '~/utils/key'
import userStore from '~/stores/userStore'

import ClipBoardBtn from '~/components/ClipBoardBtn'

export default function New() {
  const [keyPair, setKeyPair] = createSignal({ priv: '', pub: '' })
  const [nip19Pair, setNip19Pair] = createSignal({ nsec: '', npub: '' })
  const [nip19Short, setNip19Short] = createSignal({ nsec: '', npub: '' })

  const navigate = useNavigate()

  const shorten = (str: string) =>
    pipe(
      S.slice(str, 0, 17),
      S.concat('...'),
      S.concat(S.slice(str, str.length - 17, str.length))
    )

  onMount(() => {
    setKeyPair(generateKeyPair())
    setNip19Pair(toNip19(keyPair().priv, keyPair().pub))
    setNip19Short(
      pipe(
        nip19Pair(),
        D.map((key) => shorten(key))
      )
    )
  })

  onCleanup(() => {
    userStore.setUser({
      pub: keyPair().pub,
      priv: keyPair().priv,
      useExt: false,
    })
  })

  const copyNsec = async () => {
    await R.fromPromise(navigator.clipboard.writeText(nip19Pair().nsec))
  }

  const copyNpub = async () => {
    await R.fromPromise(navigator.clipboard.writeText(nip19Pair().npub))
  }

  return (
    <>
      <progress class="progress bg-neutral" value={100 / 3} max="100" />
      <h1 class="font-h1 my-6">Save your keys!</h1>
      <p>
        Your private key is your password. If you lose this key, you will lose
        access to your account! Copy it and keep it in a safe place. There is no
        way to reset your private key.
      </p>
      <h2 class="mb-4 mt-6 font-semibold text-1xl">Your public key</h2>
      <div class="input input-bordered bg-neutral flex-center-y justify-between">
        <span class="flex-center">{nip19Short().npub}</span>
        <ClipBoardBtn handler={copyNpub} />
      </div>
      <h2 class="mb-4 mt-6 font-semibold text-1xl">Your private key</h2>
      <div class="input input-bordered bg-neutral flex-center-y justify-between">
        <span>{nip19Short().nsec}</span>
        <ClipBoardBtn handler={copyNsec} />
      </div>
      <button
        class="btn btn-primary flex-end mt-8"
        onClick={() => navigate('/new/username')}
      >
        I have saved my keys, continue
      </button>
    </>
  )
}
