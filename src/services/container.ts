import { AxiosResponse } from 'axios'
import API from './API'
import { Container } from '@/models/container'
import { Entry } from '@/models/entry'
import { ApiResponse } from '@/models/ApiData'

/** 컨테이너 생성 API */
export async function createContainer(
  title: string,
  description: string,
  language: string
): Promise<ApiResponse<number>> {
  // TODO - 서버 API 명세서 수정 후 다시 확인
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
): Promise<ApiResponse<Entry>> {
  try {
    const response: AxiosResponse = await API.get(
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

/** 컨테이너 조회 API */
export async function getContainer(
  category: string
): Promise<ApiResponse<Container[]>> {
  try {
    const response: AxiosResponse<Container[]> = await API.get(
      `/api/workspaces/${category}/get`
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

/** 컨테이너 정보 수정(공유) API */
export async function editContainerInfo(
  containerId: string,
  title: string,
  description: string,
  category: string
): Promise<ApiResponse<{ message: string }>> {
  try {
    const response: AxiosResponse<{ message: string }> = await API.put(
      `/api/workspaces/${containerId}`,
      {
        title: title,
        description: description,
        category: category,
      }
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
