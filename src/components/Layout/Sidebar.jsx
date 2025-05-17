import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, Button } from '@mui/material';
import { Dashboard as DashboardIcon, ExitToApp as LogoutIcon, Login as LoginIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa',
          color: '#333',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
          Dashboard
        </Typography>
      </Box>
      <List>
        <ListItem
          button
          sx={{
            '&:hover': {
              bgcolor: '#f0f0f0',
            },
            '&.Mui-selected': {
              bgcolor: '#f0f0f0',
              color: '#333',
            }
          }}
          selected={true}
        >
          <ListItemIcon sx={{ color: '#666' }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Data Sources" sx={{ color: '#333' }} />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            if (!isLoggedIn) {
              navigate('/');
            }
          }}
          sx={{
            '&:hover': {
              bgcolor: '#f0f0f0',
            },
            '&.Mui-selected': {
              bgcolor: '#f0f0f0',
              color: '#333',
            }
          }}
        >
          <ListItemIcon sx={{ color: '#666' }}>
            {isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
          </ListItemIcon>
          {isLoggedIn && (
            <Button
              onClick={() => {
                logout();
                navigate('/');
              }}
              sx={{
                ml: 2,
                bgcolor: '#6c757d',
                color: 'white',
                '&:hover': {
                  bgcolor: '#5a6268'
                }
              }}
            >
              Logout
            </Button>
          )}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
