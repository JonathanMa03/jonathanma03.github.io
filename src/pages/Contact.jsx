import socialLinks from "../data/socialLinks";

function Contact() {
  const links = [...socialLinks].sort(
    (a, b) => (a.contactOrder ?? Infinity) - (b.contactOrder ?? Infinity),
  );

  return (
    <section className="section section-narrow">
      <p className="eyebrow">05. Contact</p>
      <h1 className="section-heading">Get In Touch</h1>

      <p style={{ maxWidth: "600px", marginBottom: "2rem" }}>
        I’m always open to discussing research, collaborations, or opportunities
        in data science, statistics, and applied modeling. Feel free to reach out
        through any of the platforms below.
      </p>

      <div
        style={{
          display: "grid",
          gap: "1rem",
        }}
      >
        {links.map(({ name, value, url, icon: Icon }) => (
          <a
            key={name}
            href={url}
            target={url.startsWith("http") ? "_blank" : undefined}
            rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
            className="hover-lift"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem 1.25rem",
              borderRadius: "14px",
              textDecoration: "none",
              border: "1px solid var(--color-border-soft)",
              background: "var(--color-surface)",
              color: "var(--color-text-main)",
              transition: "all 0.25s ease",
            }}
          >
            <div
              style={{
                fontSize: "1.25rem",
                color: "var(--color-identity)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Icon aria-hidden="true" />
            </div>

            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {name}
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: "0.85rem",
                  color: "var(--color-text-muted)",
                }}
              >
                {value}
              </p>
            </div>

            <div
              style={{
                fontSize: "0.9rem",
                color: "var(--color-accent)",
              }}
            >
              →
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Contact;
