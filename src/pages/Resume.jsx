import { useState } from "react";

function Resume() {
  const base = import.meta.env.BASE_URL;

  const documents = [
    {
      label: "Resume",
      file: "website_resume.pdf",
      title: "Resume PDF",
    },
    {
      label: "CV",
      file: "website_cv.pdf",
      title: "CV PDF",
    },
  ];

  const [activeDoc, setActiveDoc] = useState(documents[0]);
  const fileUrl = `${base}${activeDoc.file}`;

  return (
    <section className="section section-narrow">
      <p className="eyebrow">Resume / CV</p>
      <h1 className="section-heading">Resume & CV</h1>

      <p style={{ marginTop: "0.75rem" }}>
        Preview my resume or CV below, or download either PDF.
      </p>

      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginTop: "1.5rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        {documents.map((doc) => {
          const isActive = activeDoc.label === doc.label;

          return (
            <button
              key={doc.label}
              onClick={() => setActiveDoc(doc)}
              className="site-resume-btn"
              style={{
                background: isActive
                  ? "rgba(100,255,218,0.12)"
                  : "transparent",
                borderColor: isActive
                  ? "rgba(100,255,218,0.45)"
                  : undefined,
              }}
            >
              {doc.label}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <iframe
          src={fileUrl}
          title={activeDoc.title}
          style={{
            width: "100%",
            height: "900px",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "10px",
            background: "white",
          }}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <a href={fileUrl} download className="site-resume-btn">
          Download {activeDoc.label} (PDF)
        </a>
      </div>
    </section>
  );
}

export default Resume;