'use server';
/**
 * @fileOverview A flow to summarize a project given its name.
 *
 * - projectSummary - A function that summarizes a project.
 * - ProjectSummaryInput - The input type for the projectSummary function.
 * - ProjectSummaryOutput - The return type for the projectSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getGitHubRepos, GitHubRepo} from '@/services/github';

// Updated schema for the prompt input, including details from GitHub
const PromptInputSchema = z.object({
  projectName: z.string().describe('The name of the project to summarize.'),
  description: z.string().describe('The description of the project.'),
  language: z.string().describe('The primary programming language of the project.'),
  lastUpdated: z.string().describe('The date the project was last updated.'),
});

// Schema for the flow input (remains the same)
const ProjectSummaryFlowInputSchema = z.object({
  projectName: z.string().describe('The name of the project to summarize.'),
  username: z.string().describe('The GitHub username of the project owner.'),
});
export type ProjectSummaryInput = z.infer<typeof ProjectSummaryFlowInputSchema>;


const ProjectSummaryOutputSchema = z.object({
  summary: z.string().describe('A short summary of the project.'),
});
export type ProjectSummaryOutput = z.infer<typeof ProjectSummaryOutputSchema>;

export async function projectSummary(
  input: ProjectSummaryInput
): Promise<ProjectSummaryOutput> {
  return projectSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'projectSummaryPrompt',
  input: {schema: PromptInputSchema}, // Use the updated schema for prompt
  output: {schema: ProjectSummaryOutputSchema},
  prompt: `You are an AI assistant helping users understand GitHub projects.

  Summarize the following project in a single sentence, highlighting its purpose and key technologies.

  Project Name: {{{projectName}}}
  Project Description: {{{description}}}
  Technologies: {{{language}}}
  Last Updated: {{{lastUpdated}}}
`,
});

const projectSummaryFlow = ai.defineFlow(
  {
    name: 'projectSummaryFlow',
    inputSchema: ProjectSummaryFlowInputSchema, // Flow input uses the original schema
    outputSchema: ProjectSummaryOutputSchema,
  },
  async input => {
    // Fetch all repositories for the user
    const repos = await getGitHubRepos(input.username);

    // Find the specific project
    const project = repos.find(repo => repo.name === input.projectName);

    if (!project) {
      throw new Error(`Project "${input.projectName}" not found for user "${input.username}".`);
    }

    // Prepare data for the prompt
    const promptData = {
      projectName: project.name,
      description: project.description,
      language: project.language,
      lastUpdated: project.lastUpdated,
    };

    const {output} = await prompt(promptData);
    return output!;
  }
);
