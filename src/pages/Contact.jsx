import {
  FiMail,
  FiLinkedin,
  FiGithub,
} from "react-icons/fi";
import { FaInstagram, FaFacebook, FaOrcid } from "react-icons/fa";

function Contact() {
  const links = [
    {
      label: "Email",
      value: "jonathanma217@outlook.com",
      href: "mailto:jonathanma217@outlook.com",
      icon: <FiMail />,
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/jonathanma217",
      href: "https://www.linkedin.com/in/jonathanma217/",
      icon: <FiLinkedin />,
    },
    {
      label: "GitHub",
      value: "github.com/JonathanMa03",
      href: "https://github.com/JonathanMa03",
      icon: <FiGithub />,
    },
    {
      label: "ORCID",
      value: "orcid.org/0009-0005-1185-3281",
      href: "https://orcid.org/0009-0005-1185-3281",
      icon: <FaOrcid />,
    },
    {
      label: "Instagram",
      value: "@jonmapiano",
      href: "https://www.instagram.com/jonmapiano/",
      icon: <FaInstagram />,
    },
    {
      label: "Facebook",
      value: "jonmapiano",
      href: "https://www.facebook.com/jonmapiano",
      icon: <FaFacebook />,
    },
  ];

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
        {links.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.label !== "Email" ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="hover-lift"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem 1.25rem",
              borderRadius: "14px",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.03)",
              color: "var(--color-text-main)",
              transition: "all 0.25s ease",
            }}
          >
            <div
              style={{
                fontSize: "1.25rem",
                color: "var(--color-accent)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {item.icon}
            </div>

            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {item.label}
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: "0.85rem",
                  color: "var(--color-text-muted)",
                }}
              >
                {item.value}
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