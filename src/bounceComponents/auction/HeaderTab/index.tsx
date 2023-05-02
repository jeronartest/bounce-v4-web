import React, { useState } from 'react'
import { Box, Button, styled } from '@mui/material'

const StyledTab = styled(Button)(({}) => ({
  padding: '8px 12px',
  color: 'white',
  borderRadius: '8px',
  fontWeight: '500',
  fontSize: '16px',
  lineHeight: '150%',
  height: '40px',
  background: 'transparent',
  '&:hover': {
    background: '#FFFFFF33'
  },
  '&.selected': {
    background: '#E1F25C',
    color: '#121212'
  }
}))
const HeaderTab: React.FC<{ onTabChange: (currentTab: string) => void }> = ({ onTabChange }) => {
  const [currentTab, setCurrentTab] = useState('All')

  const tabs = [
    'All',
    'Token Auction',
    'NFT Auction',
    'Real World collectibles Auction',
    'Ads Auction',
    'Private Launchpad'
  ]
  return (
    <Box
      sx={{
        marginTop: '32px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '6px',
        gap: '6px',
        width: 'fit-content',
        background: '#20201E',
        backdropFilter: 'blur(4px)',
        borderRadius: '10px'
      }}
    >
      {tabs.map(tab => (
        <StyledTab
          key={tab}
          className={tab === currentTab ? 'selected' : ''}
          onClick={() => {
            setCurrentTab(tab)
            onTabChange(tab)
          }}
        >
          {tab}
        </StyledTab>
      ))}
    </Box>
  )
}

export default HeaderTab
