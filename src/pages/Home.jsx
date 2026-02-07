import { useState } from "react";

function Home() {
  const base = import.meta.env.BASE_URL;
  const [flipped, setFlipped] = useState(false);

  // Update filenames if yours differ
  const CARD_FRONT = "business-card-front.png";
  const CARD_BACK = "business-card-back.png";
  const CARD_PDF = "business-card.pdf";

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src={`${base}me.jpg`}
          alt="Jonathan Y. Ma"
          style={{
            width: "30vw",
            maxWidth: "200px",
            height: "auto",
            aspectRatio: "1 / 1",
            borderRadius: "50%",
            border: "3px solid white",
            objectFit: "cover",
            marginBottom: "20px",
          }}
        />
      </div>

      <h1>Jonathan Y. Ma</h1>
      <h2>
        Aspiring Bayesian Eonometrician | Finance & Economics | Industrial
        Engineering • Applied Statistics • Operations Research
      </h2>

      <p style={{ marginTop: "1.5rem" }}>
        I’m a Finance and Economics graduate with a strong foundation in Applied
        Mathematics, currently pursuing a Master’s in Engineering at Johns
        Hopkins. My work bridges Industrial Engineering, Statistics, and OR,
        focused on solving real-world problems through data, modeling, and
        optimization.
      </p>

      <p>
        <strong>Interests:</strong> Probabilistic Machine Learning, Bayesian
        Modeling and Computation, Econometrics, Healthcare Data Science
      </p>

      {/* Business Card */}
      <div style={{ marginTop: "2.5rem" }}>
        <h2 style={{ marginBottom: "0.75rem" }}>Business Card</h2>

        <div style={{ display: "flex", justifyContent: "center" }}>
          {/* 3D scene */}
          <div
            style={{
              width: "520px",
              maxWidth: "92vw",
              aspectRatio: "1050 / 600",
              perspective: "1200px",
            }}
          >
            {/* card */}
            <div
              onClick={() => setFlipped((v) => !v)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setFlipped((v) => !v);
              }}
              aria-label="Flip business card"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transformStyle: "preserve-3d",
                WebkitTransformStyle: "preserve-3d",
                transition: "transform 650ms ease",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                borderRadius: "14px",
                cursor: "pointer",
                boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              {/* FRONT */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "14px",
                  overflow: "hidden",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "translateZ(0)", // Safari paint fix
                }}
              >
                <img
                  src={`${base}${CARD_FRONT}`}
                  alt="Business card front"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              {/* BACK */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "14px",
                  overflow: "hidden",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg) translateZ(0)", // rotate back face
                }}
              >
                <img
                  src={`${base}${CARD_BACK}`}
                  alt="Business card back"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "0.75rem",
            color: "rgba(255,255,255,0.78)",
            fontSize: "0.95rem",
          }}
        >
          Click the card to flip
        </div>

        <div style={{ marginTop: "1rem" }}>
          <a
            href={`${base}${CARD_PDF}`}
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
            Download business card (PDF)
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;