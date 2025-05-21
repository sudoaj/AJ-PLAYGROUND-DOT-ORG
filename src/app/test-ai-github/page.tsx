import { getGitHubRepos } from '@/services/github';
import { projectQA } from '@/ai/flows/project-qa';
import { projectSummary } from '@/ai/flows/project-summary';

// Helper to format output
function JsonDisplay({ data, title }: { data: any; title: string }) {
  return (
    <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '10px' }}>
      <h2>{title}</h2>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: '#f5f5f5', padding: '10px' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export default async function TestAiGithubPage() {
  let githubReposData: any = null;
  let githubReposError: any = null;
  let projectQAData: any = null;
  let projectQAError: any = null;
  let projectSummaryData: any = null;
  let projectSummaryError: any = null;

  // It's good practice to set a specific user agent for GitHub API requests.
  // However, the fetch implementation in services/github.ts doesn't currently do this.
  // For now, we'll proceed without it. A GITHUB_TOKEN would be needed for real-world extensive use.

  try {
    githubReposData = await getGitHubRepos('octocat');
  } catch (e: any) {
    githubReposError = { message: e.message, stack: e.stack };
  }

  try {
    // Assuming 'Spoon-Knife' is a valid project for 'octocat'
    // and the AI model can answer based on its description.
    projectQAData = await projectQA({
      question: 'What is the Spoon-Knife repository about?',
      username: 'octocat',
    });
  } catch (e: any) {
    projectQAError = { message: e.message, stack: e.stack };
  }

  try {
    // Assuming 'Spoon-Knife' is a valid project for 'octocat'.
    projectSummaryData = await projectSummary({
      projectName: 'Spoon-Knife',
      username: 'octocat',
    });
  } catch (e: any) {
    projectSummaryError = { message: e.message, stack: e.stack };
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>GitHub and AI Flow Test Page</h1>
      
      <JsonDisplay title="GitHub Repos for 'octocat'" data={githubReposError || githubReposData} />
      <JsonDisplay title="Project QA for 'octocat/Spoon-Knife'" data={projectQAError || projectQAData} />
      <JsonDisplay title="Project Summary for 'octocat/Spoon-Knife'" data={projectSummaryError || projectSummaryData} />
    </div>
  );
}
