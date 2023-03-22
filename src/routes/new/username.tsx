import { createSignal } from 'solid-js'
import { useNavigate } from 'solid-start'
import { SimplePool } from 'nostr-tools'
import { initKind0Event } from '~/utils/events'

import relayStore from '~/stores/relayStore'
import userStore from '~/stores/userStore'
import relays from '~/utils/relays'

export default function userNameView() {
  const navigate = useNavigate()
  const [userName, setUsername] = createSignal('')
  const [fullName, setFullname] = createSignal('')

  const initKind0 = () => {
    const event = initKind0Event(userStore.user(), fullName(), userName())
    relayStore.relayPool().publish(relayStore.relayList(), event)
  }

  return (
    <>
      <progress class="progress bg-neutral" value={200 / 3} max="100" />
      <h1 class="font-h1 my-6">Pick a username</h1>
      <h2 class="mb-4 mt-4 font-semibold text-1xl">Username</h2>
      <input
        class="input input-bordered bg-neutral flex-center-y justify-between"
        placeholder="Pick a username"
        value={userName()}
        onChange={(e) => setUsername((e.target as HTMLInputElement).value)}
      />
      <h2 class="mb-4 mt-6 font-semibold text-1xl">Full name</h2>
      <input
        class="input input-bordered bg-neutral flex-center-y justify-between"
        placeholder="Pick your full name"
        value={fullName()}
        onChange={(e) => setFullname((e.target as HTMLInputElement).value)}
      />
      <button
        class="btn btn-primary flex-end mt-8"
        onClick={() => {
          initKind0()
          navigate('/new/ready')
        }}
      >
        Next
      </button>
    </>
  )
}
