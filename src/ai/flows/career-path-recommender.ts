'use server';

/**
 * @fileOverview An AI-powered career path recommender.
 *
 * - recommendCareerPath: Generates a potential career roadmap based on a user's profile and goals.
 * - RecommendCareerPathInput - The input type for the recommendCareerPath function.
 * - RecommendCareerPathOutput - The return type for the recommendCareerPath function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  RecommendCareerPathInputSchema,
  RecommendCareerPathOutputSchema,
  type RecommendCareerPathInput,
  type RecommendCareerPathOutput,
} from './schemas';

export { type RecommendCareerPathInput, type RecommendCareerPathOutput };

export async function recommendCareerPath(input: RecommendCareerPathInput): Promise<RecommendCareerPathOutput> {
  return recommendCareerPathFlow(input);
}


const prompt = ai.definePrompt({
  name: 'recommendCareerPathPrompt',
  input: { schema: RecommendCareerPathInputSchema },
  output: { schema: RecommendCareerPathOutputSchema },
  prompt: `You are an expert career strategist and mentor for technology and business professionals. Your task is to analyze a user's resume and their desired career goals to create a realistic, actionable, and inspiring career roadmap.

  **User's Desired Career Goals:** {{{desiredJobRoles}}}

  **User's Current Profile:**
  - Experience: {{#each experience}}{{title}} at {{company}}; {{/each}}
  - Skills: {{#each skills}}{{name}}, {{/each}}
  - Education: {{#each education}}{{degree}} in {{major}}; {{/each}}

  **Instructions:**
  1.  **Analyze the Gap:** Based on the user's current profile and their stated goals, identify the key gaps in skills and experience.
  2.  **Create a 3-4 Step Roadmap:** Construct a logical career path with 3 to 4 distinct, sequential roles. The path should start from a role that is a reasonable next step from their current position and progress logically towards their ultimate goal.
  3.  **Define Each Step:** For each step in the roadmap, provide:
      - A clear **job title**.
      - An estimated **duration** (e.g., "1-2 years", "2-3 years").
      - A **summary** of the role's responsibilities and why it's a crucial step.
      - A list of the most important **skills to develop** in that role to prepare for the next step.
  4.  **Write an Overall Summary:** Provide a brief, encouraging summary of the entire career path, explaining how it logically connects the user's present to their future goals.

  Your tone should be that of a wise, experienced mentor: encouraging, strategic, and realistic.`,
});

const recommendCareerPathFlow = ai.defineFlow(
  {
    name: 'recommendCareerPathFlow',
    inputSchema: RecommendCareerPathInputSchema,
    outputSchema: RecommendCareerPathOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
