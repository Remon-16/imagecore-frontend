// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 GET /ai_chat/chat */
export async function doAiChat(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.doAIChatParams,
  options?: { [key: string]: any }
) {
  return request<string>('/ai_chat/chat', {
    method: 'GET',
    params: {
      ...params,
      chatRequest: undefined,
      ...params['chatRequest'],
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /ai_chat/chat/sse */
export async function aiChatStream(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.aiChatStreamParams,
  options?: { [key: string]: any }
) {
  return request<API.ServerSentEventString[]>('/ai_chat/chat/sse', {
    method: 'GET',
    params: {
      ...params,
      chatRequest: undefined,
      ...params['chatRequest'],
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /ai_chat/getChatId */
export async function getChatId(options?: { [key: string]: any }) {
  return request<string>('/ai_chat/getChatId', {
    method: 'GET',
    ...(options || {}),
  })
}
