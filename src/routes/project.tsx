import { Outlet } from 'solid-start'
import NavBar from '~/components/NavBar'

export default function projectView() {
  return (
    <main>
      <NavBar />
      <Outlet />
    </main>
  )
}
