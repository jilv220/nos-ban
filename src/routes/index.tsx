import { A } from "solid-start";
import { onMount } from "solid-js";
import { getPubkey, hasNip07 } from "~/utils/nip07";

export default function Home() {
  onMount(() => {
    console.log(hasNip07())
  })

  const signInNip07 = async () => {
    const pubkey = await getPubkey()
    console.log(pubkey)
  }

  return (
    <main class="flex-center text-center mx-auto p-4">
      <div class="card bg-neutral/40 shadow-xl p-8 w-4/12">
        <div class="flex flex-col gap-4">
          <label class="font-bold text-3xl"> Login </label>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Your Private Key</span>
            </label>
            <input type="text" placeholder="nsec/hex" class="input input-bordered focus:outline-primary" />
          </div>
          <div class="mt-2 flex">
            <button class="btn btn-primary mr-2">Login</button>
            <button class="btn btn-primary grow" onClick={signInNip07} >
              Log in with Extension
            </button>
          </div>
          <div class="divider text-sm my-2">OR</div>
          <A class="btn btn-primary" href="/new">Generate Key</A>
        </div>
      </div>
    </main>
  );
}
