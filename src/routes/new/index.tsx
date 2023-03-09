import { createSignal, onCleanup, onMount } from "solid-js"
import { useNavigate } from "solid-start"
import { generateKeyPair, toNip19 } from "~/utils/key"
import { pipe, R, S } from "@mobily/ts-belt"
import userStore from "~/stores/userStore"

import ClipBoardBtn from "~/components/ClipBoardBtn";

export default function New() {
  const [priv, setPriv] = createSignal('')
  const [pub, setPub] = createSignal('')
  const [nsec, setNsec] = createSignal('')
  const [npub, setNpub] = createSignal('')
  const [nsec_short, setNsecShort] = createSignal('')
  const [npub_short, setNpubShort] = createSignal('')
  const navigate = useNavigate();

  onMount(() => {
    const { priv, pub } = generateKeyPair()
    const { nsec, npub } = toNip19(priv, pub)
    setPriv(priv)
    setPub(pub)
    setNsec(nsec)
    setNpub(npub)
    setNsecShort(shorten(nsec))
    setNpubShort(shorten(npub))
  })

  onCleanup(() => {
    userStore.setUser({
      pub: pub(),
      priv: priv(),
      useExt: false
    })
  })

  const shorten = (str: string) => pipe(
    S.slice(str, 0, 17),
    S.concat('...'),
    S.concat(S.slice(str, str.length - 17, str.length))
  )

  const copyNpub = async () => {
    await R.fromPromise(navigator.clipboard.writeText(npub()))
  }

  const copyNsec = async () => {
    await R.fromPromise(navigator.clipboard.writeText(nsec()))
  }

  return (
    <>
      <progress class="progress bg-neutral" value="25" max="100" />
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
      <button class="btn btn-primary flex-end mt-8" onClick={() => navigate("/new/username")}>
        I have saved my keys, continue
      </button>
    </>
  )
}