import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function About() {
  const base = import.meta.env.BASE_URL;

  const certifications = [
    { label: "Bloomberg Market Concepts", file: "cert-bloomberg-1.pdf" },
    { label: "Google Data Analytics", file: "cert-google-data.pdf" },
    { label: "DataCamp Intermediate R", file: "cert-datacamp-intermediate.pdf" },
    { label: "DataCamp dplyr", file: "cert-datacamp-dplyr.pdf" },
    { label: "DataCamp ggplot2", file: "cert-datacamp-ggplot2.pdf" },
    { label: "CFI FMVA", file: "cert-fmva.pdf" },
    { label: "Columbia Machine Learning", file: "cert-columbia-ml.pdf" },
  ];

  const [[index, direction], setIndex] = useState([0, 0]);

  const prev = () =>
    setIndex(([i]) => [
      i === 0 ? certifications.length - 1 : i - 1,
      -1,
    ]);

  const next = () =>
    setIndex(([i]) => [
      i === certifications.length - 1 ? 0 : i + 1,
      1,
    ]);

  const current = certifications[index];

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -60 : 60,
      opacity: 0,
      scale: 0.98,
    }),
  };

  return (
    <section className="section section-narrow">
      <p className="eyebrow">01. About</p>
      <h1 className="section-heading">About Me</h1>

      <h2>Education</h2>
      <ul>
        <li>BS Finance, BA Economics, Minor in Statistics — Rutgers University</li>
        <li>MSE Applied Mathematics and Statistics — Whiting School of Engineering, Johns Hopkins</li>
      </ul>

      <h2>Skills</h2>
      <ul>
        <li><strong>Programming:</strong> Python, R, Julia, MATLAB, SQL, Mathematica</li>
        <li><strong>Data Analysis & Visualization:</strong> pandas, dplyr, ggplot2, seaborn, matplotlib, NumPy</li>
        <li><strong>Statistical & Quantitative Methods:</strong> Time Series, Bayesian Inference, Monte Carlo, Optimization, Convexity</li>
        <li><strong>Tools & Platforms:</strong> Microsoft Office Suite, Git, Jupyter, VS Code, Bloomberg Terminal, S&amp;P Capital IQ</li>
        <li><strong>R Libraries:</strong> e1071, dplyr, tidyverse, CARET, gptstudio, lavaan, ggplot2, brms, bvar, TSA</li>
        <li><strong>Python Libraries:</strong> sklearn, scipy, pandas, sqlite3, tensorflow, plotly, dash, bs4, selenium, neuralforecast</li>
      </ul>

      <h2>Career Goals & Interests</h2>
      <p>
        I aim to work at the intersection of healthcare data science, operations research,
        and Bayesian econometrics. My background spans both business and technical domains,
        and I’m passionate about using math, modeling, and analytics to improve real-world
        decision-making. Whether it’s supply chain optimization or public surveillance modeling,
        I enjoy building strategies that are both fair and practical.
      </p>

      <div style={{ marginTop: "3rem" }}>
        <h2>Certifications</h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "1.5rem",
          }}
        >
          <button
            onClick={prev}
            aria-label="Previous certification"
            style={{
              border: "var(--border-thin)",
              background: "transparent",
              color: "var(--color-accent)",
              padding: "0.5rem",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "transform 0.2s ease, background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(-2px) scale(1.05)";
              e.currentTarget.style.background = "var(--color-accent-muted)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(0) scale(1)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <FiChevronLeft size={22} />
          </button>

          <div
            style={{
              width: "420px",
              maxWidth: "92vw",
              minHeight: "390px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.file}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="hover-lift"
                style={{
                  width: "100%",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "14px",
                  padding: "1rem",
                  background: "rgba(255,255,255,0.03)",
                  boxShadow: "var(--shadow-sm)",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.05rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {current.label}
                </h3>

                <iframe
                  src={`${base}${current.file}`}
                  title={current.label}
                  style={{
                    width: "100%",
                    height: "260px",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: "10px",
                    background: "white",
                  }}
                />

                <a
                  href={`${base}${current.file}`}
                  download
                  className="site-resume-btn"
                  style={{ marginTop: "0.75rem", display: "inline-block" }}
                >
                  Download PDF
                </a>

                <div
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.85rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {index + 1} / {certifications.length}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={next}
            aria-label="Next certification"
            style={{
              border: "var(--border-thin)",
              background: "transparent",
              color: "var(--color-accent)",
              padding: "0.5rem",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "transform 0.2s ease, background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(2px) scale(1.05)";
              e.currentTarget.style.background = "var(--color-accent-muted)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(0) scale(1)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <FiChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default About;