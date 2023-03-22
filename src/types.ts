export interface User {
  pub: string
  priv: string
  useExt: boolean
}

export interface UserMeta {
  username: string
  display_name: string
  picture: string
  about: string
}

export interface NostrEvent {
  pubkey: string
  created_at: number
  content: string
  kind: number
  tags: string[][]
  id: string
  sig: string
}

export type NostrFilter = {
  ids?: string[]
  kinds?: number[]
  authors?: string[]
  since?: number
  until?: number
  limit?: number
  search?: string
  [key: `#${string}`]: string[]
}
