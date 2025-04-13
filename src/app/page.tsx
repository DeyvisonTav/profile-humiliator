'use client';

import { useState } from 'react';
import { 
  Button, 
  Container, 
  Typography, 
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import RoastCard from '@/components/RoastCard';

export default function Home() {
  const [profileUrl, setProfileUrl] = useState('');
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Garantir que a URL está no formato correto
    const username = profileUrl.replace('https://github.com/', '').replace(/\//g, '');
    const fullUrl = `https://github.com/${username}`;
    
    setLoading(true);
    setError('');
    setRoast('');
    setProfileImage('');

    try {
      const response = await fetch('/api/humilhar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileUrl: username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar roast');
      }

      setRoast(data.roast);
      setProfileImage(data.profileImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar roast');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace('https://github.com/', '').replace(/\//g, '');
    setProfileUrl(value);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Gradiente de fundo animado */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#4f46e5,_#7c3aed,_#d946ef)] opacity-90">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_#60a5fa,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_#f472b6,_transparent_50%)]"></div>
      </div>

      <Container maxWidth="md" className="relative z-10 py-12 px-4">
        <Box className="text-center mb-12">
          <Typography 
            variant="h1" 
            component="h1" 
            className="font-bold mb-6 text-white text-4xl md:text-6xl"
          >
            HUMILHADOR
            <br />
            DE PERFIL
          </Typography>
          <Typography variant="h6" className="text-white/90 text-lg md:text-xl mb-12">
            Cole o link do seu perfil do GitHub abaixo
            <br />
            e descubra sua humilhação personalizada
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <TextField
            fullWidth
            variant="outlined"
            value={profileUrl}
            onChange={handleInputChange}
            placeholder="seu-nome-de-usuario"
            className="bg-white/95 backdrop-blur-sm rounded-2xl mb-4"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" className="text-gray-500">
                  github.com/
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                height: '60px',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
              },
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xl py-4 rounded-2xl font-medium hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <CircularProgress size={28} color="inherit" />
            ) : (
              'Gerar Humilhação'
            )}
          </Button>
        </form>

        {roast && <RoastCard roast={roast} profileUrl={`https://github.com/${profileUrl}`} profileImage={profileImage} />}

        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError('')}
        >
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </main>
  );
}
