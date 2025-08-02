'use server';

/**
 * @fileOverview A cover letter generation AI agent.
 *
 * - generateCoverLetter - A function that handles the cover letter generation process.
 * - GenerateCoverLetterInput - The input type for the generateCoverLetter function.
 * - GenerateCoverLetterOutput - The return type for the generateCoverLetter function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
    PersonalInfoSchema,
    EducationSchema,
    ExperienceSchema,
    SkillSchema,
    CertificationSchema,
    ProjectSchema,
} from './schemas';

const GenerateCoverLetterInputSchema = z.object({
  personalInfo: PersonalInfoSchema,
  education: z.array(EducationSchema),
  experience: z.array(ExperienceSchema),
  skills: z.array(SkillSchema),
  certifications: z.array(CertificationSchema).optional(),
  projects: z.array(ProjectSchema).optional(),
  jobTitle: z.string().describe('The job title the user is applying for.'),
  tone: z.enum(['formal', 'creative', 'enthusiastic', 'professional']).describe('The desired tone of the cover letter.'),
});
export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter text.'),
});
export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;

export async function generateCoverLetter(input: GenerateCoverLetterInput): Promise<GenerateCoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCoverLetterPrompt',
  input: { schema: GenerateCoverLetterInputSchema },
  output: { schema: GenerateCoverLetterOutputSchema },
  prompt: `You are an expert career coach and professional writer. Your task is to write a compelling, personalized cover letter for a job application. The user will provide their resume information, the job title they are applying for, and the desired tone.

  **Tone:** {{{tone}}}
  **Job Title:** {{{jobTitle}}}

  Base the cover letter on the following resume information:

  **Personal Information:**
  Name: {{{personalInfo.name}}}
  Email: {{{personalInfo.email}}}
  Phone: {{{personalInfo.phone}}}
  LinkedIn: {{#if personalInfo.linkedin}}{{{personalInfo.linkedin}}}{{else}}N/A{{/if}}
  GitHub: {{#if personalInfo.github}}{{{personalInfo.github}}}{{else}}N/A{{/if}}
  Location: {{{personalInfo.location}}}

  **Experience:**
  {{#each experience}}
  - **{{title}} at {{company}}** ({{startDate}} - {{endDate}}): {{description}}
  {{/each}}

  **Education:**
  {{#each education}}
  - {{degree}} in {{major}} from {{institution}}
  {{/each}}

  **Key Skills:**
  {{#each skills}}
  - {{name}}
  {{/each}}

  **Projects:**
  {{#each projects}}
  - **{{name}}**: {{description}}
  {{/each}}

  Instructions:
  1. Start with a strong opening that grabs the reader's attention and clearly states the position being applied for.
  2. Highlight 2-3 of the most relevant experiences or projects from the resume that align with the specified job title.
  3. Weave in key skills naturally throughout the body of the letter.
  4. Maintain the specified '{{{tone}}}' throughout the letter.
  5. End with a strong closing statement that reiterates interest and includes a call to action.
  6. The cover letter should be concise, professional, and tailored specifically to the job title. Do not invent a company name to apply to.
  `,
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
