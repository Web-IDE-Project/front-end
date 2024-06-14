import { AxiosResponse } from 'axios'
import API from './API'
import {
  CreateContainerResponse,
  GetPrivateContainerResponse,
  GetPublicContainerResponse,
  PrivateContainer,
  PublicContainer,
} from '@/models/ContainerData'
import { StartContainerResponse } from '@/models/FileSystemEntryData'

/** 컨테이너 생성 API */
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

/** 내 컨테이너 조회 API */
export async function getMyContainer(): Promise<GetPrivateContainerResponse> {
  try {
    const response: AxiosResponse<PrivateContainer[]> =
      await API.get(`/api/workspaces/my`)

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

/** 강의 컨테이너 조회 API */
export async function getLectureContainer(): Promise<GetPublicContainerResponse> {
  try {
    const response: AxiosResponse<PublicContainer[]> = await API.get(
      `/api/workspaces/lectures`
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

/** 질문 컨테이너 조회 API */
export async function getQuestionContainer(): Promise<GetPublicContainerResponse> {
  try {
    const response: AxiosResponse<PublicContainer[]> = await API.get(
      `/api/workspaces/questions`
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
