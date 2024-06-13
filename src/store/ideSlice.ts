import { FileSystemEntry } from '@/models/FileSystemEntryData'
import { RootState } from './index'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
// NOTE - 테스트용 파일 리스트 / 컨테이너 실행 시에 파일을 저장하는 것으로 추후 수정
import entries from '@/data/file-system-entry.json'

interface Entry {
  type: string
  id: number
}

interface StateType {
  showExplorer: boolean
  showTerminal: boolean
  showPermissionSettings: boolean
  selectedEntry: Entry
  entries: FileSystemEntry[]
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
  entries: entries || [],
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

    setEntries: (state, action: PayloadAction<FileSystemEntry[]>) => {
      state.entries = action.payload
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
  setEntries,
  setFileExecuteResult,
} = ideSlice.actions
export default ideSlice.reducer

export const selectShowExplorer = (state: RootState) => state.ide.showExplorer
export const selectShowTerminal = (state: RootState) => state.ide.showTerminal
export const selectEntry = (state: RootState) => state.ide.selectedEntry
export const selectCurrentFileId = (state: RootState) => state.ide.currentFileId
export const selectShowChatting = (state: RootState) => state.ide.showChatting
export const selectShowPermissionSettings = (state: RootState) =>
  state.ide.showPermissionSettings
export const selectCurrentFileContent = (state: RootState) =>
  state.ide.currentFileContent
export const selectEntries = (state: RootState) => state.ide.entries
export const selectFileExecuteResult = (state: RootState) =>
  state.ide.fileExecuteResult
