import React, { useCallback, useEffect, useState } from 'react'
import { IconButton, Stack, Typography } from '@mui/material'
import { ReactComponent as ArrowSVG } from 'assets/imgs/components/arrow.svg'

export type IYearProps = {
  year: number
  onChange: (year: number) => void
}

const Year: React.FC<IYearProps> = ({ year, onChange }) => {
  const [val, setVal] = useState<number>(year)

  const handlePreviousClick = useCallback(() => {
    setVal(val => {
      return val < 1900 ? 1900 : val - 1
    })
  }, [])

  const handleNextClick = useCallback(() => {
    setVal(val => val + 1)
  }, [])

  useEffect(() => {
    onChange(val)
  }, [onChange, val])

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <IconButton onClick={handlePreviousClick}>
        <ArrowSVG style={{ transform: 'rotate(90deg)' }} />
      </IconButton>
      <Typography variant="h3" sx={{ fontSize: 16, lineHeight: '20px' }}>
        {val}
      </Typography>
      <IconButton onClick={handleNextClick}>
        <ArrowSVG style={{ transform: 'rotate(-90deg)' }} />
      </IconButton>
    </Stack>
  )
}

export default Year
