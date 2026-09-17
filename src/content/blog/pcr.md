---
title: "When PCA Stops Behaving Like PCA"
date: "2026-08-31"
excerpt: "A look at principal components regression under proportional asymptotics, where sample PCs become noisy, random matrix theory enters the picture, and classical PCA intuition starts to break down."
tags: [Statistics, High-Dimensional Statistics, Random Matrix Theory, Regression]
---

Principal components regression (PCR) has a very intuitive story: find the directions in $X$ that explain the most variation, keep the important ones, and regress $y$ on them.

But that story gets much more interesting when the number of predictors is no longer small relative to the sample size.

Suppose

$$
y=X\beta+\varepsilon,
\qquad
X\in\mathbb R^{n\times p},
$$

and instead of the classical setting where $p$ is fixed and $n\to\infty$, consider

$$
n,p\to\infty,
\qquad
\frac{p}{n}\to\gamma\in(0,\infty).
$$

This is the **proportional asymptotic regime**.

The seemingly small change from

$$
\frac{p}{n}\to0
$$

to

$$
\frac{p}{n}\to\gamma>0
$$

has a major statistical consequence:

> **Sample principal components do not necessarily converge to population principal components.**

That changes what PCR is actually doing.

---

# PCR as a Spectral Estimator

Start with the singular value decomposition

$$
X=USV^\top.
$$

PCR keeps the first $k$ empirical principal directions and estimates

$$
\hat\beta_{\text{PCR}}
=
\sum_{j=1}^{k}
\frac{v_j^\top X^\top y}{s_j^2}v_j.
$$

Usually, the intuition is that the $v_j$'s estimate important directions in the population covariance matrix.

Let

$$
\widehat\Sigma=\frac{1}{n}X^\top X.
$$

Under classical asymptotics, we expect

$$
\widehat\Sigma\to\Sigma.
$$

With enough data, the sample covariance becomes a good approximation to the population covariance, and its principal components become increasingly meaningful estimates of population directions.

Under proportional asymptotics, this picture breaks.

---

# Random Matrix Theory Enters the Picture

Take the simplest possible population covariance,

$$
\Sigma=I.
$$

There are no special population directions. Every direction has variance $1$.

We might therefore expect the eigenvalues of $\widehat\Sigma$ to become concentrated around $1$ as the sample size grows.

They don't.

If

$$
\frac{p}{n}\to\gamma,
$$

the eigenvalues instead spread according to the **Marchenko-Pastur law**, with support

$$
\left[
(1-\sqrt{\gamma})^2,
(1+\sqrt{\gamma})^2
\right].
$$

So even though the population spectrum is simply

$$
1,1,\ldots,1,
$$

the sample spectrum can contain apparently large and small eigenvalues.

And this spread does not disappear as $n\to\infty$ because $p$ is growing at the same time.

This means

$$
\|\widehat\Sigma-\Sigma\|_{\mathrm{op}}
\not\to0.
$$

That is important for PCR because PCR is built directly from the eigensystem of $\widehat\Sigma$.

Some of the structure that PCR sees can therefore be a persistent consequence of high-dimensional sampling noise rather than genuine population structure.

---

# When Does a Principal Component Actually Contain Signal?

Suppose there really *is* an important direction.

A standard model for this is the spiked covariance model

$$
\Sigma=I+\theta vv^\top,
$$

where $v$ is a population direction and $\theta$ controls the strength of the signal.

The population covariance now has one distinguished eigenvector, so it seems natural to expect the first sample PC $\hat v_1$ to estimate $v$.

But under proportional asymptotics, there is a phase transition.

For this parameterization, if

$$
\theta\leq\sqrt{\gamma},
$$

then asymptotically

$$
|\langle\hat v_1,v\rangle|^2\to0.
$$

The leading empirical PC essentially tells us nothing about the true population direction.

Only when

$$
\theta>\sqrt{\gamma}
$$

