import { INode, flattenTree } from 'react-accessible-treeview'

export interface Entry {
  id: number
  name: string
  isDirectory: boolean
  content?: string | null
  children?: Entry[]
}
flattenTree

// export type TreeNode = ReturnType<
//   typeof flattenTree<{ isDirectory: boolean; content: string }>
// >
export type TreeNode = INode<{ isDirectory: boolean; content: string }>

export type Tree = TreeNode[]
