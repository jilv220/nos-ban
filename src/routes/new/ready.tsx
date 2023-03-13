import { useNavigate } from 'solid-start'
import { PROJECTS } from '~/constants/RouteNames'
import userStore from '~/stores/userStore'
import login from '~/utils/login'

export default function readyView() {
  const navigate = useNavigate()
  const signInSecret = () => {
    login.signInSecret(userStore.user().priv)
    navigate(PROJECTS)
  }

  return (
    <>
      <progress class="progress bg-neutral" value="100" max="100" />
      <h1 class="font-h1 my-8"> You're ready!</h1>
      <h3 class="font-h3 mb-6"> Time to create your first project</h3>
      <div class="flex justify-end">
        <button class="btn-primary-sm" onClick={() => signInSecret()}>
          {' '}
          Done{' '}
        </button>
      </div>
    </>
  )
}
