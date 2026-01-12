
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { FileData, Dossier } from "../types";

// Always use process.env.API_KEY directly in the named parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper for Base64 cleaning
const cleanBase64 = (b64: string) => b64.split(',')[1] || b64;

export const analyzeDocumentsAndFacts = async (
  facts: string,
  files: FileData[]
): Promise<Dossier> => {
  const model = 'gemini-3-pro-preview';
  
  const fileParts = files.map(file => ({
    inlineData: {
      data: cleanBase64(file.base64),
      mimeType: file.type
    }
  }));

  const prompt = `Analise profundamente os seguintes fatos e documentos jurídicos para gerar um dossiê técnico de alta precisão.
  
  Fatos relatados: ${facts}
  
  Sua análise deve:
  1. Extrair entidades críticas: Datas, Nomes de Partes, Valores Monetários e Cláusulas Importantes encontradas nos documentos.
  2. Estabelecer conexões estratégicas entre o relato do usuário e as provas anexadas.
  3. Sugerir quais novas provas são fundamentais para cobrir lacunas no caso.

  Gere um objeto JSON contendo:
  - title: Título formal.
  - summary: Resumo executivo.
  - legalAnalysis: Análise técnica das teses.
  - factsTimeline: Lista cronológica de eventos.
  - riskAssessment: Avaliação de riscos.
  - extractedEntities: Lista de objetos {type: 'DATE'|'NAME'|'VALUE'|'CLAUSE', value: string, context: string}.
  - strategicLinks: Lista de objetos {fact: string, evidence: string, strength: 'strong'|'moderate'|'weak'}.
  - suggestedEvidence: Checklist para o usuário {id, title, description, status: 'pending', importance: 'high'|'medium'|'low'}.`;

  const response = await ai.models.generateContent({
    model,
    contents: { 
      parts: [
        ...fileParts, 
        { text: prompt }
      ] 
    },
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          legalAnalysis: { type: Type.STRING },
          factsTimeline: { type: Type.ARRAY, items: { type: Type.STRING } },
          riskAssessment: { type: Type.STRING },
          extractedEntities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                value: { type: Type.STRING },
                context: { type: Type.STRING }
              }
            }
          },
          strategicLinks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                fact: { type: Type.STRING },
                evidence: { type: Type.STRING },
                strength: { type: Type.STRING }
              }
            }
          },
          suggestedEvidence: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                status: { type: Type.STRING },
                importance: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const transcribeAudio = async (base64Audio: string): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data: cleanBase64(base64Audio), mimeType: 'audio/webm' } },
        { text: "Transcreva fielmente este áudio jurídico." }
      ]
    }
  });
  return response.text || '';
};

export const quickChat = async (history: { role: 'user' | 'model', text: string }[], message: string): Promise<string> => {
  const model = 'gemini-3-pro-preview';
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: 'Você é um assistente jurídico especializado em triagem de casos. Ajude o usuário a entender seu dossiê e quais provas faltam. Seja formal e objetivo.',
    }
  });
  
  const response = await chat.sendMessage({ message });
  return response.text || '';
};
