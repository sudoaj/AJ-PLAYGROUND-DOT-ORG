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

// Schema for the prompt's input, now including 'repos'
const ProjectQAPromptInputSchema = z.object({
  question: z.string().describe('The question about AJ\u0027s projects.'),
  username: z.string().describe('The GitHub username to fetch projects from.'),
  repos: z.array(z.object({ // Define a basic structure for repos within the schema
    name: z.string(),
    description: z.string().nullable(), // description can be null
    language: z.string().nullable(), // language can be null
    url: z.string(),
    lastUpdated: z.string(),
  })).describe('The list of GitHub repositories.'),
});

// Schema for the overall flow's input (remains the same)
const ProjectQAFlowInputSchema = z.object({
  question: z.string().describe('The question about AJ\u0027s projects.'),
  username: z.string().describe('The GitHub username to fetch projects from.'),
});
export type ProjectQAInput = z.infer<typeof ProjectQAFlowInputSchema>;

const ProjectQAOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about AJ\u0027s projects.'),
});
export type ProjectQAOutput = z.infer<typeof ProjectQAOutputSchema>;

export async function projectQA(input: ProjectQAInput): Promise<ProjectQAOutput> {
  return projectQAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'projectQAPrompt',
  input: {schema: ProjectQAPromptInputSchema}, // Use the new schema here
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
    inputSchema: ProjectQAFlowInputSchema, // Flow uses the original input schema
    outputSchema: ProjectQAOutputSchema,
  },
  async input => {
    const reposFromGH = await getGitHubRepos(input.username);

    // Map GitHubRepo[] to the structure expected by ProjectQAPromptInputSchema.repos
    const reposForPrompt = reposFromGH.map(repo => ({
      name: repo.name,
      description: repo.description || '', // Ensure description is a string
      language: repo.language || 'N/A',    // Ensure language is a string
      url: repo.url,
      lastUpdated: repo.lastUpdated,
    }));

    const {output} = await prompt({
      question: input.question,
      username: input.username,
      repos: reposForPrompt, // Pass the fetched and mapped repos
    });
    return output!;
  }
);
