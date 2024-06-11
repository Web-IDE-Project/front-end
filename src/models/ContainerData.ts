export interface PrivateContainer {
  id: number
  title: string
  language: string
  description: string
}

export interface PublicContainer {
  id: number
  title: string
  language: string
  description: string
  nickname: string
  profileUrl: string
}

export interface CreateContainerResponse {
  success: boolean
  data?: Omit<PrivateContainer, 'id'>
  error?: string
}

export interface GetPrivateContainerResponse {
  success: boolean
  data?: PrivateContainer[]
  error?: string
}

export interface GetPublicContainerResponse {
  success: boolean
  data?: PublicContainer[]
  error?: string
}

export type GetContainerResponse = {
  success: boolean
  data?: PrivateContainer[] | PublicContainer[]
  error?: string
}
