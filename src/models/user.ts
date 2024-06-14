export interface userInfo {
  username: string
  nickname: string
  profileUrl: string
}

export interface loginResponse {
  userInfo: userInfo
  message: string
}
