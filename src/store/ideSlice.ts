import { RootState } from './index'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Tree, TreeNode } from '@/models/entry'

interface StateType {
  showExplorer: boolean
  showTerminal: boolean
  showPermissionSettings: boolean
  selectedNode: TreeNode
  tree: Tree | null
  showChatting: boolean
  fileExecuteResult: string
}

const initialState: StateType = {
  showExplorer: true,
  showTerminal: true,
  showPermissionSettings: false,
  selectedNode: {
    id: 2,
    name: 'file',
    children: [],
    parent: null,
    isBranch: true,
    metadata: {
      isDirectory: true,
      content: 'content',
    },
  },
  tree: null,
  showChatting: false,
  fileExecuteResult: '',
}

export const ideSlice = createSlice({
  name: 'IDE',
  initialState,
  reducers: {
    toggleExplorer: state => {
      state.showExplorer = !state.showExplorer
      if (state.showExplorer && state.showPermissionSettings) {
        state.showPermissionSettings = false
      }
    },
    toggleTerminal: state => {
      state.showTerminal = !state.showTerminal
    },
    togglePermissionSettings: state => {
      state.showPermissionSettings = !state.showPermissionSettings
      if (state.showPermissionSettings && state.showExplorer) {
        state.showExplorer = false
      }
    },
    toggleChatting: state => {
      state.showChatting = !state.showChatting
    },
    setSelectedNode: (state, action: PayloadAction<TreeNode>) => {
      state.selectedNode = action.payload
    },
    setTree: (state, action: PayloadAction<Tree>) => {
      state.tree = action.payload
    },
    setFileExecuteResult: (state, action: PayloadAction<string>) => {
      state.fileExecuteResult = action.payload
    },
  },
})

export const {
  toggleExplorer,
  toggleTerminal,
  togglePermissionSettings,
  toggleChatting,
  setSelectedNode,
  setTree,
  setFileExecuteResult,
} = ideSlice.actions
export default ideSlice.reducer

export const selectShowExplorer = (state: RootState) => state.ide.showExplorer
export const selectShowTerminal = (state: RootState) => state.ide.showTerminal
export const selectSelectedNode = (state: RootState) => state.ide.selectedNode
export const selectShowChatting = (state: RootState) => state.ide.showChatting
export const selectShowPermissionSettings = (state: RootState) =>
  state.ide.showPermissionSettings
export const selectTree = (state: RootState) => state.ide.tree
export const selectFileExecuteResult = (state: RootState) =>
  state.ide.fileExecuteResult
