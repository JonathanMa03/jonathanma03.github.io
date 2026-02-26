function Resume() {
  const base = import.meta.env.BASE_URL;

  const resumeFile = "resume02262026.pdf";

  const certifications = [
    { label: "Bloomberg Market Concepts", file: "cert-bloomberg-1.pdf" },
    { label: "Google Data Analytics", file: "cert-google-data.pdf" },
    { label: "DataCamp Intermediate R", file: "cert-datacamp-intermediate.pdf" },
    { label: "DataCamp dplyr", file: "cert-datacamp-dplyr.pdf" },
    { label: "DataCamp ggplot2", file: "cert-datacamp-ggplot2.pdf" },
    { label: "CFI FMVA", file: "cert-fmva.pdf" },
    { label: "Columbia Machine Learning", file: "cert-columbia-ml.pdf" },
  ];

  return (
    <div>
      <h1>Resume</h1>
      <p style={{ marginTop: "0.75rem" }}>
        Preview my resume below, or download the PDF.
      </p>

      {/* Resume Preview */}
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

      {/* Download Resume */}
      <div style={{ marginTop: "1rem" }}>
        <a
          href={`${base}${resumeFile}`}
          download
          style={{
            display: "inline-block",
            padding: "0.65rem 1rem",
            borderRadius: "10px",
            textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.06)",
            color: "white",
          }}
        >
          Download Resume (PDF)
        </a>
      </div>

      <div style={{ marginTop: "3rem" }}>
        <h2>Highlights</h2>

        <h3>Skills</h3>
        <ul>
          <li>
            <strong>Programming:</strong> Python, R, Julia, MATLAB, SQL, Mathematica
          </li>
          <li>
            <strong>Data Analysis & Visualization:</strong> pandas, dplyr,
            ggplot2, seaborn, matplotlib, NumPy
          </li>
          <li>
            <strong>Statistical & Quantitative Methods:</strong> Time Series,
            Bayesian Inference, Monte Carlo, Optimization, Convexity
          </li>
          <li>
            <strong>Tools & Platforms:</strong> Microsoft Office Suite, Git,
            Jupyter, VS Code, Bloomberg Terminal
          </li>
          <li>
            <strong>Business & Finance:</strong> Financial Modeling, Investment
            Management, Textual Analysis, Business Analytics
          </li>
        </ul>

        <h3>Certifications</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {certifications.map(({ label, file }) => (
            <li key={file} style={{ marginBottom: "3rem" }}>
              <strong>{label}</strong>

              <div style={{ marginTop: "0.5rem" }}>
                <iframe
                  src={`${base}${file}`}
                  title={label}
                  style={{
                    width: "100%",
                    maxWidth: "800px",
                    height: "500px",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: "10px",
                    background: "white",
                  }}
                />
              </div>

              <a
                href={`${base}${file}`}
                download
                style={{
                  display: "inline-block",
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "10px",
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.06)",
                  color: "white",
                }}
              >
                Download PDF
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Resume;