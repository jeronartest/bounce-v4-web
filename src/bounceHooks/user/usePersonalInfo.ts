import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserInfo } from 'api/user'
import { RootState } from 'store'
import { UserType } from 'api/market/type'
import { getCompanyInfo } from 'api/company'
import { useParams } from 'react-router-dom'

export const usePersonalInfo = (type: UserType) => {
  const [personalId, setPersonalId] = useState<number>()
  const [isMe, setIsMe] = useState<boolean>(false)
  const { userInfo, userId } = useSelector((state: RootState) => state.user)
  const params = useParams()
  const { id, thirdpartId } = params

  useEffect(() => {
    const getProfileId = async () => {
      const res = await getUserInfo({ userId: Number(id) })
      setPersonalId(res.data.id)
      setIsMe(false)
    }

    const getCompanyId = async () => {
      const res = await getCompanyInfo(id ? { userId: Number(id) } : { thirdpartId: Number(thirdpartId) })
      setPersonalId(res.data.companyId)
      setIsMe(false)
    }

    if (type === UserType.Profile) {
      if (!id || Number(id) === Number(userId)) {
        setPersonalId(userId)
        setIsMe(true)
      } else {
        getProfileId()
      }
    } else {
      if ((!thirdpartId && !id) || Number(id) === Number(userId)) {
        setPersonalId(userId)
        setIsMe(true)
      } else {
        getCompanyId()
      }
    }
  }, [id, userId, userInfo, thirdpartId, type])

  return { personalId, isMe }
}
