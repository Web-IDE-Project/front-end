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

export interface GetFileResponse {
  success: boolean
  data?: {
    content: string
  }
  error?: string
}

export interface FileResponse {
  success: boolean
  data?: {
    message: string
  }
  error?: string
}
