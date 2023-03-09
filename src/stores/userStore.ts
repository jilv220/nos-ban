import { createSignal, createRoot } from "solid-js";
import { User } from "~/types";

function userStore() {
  const [user, setUser] = createSignal({
    pub: '',
    priv: '',
    useExt: false
  } as User)

  return { user, setUser }
}

export default createRoot(userStore);