import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export const CardHeader = ({ title, action }) => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    p: 2.5,
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    bgcolor: '#fafafa',
    borderRadius: '8px 8px 0 0'
  }}>
    <Typography variant="h6" sx={{ 
      fontWeight: 600, 
      color: 'text.primary',
      fontSize: '1rem',
      lineHeight: 1.5
    }}>
      {title}
    </Typography>
    {action}
  </Box>
);

export const CardContent = ({ children, sx = {} }) => (
  <Box sx={{ p: 3, ...sx }}>
    {children}
  </Box>
);

export const CardFooter = ({ children }) => (
  <Box sx={{ 
    p: 2, 
    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
    bgcolor: '#fafafa',
    borderRadius: '0 0 8px 8px'
  }}>
    {children}
  </Box>
);

const TikTokOrganicConnectCard = ({ children, onClick, sx = {} }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        borderRadius: 2,
        border: '1px solid rgba(0, 0, 0, 0.06)',
        bgcolor: '#fff',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
          transform: 'translateY(-2px)',
        },
        ...sx,
      }}
      onClick={onClick}
    >
      {children}
    </Paper>
  );
};

// Export compound components
TikTokOrganicConnectCard.Header = CardHeader;
TikTokOrganicConnectCard.Content = CardContent;
TikTokOrganicConnectCard.Footer = CardFooter;

export default TikTokOrganicConnectCard;
