import { useEffect, useMemo, useState } from "react";
import projects from "../data/projects";

const chatEndpoint = import.meta.env.VITE_CHAT_API_URL?.trim();
const githubEndpoint = chatEndpoint
  ? new URL("/github", chatEndpoint).toString()
  : null;

const splitCategories = (category) =>
  category.split("/").map((item) => item.trim()).filter(Boolean);

const normalizeGithubLanguage = (language) => {
  if (language === "Jupyter Notebook" || language === "IPython Notebook") {
    return "Python";
  }

  if (["JavaScript", "TypeScript", "HTML", "MDX"].includes(language)) {
    return "JavaScript";
  }

  if (language === "R" || language === "Rust") {
    return "R";
  }

  return language;
};

const formatLanguageBreakdown = (repositories) => {
  const totals = repositories.reduce((counts, repository) => {
    if (!repository.language) return counts;

    const language = normalizeGithubLanguage(repository.language);
    counts[language] = (counts[language] || 0) + 1;
    return counts;
  }, {});

  const ranked = Object.entries(totals).sort(
    ([languageA, countA], [languageB, countB]) =>
      countB - countA || languageA.localeCompare(languageB),
  );
  const topThree = ranked.slice(0, 3);
  const otherCount = ranked
    .slice(3)
    .reduce((sum, [, count]) => sum + count, 0);
  const groups = [
    ...topThree,
    ...(otherCount > 0 ? [["Other", otherCount]] : []),
  ];
  const total = groups.reduce((sum, [, count]) => sum + count, 0);

  if (total === 0) return [];

  const percentages = groups.map(([language, count]) => {
    const exactTenths = (count / total) * 1000;
    return {
      language,
      tenths: Math.floor(exactTenths),
      remainder: exactTenths % 1,
    };
  });
  let remainingTenths =
    1000 - percentages.reduce((sum, item) => sum + item.tenths, 0);

  [...percentages]
    .sort((a, b) => b.remainder - a.remainder)
    .forEach((item) => {
      if (remainingTenths > 0) {
        item.tenths += 1;
        remainingTenths -= 1;
      }
    });

  return percentages.map(({ language, tenths }) => ({
    language,
    percentage: tenths / 10,
  }));
};

function Projects() {
  const [githubUser, setGithubUser] = useState(null);
  const [recentRepos, setRecentRepos] = useState([]);
  const [topLanguages, setTopLanguages] = useState([]);
  const [githubStatus, setGithubStatus] = useState("loading");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(
    () => [
      "All",
      ...new Set(projects.flatMap((project) => splitCategories(project.category))),
    ].sort((a, b) => {
      if (a === "All") return -1;
      if (b === "All") return 1;
      return a.localeCompare(b);
    }),
    [],
  );

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((project) =>
      splitCategories(project.category).includes(activeCategory)
    );
  }, [activeCategory]);

  useEffect(() => {
    async function fetchGithubData() {
      try {
        if (!githubEndpoint) {
          throw new Error("The GitHub snapshot endpoint is not configured.");
        }

        const response = await fetch(githubEndpoint);
        const payload = await response.json();
        const userData = payload.user;
        const repoData = payload.repositories;

        if (!response.ok || !userData || !Array.isArray(repoData)) {
          throw new Error("GitHub data could not be loaded.");
        }

        const formattedLanguages = formatLanguageBreakdown(repoData);

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const recent = repoData
          .filter((repo) => new Date(repo.pushed_at) >= oneMonthAgo)
          .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
          .slice(0, 4);

        setGithubUser(userData);
        setRecentRepos(recent);
        setTopLanguages(formattedLanguages);
        setGithubStatus("ready");
      } catch (error) {
        console.error("GitHub API error:", error);
        setGithubStatus("error");
      }
    }

    fetchGithubData();
  }, []);

  return (
    <section className="section">
      <p className="eyebrow">02. Projects</p>
      <h1 className="section-heading">Projects</h1>

      {/* GitHub Snapshot */}
      <div style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1.4rem",
            marginBottom: "1rem",
          }}
        >
          GitHub Snapshot
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div className="hover-lift" style={statCardStyle}>
            <p className="eyebrow" style={{ marginBottom: "0.4rem" }}>
              Repositories
            </p>
            <h3 style={statNumberStyle}>
              {githubUser ? githubUser.public_repos : "—"}
            </h3>
          </div>

          <div className="hover-lift" style={statCardStyle}>
            <p className="eyebrow" style={{ marginBottom: "0.4rem" }}>
              Followers
            </p>
            <h3 style={statNumberStyle}>
              {githubUser ? githubUser.followers : "—"}
            </h3>
          </div>

          <div className="hover-lift" style={statCardStyle}>
            <p className="eyebrow" style={{ marginBottom: "0.4rem" }}>
              Following
            </p>
            <h3 style={statNumberStyle}>
              {githubUser ? githubUser.following : "—"}
            </h3>
          </div>

          <div className="hover-lift" style={statCardStyle}>
  <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>
    Languages
  </p>

  <div style={{ display: "grid", gap: "0.55rem" }}>
    {topLanguages.length > 0 ? (
      topLanguages.map((item) => (
        <div key={item.language}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.25rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--color-text-muted)",
            }}
          >
            <span>{item.language}</span>
            <span>{item.percentage.toFixed(1)}%</span>
          </div>

          <div
            style={{
              height: "6px",
              borderRadius: "999px",
              background: "var(--color-surface-soft)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${item.percentage}%`,
                height: "100%",
                borderRadius: "999px",
                background: "var(--color-accent)",
              }}
            />
          </div>
        </div>
      ))
    ) : githubStatus === "error" ? (
      <p style={{ margin: 0 }}>Temporarily unavailable.</p>
    ) : (
      <p style={{ margin: 0 }}>Loading languages...</p>
    )}
  </div>
