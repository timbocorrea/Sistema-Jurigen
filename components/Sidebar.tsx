
import React from 'react';
import { CaseStep } from '../types';

interface SidebarProps {
  currentStep: CaseStep;
  onNavigate: (step: CaseStep) => void;
  isProcessing: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentStep, onNavigate, isProcessing }) => {
  const menuItems = [
    { id: CaseStep.INITIAL_FACTS, label: 'Relato dos Fatos', icon: 'fa-align-left' },
    { id: CaseStep.DOCUMENT_UPLOAD, label: 'Upload de Provas', icon: 'fa-file-import' },
    { id: CaseStep.AI_ANALYSIS, label: 'Análise de IA', icon: 'fa-microchip' },
    { id: CaseStep.DOSSIER_REVIEW, label: 'Dossiê Jurídico', icon: 'fa-gavel' },
    { id: CaseStep.EVIDENCE_GATHERING, label: 'Checklist de Juntada', icon: 'fa-list-check' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-full flex flex-col p-4">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-amber-500 p-2 rounded-lg">
          <i className="fas fa-scale-balanced text-xl"></i>
        </div>
        <h1 className="text-xl font-bold tracking-tight">JuriGen</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            disabled={isProcessing}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              currentStep === item.id 
                ? 'bg-amber-500 text-white shadow-lg' 
                : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800 px-2">
        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Status do Caso</p>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-sm text-slate-300">Sincronizado</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
