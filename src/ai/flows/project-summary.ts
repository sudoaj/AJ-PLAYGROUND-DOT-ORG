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

const ProjectSummaryInputSchema = z.object({
  projectName: z.string().describe('The name of the project to summarize.'),
  username: z.string().describe('The GitHub username of the project owner.'),
});
export type ProjectSummaryInput = z.infer<typeof ProjectSummaryInputSchema>;

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
  input: {schema: ProjectSummaryInputSchema},
  output: {schema: ProjectSummaryOutputSchema},
  prompt: `You are an AI assistant helping users understand GitHub projects.

  Summarize the following project in a single sentence, highlighting its purpose and key technologies.

  Project Name: {{{projectName}}}
`,
});

const projectSummaryFlow = ai.defineFlow(
  {
    name: 'projectSummaryFlow',
    inputSchema: ProjectSummaryInputSchema,
    outputSchema: ProjectSummaryOutputSchema,
  },
  async input => {
    // Before calling the prompt, retrieve the project description from GitHub.
    // This will allow the prompt to be more informative.

    const {output} = await prompt(input);
    return output!;
  }
);
