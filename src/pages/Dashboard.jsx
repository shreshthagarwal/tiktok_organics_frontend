import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Button, CircularProgress, Alert, AppBar, Toolbar } from '@mui/material';
import TikTokOrganicConnectCard from '../components/TikTokOrganicConnectCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import tiktokLogo from '../assets/tiktok_logo.svg';

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
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f8f8' }}>
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
          bgcolor: '#fff', 
          borderBottom: '1px solid #e0e0e0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <Toolbar sx={{ minHeight: '72px' }}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Box 
              component="img" 
              src={tiktokLogo} 
              alt="TikTok Logo" 
              sx={{ 
                height: 28, 
                width: 'auto',
                mr: 1.5,
              }} 
            />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                color: '#000',
                letterSpacing: '-0.5px'
              }}
            >
              TikTok Organic
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCopyUrl}
              startIcon={<ContentCopyIcon />}
              size="medium"
              sx={{ 
                textTransform: 'none', 
                color: '#000', 
                borderColor: '#000',
                px: 2,
                '&:hover': { 
                  bgcolor: '#000',
                  color: '#fff'
                } 
              }}
            >
              Copy URL
            </Button>
            <Button
              variant="contained"
              onClick={handleOpenAuth}
              size="medium"
              sx={{ 
                textTransform: 'none',
                bgcolor: '#000',
                color: '#fff',
                px: 3,
                boxShadow: 'none',
                '&:hover': { 
                  bgcolor: '#111',
                  boxShadow: 'none'
                }
              }}
            >
              Connect Account
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ 
          p: 0, 
          bgcolor: '#fff', 
          borderRadius: '8px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          border: '1px solid #e0e0e0'
        }}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 3,
              borderBottom: '1px solid #e0e0e0'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#000' }}>
                Connected Accounts
              </Typography>
              <Button
                variant="outlined"
                onClick={fetchTikTokUsers}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
                size="small"
                sx={{ 
                  textTransform: 'none',
                  color: '#000',
                  borderColor: '#000',
                  '&:hover': { 
                    bgcolor: '#000',
                    color: '#fff'
                  }
                }}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </Box>
              
            {error && (
              <Alert severity="error" sx={{ 
                m: 3,
                mb: 0,
                bgcolor: '#f8f8f8',
                border: '1px solid #e0e0e0',
                color: '#000'
              }}>
                {error}
              </Alert>
            )}
            
            {loading && tiktokUsers.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
                <CircularProgress sx={{ color: '#000' }} />
              </Box>
            ) : tiktokUsers.length > 0 ? (
              <Box sx={{ p: 3 }}>
                {tiktokUsers.map((user, index) => (
                  <Paper 
                    key={user.id || index} 
                    sx={{ 
                      p: 2, 
                      mb: 2,
                      width: '100%',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      bgcolor: '#fff',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                      }
                    }}
                  >
                    <Box sx={{ mb: 1.5, pb: 1, borderBottom: '1px solid #f0f0f0' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#000' }}>
                        Account {index + 1}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
                      gap: 2 
                    }}>
                      <Box>
                        <Typography variant="caption" sx={{ 
                          color: '#666', 
                          display: 'block', 
                          mb: 1,
                          fontWeight: 500,
                          letterSpacing: '0.5px'
                        }}>
                          USERNAME
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: '#000' }}>
                          {user.user_name || 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ 
                          color: '#666', 
                          display: 'block', 
                          mb: 1,
                          fontWeight: 500,
                          letterSpacing: '0.5px'
                        }}>
                          REFRESH TOKEN
                        </Typography>
                        <Box sx={{ 
                          bgcolor: '#f8f8f8',
                          p: 1.5, 
                          borderRadius: '4px',
                          border: '1px solid #e0e0e0',
                          overflow: 'hidden'
                        }}>
                          <Typography variant="body2" sx={{ 
                            fontFamily: 'monospace', 
                            wordBreak: 'break-all',
                            fontSize: '0.75rem',
                            color: '#000',
                            lineHeight: 1.5
                          }}>
                            {user.refresh_token || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ 
                          color: '#666', 
                          display: 'block', 
                          mb: 1,
                          fontWeight: 500,
                          letterSpacing: '0.5px'
                        }}>
                          TOKEN EXPIRES
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#000' }}>
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
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                p: 6,
                textAlign: 'center'
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 500, 
                  color: '#000', 
                  mb: 1 
                }}>
                  No connected accounts
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: '#666', 
                  maxWidth: '400px',
                  mb: 3
                }}>
                  Connect your first TikTok account to get started with organic analytics.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleOpenAuth}
                  size="large"
                  sx={{ 
                    textTransform: 'none',
                    bgcolor: '#000',
                    color: '#fff',
                    px: 4,
                    '&:hover': { 
                      bgcolor: '#111'
                    }
                  }}
                >
                  Connect Account
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;