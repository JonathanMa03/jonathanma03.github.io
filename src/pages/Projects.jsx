import projects from "../data/projects";

function Projects() {
  return (
    <section className="section">
      <p className="eyebrow">02. Projects</p>
      <h1 className="section-heading">Selected Work</h1>

      <div
        style={{
          display: "grid",
          gap: "1.5rem",
        }}
      >
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

            <p style={{ marginBottom: "1rem" }}>
              {project.description}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              {project.tech.map((item) => (
                <span
                  key={item}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    color: "var(--color-accent)",
                    padding: "0.35rem 0.65rem",
                    border: "1px solid rgba(100,255,218,0.2)",
                    borderRadius: "999px",
                    background: "rgba(100,255,218,0.06)",
                  }}
                >
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

export default Projects;