import React, { Suspense, useEffect, useState } from 'react'
import { fetchUserLocation } from 'utils/fetch/location'
import NoService from 'components/NoService'
import { IS_TEST_ENV } from '../../constants'

export default function LocationVerification({ children }: { children: React.ReactNode }) {
  const [block, setBlock] = useState(false)
  useEffect(() => {
    !IS_TEST_ENV &&
      fetchUserLocation().then(res => {
        if (res.data.country === 'US') {
          setBlock(true)
        }
      })
  }, [])

  return (
    <Suspense fallback={null}>
      {block ? <NoService /> : children}
      {/*{location === 'US' || location === 'CN' || !location || location === 'Not found' ? children : children}*/}
    </Suspense>
  )
}
