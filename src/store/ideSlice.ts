import { RootState } from './index'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface Entry {
  type: string
  id: number
}

interface StateType {
  showExplorer: boolean
  showTerminal: boolean
  showPermissionSettings: boolean
  selectedEntry: Entry
  currentFileId: number
  currentFileContent: string
  showChatting: boolean
  fileExecuteResult: string
}

const initialState: StateType = {
  showExplorer: true,
  showTerminal: true,
  showPermissionSettings: false,
  selectedEntry: {
    type: 'file',
    id: 3,
  },
  currentFileId: 3,
  currentFileContent: '',
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
    setSelectedEntry: (state, action: PayloadAction<Entry>) => {
      state.selectedEntry = action.payload
    },
    setCurrentFileId: (state, action: PayloadAction<number>) => {
      state.currentFileId = action.payload
    },
    setCurrentFileContent: (state, action: PayloadAction<string>) => {
      state.currentFileContent = action.payload
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
  setSelectedEntry,
  setCurrentFileId,
  setCurrentFileContent,
  setFileExecuteResult,
} = ideSlice.actions
export default ideSlice.reducer

export const selectShowExplorer = (state: RootState) => state.ide.showExplorer
export const selectShowTerminal = (state: RootState) => state.ide.showTerminal
export const selectEntryType = (state: RootState) => state.ide.selectedEntry
export const selectCurrentFileId = (state: RootState) => state.ide.currentFileId
export const selectShowChatting = (state: RootState) => state.ide.showChatting
export const selectShowPermissionSettings = (state: RootState) =>
  state.ide.showPermissionSettings
export const selectCurrentFileContent = (state: RootState) =>
  state.ide.currentFileContent
export const selectFileExecuteResult = (state: RootState) =>
  state.ide.fileExecuteResult
