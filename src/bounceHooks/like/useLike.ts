import { useRequest } from 'ahooks'
import { likeAndUnlike } from 'api/idea'

export const useLike = () => {
  const { data: likeRes, runAsync: postLike } = useRequest(likeAndUnlike, {
    cacheKey: 'LIKE_UNLIKE',
    manual: true,
    onSuccess: res => {
      if (res.code === 200) {
        return res.data
      }
    }
  })
  return { likeRes, postLike }
}
