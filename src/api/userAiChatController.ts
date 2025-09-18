// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 GET /userAIChat/chat */
export async function doChat(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.doChatParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>('/userAIChat/chat', {
    method: 'GET',
    params: {
      ...params,
      chatRequest: undefined,
      ...params['chatRequest'],
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /userAIChat/chat/sse */
export async function doChatStream(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.doChatStreamParams,
  options?: { [key: string]: any }
) {
  return request<API.ServerSentEventString[]>('/userAIChat/chat/sse', {
    method: 'GET',
    params: {
      ...params,
      chatRequest: undefined,
      ...params['chatRequest'],
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /userAIChat/getALLChatHis */
export async function getAllChatHisResponse(
  body: API.ChatHisRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseChatAllHisResponse>('/userAIChat/getALLChatHis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /userAIChat/getAllUserChatHis */
export async function getAllUserChatHis(
  body: API.ChatHisRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListChatHisListVo>('/userAIChat/getAllUserChatHis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /userAIChat/getChatHis */
export async function getChatHisResponse(body: API.ChatRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseChatHisResponse>('/userAIChat/getChatHis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /userAIChat/getChatHisVoPage */
export async function getChatHisVoPage(body: API.ChatHisRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsePageChatHisVo>('/userAIChat/getChatHisVoPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /userAIChat/getNewChatId */
export async function getNewChatId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getNewChatIdParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>('/userAIChat/getNewChatId', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
