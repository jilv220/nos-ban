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
import './root.css'
import relayStore from './stores/relayStore'
import userStore from './stores/userStore'
import { getUserMeta, getUserRelays } from './utils/events'
import { autoSignIn, initAppState, notSignedIn } from './utils/login'

/* The root only also render once */
export default function Root() {
  const navigate = useNavigate()
  onMount(async () => {
    const pub = localStorage.getItem('pub')
    const priv = localStorage.getItem('priv')
    if (notSignedIn(pub, priv)) {
      navigate('/')
      return
    }
    autoSignIn(pub as string, priv as string)
    initAppState()
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
    </Html>
  )
}
