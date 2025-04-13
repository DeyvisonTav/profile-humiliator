'use client';

import { Card, CardContent, Typography, Avatar, Button, Tooltip, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import PersonIcon from '@mui/icons-material/Person';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

(pdfMake as any).vfs = pdfFonts;

interface RoastCardProps {
  roast: string;
  profileUrl: string;
  profileImage: string;
}

export default function RoastCard({ roast, profileUrl, profileImage }: RoastCardProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const username = profileUrl.split('/').pop() || '';
  const initials = username
    .split('-')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();

  const handleShareLinkedIn = () => {
    const tempTextArea = document.createElement('textarea');
    const projectUrl = process.env.NEXT_PUBLIC_PROJECT_URL || 'https://github.com/deyvisontav/profile-humiliator';
    const shareText = `🎭 Humilhação Profissional baseado no meu perfil do GitHub:\n\n${roast}\n\nEste roast foi gerado pelo Profile Humiliator, um projeto que analisa perfis do GitHub de forma bem-humorada. Confira: ${projectUrl}\n\n#HumilhaçoProfissional #GitHub #HumorTech #ProfileHumiliator`;
    
    tempTextArea.value = shareText;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);

    const linkedInUrl = 'https://www.linkedin.com/feed/';
    window.open(linkedInUrl, '_blank');
    
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentText = '';
    const characters = roast.split('');
    let currentIndex = 0;

    const typeNextCharacter = () => {
      if (currentIndex < characters.length) {
        currentText += characters[currentIndex];
        setDisplayedText(currentText);
        currentIndex++;
        
        const delay = characters[currentIndex - 1] === '.' ? 500 :
                     characters[currentIndex - 1] === ',' ? 200 :
                     characters[currentIndex - 1] === ' ' ? 100 :
                     50;

        timeoutId = setTimeout(typeNextCharacter, delay);
      } else {
        setIsTyping(false);
      }
    };

    typeNextCharacter();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      setIsTyping(false);
    };
  }, [roast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto mt-12"
    >
      <Card 
        ref={cardRef}
        className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-2xl rounded-3xl overflow-hidden backdrop-blur-lg"
        sx={{
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.9) 0%, rgba(124, 58, 237, 0.9) 50%, rgba(217, 70, 239, 0.9) 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <CardContent className="p-8">
          <div className="flex items-center gap-6 mb-8">
            <Avatar
              sx={{ 
                width: 72, 
                height: 72,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                border: '4px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                '& img': {
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%'
                }
              }}
              src={profileImage}
              imgProps={{
                crossOrigin: 'anonymous',
                loading: 'eager'
              }}
            >
              {!profileImage && (initials || <PersonIcon sx={{ fontSize: 40 }} />)}
            </Avatar>
            <div>
              <Typography variant="h5" component="div" className="font-bold text-2xl">
                🎭 Roast Profissional
              </Typography>
              <Typography variant="subtitle1" className="opacity-80 mt-1">
                Baseado no seu perfil do GitHub
              </Typography>
            </div>
          </div>
          
          <Typography 
            variant="body1" 
            className="whitespace-pre-line text-lg leading-relaxed font-medium"
            sx={{ minHeight: '150px' }}
          >
            {displayedText}
            {isTyping && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                className="ml-1 inline-block"
              >
                |
              </motion.span>
            )}
          </Typography>

          {!isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-col items-end gap-4"
            >
              <Tooltip title="Se tiver coragem... 😈" arrow>
                <Button
                  variant="contained"
                  onClick={handleShareLinkedIn}
                  startIcon={<LinkedInIcon />}
                  className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-medium px-6 py-2"
                  sx={{
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  Compartilhar no LinkedIn
                </Button>
              </Tooltip>
            </motion.div>
          )}
        </CardContent>
      </Card>
      
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          O texto do seu roast foi copiado! Cole no LinkedIn para compartilhar. 😈
        </Alert>
      </Snackbar>
    </motion.div>
  );
} 