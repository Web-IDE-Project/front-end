// TODO - 추후 삭제
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
