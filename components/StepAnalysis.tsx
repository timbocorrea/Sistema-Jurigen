
import React, { useEffect, useState } from 'react';

const StepAnalysis: React.FC = () => {
  const [dots, setDots] = useState('');
  
  const messages = [
    "Analisando narrativas e fatos...",
    "Processando evidências documentais...",
    "Correlacionando provas com teses jurídicas...",
    "Gerando cronologia dos eventos...",
    "Calculando riscos e lacunas probatórias...",
    "Finalizando dossiê de alta fidelidade..."
  ];
  
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    const msgInterval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % messages.length);
    }, 3000);

    return () => {
      clearInterval(dotInterval);
      clearInterval(msgInterval);
    };
  }, [messages.length]);

  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <div className="relative mb-12">
        <div className="w-32 h-32 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fas fa-scale-balanced text-3xl text-amber-500 animate-pulse"></i>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-slate-800 mb-4">Gerando sua Inteligência Jurídica{dots}</h2>
      <p className="text-lg text-slate-500 max-w-md mx-auto h-12 transition-all duration-500">
        {messages[msgIndex]}
      </p>

      <div className="mt-12 w-full max-w-lg bg-slate-200 h-2 rounded-full overflow-hidden">
        <div className="bg-amber-500 h-full animate-[progress_15s_ease-in-out_infinite]" style={{ width: '0%' }}></div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default StepAnalysis;
