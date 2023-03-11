import { onMount } from 'solid-js'
import { useNavigate } from 'solid-start'
import { notSignedIn } from '~/utils/login'

export default function projectsView() {
  const navigate = useNavigate()
  onMount(() => {
    const pub = localStorage.getItem('pub')
    const priv = localStorage.getItem('priv')
    if (notSignedIn(pub, priv)) {
      navigate('/')
    }
  })
  return <></>
}
