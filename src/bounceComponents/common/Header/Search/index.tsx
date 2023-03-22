import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Box } from '@mui/material'
import SearchInput, { ISearchOption } from '../../SearchInput'
import { searchUser } from 'api/optionsData'
import DefaultAvaSVG from 'assets/imgs/components/defaultAva.svg'
import { USER_TYPE } from 'api/user/type'
import { useNavigate } from 'react-router-dom'

const Search: React.FC = () => {
  const [userData, setUserData] = useState<ISearchOption[]>([])
  const [searchText, setSearchText] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    searchUser({
      limit: 100,
      offset: 0,
      userType: 0,
      value: searchText
    }).then(res => {
      const { code, data } = res
      if (code !== 200) {
        toast.error('search error')
      }
      const temp = data?.list?.map((v: { name: any; avatar: any }) => {
        return {
          label: v?.name,
          icon: v?.avatar || DefaultAvaSVG,
          value: v
        }
      })
      setUserData([...temp])
    })
  }, [searchText])

  return (
    <Box
      sx={{
        width: 240,
        height: 40,
        '.Mui-focused': {
          '.MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.2)'
          }
        },
        '.MuiOutlinedInput-root': {
          background: '#F5F6F8',
          height: 40,
          padding: '0 !important',
          '& input': {
            paddingTop: '7.5px !important',
            paddingRight: '10px !important'
          }
        }
      }}
    >
      <SearchInput
        options={userData}
        filterOptions={(list: any) => list}
        renderOption={option => {
          return (
            <span>
              {option?.label}
              {option?.value?.userType === USER_TYPE.USER && (
                <span style={{ color: 'rgba(23, 23, 23, 0.7)', marginLeft: 8 }}>#{option?.value?.fullNameId}</span>
              )}
            </span>
          )
        }}
        placeholder={'Search by username or company'}
        startIcon
        loadingText={'No result'}
        value={searchText}
        onChange={(_, newValue) => {
          setSearchText(newValue)
        }}
        onSelect={(_, newVal) => {
          setSearchText('')
          if (newVal?.value?.thirdpartId) {
            return navigate(`/company/summary?thirdpartId=${newVal?.value?.thirdpartId}`)
          }
          if (newVal?.value?.userType === USER_TYPE.USER) {
            return navigate(`/profile/summary?id=${newVal?.value?.userId}`)
          }

          return navigate(`/company/summary?id=${newVal?.value?.userId}`)
        }}
      />
    </Box>
  )
}

export default Search
