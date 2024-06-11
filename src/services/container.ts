import { AxiosResponse } from 'axios'
import API from './API'
import { StartContainerResponse } from '../models/FileSystemEntryData'

interface CreateContainerResponse {
  success: boolean
  data?: {
    title: string
    description: string
    language: string
  }
  error?: string
}
export async function createContainer(
  title: string,
  description: string,
  language: string
): Promise<CreateContainerResponse> {
  try {
    const response: AxiosResponse = await API.post(`/api/workspaces`, {
      title,
      description,
      language,
    })

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

/** 컨테이너 실행 API */
export async function startContainer(
  containerId: number
): Promise<StartContainerResponse> {
  try {
    const response: AxiosResponse = await API.post(
      `/api/workspaces/${containerId}`
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
