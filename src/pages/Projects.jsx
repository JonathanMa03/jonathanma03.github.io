import { useEffect, useState } from "react";
import projects from "../data/projects";

function Projects() {
  const [githubUser, setGithubUser] = useState(null);
  const [recentRepos, setRecentRepos] = useState([]);
  const [topLanguages, setTopLanguages] = useState([]);

  useEffect(() => {
    async function fetchGithubData() {
      try {
        const [userRes, repoRes] = await Promise.all([
          fetch("https://api.github.com/users/JonathanMa03"),
          fetch("https://api.github.com/users/JonathanMa03/repos?sort=updated"),
        ]);

        const userData = await userRes.json();
        const repoData = await repoRes.json();

        const languageResults = await Promise.all(
        repoData.slice(0, 25).map(async (repo) => {
          const res = await fetch(repo.languages_url);
          return res.json();
          })
        );

        const languageTotals = {};

        languageResults.forEach((languages) => {
        Object.entries(languages).forEach(([language, bytes]) => {
          let normalizedLanguage = language;

          if (
            language === "Jupyter Notebook" ||
            language === "IPython Notebook"
          ) {
            normalizedLanguage = "Python";
          }

          if (
            language === "JavaScript" ||
            language === "TypeScript" ||
            language === "MDX"
          ) {
            normalizedLanguage = "JavaScript / TypeScript";
          }

          if (
            language === "R" ||
            language === "Rust" 
          ) {
            normalizedLanguage = "R";
          }

          languageTotals[normalizedLanguage] =
            (languageTotals[normalizedLanguage] || 0) + bytes;
        });
      });

        const totalBytes = Object.values(languageTotals).reduce(
          (sum, bytes) => sum + bytes,
          0
        );

        const formattedLanguages = Object.entries(languageTotals)
          .map(([language, bytes]) => ({
            language,
            percentage: totalBytes ? (bytes / totalBytes) * 100 : 0,
          }))
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 4);

        setTopLanguages(formattedLanguages);

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const recent = repoData
          .filter((repo) => new Date(repo.updated_at) >= oneMonthAgo)
          .slice(0, 4);

        setGithubUser(userData);
        setRecentRepos(recent);
      } catch (error) {
        console.error("GitHub API error:", error);
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
              background: "rgba(255,255,255,0.06)",
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
                  Updated {new Date(repo.updated_at).toLocaleDateString()}
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
      <h1 className="section-heading">Selected Work</h1>

      <div style={{ display: "grid", gap: "1.5rem" }}>
        {projects.map((project, index) => (
          <article
            key={index}
            className="hover-lift"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "16px",
              padding: "1.5rem",
              background: "rgba(255,255,255,0.03)",
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
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "16px",
  padding: "1.25rem",
  background: "rgba(255,255,255,0.03)",
  boxShadow: "var(--shadow-sm)",
};

const statNumberStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: "2rem",
  margin: 0,
  color: "var(--color-heading)",
};

const repoCardStyle = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "16px",
  padding: "1.25rem",
  background: "rgba(255,255,255,0.03)",
  boxShadow: "var(--shadow-sm)",
  color: "var(--color-text-main)",
};

const tagStyle = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.8rem",
  color: "var(--color-accent)",
  padding: "0.35rem 0.65rem",
  border: "1px solid rgba(100,255,218,0.2)",
  borderRadius: "999px",
  background: "rgba(100,255,218,0.06)",
};

export default Projects;