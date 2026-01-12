
import { supabase } from './supabaseClient';
import { Dossier, EvidenceItem } from '../types';

export const dossierService = {
    // Create a new dossier record
    async createDossier(dossier: Dossier) {
        const { data, error } = await supabase
            .from('dossiers')
            .insert([
                {
                    title: dossier.title,
                    summary: dossier.summary,
                    legal_analysis: dossier.legalAnalysis,
                    risk_assessment: dossier.riskAssessment,
                    facts_timeline: dossier.factsTimeline,
                    extracted_entities: dossier.extractedEntities,
                    strategic_links: dossier.strategicLinks
                }
            ])
            .select()
            .single();

        if (error) throw error;

        // Insert evidence items linked to this dossier
        if (dossier.suggestedEvidence && dossier.suggestedEvidence.length > 0) {
            const evidenceToInsert = dossier.suggestedEvidence.map(item => ({
                dossier_id: data.id,
                title: item.title,
                description: item.description,
                status: item.status,
                importance: item.importance
            }));

            const { error: evidenceError } = await supabase
                .from('evidence_items')
                .insert(evidenceToInsert);

            if (evidenceError) throw evidenceError;
        }

        return data;
    },

    // Get the most recent dossier (for simple persistence)
    async getLatestDossier(): Promise<Dossier | null> {
        const { data, error } = await supabase
            .from('dossiers')
            .select(`
        *,
        evidence_items (*)
      `)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // No rows found
            throw error;
        }

        // Map back to TypeScript interface
        return {
            title: data.title,
            summary: data.summary,
            legalAnalysis: data.legal_analysis,
            riskAssessment: data.risk_assessment,
            factsTimeline: data.facts_timeline,
            extractedEntities: data.extracted_entities,
            strategicLinks: data.strategic_links,
            suggestedEvidence: data.evidence_items.map((item: any) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                status: item.status,
                importance: item.importance
            }))
        };
    }
};
