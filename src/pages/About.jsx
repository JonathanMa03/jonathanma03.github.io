import { FiDownload, FiExternalLink } from "react-icons/fi";
import { motion as Motion } from "framer-motion";
import certifications from "../data/certifications";
import education from "../data/education";
import profile from "../data/profile";
import research from "../data/research";
import "./About.css";

function About() {
  const base = import.meta.env.BASE_URL;
  const certificationGroups = certifications.reduce((groups, certification) => {
    const existingGroup = groups.find(
      (group) => group.topic === certification.topic,
    );

    if (existingGroup) {
      existingGroup.certifications.push(certification);
    } else {
      groups.push({
        topic: certification.topic,
        certifications: [certification],
      });
    }

    return groups;
  }, []);

  return (
    <section className="section section-narrow">
      <p className="eyebrow">01. About</p>
      <h1 className="section-heading">About Me</h1>

      <h2>Education</h2>
      <div className="education-grid">
        {education.map((entry) => (
          <article className="education-card" key={entry.level}>
            <p className="education-level">{entry.level}</p>
            <h3>{entry.institution}</h3>
            <p className="education-degree">{entry.degree}</p>

            {entry.mentorship && (
              <div className="education-mentorship">
                {entry.mentorship.map((group) => (
                  <p key={group.label}>
                    <strong>{group.label}:</strong>{' '}
                    {group.segments.map((segment, index) =>
                      segment.type === 'link' ? (
                        <a
                          href={segment.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          key={`${segment.label}-${index}`}
                        >
                          {segment.label}
                        </a>
                      ) : (
                        <span key={`${group.label}-${index}`}>{segment.value}</span>
                      ),
                    )}
                  </p>
                ))}
              </div>
            )}

            {entry.relationships && (
              <dl className="education-people">
                {entry.relationships.map((relationship) => (
                  <div key={relationship.role}>
                    <dt>{relationship.role}</dt>
                    <dd>
                      <a
                        href={relationship.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {relationship.name}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </article>
        ))}
      </div>

      <h2>Skills</h2>
      <ul>
        {profile.skills.map((skill) => (
          <li key={skill.label}>
            <strong>{skill.label}:</strong> {skill.items.join(', ')}
          </li>
        ))}
      </ul>

      <h2>Career Goals & Interests</h2>
      <p>{research.careerGoals}</p>

      <div className="certifications-section">
        <h2>Certifications</h2>
        <p className="certifications-intro">
          Selected training across data science, finance, and healthcare research.
        </p>

        <div className="certification-grid">
          {certificationGroups.map((group, groupIndex) => (
            <Motion.section
              key={group.topic}
              className="certification-topic"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.4, delay: groupIndex * 0.08 }}
            >
              <header className="certification-topic-header">
                <div className="certification-topic-title-row">
                  <h3>{group.topic}</h3>
                  <span>{group.certifications.length} certificates</span>
                </div>
              </header>

              <div className="certification-list">
                {group.certifications.map((certification) => (
                  <article className="certification-card" key={certification.file}>
                    <iframe
                      src={`${base}${certification.file}#toolbar=0&navpanes=0`}
                      title={`${certification.label} certificate preview`}
                      loading="lazy"
                      className="certification-preview"
                    />

                    <div className="certification-card-body">
                      <h4>{certification.label}</h4>
                      <div className="certification-actions">
                        <a
                          href={`${base}${certification.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View <FiExternalLink aria-hidden="true" />
                        </a>
                        <a href={`${base}${certification.file}`} download>
                          Download <FiDownload aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </Motion.section>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
