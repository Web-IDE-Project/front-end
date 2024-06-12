export interface FileSystemEntry {
  id: number
  name: string
  isDirectory: boolean
  parentId: number | null
}

export interface StartContainerResponse {
  success: boolean
  data?: FileSystemEntry[]
  error?: string
}

export interface TreeItem {
  name: string
  children: number[]
  id: number
  parent: number | null
}

export interface FileApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
