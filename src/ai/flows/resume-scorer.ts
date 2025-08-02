'use server';

/**
 * @fileOverview A resume scoring AI agent.
 *
 * - scoreResume - A function that handles the resume scoring process.
 * - ScoreResumeInput - The input type for the scoreResume function.
 * - ScoreResumeOutput - The return type for the scoreResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
    PersonalInfoSchema,
    EducationSchema,
    ExperienceSchema,
    SkillSchema,
    CertificationSchema,
    ProjectSchema,
} from './schemas';

const ScoreResumeInputSchema = z.object({
  personalInfo: PersonalInfoSchema,
  education: z.array(EducationSchema),
  experience: z.array(ExperienceSchema),
  skills: z.array(SkillSchema),
  certifications: z.array(CertificationSchema).optional(),
  projects: z.array(ProjectSchema).optional(),
  desiredJobRoles: z.string().optional(),
});
export type ScoreResumeInput = z.infer<typeof ScoreResumeInputSchema>;

const ScoreResumeOutputSchema = z.object({
  score: z.number().min(0).max(100).describe('A score from 0 to 100 for the resume.'),
  feedback: z.array(z.string()).describe('Actionable feedback points to improve the resume.'),
});
export type ScoreResumeOutput = z.infer<typeof ScoreResumeOutputSchema>;


export async function scoreResume(input: ScoreResumeInput): Promise<ScoreResumeOutput> {
  return scoreResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scoreResumePrompt',
  input: {schema: ScoreResumeInputSchema},
  output: {schema: ScoreResumeOutputSchema},
  prompt: `You are a world-class career coach and resume expert. Your task is to analyze the provided resume data and give it a score from 0 to 100. You must also provide specific, actionable feedback on how to improve it.

  Scoring Criteria:
  - **Clarity and Conciseness:** Is the information easy to read and understand?
  - **Impact and Action Verbs:** Does the experience section use strong action verbs and quantify achievements?
  - **Relevance:** Is the information relevant to the desired job roles (if provided)?
  - **Completeness:** Are all key sections (Experience, Education, Skills) well-filled?
  - **Skills Section:** Does the skills section list relevant and valuable skills?

  Based on these criteria, evaluate the following resume data:

  **Desired Job Roles:** {{{desiredJobRoles}}}

  **Personal Info:**
  Name: {{{personalInfo.name}}}
  Contact: {{{personalInfo.email}}}, {{{personalInfo.phone}}}

  **Experience:**
  {{#each experience}}
  - **{{title}} at {{company}}** ({{startDate}} - {{endDate}})
    {{description}}
  {{/each}}

  **Education:**
  {{#each education}}
  - {{degree}} in {{major}} from {{institution}} (Graduated: {{graduationDate}})
  {{/each}}

  **Skills:**
  {{#each skills}}
  - {{name}}
  {{/each}}

  **Projects:**
  {{#each projects}}
  - **{{name}}**: {{description}}
  {{/each}}
  
  **Certifications:**
  {{#each certifications}}
    - **{{name}}** from {{issuingOrganization}}
  {{/each}}

  After analyzing, provide a score and a list of feedback points. The feedback should be constructive and help the user create a truly outstanding resume. Be specific in your suggestions.
`,
});

const scoreResumeFlow = ai.defineFlow(
  {
    name: 'scoreResumeFlow',
    inputSchema: ScoreResumeInputSchema,
    outputSchema: ScoreResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
