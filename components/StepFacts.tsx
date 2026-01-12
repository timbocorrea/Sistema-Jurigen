
import React, { useState, useRef } from 'react';
import { transcribeAudio } from '../services/geminiService';
import { FileData } from '../types';

interface StepFactsProps {
  facts: string;
  files: FileData[];
  onChange: (val: string) => void;
  onUpload: (files: FileData[]) => void;
  onRemove: (id: string) => void;
  onNext: () => void;
}

const StepFacts: React.FC<StepFactsProps> = ({ facts, files, onChange, onUpload, onRemove, onNext }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          try {
            const transcription = await transcribeAudio(base64);
            onChange(facts + (facts ? '\n' : '') + transcription);
          } catch (err) {
            console.error("Transcription failed", err);
          } finally {
            setIsRecording(false);
          }
        };
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing mic", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
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
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Relato Inicial dos Fatos</h2>
        <p className="text-slate-600">Descreva o que aconteceu em detalhes. Você pode digitar, ditar ou anexar arquivos relevantes (documentos, fotos, áudios) para fundamentar seu relato.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-1 bg-slate-50 border-b flex justify-between items-center px-4 py-2">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase">Editor de Caso</span>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all text-sm font-medium"
            >
              <i className="fas fa-paperclip"></i>
              Anexar Arquivos
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              multiple 
              className="hidden" 
              onChange={handleFileChange}
              accept="image/*,audio/*,.pdf,.doc,.docx,.txt"
            />
          </div>
          <button 
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
              isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            <i className="fas fa-microphone"></i>
            <span className="text-sm font-medium">{isRecording ? 'Gravando...' : 'Segure para Falar'}</span>
          </button>
        </div>
        <textarea
          value={facts}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Comece descrevendo os fatos aqui... Ex: 'No dia 15 de março, fui demitido sem justa causa logo após retornar de licença médica...'"
          className="w-full h-80 p-6 focus:outline-none text-slate-700 resize-none text-lg leading-relaxed"
        />
      </div>

      {files.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Anexos Iniciais ({files.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {files.map(file => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="text-amber-500 flex-shrink-0">
                    {file.category === 'image' && <i className="fas fa-image"></i>}
                    {file.category === 'document' && <i className="fas fa-file-lines"></i>}
                    {file.category === 'audio' && <i className="fas fa-volume-high"></i>}
                    {file.category === 'video' && <i className="fas fa-video"></i>}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-700 truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{file.category}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onRemove(file.id)} 
                  className="text-slate-300 hover:text-red-500 p-2 transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={!facts.trim() && files.length === 0}
          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
        >
          Próximo Passo
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default StepFacts;
