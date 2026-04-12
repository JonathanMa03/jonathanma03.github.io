import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import experience from "../data/experience";

function Experience() {
  const [activeTag, setActiveTag] = useState("All");

  const filters = ["All", "Research", "Academic", "Leadership"];

  const filteredExperience = useMemo(() => {
    if (activeTag === "All") return experience;
    return experience.filter((item) => item.tags.includes(activeTag));
  }, [activeTag]);

  return (
    <section className="section">
      <p className="eyebrow">03. Experience</p>
      <h1 className="section-heading">Experience</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginTop: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {filters.map((filter) => {
          const isActive = activeTag === filter;

          return (
            <button
              key={filter}
              onClick={() => setActiveTag(filter)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                padding: "0.55rem 0.9rem",
                borderRadius: "999px",
                border: isActive
                  ? "1px solid var(--color-accent)"
                  : "1px solid rgba(100,255,218,0.15)",
                background: isActive
                  ? "rgba(100,255,218,0.10)"
                  : "rgba(255,255,255,0.03)",
                color: isActive
                  ? "var(--color-accent)"
                  : "var(--color-text-muted)",
                transition: "all 0.2s ease",
              }}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div
        style={{
          position: "relative",
          marginTop: "1rem",
          paddingLeft: "1.5rem",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "6px",
            top: 0,
            bottom: 0,
            width: "2px",
            background: "rgba(100,255,218,0.18)",
          }}
        />

        <div
          style={{
            display: "grid",
            gap: "2rem",
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredExperience.map((item, index) => (
              <motion.article
                key={`${item.role}-${activeTag}`}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="hover-lift"
                style={{
                  position: "relative",
                  padding: "1.25rem 1.25rem 1.25rem 1.5rem",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.03)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "-1.72rem",
                    top: "1.5rem",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: "var(--color-accent)",
                    boxShadow: "0 0 0 5px rgba(100,255,218,0.12)",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "0.65rem",
                  }}
                >
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        color: "var(--color-accent)",
                        padding: "0.3rem 0.55rem",
                        border: "1px solid rgba(100,255,218,0.2)",
                        borderRadius: "999px",
                        background: "rgba(100,255,218,0.06)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "1.25rem",
                    marginBottom: "0.35rem",
                  }}
                >
                  {item.role}
                </h2>

                <p
                  style={{
                    color: "var(--color-heading)",
                    marginBottom: "0.2rem",
                    fontWeight: 600,
                  }}
                >
                  {item.organization}
                </p>

                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem",
                    color: "var(--color-text-muted)",
                    marginBottom: "1rem",
                  }}
                >
                  {item.period}
                </p>

                <ul style={{ marginBottom: 0 }}>
                  {item.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>{bullet}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default Experience;