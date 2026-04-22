const projects = [
    {
      name: "Diffusion-Based Topic Evolution in Biomedical Literature",
      description:
        "Builds a dynamic framework for modeling how biomedical research topics evolve over time using modern machine learning and probabilistic methods. PubMed abstracts are collected, embedded, clustered, and aligned into trajectories. A diffusion model captures uncertainty and nonlinear topic evolution.",
      tech: [
        "Python",
        "pandas",
        "PyTorch",
        "SQLite",
        "sentence-transformers",
        "plotly",
      ],
      link: "https://github.com/JonathanMa03/diffusion-topic-evaluation",
      category: "Research / NLP / Generative Modeling",
    },
    {
      name: "Causal Survival Inference from Reconstructed IPD",
      description:
        "A Bayesian nonparametric framework for estimating causal treatment effects from reconstructed Kaplan–Meier data. Combines covariate augmentation, target-population reweighting, and uncertainty quantification via Dirichlet weighting, with a model-based NTR hazard extension. Demonstrates that reconstruction pipelines and modeling assumptions can materially change clinical conclusions.",
      tech: [
        "Python",
        "pandas",
        "numpy",
        "matplotlib"
      ],
      link: "https://github.com/JonathanMa03/NPBS-project-MaZhu",
      category: "Inverse Problems / Biostatistics / Causal Inference",
    },
    {
      name: "robustBVAR: A Distributionally Robust Bayesian VAR Framework",
      description:
        "Combines Bayesian VAR modeling with distributionally robust optimization and diffusion-based innovation modeling to simulate shocks and stress-test multivariate systems.",
      tech: ["R", "dplyr", "ggplot2", "bvar"],
      link: "https://github.com/JonathanMa03/innovative-droBVAR",
      category: "Research / Bayesian Time Series / Optimization",
    },
    {
      name: "Bayesian Hierarchical Modeling of Cancer Diagnoses",
      description:
        "Uses multilevel Bayesian logistic regression on SEER data to analyze late-stage cancer detection across demographic and regional factors.",
      tech: ["R", "dplyr", "ggplot2", "brms"],
      link: "https://absj.org/index.php/absj/article/view/114",
      category: "Research / Healthcare / Bayesian Modeling",
    },
    {
      name: "Comparative Analysis of BVARs with Flexible Innovation Distributions",
      description:
        "Implements and compares Bayesian VAR models with Gaussian, Student-t, mixture, and stochastic volatility innovations for financial time series. Uses MCMC-based inference and rolling forecasts to evaluate predictive densities and tail risk (VaR, ES), demonstrating that regime-aware and heavy-tailed models outperform standard Gaussian assumptions, especially during crisis periods.",
      tech: ["Python","numpy","pandas","scipy","matplotlib","PyMC","yfinance"],
      link: "https://github.com/JonathanMa03/pmlproject-MaZhuTao-SP26",
      category: "Risk Modeling / Bayesian Time Series / Quantitative Finance",
    },
    {
      name: "Predicting Depression: A Comparative ML Approach",
      description:
        "Compares logistic regression and random forest models for detecting depression using survey data.",
      tech: ["R", "CARET", "dplyr", "randomForest"],
      link: "https://github.com/JonathanMa03/Depression-Prediction",
      category: "Machine Learning / Healthcare",
    },
    {
      name: "Obesity of the Youth",
      description:
        "Analyzes adolescent obesity using inequality metrics and logistic modeling on national health survey data.",
      tech: ["R", "ineq", "tidyverse", "lme4"],
      link: "https://github.com/JonathanMa03/YouthObesity",
      category: "Public Health / Inequality",
    },
    {
      name: "Stock Price Forecasting Dashboard",
      description:
        "Interactive dashboard using neural networks for stock prediction and visualization.",
      tech: ["Python", "plotly", "numpy", "pandas", "dash"],
      link: "https://github.com/JonathanMa03/Stock-Forecaster",
      category: "Finance / Time Series",
    },
    {
      name: "Market Behavior Analysis",
      description:
        "Visualizes market behavior during major shocks like the 2008 crisis and COVID.",
      tech: ["Python", "matplotlib", "seaborn", "sklearn"],
      link: "https://github.com/JonathanMa03/Market-Shock-Behavior",
      category: "Finance / Visualization",
    },
  ];
  
  export default projects;