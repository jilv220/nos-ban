import { FaSolidAngleDown } from 'solid-icons/fa'
import { FiFolder } from 'solid-icons/fi'
import { createEffect, createSignal, on, onMount, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { A } from 'solid-start'
import userStore from '~/stores/userStore'
import { initAppState, signOut } from '~/utils/login'

export default function NavBar() {
  const [state, setState] = createStore({
    picture: '',
    display_name: '',
    pub: '',
  })

  createEffect(
    on(userStore.user, async () => {
      if (userStore.user().pub) {
        setState('pub', userStore.user().pub)
      }
    })
  )

  createEffect(
    on(userStore.userMeta, async () => {
      if (userStore.userMeta().picture) {
        setState('picture', userStore.userMeta().picture)
      }
      if (userStore.userMeta().display_name) {
        setState('display_name', userStore.userMeta().display_name)
      }
    })
  )

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
                <img src={state.picture} />
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
                  <img src={state.picture} />
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <Show
                  when={state.display_name !== ''}
                  fallback={<p class="font-semibold"> Nostrich </p>}
                >
                  <p class="font-semibold">{state.display_name}</p>
                </Show>
                <p class="truncate w-[13vw]">{state.pub}</p>
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
