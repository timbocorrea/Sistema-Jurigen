
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import StepFacts from './components/StepFacts';
import StepUpload from './components/StepUpload';
import StepAnalysis from './components/StepAnalysis';
import DossierView from './components/DossierView';
import EvidenceGathering from './components/EvidenceGathering';
import LegalChatbot from './components/LegalChatbot';
import { CaseStep, FileData, Dossier } from './types';
import { analyzeDocumentsAndFacts } from './services/geminiService';
import { dossierService } from './services/dossierService';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<CaseStep>(CaseStep.INITIAL_FACTS);
  const [facts, setFacts] = useState('');
  const [files, setFiles] = useState<FileData[]>([]);
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load latest dossier on mount
  React.useEffect(() => {
    const loadDossier = async () => {
      try {
        const savedDossier = await dossierService.getLatestDossier();
        if (savedDossier) {
          setDossier(savedDossier);
          // Optional: Prompt user or auto-navigate? For now just load state.
          console.log("Dossier loaded from Supabase");
        }
      } catch (error) {
        console.error("Error loading dossier:", error);
      }
    };
    loadDossier();
  }, []);

  const handleNavigate = (step: CaseStep) => {
    // Basic guard: don't navigate if processing or if trying to see dossier without generation
    if (isProcessing) return;
    if ((step === CaseStep.DOSSIER_REVIEW || step === CaseStep.EVIDENCE_GATHERING) && !dossier) return;
    setCurrentStep(step);
  };

  const handleFactsChange = (val: string) => setFacts(val);

  const handleFileUpload = (newFiles: FileData[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileRemove = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const startAnalysis = async () => {
    setIsProcessing(true);
    setCurrentStep(CaseStep.AI_ANALYSIS);

    try {
      const result = await analyzeDocumentsAndFacts(facts, files);

      // Save to Supabase
      try {
        await dossierService.createDossier(result);
        console.log("Dossier saved to Supabase");
      } catch (saveError) {
        console.error("Failed to save dossier to Supabase:", saveError);
        alert("Atenção: O dossiê foi gerado mas não pôde ser salvo no banco de dados.");
      }

      setDossier(result);
      setCurrentStep(CaseStep.DOSSIER_REVIEW);
    } catch (err) {
      console.error("Analysis failed", err);
      setCurrentStep(CaseStep.DOCUMENT_UPLOAD); // fallback
    } finally {
      setIsProcessing(false);
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case CaseStep.INITIAL_FACTS:
        return (
          <StepFacts
            facts={facts}
            files={files}
            onChange={handleFactsChange}
            onUpload={handleFileUpload}
            onRemove={handleFileRemove}
            onNext={() => setCurrentStep(CaseStep.DOCUMENT_UPLOAD)}
          />
        );
      case CaseStep.DOCUMENT_UPLOAD:
        return (
          <StepUpload
            files={files}
            onUpload={handleFileUpload}
            onRemove={handleFileRemove}
            onNext={startAnalysis}
            onBack={() => setCurrentStep(CaseStep.INITIAL_FACTS)}
          />
        );
      case CaseStep.AI_ANALYSIS:
        return <StepAnalysis />;
      case CaseStep.DOSSIER_REVIEW:
        return dossier ? (
          <DossierView
            dossier={dossier}
            onNext={() => setCurrentStep(CaseStep.EVIDENCE_GATHERING)}
          />
        ) : null;
      case CaseStep.EVIDENCE_GATHERING:
        return dossier ? (
          <EvidenceGathering
            evidence={dossier.suggestedEvidence}
            onFinish={() => alert("Dossiê enviado com sucesso para análise jurídica profissional!")}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        currentStep={currentStep}
        onNavigate={handleNavigate}
        isProcessing={isProcessing}
      />

      <main className="flex-1 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-medium">Fluxo do Caso</span>
            <i className="fas fa-chevron-right text-xs text-slate-300"></i>
            <span className="text-slate-900 font-bold">{currentStep.replace('_', ' ')}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex -space-x-2">
              <img className="w-8 h-8 rounded-full border-2 border-white" src="https://picsum.photos/32/32?1" alt="lawyer" />
              <div className="w-8 h-8 rounded-full border-2 border-white bg-amber-500 flex items-center justify-center text-[10px] text-white font-bold">IA</div>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <i className="fas fa-bell"></i>
            </button>
          </div>
        </header>

        <div className="h-[calc(100vh-64px)] overflow-y-auto px-10">
          {renderContent()}
        </div>
      </main>

      <LegalChatbot />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default App;
