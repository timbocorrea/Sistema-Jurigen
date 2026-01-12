
export enum CaseStep {
  INITIAL_FACTS = 'INITIAL_FACTS',
  DOCUMENT_UPLOAD = 'DOCUMENT_UPLOAD',
  AI_ANALYSIS = 'AI_ANALYSIS',
  DOSSIER_REVIEW = 'DOSSIER_REVIEW',
  EVIDENCE_GATHERING = 'EVIDENCE_GATHERING'
}

export interface FileData {
  id: string;
  name: string;
  type: string;
  base64: string;
  category: 'document' | 'image' | 'video' | 'audio';
  analysis?: string;
}

export interface ExtractedEntity {
  type: 'DATE' | 'NAME' | 'VALUE' | 'CLAUSE';
  value: string;
  context: string;
}

export interface StrategicLink {
  fact: string;
  evidence: string;
  strength: 'strong' | 'moderate' | 'weak';
}

export interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'collected';
  importance: 'high' | 'medium' | 'low';
}

export interface Dossier {
  title: string;
  summary: string;
  legalAnalysis: string;
  factsTimeline: string[];
  suggestedEvidence: EvidenceItem[];
  riskAssessment: string;
  extractedEntities: ExtractedEntity[];
  strategicLinks: StrategicLink[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
