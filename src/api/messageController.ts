// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /message/allMessageREAD */
export async function allMessageRead(
  body: API.UserMessageRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/message/allMessageREAD', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /message/changeMessageStatus */
export async function changeMessageStatus(
  body: API.UserMessageRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/message/changeMessageStatus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /message/getExistUnReadMessage */
export async function getExistUnReadMessage(
  body: API.UserMessageRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/message/getExistUnReadMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /message/listMessageVoByPage */
export async function listMessageVoByPage(
  body: API.UserMessageRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageMessageVo>('/message/listMessageVoByPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
