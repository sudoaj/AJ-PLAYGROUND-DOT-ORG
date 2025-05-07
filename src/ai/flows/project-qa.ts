'use server';

/**
 * @fileOverview Implements an AI assistant (AJ-GPT) that can answer questions about AJ's projects.
 *
 * - projectQA - A function that handles question answering about projects.
 * - ProjectQAInput - The input type for the projectQA function.
 * - ProjectQAOutput - The return type for the projectQA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {GitHubRepo, getGitHubRepos} from '@/services/github';

const ProjectQAInputSchema = z.object({
  question: z.string().describe('The question about AJ\u0027s projects.'),
  username: z.string().describe('The GitHub username to fetch projects from.'),
});
export type ProjectQAInput = z.infer<typeof ProjectQAInputSchema>;

const ProjectQAOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about AJ\u0027s projects.'),
});
export type ProjectQAOutput = z.infer<typeof ProjectQAOutputSchema>;

export async function projectQA(input: ProjectQAInput): Promise<ProjectQAOutput> {
  return projectQAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'projectQAPrompt',
  input: {schema: ProjectQAInputSchema},
  output: {schema: ProjectQAOutputSchema},
  prompt: `You are AJ-GPT, an AI assistant that answers questions about AJ's projects.

  You will be given a question about AJ's projects and you should answer it based on the project data provided.

  AJ's Github username is {{{username}}}.

  Here is a list of AJ's projects:

  {{#each repos}}
  Project Title: {{name}}
  Description: {{description}}
  Technologies: {{language}}
  Link to GitHub repository: {{url}}
  Last Updated: {{lastUpdated}}
  {{/each}}

  Question: {{{question}}}

  Answer:`,
});

const projectQAFlow = ai.defineFlow(
  {
    name: 'projectQAFlow',
    inputSchema: ProjectQAInputSchema,
    outputSchema: ProjectQAOutputSchema,
  },
  async input => {
    const repos = await getGitHubRepos(input.username);
    const {output} = await prompt({...input, repos});
    return output!;
  }
);
