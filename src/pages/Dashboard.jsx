import React from 'react';
import { Box, Container, Typography, Paper, Button, CircularProgress, IconButton } from '@mui/material';
import TikTokOrganicConnectCard from '../components/TikTokOrganicConnectCard';
import { db, collection, getDocs, orderBy, limit, query, doc, deleteDoc } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';


const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [authUrl, setAuthUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [tokens, setTokens] = React.useState([]);
  const [fetchingTokens, setFetchingTokens] = React.useState(false);

  // Fetch initial auth URL
  React.useEffect(() => {
    const authUrl = 'https://www.tiktok.com/v2/auth/authorize?client_key=7480734602387030017&scope=user.info.basic%2Cvideo.list%2Cbiz.creator.info%2Cbiz.creator.insights%2Cuser.info.username%2Cuser.info.stats%2Cuser.info.profile%2Cuser.account.type%2Cuser.insights&response_type=code&redirect_uri=https%3A%2F%2Ftiktok-organics-1.onrender.com%2F';
    setAuthUrl(authUrl);
  }, []);

  // Fetch tokens from Firebase every 30 seconds
  React.useEffect(() => {
    const fetchFirebaseTokens = async () => {
      try {
        setFetchingTokens(true);
        const tiktokUsersRef = collection(db, 'tiktok_users');
        const q = query(
          tiktokUsersRef,
          orderBy('tokens.expires_at', 'desc'),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        
        const userTokens = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setTokens(userTokens);
      } catch (error) {
        console.error('Error fetching tokens from Firebase:', error);
        alert('Failed to fetch tokens from Firebase. Please try again.');
      } finally {
        setFetchingTokens(false);
      }
    };

    const interval = setInterval(fetchFirebaseTokens, 30000);
    fetchFirebaseTokens(); // Initial fetch
    return () => clearInterval(interval);
  }, []);

  const handleCopyUrl = () => {
    if (!authUrl) return;
    
    navigator.clipboard.writeText(authUrl)
      .then(() => {
        alert('Authorization URL copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy URL:', err);
        alert('Failed to copy URL. Please try again.');
      });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h4" gutterBottom>
            TikTok Organics
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TikTokOrganicConnectCard>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (authUrl) {
                      navigator.clipboard.writeText(authUrl)
                        .then(() => alert('Authorization URL copied to clipboard!'))
                        .catch(err => console.error('Failed to copy URL:', err));
                    }
                  }}
                  sx={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#5a6268'
                    }
                  }}
                >
                  Copy Auth URL
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (authUrl) {
                      window.open(authUrl, '_blank');
                    }
                  }}
                  sx={{
                    bgcolor: '#6c757d',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#5a6268'
                    }
                  }}
                >
                  Open TikTok Auth
                </Button>
              </Box>
            </TikTokOrganicConnectCard>
            {tokens.length > 0 && (
              <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Connected TikTok Accounts</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {tokens.map((user, index) => (
                    <Box key={user.id} sx={{ p: 1, bgcolor: 'white', borderRadius: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">Account {index + 1}</Typography>
                        <IconButton
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this TikTok account?')) {
                              try {
                                const userRef = doc(db, 'tiktok_users', user.id);
                                await deleteDoc(userRef);
                                // Refresh tokens list
                                const tiktokUsersRef = collection(db, 'tiktok_users');
                                const q = query(
                                  tiktokUsersRef,
                                  orderBy('tokens.expires_at', 'desc'),
                                  limit(10)
                                );
                                const querySnapshot = await getDocs(q);
                                
                                const userTokens = querySnapshot.docs.map(doc => ({
                                  id: doc.id,
                                  ...doc.data()
                                }));
                                
                                setTokens(userTokens);
                              } catch (error) {
                                console.error('Error deleting user:', error);
                                alert('Failed to delete TikTok account. Please try again.');
                              }
                            }
                          }}
                          size="small"
                          sx={{
                            color: '#6c757d',
                            '&:hover': {
                              color: '#5a6268'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Typography variant="body2">Access Token: {user.tokens?.access_token?.slice(0, 20)}...</Typography>
                      {user.tokens?.refresh_token && (
                        <Typography variant="body2">Refresh Token: {user.tokens.refresh_token.slice(0, 20)}...</Typography>
                      )}
                      <Typography variant="body2">Scopes: {user.user_info?.scopes?.join(', ')}</Typography>
                      <Typography variant="body2">Last Updated: {new Date(user.tokens?.expires_at?.toDate()).toLocaleString()}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            
            {fetchingTokens && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard;
