// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /thumb/do */
export async function doThumb(body: API.DoThumbRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/thumb/do', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /thumb/undo */
export async function undoThumb(body: API.DoThumbRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/thumb/undo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
