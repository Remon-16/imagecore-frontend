// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /screenplay/addScreenplay */
export async function addScreenplay(
  body: API.ScreenplayAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseScreenplayVO>('/screenplay/addScreenplay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /screenplay/get */
export async function queryScreenplayById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryScreenplayByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseScreenplayVO>('/screenplay/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /screenplay/queryScreenplayPage */
export async function queryScreenplayPage(
  body: API.ScreenplayQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageScreenplayVO>('/screenplay/queryScreenplayPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /screenplay/updateScreenplay */
export async function updateScreenplay(
  body: API.ScreenplayUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/screenplay/updateScreenplay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
