const projects = [
    {
      name: "EligCrit: Automated Eligibility Criteria Extraction for Clinical Trials",
      description:
        "An LLM-powered framework for extracting, validating, and standardizing clinical trial eligibility criteria from ClinicalTrials.gov. The platform replaces LangChain dependencies with a modular OpenAI SDK architecture, integrates ICD-10 and RxNorm terminology normalization, and includes an independent validation agent that automatically compares extracted criteria against the original XML records. The system achieved an Exact Match score of 91.8% and an F1 score of 0.96 while supporting multiple foundation models, structured exports, desktop and command-line interfaces, and reproducible clinical NLP workflows.",
      tech: [
        "Python",
        "OpenAI SDK",
        "SQLite",
        "ICD-10",
        "RxNorm",
        "XML",
        "Tkinter",
      ],
      link: "TBD",
      category: "Clinical NLP / LLMs / Information Extraction",
    },
    {
      name: "TronRL: Online Reinforcement Learning for Human-Agent Adaptation",
      description:
        "A custom human-versus-agent Tron environment for studying online reinforcement learning under nonstationary opponent behavior. The framework includes scripted baseline agents, PPO pretraining, gameplay logging, replay analysis, checkpointing, continual learning experiments, and infrastructure for evaluating adaptation speed and catastrophic forgetting.",
      tech: [
        "Python",
        "Gymnasium",
        "Stable-Baselines3",
        "PyTorch",
      ],
      link:
        "https://github.com/JonathanMa03/tron-online-rl",
      category: "Reinforcement Learning / Continual Learning / Human-Agent Interaction",
    },
    {
      name: "DiffIndEye: Diffusion-Based Retinal OCT Inpainting",
      description:
        "Research-oriented framework for studying diffusion-based image inpainting on retinal OCT scans. The project treats OCT reconstruction as an inverse problem, where partially masked retinal images are reconstructed using classical baselines and conditional DDPMs. It includes preprocessing pipelines, synthetic stripe corruption, baseline inpainting methods, modular diffusion training, checkpoint-based evaluation, and reproducible reconstruction experiments.",
      tech: [
        "Python",
        "PyTorch",
        "Medical Imaging",
        "OpenCV",
      ],
      link: "https://github.com/JonathanMa03/diff-in-eye",
      category: "Medical Imaging / Diffusion Models / Inverse Problems",
    },
    {
      name: "CovarRecon-IPD: Approximate Individual Patient Data Reconstruction using Ant Colony Optimization",
      description:
        "A research framework for quantifying uncertainty in reconstructed individual patient data (IPD) from published clinical trials. Rather than treating reconstructed datasets as fixed, the project explores the geometry of the feasible reconstruction space using Monte Carlo sampling, simulated tempering, extremal optimization, and ant colony optimization to study how treatment-effect estimates vary across admissible patient-level assignments.",
      tech: [
        "Python",
        "NumPy",
        "SciPy",
        "Survival Analysis",
        "Optimization",
      ],
      link:
        "https://github.com/JonathanMa03/covar-recon-IPD/tree/main",
      category: "Inverse Problems / Data Integrity / Biostatistics",
    },
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
      name: "innovcal: Probabilistic Forecast Calibration under Innovation Misspecification",
      description:
        "A research framework investigating how flexible innovation models improve probabilistic forecast calibration under distributional misspecification. The project integrates diffusion-based residual modeling with classical (VAR) and deep probabilistic (DeepAR) forecasting systems, recursively propagating learned innovations to generate calibrated predictive distributions. Robustness is evaluated through Wasserstein perturbation analysis, stress testing, and calibration diagnostics including PIT, CRPS, ECE, and Energy Score under controlled distributional shifts.",
      tech: [
        "Python",
        "PyTorch",
        "R",
        "VAR",
        "DeepAR",
        "Diffusion Models",
        "Time Series",
      ],
      link: "https://github.com/JonathanMa03/innovative-droBVAR",
      category: "Probabilistic Forecasting / Diffusion Models / Uncertainty Quantification",
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
      name: "Analyzing Youth Obesity and Health Inequality",
      description:
        "A public health analytics project investigating socioeconomic and racial disparities in adolescent obesity using nearly 40,000 observations from the National Survey of Children's Health (NSCH). The study combines logistic regression with average marginal effects, Concentration and Kakwani Indices, and the PRECEDE–PROCEED framework to quantify how income, healthcare access, parental education, and race influence obesity risk while evaluating equity in existing public health interventions.",
      tech: [
        "R",
        "Logistic Regression",
        "Survey Analysis",
        "Health Economics",
        "Inequality Metrics",
        "Public Health"
      ],
      link: "https://github.com/JonathanMa03/YouthObesity",
      category: "Health Economics / Public Health / Statistical Modeling",
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