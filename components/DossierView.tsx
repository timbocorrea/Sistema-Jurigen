
import React from 'react';
import { Dossier, ExtractedEntity } from '../types';

interface DossierViewProps {
  dossier: Dossier;
  onNext: () => void;
}

const DossierView: React.FC<DossierViewProps> = ({ dossier, onNext }) => {
  const getEntityIcon = (type: ExtractedEntity['type']) => {
    switch (type) {
      case 'DATE': return 'fa-calendar-days';
      case 'NAME': return 'fa-user-tie';
      case 'VALUE': return 'fa-coins';
      case 'CLAUSE': return 'fa-file-signature';
      default: return 'fa-info-circle';
    }
  };

  const getEntityColor = (type: ExtractedEntity['type']) => {
    switch (type) {
      case 'DATE': return 'text-blue-500 bg-blue-50';
      case 'NAME': return 'text-purple-500 bg-purple-50';
      case 'VALUE': return 'text-green-500 bg-green-50';
      case 'CLAUSE': return 'text-amber-500 bg-amber-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{dossier.title || 'Dossiê Jurídico Preliminar'}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">AI Intelligence</span>
            <p className="text-slate-500 text-xs font-medium italic">Sincronizado com os fatos e documentos fornecidos</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-sm">
            <i className="fas fa-print"></i>
            Imprimir
          </button>
          <button
            onClick={onNext}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
          >
            Ver Guia de Provas
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar pb-24">
        
        {/* Sumário e Inteligência de Documentos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
              Resumo Estratégico
            </h3>
            <p className="text-slate-700 leading-relaxed text-lg">{dossier.summary}</p>
          </section>

          <section className="bg-slate-900 text-white rounded-2xl p-8 shadow-lg border border-slate-800">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <i className="fas fa-microchip text-amber-500"></i>
              Document Intelligence
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {dossier.extractedEntities?.map((entity, idx) => (
                <div key={idx} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] ${getEntityColor(entity.type)}`}>
                      <i className={`fas ${getEntityIcon(entity.type)}`}></i>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{entity.type}</span>
                  </div>
                  <p className="font-bold text-sm text-slate-100">{entity.value}</p>
                  <p className="text-[10px] text-slate-500 mt-1 italic leading-tight">{entity.context}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Conexões Estratégicas e Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <i className="fas fa-link text-amber-500"></i>
              Conexões Probatórias
            </h3>
            <div className="space-y-4">
              {dossier.strategicLinks?.map((link, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-700">Conexão Identificada</span>
                    <span className={`text-[10px] font-bold uppercase ${link.strength === 'strong' ? 'text-green-600' : 'text-amber-600'}`}>
                      {link.strength === 'strong' ? 'Força Alta' : 'Força Média'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 mb-1 italic">"{link.fact}"</p>
                  <div className="flex items-center gap-2 text-slate-500">
                    <i className="fas fa-arrow-turn-up rotate-90 text-xs"></i>
                    <p className="text-xs font-medium">Comprovado por: <span className="text-amber-600">{link.evidence}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <i className="fas fa-clock text-amber-500"></i>
              Timeline dos Fatos
            </h3>
            <div className="relative space-y-8 before:content-[''] before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {dossier.factsTimeline.map((fact, idx) => (
                <div key={idx} className="relative pl-10">
                  <div className="absolute left-0 top-1 w-7 h-7 bg-white border-2 border-amber-500 rounded-full flex items-center justify-center z-10 shadow-sm">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">{fact}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Análise Técnica e Risco */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fas fa-book-scale text-amber-500"></i>
              Enquadramento Jurídico
            </h3>
            <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {dossier.legalAnalysis}
            </div>
          </section>

          <section className="bg-red-50 rounded-2xl p-8 border border-red-100">
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
              <i className="fas fa-triangle-exclamation"></i>
              Pontos de Atenção e Riscos
            </h3>
            <p className="text-red-900/80 text-sm leading-relaxed font-medium">{dossier.riskAssessment}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DossierView;
