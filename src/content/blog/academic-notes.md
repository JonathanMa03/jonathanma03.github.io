---
title: "Self-Typed Lecture Notes and Building a Personal Mathematical Reference"
date: "2026-05-05"
excerpt: "A reflection on compiling graduate lecture notes in statistics, optimization, machine learning, and applied mathematics into a unified personal reference system."
tags: [Mathematics, Statistics, Optimization, Machine Learning, Notes]
---

Over the past year, I began building a consolidated repository of self-typed lecture notes spanning graduate coursework in applied mathematics, statistics, optimization, and machine learning. What initially started as scattered LaTeX files eventually evolved into a structured personal reference system for topics I repeatedly revisit in research, modeling, and computation.

The project combines:
- lecture material
- textbook references
- supplemental readings
- personal derivations
- implementation notes
- in-class discussions and Q\&A

The goal was never to create official course notes, but rather a compact "working mathematician's notebook" that I could continuously extend and refine over time.

The notes can be accessed [here](https://github.com/JonathanMa03/vsc-latex-sync)

# Courses and Core Concepts

## Bayesian Statistics

One of the foundational ideas throughout probabilistic modeling is Bayes' theorem:

$$
p(\theta \mid y)
=
\frac{
p(y \mid \theta)p(\theta)
}{
p(y)
}
$$

The course emphasized posterior reasoning, conjugacy, MCMC, and decision-theoretic interpretations of uncertainty.

---

## Elements of Statistical Learning

A recurring theme in statistical learning is the bias-variance tradeoff:

$$
\mathbb{E}
\left[
(y - \hat f(x))^2
\right]
=
\operatorname{Bias}(\hat f(x))^2
+
\operatorname{Var}(\hat f(x))
+
\sigma^2
$$

Topics included regularization, tree-based methods, ensemble learning, and high-dimensional prediction.

---

## Introduction to Data Science

Linear regression in matrix form remains one of the most useful modeling frameworks:

$$
\hat{\beta}
=
(X^\top X)^{-1}X^\top y
$$

The course focused on reproducible workflows, statistical computing, and practical data analysis pipelines.

---

## Time Series Analysis

One particularly elegant model studied was the Airline Model:

$$
(1-B)(1-B^{12})X_t
=
(1-\theta B)(1-\Theta B^{12})\varepsilon_t
$$

Topics included ARIMA models, forecasting, intervention analysis, and multivariate time series methods.

---

## Computing for Applied Mathematics

The Discrete Fourier Transform (DFT) appears throughout scientific computing:

$$
X_k
=
\sum_{n=0}^{N-1}
x_n
e^{-2\pi i kn/N}
$$

The course explored numerical computation, scientific programming, and algorithmic implementation techniques.

---

## Probabilistic Machine Learning

The Kullback-Leibler divergence measures discrepancy between probability distributions:

$$
D_{\mathrm{KL}}(P \| Q)
=
\sum_x
P(x)
\log
\frac{P(x)}{Q(x)}
$$

The course connected probabilistic reasoning with modern machine learning frameworks and approximate inference methods.

---

## Statistical Theory

A central theoretical result is the Gauss-Markov theorem:

$$
\operatorname{Var}(\hat{\beta})
=
\sigma^2 (X^\top X)^{-1}
$$

This characterizes the Ordinary Least Squares estimator as the BLUE estimator under classical assumptions.

---

## Nonparametric Bayesian Statistics

One of the most interesting constructions studied was the Chinese Restaurant Process:

$$
P(z_{n+1}=k)
=
\frac{n_k}{n+\alpha}
\quad\text{and}\quad
P(z_{n+1}=\text{new})
=
\frac{\alpha}{n+\alpha}
$$

The course explored Dirichlet processes, exchangeability, stick-breaking constructions, and Bayesian clustering.

---

## AI and Statistical Methods in Clinical Data Science

A central framework in clinical trial methodology is survival analysis through the Cox proportional hazards model:

$$

h(t \mid X)

=

h_0(t)

\exp(X^\top \beta)

$$

The course emphasized statistical learning methods for biomedical data, including survival modeling, longitudinal analysis, causal inference, and adaptive clinical trial methodologies.

---

## Mathematics of Data Science

One result that repeatedly appeared in spectral methods and perturbation analysis was the Sin Theta theorem:

$$
\sin \Theta(U,\hat U)
\le
\frac{
\|E\|
}{
\delta
}
$$

The course connected linear algebra, concentration phenomena, randomized methods, and modern data science theory.

---

## Nonlinear Optimization 1

Convexity forms the backbone of optimization theory:

$$
\lambda x + (1-\lambda)y \in C
\quad
\forall x,y \in C
$$

The course covered convex sets, convex functions, first-order methods, and optimality conditions.

---

## Nonlinear Optimization 2

Lagrangian duality provides an alternative view of constrained optimization:

$$
g(\lambda)
=
\inf_x
L(x,\lambda)
$$

Topics included KKT conditions, duality theory, constrained optimization, and advanced nonlinear programming methods.

---

## Random Matrix Theory in Data Science and Statistics

Principal Component Analysis can be written as the eigenvalue problem:

$$
S v
=
\lambda v
$$

The course explored spectral methods, high-dimensional asymptotics, concentration, and random matrix phenomena in statistics.

# Closing Thoughts

One unexpected benefit of typing and restructuring notes by hand was that it forced me to revisit concepts repeatedly from multiple perspectives:
- probabilistic
- geometric
- computational
- optimization-based
- statistical

Over time, these notes became less of a course archive and more of an interconnected mathematical reference system for research and modeling work.

The repository continues to evolve as I refine derivations, add references, improve explanations, and connect ideas across courses and domains.