import { pipe, B, F } from '@mobily/ts-belt'
import { BsKanban } from 'solid-icons/bs'
import { createEffect, createSignal, on, onMount } from 'solid-js'
import relayStore from '~/stores/relayStore'
import userStore from '~/stores/userStore'
import { createProjectEvent, initGroupEvent } from '~/utils/events'

export default function projectView() {
  const [name, setName] = createSignal('')
  const [desp, setDesp] = createSignal('')
  let nameLabel: Element | null
  let despLabel: Element | null

  onMount(() => {
    nameLabel = document.querySelector('#project-name > label > span')
    despLabel = document.querySelector('#project-desp > label > span')
  })

  const isProjectValid = (): boolean => name() !== '' && desp() !== ''

  createEffect(
    on(
      name,
      (v) => {
        if (v === '') {
          ;(nameLabel as Element).innerHTML = 'Project name cannot be empty'
        } else {
          ;(nameLabel as Element).innerHTML = ''
        }
      },
      { defer: true }
    )
  )

  createEffect(
    on(
      desp,
      (v) => {
        if (v === '') {
          ;(despLabel as Element).innerHTML =
            'Project description cannot be empty'
        } else {
          ;(despLabel as Element).innerHTML = ''
        }
      },
      { defer: true }
    )
  )

  return (
    <>
      <div class="flex-col flex-center-x flex-center-y mt-8 mx-auto w-[800px]">
        <div class="flex-row flex-center-y">
          <BsKanban size={28} class="mr-4" />
          <h1 class="font-h1">Kanban</h1>
        </div>
        <h3 class="font-h3 mb-8">
          Keep a constant workflow on independent tasks
        </h3>
        <div class="form-control self-start w-full mx-5">
          <label class="label mb-1">
            <span class="label-text font-h3">New project details</span>
          </label>
          <div class="form-control" id="project-name">
            <label class="label">
              <span class="label-text text-error" />
            </label>
            <input
              type="text"
              placeholder="Project Name (Required)"
              class="input input-bordered bg-neutral/40 mb-4 text-sm"
              value={name()}
              onChange={(e) => setName((e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="form-control" id="project-desp">
            <label class="label">
              <span class="label-text text-error" />
            </label>
            <textarea
              class="textarea textarea-bordered bg-neutral/40 min-h-[10rem] text-sm mb-[3rem]"
              placeholder="Project Description (Required)"
              value={desp()}
              onChange={(e) => setDesp((e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="flex flex-row">
            <button
              class="btn w-1/5 mr-4"
              onClick={() => window.history.back()}
            >
              Back
            </button>
            <button
              class="btn btn-primary flex-grow"
              onClick={() => {
                pipe(
                  isProjectValid(),
                  B.ifElse(
                    async () => {
                      const projectEvent = await createProjectEvent(
                        userStore.user()
                      )
                      const groupInitEvent = await initGroupEvent(
                        userStore.user(),
                        projectEvent.id
                      )
                      relayStore
                        .relayPool()
                        .publish(relayStore.relayList(), projectEvent)
                      relayStore
                        .relayPool()
                        .publish(relayStore.relayList(), groupInitEvent)
                      // TODO: share and update group secret
                    },
                    async () => {
                      createEffect(() => {
                        if (name() === '') {
                          ;(nameLabel as Element).innerHTML =
                            'Project name cannot be empty'
                        }
                        if (desp() === '') {
                          ;(despLabel as Element).innerHTML =
                            'Project description cannot be empty'
                        }
                      })
                    }
                  )
                )
              }}
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
