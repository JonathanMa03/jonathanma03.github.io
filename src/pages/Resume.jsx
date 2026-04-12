function Resume() {
  const base = import.meta.env.BASE_URL;
  const resumeFile = "resume02262026.pdf";

  return (
    <section className="section section-narrow">
      <p className="eyebrow">Resume</p>
      <h1 className="section-heading">Resume</h1>

      <p style={{ marginTop: "0.75rem" }}>
        Preview my resume below, or download the PDF.
      </p>

      <div style={{ marginTop: "1rem" }}>
        <iframe
          src={`${base}${resumeFile}`}
          title="Resume PDF"
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
        <a
          href={`${base}${resumeFile}`}
          download
          className="site-resume-btn"
        >
          Download Resume (PDF)
        </a>
      </div>
    </section>
  );
}

export default Resume;