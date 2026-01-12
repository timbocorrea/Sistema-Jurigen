
import React, { useState } from 'react';
import { EvidenceItem } from '../types';

interface EvidenceGatheringProps {
  evidence: EvidenceItem[];
  onFinish: () => void;
}

const EvidenceGathering: React.FC<EvidenceGatheringProps> = ({ evidence, onFinish }) => {
  const [items, setItems] = useState(evidence);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: item.status === 'collected' ? 'pending' : 'collected' } : item
    ));
  };

  const progress = Math.round((items.filter(i => i.status === 'collected').length / items.length) * 100);

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-12 flex justify-between items-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="max-w-xl">
          <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Guia de Coleta de Provas</h2>
          <p className="text-slate-600 text-lg">Nossa IA analisou seu dossiê e identificou que as seguintes provas são <span className="font-bold text-amber-600">cruciais</span> para que o seu advogado possa atuar com máxima eficácia.</p>
        </div>
        <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 min-w-[150px]">
          <div className="text-4xl font-black text-amber-500 mb-1">{progress}%</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Concluído</div>
        </div>
      </div>

      <div className="w-full bg-slate-200 h-3 rounded-full mb-12 overflow-hidden shadow-inner">
        <div className="bg-amber-500 h-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-16">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            onClick={() => toggleItem(item.id)}
            className={`group cursor-pointer p-8 rounded-3xl border-2 transition-all flex items-start gap-6 relative overflow-hidden ${
              item.status === 'collected' 
                ? 'bg-green-50/50 border-green-200' 
                : 'bg-white border-slate-100 hover:border-amber-300 hover:shadow-xl hover:-translate-y-1'
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-300 mb-2 uppercase">Passo {index + 1}</span>
              <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all ${
                item.status === 'collected' ? 'bg-green-500 border-green-500 rotate-12' : 'border-slate-200 group-hover:border-amber-400 group-hover:rotate-6'
              }`}>
                {item.status === 'collected' ? (
                  <i className="fas fa-check text-white text-xl"></i>
                ) : (
                  <i className={`fas fa-paperclip text-slate-300 group-hover:text-amber-500 transition-colors`}></i>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h4 className={`font-black text-xl ${item.status === 'collected' ? 'text-green-800 line-through' : 'text-slate-900'}`}>
                  {item.title}
                </h4>
                {item.importance === 'high' && !item.status && (
                  <span className="bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-red-500/30">
                    Alta Prioridade
                  </span>
                )}
              </div>
              <p className={`text-slate-600 leading-relaxed max-w-2xl ${item.status === 'collected' ? 'opacity-40' : ''}`}>
                {item.description}
              </p>
            </div>

            {/* Background design element */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <i className="fas fa-file-contract text-8xl -rotate-12"></i>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-12 flex flex-col lg:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 w-24 h-24 bg-amber-500 rounded-[2rem] flex items-center justify-center text-4xl text-white shadow-2xl rotate-3">
          <i className="fas fa-paper-plane"></i>
        </div>
        <div className="relative z-10 flex-1 text-center lg:text-left">
          <h3 className="text-3xl font-black text-white mb-3">Tudo pronto para o envio?</h3>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">
            Ao finalizar, seu dossiê completo será empacotado e preparado para a revisão técnica do seu advogado de confiança.
          </p>
        </div>
        <button 
          onClick={onFinish}
          disabled={progress < 100}
          className={`relative z-10 px-10 py-5 rounded-2xl font-black transition-all shadow-2xl whitespace-nowrap text-lg ${
            progress === 100 
              ? 'bg-amber-500 text-white hover:bg-amber-600 hover:scale-105 active:scale-95' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {progress === 100 ? 'Finalizar e Enviar para o Advogado' : 'Complete o Checklist Primeiro'}
        </button>
      </div>
    </div>
  );
};

export default EvidenceGathering;
