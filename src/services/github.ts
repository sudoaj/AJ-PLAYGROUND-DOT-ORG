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
  const apiUrl = `https://api.github.com/users/${username}/repos`;
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };

  // Check for GITHUB_TOKEN and add to headers if available
  // Accessing environment variables in a Worker context can be tricky.
  // Assuming 'process.env.GITHUB_TOKEN' is accessible in this environment.
  // If not, this part might need adjustment based on the specific Worker environment.
  const githubToken = process.env.GITHUB_TOKEN;

  if (githubToken) {
    headers['Authorization'] = `token ${githubToken}`;
  } else {
    console.warn('GITHUB_TOKEN not found. API requests may be rate-limited or only return public data.');
  }

  try {
    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      // Handle API errors (e.g., 404 for user not found)
      console.error(`GitHub API error: ${response.status} - ${response.statusText}`);
      // Depending on the desired behavior, you might want to throw an error
      // or return an empty array or a specific error object.
      // For now, returning an empty array.
      return [];
    }

    const data = await response.json();

    // Map API response to GitHubRepo interface
    return data.map((repo: any) => ({
      name: repo.name,
      description: repo.description || '', // Handle null descriptions
      url: repo.html_url,
      language: repo.language || 'N/A', // Handle null languages
      lastUpdated: repo.updated_at,
    }));
  } catch (error) {
    // Handle network errors
    console.error('Failed to fetch GitHub repositories:', error);
    // Depending on the desired behavior, you might want to throw an error
    // or return an empty array or a specific error object.
    // For now, returning an empty array.
    return [];
  }
}
