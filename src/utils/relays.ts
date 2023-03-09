import { pipe, A } from '@mobily/ts-belt'
import { SimplePool } from 'nostr-tools'

export const connect = (relayList: string[], pool: SimplePool) => {
  pipe(
    relayList,
    A.forEach((xs) => pool.ensureRelay(xs))
  )
}

export default {
  connect,
}
