import { ApiInstance } from '..'
import { CollectToggleParams, IIdeasListParams, ILikeUnlikeParams, IUpdateIdeaParams } from './type'

// 创建/更新idea
export const createUpdateIdea = (body: IUpdateIdeaParams) => {
  return ApiInstance.post('/user/update_idea', body)
}

// 查询单个idea详情
export const getIdeaDetail = (body: { ideaId: number }) => {
  return ApiInstance.post('/user/idea', body)
}

// 删除单个idea
export const deleteIdea = (body: { ideaId: number }) => {
  return ApiInstance.post('/user/delete_idea', body)
}

export const likeAndUnlike = (body: ILikeUnlikeParams) => {
  return ApiInstance.post('/user/like', body)
}

export const collectToggle = (body: CollectToggleParams) => {
  return ApiInstance.post('/user/collect', body)
}

export const getIdeasList = (body: IIdeasListParams) => {
  return ApiInstance.post('/com/search/idea', body)
}
