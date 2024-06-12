import { configureStore } from '@reduxjs/toolkit'
import ideReducer from './ideSlice'

const store = configureStore({
  reducer: {
    ide: ideReducer,
  },
})

export type RootState = ReturnType<typeof store.getState> // store의 state를 나타내는 타입
export type AppDispatch = typeof store.dispatch // 액션을 dispatch하는 함수의 타입

export default store
