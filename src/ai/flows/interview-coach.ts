'use server';

/**
 * @fileOverview An AI-powered mock interview coach.
 *
 * - generateQuestions: Generates a list of interview questions for a job title.
 * - evaluateAnswer: Evaluates a user's answer to a specific question.
 * - summarizeInterview: Provides an overall score and summary for the entire interview.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Schema for generating questions
const GenerateQuestionsInputSchema = z.object({
  jobTitle: z.string().describe('The job title the user is interviewing for.'),
});
export type GenerateQuestionsInput = z.infer<typeof GenerateQuestionsInputSchema>;

const GenerateQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('A list of 5-7 relevant interview questions.'),
});
export type GenerateQuestionsOutput = z.infer<typeof GenerateQuestionsOutputSchema>;


// Schema for evaluating an answer
const FeedbackSchema = z.object({
    feedback: z.string().describe('Constructive, specific feedback on the user\'s answer.'),
    score: z.number().min(1).max(5).describe('A score from 1 to 5 on the quality of the answer.'),
});

const EvaluateAnswerInputSchema = z.object({
  jobTitle: z.string().describe('The job title for context.'),
  question: z.string().describe('The interview question that was asked.'),
  answer: z.string().describe("The user's answer to the question."),
});
export type EvaluateAnswerInput = z.infer<typeof EvaluateAnswerInputSchema>;

export type EvaluateAnswerOutput = z.infer<typeof FeedbackSchema>;


// Schema for summarizing the interview
const InterviewHistoryItemSchema = z.object({
    question: z.string(),
    answer: z.string(),
    feedback: FeedbackSchema,
});

const SummarizeInterviewInputSchema = z.object({
    jobTitle: z.string().describe('The job title for context.'),
    interviewHistory: z.array(InterviewHistoryItemSchema).describe('The full history of the interview session.'),
});
export type SummarizeInterviewInput = z.infer<typeof SummarizeInterviewInputSchema>;

const SummarizeInterviewOutputSchema = z.object({
    overallScore: z.number().min(0).max(100).describe('An overall score for the interview from 0 to 100.'),
    summary: z.string().describe('A summary of the user\'s performance, highlighting strengths and weaknesses.'),
    suggestions: z.array(z.string()).describe('A list of actionable suggestions for improvement.'),
});
export type SummarizeInterviewOutput = z.infer<typeof SummarizeInterviewOutputSchema>;


// Exported functions
export async function generateQuestions(input: GenerateQuestionsInput): Promise<GenerateQuestionsOutput> {
  return generateQuestionsFlow(input);
}

export async function evaluateAnswer(input: EvaluateAnswerInput): Promise<EvaluateAnswerOutput> {
  return evaluateAnswerFlow(input);
}

export async function summarizeInterview(input: SummarizeInterviewInput): Promise<SummarizeInterviewOutput> {
    return summarizeInterviewFlow(input);
}


// Internal Flows and Prompts

const generateQuestionsPrompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: { schema: GenerateQuestionsInputSchema },
  output: { schema: GenerateQuestionsOutputSchema },
  prompt: `You are an expert HR manager and career coach specializing in interviews.
  
  Your task is to generate a list of 5 to 7 insightful and common interview questions for the following job title: {{{jobTitle}}}.

  The questions should cover a range of topics, including behavioral, situational, and technical questions relevant to the role. Do not include more than 7 questions.
  `,
});

const generateQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuestionsFlow',
    inputSchema: GenerateQuestionsInputSchema,
    outputSchema: GenerateQuestionsOutputSchema,
  },
  async (input) => {
    const { output } = await generateQuestionsPrompt(input);
    return output!;
  }
);


const evaluateAnswerPrompt = ai.definePrompt({
    name: 'evaluateAnswerPrompt',
    input: { schema: EvaluateAnswerInputSchema },
    output: { schema: FeedbackSchema },
    prompt: `You are an expert interview coach. Your task is to evaluate a user's answer to an interview question and provide constructive feedback.

    **Job Title:** {{{jobTitle}}}
    **Question:** "{{{question}}}"
    **User's Answer:** "{{{answer}}}"

    Evaluation Criteria:
    1.  **Clarity and Conciseness:** Is the answer clear, structured, and to the point?
    2.  **Relevance:** Does the answer directly address the question?
    3.  **Impact (STAR Method):** Does the user effectively describe the Situation, Task, Action, and Result?
    4.  **Confidence and Tone:** Does the answer project confidence and professionalism?

    Based on these criteria, please provide:
    1.  **Score:** A score from 1 (Needs significant improvement) to 5 (Excellent).
    2.  **Feedback:** Specific, actionable feedback. Start with what was good about the answer, then suggest concrete improvements. Frame the feedback to be encouraging and helpful.
    `
});

const evaluateAnswerFlow = ai.defineFlow(
    {
        name: 'evaluateAnswerFlow',
        inputSchema: EvaluateAnswerInputSchema,
        outputSchema: FeedbackSchema,
    },
    async (input) => {
        const { output } = await evaluateAnswerPrompt(input);
        return output!;
    }
);


const summarizeInterviewPrompt = ai.definePrompt({
    name: 'summarizeInterviewPrompt',
    input: { schema: SummarizeInterviewInputSchema },
    output: { schema: SummarizeInterviewOutputSchema },
    prompt: `You are a master career coach who has just observed a mock interview session for the role of **{{{jobTitle}}}**. Your task is to provide a final report card for the user based on their performance across all questions.

    Here is the full transcript of the interview:
    {{#each interviewHistory}}
    ---
    **Question:** {{question}}
    **Answer:** {{answer}}
    **Individual Feedback:** (Score: {{feedback.score}}/5) {{feedback.feedback}}
    ---
    {{/each}}

    Instructions for your final analysis:
    1.  **Review Holistically:** Do not just repeat the individual feedback. Synthesize the results to identify patterns. Did the user consistently struggle with being concise? Did they excel at providing data-driven results?
    2.  **Calculate Overall Score:** Based on the individual scores and your overall impression, calculate a final score for the interview out of 100.
    3.  **Write a Summary:** Provide a brief summary of the user's performance. Start with their key strengths and then transition to their main areas for improvement.
    4.  **Give Actionable Suggestions:** Provide a list of 3-5 high-level, actionable suggestions that would most improve their interview performance.
    `
});

const summarizeInterviewFlow = ai.defineFlow(
    {
        name: 'summarizeInterviewFlow',
        inputSchema: SummarizeInterviewInputSchema,
        outputSchema: SummarizeInterviewOutputSchema,
    },
    async (input) => {
        const { output } = await summarizeInterviewPrompt(input);
        return output!;
    }
);
