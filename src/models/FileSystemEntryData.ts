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

export interface TreeItem2 {
  index: string
  isFolder: boolean
  children?: string[]
  data: string
}

export interface Tree2 {
  [key: string]: TreeItem
}

export interface TreeItem {
  name: string
  children: number[]
  id: number
  parent: number | null
}
