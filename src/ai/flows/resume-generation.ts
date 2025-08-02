'use server';

/**
 * @fileOverview Resume generation AI agent.
 *
 * - generateResume - A function that handles the resume generation process.
 * - GenerateResumeInput - The input type for the generateResume function.
 * - GenerateResumeOutput - The return type for the generateResume function.
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

const GenerateResumeInputSchema = z.object({
  personalInfo: PersonalInfoSchema.describe('Personal information of the person.'),
  education: z.array(EducationSchema).describe('Educational background of the person.'),
  experience: z.array(ExperienceSchema).describe('Work experience of the person.'),
  skills: z.array(SkillSchema).describe('Skills of the person.'),
  certifications: z.array(CertificationSchema).optional().describe('Certifications of the person.'),
  projects: z.array(ProjectSchema).optional().describe('Projects of the person.'),
});

export type GenerateResumeInput = z.infer<typeof GenerateResumeInputSchema>;

const GenerateResumeOutputSchema = z.object({
  resume: z.string().describe('The generated resume in a readable format.'),
});

export type GenerateResumeOutput = z.infer<typeof GenerateResumeOutputSchema>;

export async function generateResume(input: GenerateResumeInput): Promise<GenerateResumeOutput> {
  return generateResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resumePrompt',
  input: {schema: GenerateResumeInputSchema},
  output: {schema: GenerateResumeOutputSchema},
  prompt: `You are a professional resume writer. Please create a compelling and professional resume based on the following information:

Personal Information:
Name: {{{personalInfo.name}}}
Email: {{{personalInfo.email}}}
Phone: {{{personalInfo.phone}}}
LinkedIn: {{#if personalInfo.linkedin}}{{{personalInfo.linkedin}}}{{else}}N/A{{/if}}
GitHub: {{#if personalInfo.github}}{{{personalInfo.github}}}{{else}}N/A{{/if}}
Location: {{{personalInfo.location}}}

Education:
{{#each education}}
Institution: {{{institution}}}
Degree: {{{degree}}}, {{{major}}}
Graduation Date: {{{graduationDate}}}
Description: {{{description}}}
{{/each}}

Experience:
{{#each experience}}
Company: {{{company}}}
Title: {{{title}}}
Start Date: {{{startDate}}}
End Date: {{#if endDate}}{{{endDate}}}{{else}}Present{{/if}}
Description: {{{description}}}
{{/each}}

Skills:
{{#each skills}}
- {{{name}}}
{{/each}}

Certifications:
{{#each certifications}}
Name: {{{name}}}
Issuing Organization: {{{issuingOrganization}}}
Issue Date: {{{issueDate}}}
Expiration Date: {{#if expirationDate}}{{{expirationDate}}}{{else}}N/A{{/if}}
{{/each}}

Projects:
{{#each projects}}
Name: {{{name}}}
Description: {{{description}}}
Link: {{#if link}}{{{link}}}{{else}}N/A{{/if}}
{{/each}}
`,
});

const generateResumeFlow = ai.defineFlow(
  {
    name: 'generateResumeFlow',
    inputSchema: GenerateResumeInputSchema,
    outputSchema: GenerateResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
