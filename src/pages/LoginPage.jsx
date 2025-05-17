import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login({ email, password })) {
      navigate('/dashboard');
    }
  };

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      width: '100vw',
      overflowX: 'hidden',
      padding: '20px'
    }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          p: 4,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: 400,
          mx: 'auto'
        }}
      >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
              TikTok Organics
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', color: '#666', mb: 4 }}>
              Please enter your credentials to continue
            </Typography>
          </Box>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#e0e0e0'
                },
                '&:hover fieldset': {
                  borderColor: '#6c757d'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6c757d'
                }
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#e0e0e0'
                },
                '&:hover fieldset': {
                  borderColor: '#6c757d'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6c757d'
                }
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              bgcolor: '#6c757d',
              color: 'white',
              '&:hover': {
                bgcolor: '#5a6268'
              },
              mt: 3,
              mb: 2,
              py: 1.5
            }}
          >
            Login
          </Button>
        </Box>
      </Box>
  );
};

export default LoginPage;
