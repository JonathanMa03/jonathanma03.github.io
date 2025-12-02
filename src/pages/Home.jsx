function Home() {
  const base = import.meta.env.BASE_URL;
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img
          src={`${base}me.jpg`}
          alt="Jonathan Y. Ma"
          style={{
            width: '30vw',
            maxWidth: '200px',
            height: 'auto',
            aspectRatio: '1 / 1',
            borderRadius: '50%',
            border: '3px solid white',
            objectFit: 'cover',
            marginBottom: '20px',
          }}
        />
      </div>

      <h1>Jonathan Y. Ma</h1>
      <h2>
        Aspiring Bayesian Econometrician | Finance & Economics | Industrial Engineering • Applied Statistics • Operations Research
      </h2>

      <p style={{ marginTop: '1.5rem' }}>
        I’m a Finance and Economics graduate with a strong foundation in Applied Mathematics,
        currently pursuing a Master’s in Engineering at Johns Hopkins. My work bridges Industrial Engineering,
        Statistics, and OR, focused on solving real-world problems through data, modeling, and optimization.
      </p>

      <p>
        <strong>Interests:</strong> Probabilistic Machine Learning, Bayesian Modeling and Computation, Econometrics, Healthcare Data Science
      </p>
    </div>
  );
}

export default Home;