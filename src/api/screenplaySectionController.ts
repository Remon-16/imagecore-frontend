// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /screenplaySection/addScreenplaySection */
export async function addScreenplaySection(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addScreenplaySectionParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseScreenplaySection>('/screenplaySection/addScreenplaySection', {
    method: 'POST',
    params: {
      ...params,
      screenplaySection: undefined,
      ...params['screenplaySection'],
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /screenplaySection/queryScreenplaySectionByList */
export async function queryScreenplaySectionByList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryScreenplaySectionByListParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListScreenplaySectionVO>(
    '/screenplaySection/queryScreenplaySectionByList',
    {
      method: 'POST',
      params: {
        ...params,
        screenplaySectionQueryRequest: undefined,
        ...params['screenplaySectionQueryRequest'],
      },
      ...(options || {}),
    }
  )
}

/** 此处后端没有提供注释 POST /screenplaySection/queryScreenplaySectionByPage */
export async function queryScreenplaySectionByPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryScreenplaySectionByPageParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageScreenplaySectionVO>(
    '/screenplaySection/queryScreenplaySectionByPage',
    {
      method: 'POST',
      params: {
        ...params,
        screenplaySectionQueryRequest: undefined,
        ...params['screenplaySectionQueryRequest'],
      },
      ...(options || {}),
    }
  )
}

/** 此处后端没有提供注释 POST /screenplaySection/updateScreenplaySection */
export async function updateScreenplaySection(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateScreenplaySectionParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/screenplaySection/updateScreenplaySection', {
    method: 'POST',
    params: {
      ...params,
      screenplaySectionUpdateRequest: undefined,
      ...params['screenplaySectionUpdateRequest'],
    },
    ...(options || {}),
  })
}
