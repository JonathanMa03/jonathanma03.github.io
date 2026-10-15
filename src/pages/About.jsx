import { FiDownload, FiExternalLink } from "react-icons/fi";
import { motion } from "framer-motion";
import certifications from "../data/certifications";
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
      <ul>
        <li>B.S. Finance, B.A. Economics, Minor in Statistics — Rutgers University</li>
        <li>M.S.E. Applied Mathematics and Statistics — Whiting School of Engineering, Johns Hopkins University</li>
      </ul>

      <h2>Skills</h2>
      <ul>
        <li><strong>Programming:</strong> Python, R, SQL, Julia, JavaScript, MATLAB, Mathematica, Stata, SAS</li>
        <li><strong>Data Analysis & Visualization:</strong> Pandas, NumPy, SciPy, dplyr, ggplot2, Matplotlib, Plotly, Dash, Tableau, Polars, Marimo</li>
        <li><strong>Statistical & Quantitative Methods:</strong> Bayesian Computation, Causal Inference, Time Series Analysis, Probabilistic Forecasting, Nonparametric Statistics, RLVR, RLHF, MCMC Simulation</li>
        <li><strong>Tools & Platforms:</strong> GitHub, Jupyter, VS Code, Docker, PostgreSQL, Supabase, Vercel, Railway, Bloomberg Terminal, S&amp;P Capital IQ, Netlify</li>
        <li><strong>R Libraries:</strong> tidyverse, dplyr, ggplot2, lavaan, brms, caret, BART, bvar, ggdag, text2vec</li>
        <li><strong>Python Libraries:</strong> PyTorch, scikit-learn, scikit-fda, pandas, NumPy, SciPy, OpenCV, CVXPY, Pyro, sentence-transformers, Selenium, LangChain, LangGraph</li>
      </ul>

      <h2>Career Goals & Interests</h2>
      <p>
       I work at the intersection of applied mathematics, statistics, optimization, and machine learning, with the goal of bridging quantitative theory and practical application. My interests center on developing reliable learning and decision-making systems that operate under uncertainty, misspecification, and distribution shift. Drawing on work across economics, finance, biomedical research, and AI, I am especially interested in problems where the appropriate methodology is not obvious and where statistical reasoning can complement emerging AI methods. Long term, I hope to develop rigorous, interpretable, and computationally practical methods that improve scientific discovery, forecasting, human-AI collaboration, and data-driven decision-making.
      </p>

      <div className="certifications-section">
        <h2>Certifications</h2>
        <p className="certifications-intro">
          Selected training across data science, finance, and healthcare research.
        </p>

        <div className="certification-grid">
          {certificationGroups.map((group, groupIndex) => (
            <motion.section
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
            </motion.section>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
