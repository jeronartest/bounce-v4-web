import { ApiInstance } from '..'
import { IResponse } from '../type'
import { IIdeasListParams, ILikeUnlikeParams, IUpdateIdeaParams } from './type'

// 创建/更新idea
export const createUpdateIdea = (body: IUpdateIdeaParams) => {
  return ApiInstance.post('/user/update_idea', body)
}

// 查询单个idea详情
export const getIdeaDetail = body => {
  return ApiInstance.post('/user/idea', body)
}

// 删除单个idea
export const deleteIdea = (body: { ideaId: number }) => {
  return ApiInstance.post('/user/delete_idea', body)
}

// 点赞和点踩
export const likeAndUnlike = (body: ILikeUnlikeParams) => {
  return ApiInstance.post('/user/like', body)
}

//获取idea列表
export const getIdeasList = (body: IIdeasListParams) => {
  return ApiInstance.post('/com/search/idea', body)
}
