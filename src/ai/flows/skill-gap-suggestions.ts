'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting skills to develop based on a user's profile and desired job roles.
 *
 * - suggestSkills - A function that suggests skills based on the user's profile.
 * - SuggestSkillsInput - The input type for the suggestSkills function.
 * - SuggestSkillsOutput - The return type for the suggestSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSkillsInputSchema = z.object({
  personalInfo: z.string().describe('Personal information of the user.'),
  education: z.string().describe('Educational background of the user.'),
  experience: z.string().describe('Work experience of the user.'),
  skills: z.string().describe('Skills of the user.'),
  certifications: z.string().describe('Certifications of the user.'),
  projects: z.string().describe('Projects of the user.'),
  desiredJobRoles: z.string().describe('Desired job roles of the user.'),
});
export type SuggestSkillsInput = z.infer<typeof SuggestSkillsInputSchema>;

const SuggestSkillsOutputSchema = z.object({
  suggestedSkills: z.array(z.string()).describe('An array of suggested skills to develop.'),
  reasoning: z.string().describe('The reasoning behind the skill suggestions.'),
});
export type SuggestSkillsOutput = z.infer<typeof SuggestSkillsOutputSchema>;

export async function suggestSkills(input: SuggestSkillsInput): Promise<SuggestSkillsOutput> {
  return suggestSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSkillsPrompt',
  input: {schema: SuggestSkillsInputSchema},
  output: {schema: SuggestSkillsOutputSchema},
  prompt: `You are a career advisor who specializes in identifying skill gaps and suggesting skills to develop for career advancement.

  Based on the user's profile and desired job roles, provide a list of skills that the user should develop to improve their career prospects. Also, provide a reasoning behind the skill suggestions.

  User Profile:
  Personal Information: {{{personalInfo}}}
  Education: {{{education}}}
  Experience: {{{experience}}}
  Skills: {{{skills}}}
  Certifications: {{{certifications}}}
  Projects: {{{projects}}}

  Desired Job Roles: {{{desiredJobRoles}}}

  Suggested Skills:`,
});

const suggestSkillsFlow = ai.defineFlow(
  {
    name: 'suggestSkillsFlow',
    inputSchema: SuggestSkillsInputSchema,
    outputSchema: SuggestSkillsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
