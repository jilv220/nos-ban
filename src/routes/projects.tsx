import { createEffect, onMount, on, For, Show, lazy } from 'solid-js'
import { createStore } from 'solid-js/store'
import { useNavigate } from 'solid-start'
import NavBar from '~/components/NavBar'
import userStore from '~/stores/userStore'
import { Project, User } from '~/types'
import { decryptSelfMsgAdapter, getProjectEvents } from '~/utils/events'

export default function projectsView() {
  const navigate = useNavigate()
  const [state, setState] = createStore({
    projects: [] as Project[],
  })

  createEffect(
    on(userStore.user, async () => {
      if (userStore.user().pub) {
        const latest = await getProjectEvents(userStore.user())
        const decrypted = await decryptSelfMsgAdapter(
          userStore.user(),
          latest?.content
        )
        const decryptedArr = JSON.parse(decrypted) as Project[]
        setState('projects', () => [...decryptedArr])
      }
    })
  )

  return (
    <main>
      <NavBar />
      <div class="flex flex-col mx-32">
        <div class="flex-center-y justify-between bg-neutral mt-8 mb-4 p-4">
          <h1 class="font-h2">My Projects</h1>
          <button
            class="btn btn-primary"
            onClick={() => navigate('/project/new')}
          >
            New Project
          </button>
        </div>
        <section>
          <For each={state.projects} fallback={<div class="animate-pulse" />}>
            {(project) => {
              return (
                <>
                  <div class="p-2">
                    <div class="font-h2 text-primary">{project.name}</div>
                    <div>{project.desp}</div>
                  </div>
                  <div class="divider m-0" />
                </>
              )
            }}
          </For>
        </section>
      </div>
    </main>
  )
}
