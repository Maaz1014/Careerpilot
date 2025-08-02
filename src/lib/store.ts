import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ResumeData } from '@/lib/types';
import { SuggestSkillsOutput } from '@/ai/flows/skill-gap-suggestions';
import { ScoreResumeOutput } from '@/ai/flows/resume-scorer';

interface ResumeState {
  data: Partial<ResumeData>;
  generatedResume: string | null;
  skillSuggestions: SuggestSkillsOutput | null;
  resumeScore: ScoreResumeOutput | null;
  template: 'modern' | 'classic';
  setData: (data: Partial<ResumeData>) => void;
  setGeneratedResume: (resume: string | null) => void;
  setSkillSuggestions: (suggestions: SuggestSkillsOutput | null) => void;
  setResumeScore: (score: ScoreResumeOutput | null) => void;
  setTemplate: (template: 'modern' | 'classic') => void;
  reset: () => void;
}

const initialState = {
    data: {
        personalInfo: undefined,
        education: [],
        experience: [],
        skills: [],
        certifications: [],
        projects: [],
        desiredJobRoles: '',
    },
    generatedResume: null,
    skillSuggestions: null,
    resumeScore: null,
    template: 'modern' as const,
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      ...initialState,
      setData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
      setGeneratedResume: (resume) => set({ generatedResume: resume }),
      setSkillSuggestions: (suggestions) => set({ skillSuggestions: suggestions }),
      setResumeScore: (score) => set({ resumeScore: score }),
      setTemplate: (template) => set({ template }),
      reset: () => set(initialState),
    }),
    {
      name: 'career-pilot-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
