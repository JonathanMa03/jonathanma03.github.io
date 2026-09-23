---
title: "Can Schrödinger Bridges Give Us a Different Way to Think About Time Series?"
date: "2026-09-23"
excerpt: "A time-series interpretation of transport-relaxed Schrödinger bridges: instead of forecasting a single future value, can we learn a plausible stochastic evolution between distributions of past and future states?"
tags: [Time Series, Schrödinger Bridges, Optimal Transport, Probabilistic Forecasting]
---

Most time-series forecasting starts from a familiar question:

> **Given what I have observed up to time $t$, what happens at time $t+1$?**

For example, an autoregressive model might assume

$$
X_{t+1}
=
f(X_t,X_{t-1},\ldots)
+
\varepsilon_{t+1}.
$$

We estimate $f$, make a forecast, and characterize the uncertainty around it.

But I recently came across the paper *Schrödinger Bridge with Transport Relaxation* by Yifan Jiang, Renyuan Xu, and Luhao Zhang, which made me think about the problem from a different angle.

Rather than asking only what the next value should be, suppose we ask:

> **What is a plausible stochastic evolution that transports the distribution of the process today into the distribution we expect to see in the future?**

That sounds much more like a Schrödinger bridge.

---

# From Forecasting Points to Transporting Distributions

Suppose we observe a multivariate time series

$$
X_1,X_2,\ldots,X_T,
\qquad
X_t\in\mathbb R^d.
$$

Instead of thinking only about the conditional mean

$$
\mathbb E[X_{T+h}\mid X_{1:T}],
$$

imagine constructing distributions representing the process at two different periods.

For example,

$$
\mu_{\text{past}}
=
\frac{1}{m}
\sum_{t=T-m+1}^{T}
\delta_{X_t}
$$

could represent the recent state of the system, while

$$
\mu_{\text{future}}
$$

represents its distribution at some future horizon.

The problem then becomes less like ordinary regression and more like

$$
\mu_{\text{past}}
\quad
\longrightarrow
\quad
\mu_{\text{future}}.
$$

But there are many stochastic processes capable of connecting those two distributions.

A Schrödinger bridge asks for a particularly natural one: the stochastic evolution that connects the endpoints while remaining as close as possible to some reference dynamics.

---

# What Are the Reference Dynamics?

This is where the connection to time series becomes especially interesting.

Suppose we already have a model describing how we think the system normally evolves:

$$
X_{t+1}
=
f_\theta(X_t)
+
\varepsilon_{t+1}.
$$

This could come from a VAR, state-space model, nonlinear autoregression, or some learned transition model.

That model induces a reference stochastic process

$$
P_{\text{ref}}.
$$

Rather than throwing this model away, we could treat it as our **baseline dynamics**.

The bridge then asks:

> Among processes that move us toward the desired future distribution, which one requires the smallest departure from the dynamics we already believe?

Conceptually,

$$
P^*
=
\arg\min_P
\operatorname{KL}(P\|P_{\text{ref}})
$$

subject to appropriate distributional conditions.

So instead of directly replacing a time-series model, the bridge can sit on top of one.

The time-series model tells us how the system normally evolves.

The bridge tells us how those dynamics may need to change to connect one distributional state to another.

---

# The Problem With Real Time-Series Data

There is an immediate practical issue.

We do not actually know

$$
\mu_{\text{past}}
\qquad\text{or}\qquad
\mu_{\text{future}}.
$$

We observe finite samples.

Our distributions therefore look more like

$$
\widehat\mu
=
\frac{1}{n}
\sum_{i=1}^{n}\delta_{X_i}.
$$

These are empirical distributions consisting of discrete observations.

This is exactly the practical issue motivating the transport relaxation in the paper.

A classical Schrödinger bridge tries to match its prescribed marginal distributions exactly.

But if those marginals are simply empirical approximations to unknown distributions, why should we insist that the bridge hit them perfectly?

---

# Relaxing the Endpoints

The paper replaces exact marginal matching with a softer requirement.

Instead of demanding

$$
P_0=\widehat\mu_0,
\qquad
P_T=\widehat\mu_T,
$$

we can penalize disagreement using optimal transport.

Schematically, the objective becomes

$$
\operatorname{KL}(P\|P_{\text{ref}})
+
\lambda_0
W_2^2(P_0,\widehat\mu_0)
+
\lambda_T
W_2^2(P_T,\widehat\mu_T).
$$

Now the bridge does not have to reproduce the empirical distributions exactly.

It only has to remain reasonably close to them.

That distinction feels particularly natural for time series.

An empirical distribution constructed from a short rolling window is noisy. A future distribution estimated from historical analogues is noisy. A distribution describing a different market regime, patient population, or economic period is also only an approximation.

Treating these distributions as exact constraints may give them much more authority than the data justify.

---

# A Time-Series Formulation

This suggests a fairly natural forecasting setup.

Suppose our current information is

$$
\mathcal F_T
=
\sigma(X_1,\ldots,X_T).
$$

A baseline forecasting model gives us a reference path distribution

