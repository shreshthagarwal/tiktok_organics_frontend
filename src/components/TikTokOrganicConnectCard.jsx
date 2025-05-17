import React from 'react';
import { Box, Typography } from '@mui/material';
import tiktokLogo from '../assets/tiktok_logo.svg';

const TikTokOrganicConnectCard = ({ onClick, children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        p: 2,
        borderRadius: 1,
        border: '1px solid #e0e0e0',
        bgcolor: 'white',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: '#f6f6f6',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 3,
        }}
      >
        <img src={tiktokLogo} alt="TikTok" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#333' }}>
          TikTok Organic
        </Typography>
      </Box>
      {children}
    </Box>
  );
};

export default TikTokOrganicConnectCard;
