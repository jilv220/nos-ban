// @refresh reload
import { onMount, Suspense } from 'solid-js'
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
  useNavigate,
} from 'solid-start'
import { Toaster } from 'solid-toast'
import './root.css'
import userStore from './stores/userStore'
import { User } from './types'
import login, { notSignedIn } from './utils/login'

export default function Root() {
  const navigate = useNavigate()

  onMount(() => {
    const pub = localStorage.getItem('pub')
    const priv = localStorage.getItem('priv')

    if (notSignedIn(pub, priv)) return
    userStore.setUser({
      pub: pub as string,
      priv: login.isSignedInNip07(pub, priv) ? '' : priv,
      useExt: login.isSignedInNip07(pub, priv),
    } as User)
    navigate('/projects')
  })

  return (
    <Html data-theme="mydark" lang="en">
      <Head>
        <Title>SolidStart - With TailwindCSS</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
      <Toaster position="bottom-right" />
    </Html>
  )
}
