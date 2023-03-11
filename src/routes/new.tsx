import { Outlet, Style } from 'solid-start'

export default function NewLayout() {
  return (
    <main class="flex flex-col lg:mx-60">
      <Style>{`
        .progress::-webkit-progress-value {
          background: linear-gradient(90deg,#de0050,#ff6baf 108.33%)
        }
      `}</Style>
      <h1 class="font-h1 text-primary my-6 from-current">Nosban!</h1>
      <Outlet />
    </main>
  )
}
