import { RootState } from './index'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
// NOTE - 테스트용 파일 리스트 / 컨테이너 실행 시에 파일을 저장하는 것으로 추후 수정
import entries from '@/data/file-system-entry.json'
import { Tree, TreeNode } from '@/models/EntryData'
import { flattenTree } from 'react-accessible-treeview'

interface StateType {
  showExplorer: boolean
  showTerminal: boolean
  showPermissionSettings: boolean
  selectedNode: TreeNode
  tree: Tree
  showChatting: boolean
  fileExecuteResult: string
}

const initialState: StateType = {
  showExplorer: true,
  showTerminal: true,
  showPermissionSettings: false,
  selectedNode: {
    id: 1,
    name: 'file',
    children: [],
    parent: null,
    isBranch: true,
    metadata: {
      isDirectory: true,
      content: 'content',
    },
  },
  tree: flattenTree(entries),
  showChatting: false,
  fileExecuteResult: '',
}

export const ideSlice = createSlice({
  name: 'IDE',
  initialState,
  reducers: {
    toggleExplorer: state => {
      state.showExplorer = !state.showExplorer
      if (state.showPermissionSettings) {
        state.showPermissionSettings = !state.showPermissionSettings
      }
    },
    toggleTerminal: state => {
      state.showTerminal = !state.showTerminal
    },
    togglePermissionSettings: state => {
      state.showPermissionSettings = !state.showPermissionSettings
      if (state.showExplorer) {
        state.showExplorer = !state.showExplorer
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
export const selectEntry = (state: RootState) => state.ide.selectedNode
export const selectShowChatting = (state: RootState) => state.ide.showChatting
export const selectShowPermissionSettings = (state: RootState) =>
  state.ide.showPermissionSettings
export const selectEntries = (state: RootState) => state.ide.tree
export const selectFileExecuteResult = (state: RootState) =>
  state.ide.fileExecuteResult
