import { onMount } from 'solid-js'
import { useNavigate, Outlet } from 'solid-start'
import { autoSignIn, notSignedIn } from '~/utils/login'
import NavBar from '~/components/NavBar'

export default function projectsView() {
  const navigate = useNavigate()

  onMount(async () => {
    const pub = localStorage.getItem('pub')
    const priv = localStorage.getItem('priv')
    if (notSignedIn(pub, priv)) {
      navigate('/')
      return
    }
    autoSignIn(pub as string, priv as string)
  })

  return (
    <main>
      <NavBar />
      <Outlet />
    </main>
  )
}