$$
P_{\text{ref}}
(
X_{T+1:T+H}
\mid
\mathcal F_T
).
$$

Now suppose we also have some information about the distribution we expect at horizon $H$.

Call this empirical target

$$
\widehat\nu_{T+H}.
$$

Rather than simply forecasting forward from the reference model, we could solve something like

$$
P^*
=
\arg\min_P
\left\{
\operatorname{KL}(P\|P_{\text{ref}})
+
\lambda
W_2^2(P_{T+H},\widehat\nu_{T+H})
\right\}.
$$

The resulting $P^*$ would describe an entire distribution over future trajectories,

$$
X_{T+1},
X_{T+2},
\ldots,
X_{T+H},
$$

not merely a point forecast at $T+H$.

That is an important distinction.

The object being forecast is now a **path distribution**.

---

# Why Would We Know Something About the Future Distribution?

At first this sounds strange.

If we already know the future distribution, why forecast it?

But there are plenty of situations where we may have partial distributional information without knowing the actual trajectory.

Consider macroeconomic forecasting.

We may have a model describing the historical dynamics of

$$
X_t
=
\begin{bmatrix}
\text{inflation}_t\\
\text{unemployment}_t\\
\text{interest rate}_t
\end{bmatrix}.
$$

Suppose we want to study a scenario where inflation returns toward a particular range over the next year.

A traditional approach might impose a deterministic path or manually shock a VAR.

A bridge-based formulation could instead ask:

> **What stochastic paths move the economy toward that future distribution while deviating as little as possible from its estimated historical dynamics?**

That gives us something much richer than a single scenario.

It gives us a distribution over plausible paths consistent with the scenario.

---

# Regime Changes Become a Transport Problem

Another interesting interpretation comes from distribution shift.

Suppose a financial return process historically follows

$$
X_t\sim\mu_A,
$$

but during a stressed regime it behaves more like

$$
X_t\sim\mu_B.
$$

Instead of treating the regime change as an instantaneous switch,

$$
\mu_A\rightarrow\mu_B,
$$

we could ask for a stochastic transition

$$
\mu_A
\rightarrow
\mu_{t+1}
\rightarrow
\mu_{t+2}
\rightarrow
\cdots
\rightarrow
\mu_B.
$$

A Schrödinger bridge provides exactly this kind of object.

And transport relaxation makes the setup more realistic because $\mu_A$ and $\mu_B$ are probably estimated from finite historical windows.

We do not really believe the empirical distributions themselves are the truth.

We believe they are noisy observations of the regimes we are trying to describe.

---

# Connecting This Back to Probabilistic Forecasting

Most probabilistic forecasting methods aim to estimate something like

$$
p(X_{T+h}\mid X_{1:T}).
$$

A bridge perspective shifts the emphasis slightly.

Instead of asking only for the distribution at one horizon, we care about

$$
p(
X_{T+1},
\ldots,
X_{T+H}
\mid
X_{1:T}
).
$$

That distinction matters whenever the **path itself** is important.

Two forecasting models might have identical distributions at $T+H$ but imply completely different trajectories for getting there.

One might predict a smooth adjustment.

Another might imply extreme intermediate volatility.

If we only evaluate the endpoint, those models can look identical.

A bridge naturally makes the transition path part of the statistical object.

---

# A Different Kind of Scenario Analysis

This may be where I find the time-series interpretation most compelling.

Traditional forecasting asks

$$
\text{past}
\longrightarrow
\text{most likely future}.
$$

Scenario analysis often asks

$$
\text{past}
+
\text{shock}
\longrightarrow
\text{future}.
$$

A transport-relaxed bridge suggests something slightly different:

$$
\text{current distribution}
\longrightarrow
\text{plausible path distribution}
\longrightarrow
\text{future regime}.
$$

The future regime does not need to be imposed exactly.

Instead, the model balances three things:

1. what we observed,
2. what our baseline time-series dynamics say is plausible,
3. how strongly we want the process to move toward a target distribution.

That makes the relaxation parameter itself meaningful.

A strong transport penalty says:

> "I trust my target distribution quite a lot."

A weaker penalty says:

> "Treat this target as guidance, not as ground truth."

---

# Where I Think This Gets Interesting

The paper itself is about the mathematical and computational properties of transport-relaxed Schrödinger bridges, not specifically about time-series forecasting.

But the formulation suggests an interesting way of thinking about temporal data.

A time series already gives us a stochastic evolution through distributions.

A forecasting model gives us reference dynamics.

Historical regimes, scenarios, stress periods, or external forecasts can give us noisy empirical target distributions.

Putting those pieces together gives something like

$$
\boxed{
\text{time-series model}
+
\text{Schrödinger bridge}
+
\text{transport relaxation}
}
$$

where the goal is no longer just to predict the next observation.

It is to learn a plausible stochastic evolution between uncertain distributional states.

That leads to a question I find much more interesting than simply asking for another forecasting architecture:

> **Instead of predicting where a time series will end up, can we model the most plausible distribution of paths by which it gets there?**