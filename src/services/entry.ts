import { AxiosResponse } from 'axios'
import API from './API'
import {
  FileApiResponse,
  FileSystemEntry,
  GetFileResponse,
} from '@/models/FileSystemEntryData'

/** 파일 조회 API */
export async function getFile(
  containerId: string | number,
  fileId: string | number
): Promise<GetFileResponse> {
  try {
    const response: AxiosResponse = await API.get(
      `/api/workspaces/${containerId}/files/${fileId}`
    )

    return {
      success: true,
      data: response.data,
    }
  } catch (err: any) {
    return {
      success: false,
      error:
        err.response?.data?.message || err.message || 'Unknown error occurred',
    }
  }
}

/** 디렉토리 생성 API */
export async function createDirectory(
  containerId: string | number,
  directoryId: string | number,
  name: string
): Promise<FileApiResponse<FileSystemEntry>> {
  try {
    const response: AxiosResponse = await API.post(
      `/api/workspaces/${containerId}/directories/${directoryId}`,
      { name: name }
    )

    return {
      success: true,
      data: response.data,
    }
  } catch (err: any) {
    return {
      success: false,
      error:
        err.response?.data?.message || err.message || 'Unknown error occurred',
    }
  }
}

/** 파일 생성 API */
export async function createFile(
  containerId: string | number,
  directoryId: string | number,
  name: string
): Promise<FileApiResponse<FileSystemEntry>> {
  try {
    const response: AxiosResponse = await API.post(
      `/api/workspaces/${containerId}/files/${directoryId}`,
      { name: name }
    )

    return {
      success: true,
      data: response.data,
    }
  } catch (err: any) {
    return {
      success: false,
      error:
        err.response?.data?.message || err.message || 'Unknown error occurred',
    }
  }
}
