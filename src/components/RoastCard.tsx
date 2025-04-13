'use client';

import { Card, CardContent, Typography, Avatar, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';

interface RoastCardProps {
  roast: string;
  profileUrl: string;
  profileImage: string;
}

export default function RoastCard({ roast, profileUrl, profileImage }: RoastCardProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  // Extrair o username do GitHub
  const username = profileUrl.split('/').pop() || '';
  const initials = username
    .split('-')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;

    try {
      // Criar um clone do card para o PDF
      const cardClone = cardRef.current.cloneNode(true) as HTMLElement;
      
      // Remover o botão de download do clone
      const downloadButton = cardClone.querySelector('button');
      if (downloadButton) {
        downloadButton.remove();
      }

      // Ajustar o estilo do clone para o PDF
      cardClone.style.width = '800px';
      cardClone.style.padding = '40px';
      cardClone.style.backgroundColor = 'transparent';

      // Garantir que a imagem do perfil seja carregada
      const avatar = cardClone.querySelector('img');
      if (avatar) {
        await new Promise((resolve) => {
          avatar.onload = resolve;
          if (avatar.complete) resolve(null);
        });
      }

      const canvas = await html2canvas(cardClone, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 15000,
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('roast-profissional.pdf');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
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
              className="mt-8 flex justify-end"
            >
              <Button
                variant="contained"
                onClick={handleDownloadPDF}
                startIcon={<DownloadIcon />}
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-medium px-6 py-2"
                sx={{
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                Baixar PDF
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
} 