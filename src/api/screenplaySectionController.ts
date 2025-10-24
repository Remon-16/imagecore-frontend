// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /screenplaySection/addScreenplaySection */
export async function addScreenplaySection(
  body: API.ScreenplaySectionAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseScreenplaySection>('/screenplaySection/addScreenplaySection', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /screenplaySection/get */
export async function queryScreenplaySectionById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryScreenplaySectionByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseScreenplaySectionVO>('/screenplaySection/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /screenplaySection/queryScreenplayContent */
export async function queryScreenplayContent(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryScreenplayContentParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseScreenplayContentVO>('/screenplaySection/queryScreenplayContent', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /screenplaySection/queryScreenplaySectionByList */
export async function queryScreenplaySectionByList(
  body: API.ScreenplaySectionQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListScreenplaySectionVO>(
    '/screenplaySection/queryScreenplaySectionByList',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    }
  )
}

/** 此处后端没有提供注释 POST /screenplaySection/queryScreenplaySectionByPage */
export async function queryScreenplaySectionByPage(
  body: API.ScreenplaySectionQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageScreenplaySectionVO>(
    '/screenplaySection/queryScreenplaySectionByPage',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    }
  )
}

/** 此处后端没有提供注释 POST /screenplaySection/updateScreenplaySection */
export async function updateScreenplaySection(
  body: API.ScreenplaySectionUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/screenplaySection/updateScreenplaySection', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
