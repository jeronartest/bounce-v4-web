import { usePagination, useRequest } from 'ahooks'
import { toast } from 'react-toastify'
import { addComments, addCommentsReply, deleteComments, deleteCommentsReply, getComments } from 'api/user'
import {
  IAddCommentParams,
  IAddCommentsReplyParams,
  IDeleteCommentsParams,
  IDeleteCommentsReplyParams,
  TopicType
} from 'api/user/type'

export const useGetComments = (topicId: number, topicType: TopicType) => {
  return usePagination(
    async ({ current, pageSize }) => {
      const res = await getComments({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        topicId,
        topicType
      })
      return {
        total: res.data.total,
        list: res.data.list
      }
    },
    {
      defaultPageSize: 9999,
      ready: !!topicId && !!topicType,
      refreshDeps: [topicId, topicType]
    }
  )
}

export const useAddComments = (callback?: () => void) => {
  return useRequest(async (params: IAddCommentParams) => addComments(params), {
    manual: true,
    onSuccess: response => {
      const { code } = response
      console.log('response', response)
      if (code === 200) {
        callback?.()
      } else {
        toast.error('Comment sent failed')
      }
    }
  })
}

export const useDeleteComments = (callback?: () => void) => {
  return useRequest(async (params: IDeleteCommentsParams) => deleteComments(params), {
    manual: true,
    onSuccess: response => {
      const { code } = response
      if (code === 200) {
        callback?.()
      } else {
        toast.error('Comment delete failed')
      }
    }
  })
}

export const useAddCommentsReply = (callback?: () => void) => {
  return useRequest(async (params: IAddCommentsReplyParams) => addCommentsReply(params), {
    manual: true,
    onSuccess: response => {
      const { code } = response
      if (code === 200) {
        callback?.()
      } else {
        toast.error('Comment sent failed')
      }
    }
  })
}

export const useDeleteCommentsReply = (callback?: () => void) => {
  return useRequest(async (params: IDeleteCommentsReplyParams) => deleteCommentsReply(params), {
    manual: true,
    onSuccess: response => {
      const { code } = response
      if (code === 200) {
        callback?.()
      } else {
        toast.error('Comment delete failed')
      }
    }
  })
}
