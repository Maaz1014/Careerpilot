'use server';

/**
 * @fileOverview Provides real-time market insights for job roles.
 *
 * - getMarketInsights - A function that returns market trends, skills, and salary info.
 * - MarketInsightsInput - The input type for the getMarketInsights function.
 * - MarketInsightsOutput - The return type for the getMarketInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MarketInsightsInputSchema = z.object({
  jobTitle: z.string().describe('The job title the user is interested in.'),
  location: z.string().describe('The city or region for the job market analysis.'),
});
export type MarketInsightsInput = z.infer<typeof MarketInsightsInputSchema>;

const MarketInsightsOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the current market for the specified role.'),
  inDemandSkills: z
    .array(
      z.object({
        skill: z.string().describe('The name of the in-demand skill.'),
        reason: z.string().describe('A brief explanation of why this skill is in demand.'),
      })
    )
    .describe('A list of the top 5 most in-demand skills for this role.'),
  salaryBenchmark: z
    .object({
      low: z.number().describe('The lower end of the typical salary range.'),
      high: z.number().describe('The higher end of the typical salary range.'),
      currency: z.string().describe('The currency for the salary, e.g., USD.'),
    })
    .describe('An estimated salary benchmark for the role in the specified location.'),
  trendingRoles: z
    .array(z.string())
    .describe('A list of 3-4 related or emerging job titles in this field.'),
});
export type MarketInsightsOutput = z.infer<typeof MarketInsightsOutputSchema>;

export async function getMarketInsights(input: MarketInsightsInput): Promise<MarketInsightsOutput> {
  return marketInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketInsightsPrompt',
  input: { schema: MarketInsightsInputSchema },
  output: { schema: MarketInsightsOutputSchema },
  prompt: `You are a world-class career analyst and market research expert. Your task is to provide detailed market insights for a specific job role and location.

  The user is interested in the following role:
  **Job Title:** {{{jobTitle}}}
  **Location:** {{{location}}}

  Based on your extensive knowledge of the current job market, please provide the following information:
  1.  **Summary:** A brief, insightful overview of the job market for this role in the specified location.
  2.  **In-Demand Skills:** Identify the top 5 most critical and in-demand skills. For each skill, provide a short reason why it's important.
  3.  **Salary Benchmark:** Provide an estimated annual salary range (low and high) for this role in the given location. Use the local currency.
  4.  **Trending Roles:** List 3-4 related or emerging job titles that someone with this skill set might also consider.

  Your analysis should be realistic, current, and data-driven based on your training data. Do not invent wildly inaccurate data. Present the information clearly and concisely.
  `,
});

const marketInsightsFlow = ai.defineFlow(
  {
    name: 'marketInsightsFlow',
    inputSchema: MarketInsightsInputSchema,
    outputSchema: MarketInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
