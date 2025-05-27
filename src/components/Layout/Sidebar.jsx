import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, Button, Divider } from '@mui/material';
import { Dashboard as DashboardIcon, AccountCircle as AccountIcon, ExitToApp as LogoutIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import tmsLogo from '../../assets/tms_logo2.jpeg';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();
  
  const menuItems = [
    { text: 'TikTok Accounts', icon: <AccountIcon />, path: '/dashboard' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          borderRight: '1px solid rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Logo Section */}
      <Box 
        sx={{ 
          p: 3, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
        }}
      >
        <Box 
          component="img" 
          src={tmsLogo} 
          alt="TMS Logo" 
          sx={{ 
            height: 80,
            width: 'auto',
            objectFit: 'contain',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }} 
        />
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem
                key={item.text}
                button
                onClick={() => navigate(item.path)}
                sx={{
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                  },
                  ...(isActive && {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    borderLeft: '3px solid #000',
                    '& .MuiListItemIcon-root': {
                      color: '#000',
                    },
                    '& .MuiTypography-root': {
                      fontWeight: 500,
                    },
                  }),
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'rgba(0, 0, 0, 0.6)' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: 'text.primary',
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Logout Section */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            textTransform: 'none',
            bgcolor: '#000',
            color: '#fff',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.85)',
            },
            boxShadow: 'none',
            '&:active': {
              boxShadow: 'none',
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