does the leading empirical PC acquire nonzero asymptotic alignment with $v$.

Even then, that alignment is generally not perfect.

So a real population signal can exist while PCA remains unable to reliably recover its direction.

That is a very different picture from the usual low-dimensional intuition.

---

# PCR Is Really Regularization

This also suggests another way to think about PCR.

OLS effectively applies the spectral transformation

$$
g_{\text{OLS}}(\lambda)
=
\frac{1}{\lambda}.
$$

Small eigenvalues are dangerous because dividing by them amplifies estimation noise.

PCR avoids this by using

$$
g_{\text{PCR}}(\lambda)
=
\frac{1}{\lambda}
\mathbf 1\{\lambda\geq t\}.
$$

Anything below the threshold is simply discarded.

Compare this with ridge regression,

$$
g_{\text{ridge}}(\lambda)
=
\frac{1}{\lambda+\lambda_{\text{ridge}}}.
$$

PCR performs a **hard spectral cutoff**, while ridge smoothly shrinks unstable directions.

So PCR is not just PCA followed by regression.

It is a particular form of **spectral regularization**.

---

# The Bias-Variance Tradeoff

Let

$$
P_k
=
\sum_{j=1}^{k}v_jv_j^\top
$$

be the projection onto the retained empirical PCs.

Conditional on $X$,

$$
\mathbb E[\hat\beta_{\text{PCR}}\mid X]
=
P_k\beta.
$$

Therefore the component

$$
(I-P_k)\beta
$$

is discarded.

That creates bias.

But keeping additional PCs also increases variance. Since

$$
s_j^2=n\hat\lambda_j,
$$

the variance associated with a retained direction behaves roughly like

$$
\frac{\sigma^2}{n\hat\lambda_j}.
$$

As we move deeper into the sample spectrum, $\hat\lambda_j$ becomes smaller and estimating those directions becomes increasingly expensive.

PCR is therefore balancing two effects:

- discard too many PCs and we lose signal,
- retain too many PCs and we amplify noise.

Under proportional asymptotics, neither effect necessarily disappears.

---

# Why the Signal Direction Matters

There is another subtle point here.

PCA chooses directions based on variation in $X$.

Regression cares about predicting $y$.

Those are not the same objective.

Suppose $\beta$ happens to align strongly with a low-variance population direction. PCA may consider that direction unimportant even though it contains substantial predictive information.

Conversely, a high-variance direction in $X$ might contain almost no information about $y$.

So the asymptotic behavior of PCR depends not only on the population eigenvalues, but also on how the regression signal $\beta$ aligns with the corresponding eigendirections.

Schematically, the limiting prediction risk becomes a function like

$$
R_{\text{PCR}}
=
R(
\gamma,
\alpha,
\Sigma,
\beta,
\sigma^2
),
$$

where

$$
\alpha=\lim\frac{k}{p}
$$

is the fraction of PCs retained.

This is one reason PCR becomes particularly interesting from a statistical theory perspective: the spectrum of $X$ and the location of the predictive signal within that spectrum interact.

---

# The Bigger Picture

PCR is a nice example of how proportional asymptotics can change the interpretation of a familiar statistical method.

In the classical regime, we can roughly tell the story

$$
\text{sample PCs}
\longrightarrow
\text{population PCs}
\longrightarrow
\text{regression}.
$$

In the proportional regime, the first arrow is no longer automatic.

The empirical spectrum remains noisy, empirical eigenvectors can remain imperfect estimates of population directions, and sufficiently weak population components may not be recoverable at all.

PCR therefore becomes less about simply "finding the important principal components" and more about deciding how much of a noisy empirical spectrum should be trusted for prediction.

That leads to a much more interesting question than simply asking how many PCs to keep:

> **When $p$ and $n$ grow together, how much information about the population signal actually survives in the empirical principal components?**

And that is where a seemingly straightforward regression technique starts connecting PCA, random matrix theory, spectral regularization, and high-dimensional statistical inference.