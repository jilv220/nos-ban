import { FaSolidAngleDown } from 'solid-icons/fa'
import { FiFolder } from 'solid-icons/fi'
import { onMount, Show } from 'solid-js'
import { A, useNavigate } from 'solid-start'
import relayStore from '~/stores/relayStore'
import userStore from '~/stores/userStore'
import { getUserMeta, getUserRelays } from '~/utils/events'
import { autoSignIn, notSignedIn, signOut } from '~/utils/login'

export default function NavBar() {
  const navigate = useNavigate()
  onMount(async () => {
    const pub = localStorage.getItem('pub')
    const priv = localStorage.getItem('priv')
    if (notSignedIn(pub, priv)) {
      navigate('/')
      return
    }
    autoSignIn(pub as string, priv as string)
    userStore.setUserMeta(await getUserMeta(pub as string))
    relayStore.setRelayList(await getUserRelays(pub as string))
  })

  return (
    <div class="navbar bg-neutral">
      <div class="flex-none mx-3">
        <h1 class="text-primary font-h2">Nosban!</h1>
      </div>
      <div class="flex-1">
        <div class="dropdown dropdown-hover">
          <label tabindex="0" class="btn p-0 bg-neutral-focus hover:bg-primary">
            <FiFolder class="mx-2" />
            <span class="mr-2">Projects</span>
          </label>
          <ul
            tabindex="0"
            class="dropdown-content menu p-2 shadow bg-neutral rounded-box w-52"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="flex-none pr-3">
        <div class="divider divider-horizontal h-12 mx-2" />
        <div class="dropdown dropdown-hover dropdown-end">
          <div tabindex="0" class="flex-center-x flex-center-y">
            <div class="avatar mr-2">
              <div class="rounded-full w-12 h-12">
                <img src={userStore.userMeta().picture} />
              </div>
            </div>
            <FaSolidAngleDown />
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu shadow bg-neutral rounded-box w-[20vw] p-2"
          >
            <div class="flex-row flex-center-y mb-2">
              <div class="avatar p-1 mr-1">
                <div class="rounded-full w-16 h-16">
                  <img src={userStore.userMeta().picture} />
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <Show
                  when={userStore.userMeta().display_name !== ''}
                  fallback={<p class="font-semibold"> Nostrich </p>}
                >
                  <p class="font-semibold">
                    {userStore.userMeta().display_name}
                  </p>
                </Show>
                <p class="truncate w-[13vw]">{userStore.user().pub}</p>
                <p>Edit Profile</p>
              </div>
            </div>
            <div class="divider m-0" />
            <li>
              <A
                href="/"
                onClick={() => {
                  signOut()
                }}
                activeClass=""
              >
                Logout
              </A>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
