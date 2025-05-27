import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Alert, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import tmsLogo from '../assets/tms_logo.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login({ email, password });
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
      width: '100%',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 4,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: 400,
          mx: 'auto',
          border: '1px solid rgba(0, 0, 0, 0.1)'
        }}
      >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center'
          }}>
            <Box 
              component="img"
              src={tmsLogo} 
              alt="TMS Logo" 
              sx={{ 
                maxHeight: 60,
                maxWidth: '100%',
                height: 'auto',
                width: 'auto',
                objectFit: 'contain',
                mb: 3
              }} 
            />
            <Typography 
              variant="subtitle1" 
              sx={{ 
                textAlign: 'center', 
                color: 'text.secondary',
                fontWeight: 500,
                letterSpacing: 0.5,
                mb: -2
              }}
            >
              Sign in to your account
            </Typography>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2,
                  width: '100%',
                  '& .MuiAlert-message': {
                    width: '100%',
                    textAlign: 'left'
                  }
                }}
              >
                {error}
              </Alert>
            )}
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
                  borderColor: 'rgba(0, 0, 0, 0.23)'
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.5)'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.7)'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(0, 0, 0, 0.6)'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'rgba(0, 0, 0, 0.8)'
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
                  borderColor: 'rgba(0, 0, 0, 0.23)'
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.5)'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.7)'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(0, 0, 0, 0.6)'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'rgba(0, 0, 0, 0.8)'
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              borderRadius: 1,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              letterSpacing: 0.5,
              height: 48,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.9)'
              },
              mt: 1,
              mb: 2,
              transition: 'all 0.2s ease-in-out',
              '&:disabled': {
                bgcolor: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.26)'
              }
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Signing in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </Box>
      </Box>
  );
};

export default LoginPage;
