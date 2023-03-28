import { createSignal, createRoot } from 'solid-js'
import { User, UserMeta } from '~/types'

function userStore() {
  const [user, setUser] = createSignal({
    pub: '',
    priv: '',
    useExt: false,
  } as User)

  const userMetaInitial: UserMeta = {
    username: '',
    display_name: '',
    picture: '',
    about: '',
  }

  const [userMeta, setUserMeta] = createSignal(userMetaInitial)

  return { user, setUser, userMeta, setUserMeta, userMetaInitial }
}

export default createRoot(userStore)
