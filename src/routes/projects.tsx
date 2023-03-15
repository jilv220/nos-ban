import { useNavigate } from 'solid-start'
import NavBar from '~/components/NavBar'

export default function projectsView() {
  const navigate = useNavigate()

  return (
    <main>
      <NavBar />
      <div class="flex flex-col mx-32">
        <div class="flex-center-y justify-between bg-neutral mt-8 mb-4 p-4">
          <h1 class="font-h2">My Projects</h1>
          <button
            class="btn btn-primary"
            onClick={() => navigate('/project/new')}
          >
            New Project
          </button>
        </div>
        <section>Placeholder</section>
      </div>
    </main>
  )
}
