/**
 * Represents a GitHub repository.
 */
export interface GitHubRepo {
  /**
   * The name of the repository.
   */
  name: string;
  /**
   * A brief description of the repository.
   */
  description: string;
  /**
   * The URL of the GitHub repository.
   */
  url: string;
  /**
   * The primary programming language used in the repository.
   */
  language: string;
  /**
   * The date the repository was last updated.
   */
  lastUpdated: string;
}

/**
 * Asynchronously retrieves a list of GitHub repositories for a given user.
 *
 * @param username The GitHub username.
 * @returns A promise that resolves to an array of GitHubRepo objects.
 */
export async function getGitHubRepos(username: string): Promise<GitHubRepo[]> {
  // TODO: Implement this by calling the GitHub API.

  return [
    {
      name: 'repo1',
      description: 'First repo',
      url: 'https://github.com/user/repo1',
      language: 'TypeScript',
      lastUpdated: '2024-01-01',
    },
    {
      name: 'repo2',
      description: 'Second repo',
      url: 'https://github.com/user/repo2',
      language: 'JavaScript',
      lastUpdated: '2024-02-15',
    },
  ];
}
