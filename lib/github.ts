import { unstable_cache } from "next/cache";

const githubUser = process.env.GITHUB_USERNAME;

async function fetchGitHub() {
  if (!githubUser) return { repos: [], commits: [] };

  const headers: HeadersInit = process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {};

  const [reposRes, eventsRes] = await Promise.all([
    fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=6`, {
      headers,
      next: { revalidate: 3600 }
    }),
    fetch(`https://api.github.com/users/${githubUser}/events/public?per_page=30`, {
      headers,
      next: { revalidate: 3600 }
    })
  ]);

  const repos = reposRes.ok ? await reposRes.json() : [];
  const events = eventsRes.ok ? await eventsRes.json() : [];

  const commits = events
    .filter((e: any) => e.type === "PushEvent")
    .flatMap((e: any) =>
      (e.payload?.commits || []).map((commit: any) => ({
        repo: e.repo?.name,
        message: commit.message,
        sha: commit.sha,
        url: `https://github.com/${e.repo?.name}/commit/${commit.sha}`
      }))
    )
    .slice(0, 8);

  return {
    repos: repos.map((r: any) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      html_url: r.html_url,
      stargazers_count: r.stargazers_count,
      language: r.language
    })),
    commits
  };
}

export const getCachedGitHub = unstable_cache(fetchGitHub, ["github-data"], {
  revalidate: 3600
});
