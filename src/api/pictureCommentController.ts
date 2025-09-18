// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /picture_comment/deleteComment */
export async function deleteComment(
  body: API.PictureCommentRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/picture_comment/deleteComment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /picture_comment/query_root */
export async function getPictureCommentRootVo(
  body: API.PictureCommentQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePictureCommentRootVo>('/picture_comment/query_root', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /picture_comment/query_second */
export async function getPictureCommentVo(
  body: API.PictureCommentQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePictureCommentVo>('/picture_comment/query_second', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /picture_comment/saveOrUpdate */
export async function saveOrUpdatePictureComment(
  body: API.PictureCommentRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePictureCommentVo>('/picture_comment/saveOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
