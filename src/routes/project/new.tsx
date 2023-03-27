import { pipe, B } from '@mobily/ts-belt'
import { BsKanban } from 'solid-icons/bs'
import { createEffect, createSignal, on } from 'solid-js'
import { useNavigate } from 'solid-start'
import { PROJECTS } from '~/constants/RouteNames'
import relayStore from '~/stores/relayStore'
import userStore from '~/stores/userStore'
import { createProjectEvent, initGroupEvent } from '~/utils/events'

export default function projectView() {
  const [name, setName] = createSignal('')
  const [desp, setDesp] = createSignal('')
  let nameLabel: HTMLSpanElement | ((el: HTMLSpanElement) => void) | undefined
  let despLabel: HTMLSpanElement | ((el: HTMLSpanElement) => void) | undefined
  const navigate = useNavigate()

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
              <span class="label-text text-error" ref={nameLabel} />
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
              <span class="label-text text-error" ref={despLabel} />
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
                        userStore.user(),
                        { name: name(), desp: desp() }
                      )
                      const groupInitEvent = await initGroupEvent(
                        userStore.user(),
                        projectEvent.id
                      )
                      navigate(PROJECTS)
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
