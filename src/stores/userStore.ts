import { createSignal, createRoot } from 'solid-js'
import { User, UserMeta } from '~/types'

function userStore() {
  const [user, setUser] = createSignal({
    pub: '',
    priv: '',
    useExt: false,
  } as User)

  const [userMeta, setUserMeta] = createSignal({
    username: '',
    display_name: '',
    picture: '',
    about: '',
  } as UserMeta)

  return { user, setUser, userMeta, setUserMeta }
}

export default createRoot(userStore)
