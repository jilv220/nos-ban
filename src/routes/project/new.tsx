import { BsKanban } from 'solid-icons/bs'
import { createSignal } from 'solid-js'

export default function projectView() {
  const [name, setName] = createSignal('')
  const [desp, setDesp] = createSignal('')

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
          <input
            type="text"
            placeholder="Project Name (Required)"
            class="input input-bordered bg-neutral/40 mb-4 text-sm"
            value={name()}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
          />
          <textarea
            class="textarea textarea-bordered bg-neutral/40 min-h-[10rem] text-sm mb-[3rem]"
            placeholder="Project Description (Required)"
            value={desp()}
            onChange={(e) => setDesp((e.target as HTMLInputElement).value)}
          />
          <div class="flex flex-row">
            <button
              class="btn w-1/5 mr-4"
              onClick={() => window.history.back()}
            >
              Back
            </button>
            <button class="btn btn-primary flex-grow">Create Project</button>
          </div>
        </div>
      </div>
    </>
  )
}
