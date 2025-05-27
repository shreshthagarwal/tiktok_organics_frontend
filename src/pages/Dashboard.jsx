import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Button, CircularProgress, Alert } from '@mui/material';
import TikTokOrganicConnectCard from '../components/TikTokOrganicConnectCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [tiktokUsers, setTiktokUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authUrl, setAuthUrl] = useState('');

  // Set up TikTok auth URL from environment variables
  useEffect(() => {
    const url = import.meta.env.VITE_TIKTOK_OAUTH_URL;
    setAuthUrl(url);
  }, []);

  // Fetch TikTok users from the API
  const fetchTikTokUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://addon.sightshark.com/tiktok/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch TikTok users');
      }

      const data = await response.json();
      setTiktokUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching TikTok users:', error);
      setError(error.message || 'Failed to load TikTok users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTikTokUsers();
  }, []);

  const handleCopyUrl = () => {
    if (!authUrl) return;
    
    navigator.clipboard.writeText(authUrl)
      .then(() => alert('Authorization URL copied to clipboard!'))
      .catch(err => {
        console.error('Failed to copy URL:', err);
        alert('Failed to copy URL. Please try again.');
      });
  };

  const handleOpenAuth = () => {
    if (authUrl) {
      window.open(authUrl, '_blank');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">TikTok Organics</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleCopyUrl}
              startIcon={<ContentCopyIcon />}
              sx={{
                bgcolor: '#6c757d',
                '&:hover': { bgcolor: '#5a6268' }
              }}
            >
              Copy Auth URL
            </Button>
            <Button
              variant="outlined"
              onClick={handleOpenAuth}
              sx={{
                color: '#6c757d',
                borderColor: '#6c757d',
                '&:hover': {
                  borderColor: '#5a6268',
                  bgcolor: 'rgba(108, 117, 125, 0.04)'
                }
              }}
            >
              Open TikTok Auth
            </Button>
          </Box>
        </Box>
        
        <TikTokOrganicConnectCard>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2,
              p: 2,
              bgcolor: '#f8f9fa',
              borderRadius: 1
            }}>
              <Typography variant="h6">Connected TikTok Accounts</Typography>
              <Button
                variant="outlined"
                onClick={fetchTikTokUsers}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                size="small"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </Box>
              
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {loading && tiktokUsers.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : tiktokUsers.length > 0 ? (
              <Box sx={{ width: '100%' }}>
                {tiktokUsers.map((user, index) => (
                  <Paper 
                    key={user.id || index} 
                    sx={{ 
                      p: 2, 
                      mb: 2,
                      width: '100%',
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      '&:hover': {
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Account {index + 1}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2, mt: 1 }}>
                      <Box>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Username:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {user.user_name || 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Refresh Token:
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          fontFamily: 'monospace', 
                          bgcolor: 'rgba(0, 0, 0, 0.04)', 
                          p: 0.5, 
                          borderRadius: 0.5,
                          wordBreak: 'break-all'
                        }}>
                          {user.refresh_token || 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Token Expires:
                        </Typography>
                        <Typography variant="body2">
                          {user.refresh_token_expires ? 
                            new Date(user.refresh_token_expires).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              timeZoneName: 'short'
                            }) : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                No TikTok accounts connected yet.
              </Typography>
            )}
          </Box>
        </TikTokOrganicConnectCard>
      </Paper>
    </Container>
  );
};

export default Dashboard;
