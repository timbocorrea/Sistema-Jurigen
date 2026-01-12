
import React from 'react';
import { FileData } from '../types';

interface StepUploadProps {
  files: FileData[];
  onUpload: (files: FileData[]) => void;
  onRemove: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepUpload: React.FC<StepUploadProps> = ({ files, onUpload, onRemove, onNext, onBack }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    // Explicitly type 'file' as File to fix property 'type' and 'name' does not exist on type 'unknown' errors.
    Array.from(e.target.files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        let category: FileData['category'] = 'document';
        if (file.type.startsWith('image/')) category = 'image';
        if (file.type.startsWith('video/')) category = 'video';
        if (file.type.startsWith('audio/')) category = 'audio';

        onUpload([{
          id: Math.random().toString(36).substring(2, 11),
          name: file.name,
          type: file.type,
          base64,
          category
        }]);
      };
      // File is now correctly typed as File, which extends Blob, resolving the readAsDataURL error.
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Upload de Evidências</h2>
        <p className="text-slate-600">Envie contratos, recibos, fotos, vídeos ou áudios que comprovem seus relatos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <label className="border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-all">
          <input type="file" multiple className="hidden" onChange={handleFileChange} />
          <div className="bg-amber-100 text-amber-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-cloud-arrow-up text-2xl"></i>
          </div>
          <p className="text-lg font-bold text-slate-700">Clique para selecionar arquivos</p>
          <p className="text-sm text-slate-500 mt-1">PDF, JPG, PNG, MP4, MP3</p>
        </label>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-paperclip text-amber-500"></i>
            Arquivos Selecionados ({files.length})
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {files.length === 0 ? (
              <p className="text-slate-400 text-sm italic">Nenhum arquivo enviado ainda.</p>
            ) : (
              files.map(file => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="text-slate-400">
                      {file.category === 'image' && <i className="fas fa-image"></i>}
                      {file.category === 'document' && <i className="fas fa-file-pdf"></i>}
                      {file.category === 'video' && <i className="fas fa-video"></i>}
                      {file.category === 'audio' && <i className="fas fa-microphone"></i>}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 truncate w-40">{file.name}</p>
                      <p className="text-xs text-slate-400 uppercase">{file.category}</p>
                    </div>
                  </div>
                  <button onClick={() => onRemove(file.id)} className="text-slate-400 hover:text-red-500 p-2">
                    <i className="fas fa-trash-can"></i>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-700 px-6 py-3 font-bold flex items-center gap-2">
          <i className="fas fa-arrow-left"></i>
          Voltar
        </button>
        <button
          onClick={onNext}
          className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
        >
          Gerar Dossiê Inteligente
          <i className="fas fa-wand-magic-sparkles"></i>
        </button>
      </div>
    </div>
  );
};

export default StepUpload;
