import { createSignal, onMount } from "solid-js"
import { Style } from "solid-start"
import { generateKeyPair, toNip19 } from "~/utils/key"
import { pipe, R, S } from "@mobily/ts-belt"

import ClipBoardBtn from "~/components/ClipBoardBtn";

export default function New() {
  const [nsec, setNsec] = createSignal('')
  const [npub, setNpub] = createSignal('')
  const [nsec_short, setNsecShort] = createSignal('')
  const [npub_short, setNpubShort] = createSignal('')

  onMount(() => {
    const { priv, pub } = generateKeyPair()
    const { nsec, npub } = toNip19(priv, pub)
    setNsecShort(shorten(nsec))
    setNpubShort(shorten(npub))
    setNsec(nsec)
    setNpub(npub)
  })

  const shorten = (str: string) => pipe(
    S.slice(str, 0, 17),
    S.concat('...'),
    S.concat(S.slice(str, str.length - 17, str.length))
  )

  const copyNpub = async () => {
    const res = await R.fromPromise(navigator.clipboard.writeText(npub()))
    console.log(R.isOk(res))
  }

  const copyNsec = async () => {
    await R.fromPromise(navigator.clipboard.writeText(nsec()))
  }

  return (
    <main class="mx-60 flex flex-col">
      <Style>{`
        .progress::-webkit-progress-value {
          background: linear-gradient(90deg,#de0050,#ff6baf 108.33%)
        }
      `}</Style>
      <h1 class="font-h1 text-primary my-6 from-current">Nosban!</h1>
      <progress class="progress bg-neutral" value="25" max="100">
      </progress>
      <h1 class="font-h1 my-6">Save your keys!</h1>
      <p class="text-gray-100">
        Your private key is your password. If you lose this key, you will lose access to your account! Copy it and keep it in a safe place. There is no way to reset your private key.
      </p>
      <h2 class="mb-4 mt-6 font-semibold text-1xl">
        Your public key
      </h2>
      <div class="input input-bordered bg-neutral flex-center-y justify-between">
        <span class="flex-center">{npub_short()}</span>
        <ClipBoardBtn handler={copyNpub}/>
      </div>
      <h2 class="mb-4 mt-6 font-semibold text-1xl">
        Your private key
      </h2>
      <div class="input input-bordered bg-neutral flex-center-y justify-between">
        <span>{nsec_short()}</span>
        <ClipBoardBtn handler={copyNsec}/>
      </div>
      <button class="btn btn-primary flex-end mt-8">
        I have saved my keys, continue
      </button>
    </main>
  )
}