</div>
        </div>

        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1.4rem",
            marginBottom: "1rem",
          }}
        >
          Recent Activity
        </h2>

        {recentRepos.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {recentRepos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover-lift"
                style={{
                  ...repoCardStyle,
                  textDecoration: "none",
                }}
              >
                <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>
                  Pushed {new Date(repo.pushed_at).toLocaleDateString()}
                </p>

                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "1.05rem",
                    marginBottom: "0.5rem",
                    color: "var(--color-heading)",
                  }}
                >
                  {repo.name}
                </h3>

                <p
                  style={{
                    fontSize: "0.9rem",
                    marginBottom: "0.9rem",
                  }}
                >
                  {repo.description || "No description provided."}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.6rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {repo.language && <span>{repo.language}</span>}
                  <span>★ {repo.stargazers_count}</span>
                  <span>⑂ {repo.forks_count}</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p>No repositories updated in the last month.</p>
        )}
      </div>

      {/* Selected Work */}
      <h1 className="section-heading">Selected Works</h1>

      <div
        aria-label="Filter projects by category"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginTop: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveCategory(category)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                padding: "0.55rem 0.9rem",
                borderRadius: "999px",
                border: isActive
                  ? "1px solid var(--color-accent)"
                  : "1px solid var(--color-border-soft)",
                background: isActive
                  ? "var(--color-accent-muted)"
                  : "var(--color-surface)",
                color: isActive
                  ? "var(--color-accent)"
                  : "var(--color-text-muted)",
                transition: "all 0.2s ease",
              }}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gap: "1.5rem" }}>
        {filteredProjects.map((project) => (
          <article
            key={project.name}
            className="hover-lift"
            style={{
              border: "1px solid var(--color-border-soft)",
              borderRadius: "16px",
              padding: "1.5rem",
              background: "var(--color-surface)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>
              {project.category}
            </p>

            <h2
              style={{
                fontSize: "1.35rem",
                marginBottom: "0.85rem",
              }}
            >
              {project.name}
            </h2>

            <p style={{ marginBottom: "1rem" }}>{project.description}</p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              {project.tech.map((item) => (
                <span key={item} style={tagStyle}>
                  {item}
                </span>
              ))}
            </div>

            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="site-resume-btn"
            >
              View Repository →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

const statCardStyle = {
  border: "1px solid var(--color-border-soft)",
  borderRadius: "16px",
  padding: "1.25rem",
  background: "var(--color-surface)",
  boxShadow: "var(--shadow-sm)",
};

const statNumberStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: "2rem",
  margin: 0,
  color: "var(--color-heading)",
};

const repoCardStyle = {
  border: "1px solid var(--color-border-soft)",
  borderRadius: "16px",
  padding: "1.25rem",
  background: "var(--color-surface)",
  boxShadow: "var(--shadow-sm)",
  color: "var(--color-text-main)",
};

const tagStyle = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.8rem",
  color: "var(--color-identity)",
  padding: "0.35rem 0.65rem",
  border: "1px solid var(--color-identity-border)",
  borderRadius: "999px",
  background: "var(--color-identity-muted)",
};

export default Projects;
