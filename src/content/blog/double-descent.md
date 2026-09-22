---
title: "Why Can a Bigger Model Generalize Better? The Double Descent Phenomenon"
date: "2026-09-19"
excerpt: "A statistical look at double descent, the interpolation threshold, and why adding parameters can sometimes improve test performance even after a model perfectly fits the training data."
tags: [Statistics, Machine Learning, High-Dimensional Statistics, Bias-Variance Tradeoff]
---

One of the first lessons in statistical learning is that increasing model complexity eventually leads to overfitting.

A simple model underfits. A moderately flexible model performs well. An excessively flexible model starts fitting noise, causing test error to increase.

This gives us the familiar U-shaped risk curve:

$$
\text{underfitting}
\longrightarrow
\text{optimal complexity}
\longrightarrow
\text{overfitting}.
$$

But modern machine learning presents an awkward problem with this story.

Neural networks often have far more parameters than observations. They can achieve essentially zero training error, yet increasing their size can sometimes make their test performance **better**, not worse.

This leads to a strange-looking phenomenon known as **double descent**.

Instead of test error following one U-shaped curve, it can decrease, increase dramatically near the point where the model first interpolates the training data, and then **decrease again**.

> **Why would making an already overparameterized model even larger improve generalization?**

The answer becomes particularly interesting when we look at the statistical theory behind interpolation.

---

# The Classical Bias-Variance Picture

Suppose

$$
y=f(x)+\varepsilon,
$$

where

$$
\mathbb E[\varepsilon]=0,
\qquad
\operatorname{Var}(\varepsilon)=\sigma^2.
$$

For an estimator $\hat f$, prediction error can be decomposed conceptually as

$$
\operatorname{Risk}
=
\operatorname{Bias}^2
+
\operatorname{Variance}
+
\sigma^2.
$$

As model complexity increases, bias usually decreases while variance increases.

This gives the classical picture:

$$
\text{Test Error}
\quad
\cup
$$

with some intermediate model complexity minimizing prediction risk.

This intuition works extremely well when the number of parameters is relatively small compared with the amount of data.

But something interesting happens when the number of parameters approaches the number of observations.

---

# The Interpolation Threshold

Consider ordinary linear regression,

$$
y=X\beta+\varepsilon,
\qquad
X\in\mathbb R^{n\times p}.
$$

The ratio

$$
\gamma=\frac{p}{n}
$$

gives us a simple measure of model complexity relative to sample size.

When

$$
p<n,
$$

we are in the usual underparameterized regime.

As $p$ approaches $n$, however, the model gains enough flexibility to fit essentially every training observation.

The critical point

$$
p\approx n
$$

is called the **interpolation threshold**.

Near this threshold, something statistically dangerous happens.

The matrix

$$
X^\top X
$$

becomes increasingly ill-conditioned.

OLS requires

$$
\hat\beta
=
(X^\top X)^{-1}X^\top y,
$$

so directions associated with very small eigenvalues of $X^\top X$ are multiplied by very large inverse eigenvalues.

If

$$
X^\top X v_j=\lambda_jv_j,
$$

then estimation in direction $v_j$ involves a factor proportional to

$$
\frac{1}{\lambda_j}.
$$

As

$$
\lambda_j\to0,
$$

small amounts of noise can produce enormous changes in the estimated coefficients.

This causes prediction variance to explode.

And that creates the peak in double descent.

---

# What Happens After $p=n$?

Now comes the strange part.

Suppose

$$
p>n.
$$

There are more parameters than observations, so infinitely many coefficient vectors can interpolate the training data:

$$
X\beta=y.
$$

We therefore need some rule for selecting among them.

A natural choice is the **minimum-norm interpolator**,

$$
\hat\beta
=
X^\top(XX^\top)^{-1}y,
$$

which solves

$$
\min_\beta \|\beta\|_2
$$

subject to

$$
X\beta=y.
$$

So although the model has enough parameters to fit the data perfectly, it does not choose an arbitrary interpolating solution.

It chooses the one with the smallest Euclidean norm.

This introduces an implicit preference among all possible interpolators.

---

# More Parameters Can Mean More Ways to Interpolate

This gives an interesting geometric interpretation.

When $p$ is only slightly larger than $n$, there may be relatively little freedom in how the model achieves interpolation.

As $p$ becomes much larger than $n$, the null space

$$
\mathcal N(X)
=
\{v:Xv=0\}
$$

grows in dimension.

Since

$$
\dim\mathcal N(X)\approx p-n,
$$

there are increasingly many parameter vectors that produce exactly the same fitted values on the training set.

The minimum-norm rule can exploit this larger space to find an interpolating solution with smaller coefficients.

So adding parameters does not necessarily mean that the fitted function becomes increasingly wild.

Counterintuitively, additional parameters can give the learning algorithm **more freedom to find a well-behaved interpolator**.

This is one of the key ideas behind the second descent.

---

# A Random Matrix View

The phenomenon becomes especially clean under proportional asymptotics,

$$
n,p\to\infty,
\qquad
\frac{p}{n}\to\gamma.
$$

Suppose, for simplicity, that the design is isotropic.

Random matrix theory tells us that the eigenvalues of the sample covariance

$$
\widehat\Sigma
=
\frac{1}{n}X^\top X
$$

follow the Marchenko-Pastur distribution asymptotically.

Its lower spectral edge is

$$
\lambda_-=(1-\sqrt{\gamma})^2.
$$

Now notice what happens when

$$
\gamma\to1.
$$

We get

$$
\lambda_-\to0.
$$

The sample covariance therefore develops eigenvalues arbitrarily close to zero exactly around the interpolation threshold.

Since regression involves inverse eigenvalues, terms resembling

$$
\frac{1}{\lambda}
$$

become extremely large.

So the dramatic peak around $p=n$ is not mysterious at all from a spectral perspective:

> **The interpolation threshold is where the empirical spectrum approaches zero and noise amplification becomes most severe.**

Once we move sufficiently far into the overparameterized regime, the relevant spectrum moves away from this unstable boundary and variance can begin falling again.

---

# A Simple Risk Calculation

This behavior can even appear in one of the simplest possible settings.

For isotropic Gaussian linear regression, the variance component of prediction risk in the underparameterized regime behaves asymptotically like

$$
R_{\text{var}}
\approx
\sigma^2\frac{\gamma}{1-\gamma},
\qquad
\gamma<1.
$$

As

$$
\gamma\to1^-,
$$

this diverges.

On the overparameterized side, the minimum-norm interpolator has a variance term behaving like

$$
R_{\text{var}}
\approx
\frac{\sigma^2}{\gamma-1},
\qquad
\gamma>1.
$$

Again,

$$
R_{\text{var}}\to\infty
$$

as $\gamma\to1^+$.

But now something different happens as $\gamma$ increases:

$$
\frac{\sigma^2}{\gamma-1}\to0.
$$

The variance created by fitting noise begins to decrease.

There is also a bias cost because the minimum-norm solution cannot recover components of $\beta$ lying outside the row space of $X$. So the total risk still depends on the signal structure.

But even this simple model already contains the basic shape:

$$
\text{descent}
\rightarrow
\text{interpolation peak}
\rightarrow
\text{second descent}.
$$

No neural network is required.

---

# Interpolation Is Not the Same as Overfitting

This is probably the part of double descent that I find most interesting.

Classically, we often treat

$$
\text{training error}=0
$$

as almost synonymous with severe overfitting.

Double descent shows that this is too simple.

There can be many functions that interpolate the same training data, and they can have wildly different behavior away from those observations.

The important question is therefore not merely

> "Does the model interpolate?"

but rather

> **"Which interpolating solution does the learning algorithm select?"**

For linear regression, the Moore-Penrose pseudoinverse selects the minimum-$\ell_2$-norm solution.

In neural networks, gradient-based optimization can similarly impose forms of **implicit regularization**, preferring some interpolating solutions over others even when no explicit penalty appears in the objective.

The number of parameters alone therefore does not completely describe effective model complexity.

---

# Where the Classical Story Still Matters

Double descent does not mean the bias-variance tradeoff was wrong.

Instead, it shows that **parameter count is not always a monotone measure of statistical complexity**.

The classical U-shaped curve describes one regime of learning very well.

But once models become capable of interpolation, the geometry of the solution space and the learning algorithm's implicit regularization become important too.

The resulting picture looks more like

$$
\text{underparameterized}
\longrightarrow
\text{interpolation threshold}
\longrightarrow
\text{overparameterized}.
$$

Near interpolation, estimation can become extremely unstable.

Far beyond interpolation, however, additional parameters can create more ways to fit the data while still allowing the algorithm to select a relatively simple solution.

---

# The Bigger Picture

Double descent initially sounds almost paradoxical.

If a model is already complex enough to perfectly fit noisy training data, why would giving it even more parameters help?

The statistical answer is that fitting the data is only part of the story.

Near the interpolation threshold, the regression problem becomes spectrally unstable and noise is strongly amplified. Farther into the overparameterized regime, there are many more interpolating solutions, and minimum-norm or implicitly regularized learning algorithms can select solutions with better predictive behavior.

So perhaps the more useful picture is not

$$
\text{more parameters}
\Longrightarrow
\text{more overfitting}.
$$

Instead, we should think about

$$
\text{parameterization}
+
\text{data geometry}
+
\text{optimization}
+
\text{implicit regularization}.
$$

Together, these determine which function the model actually learns.

And that leads to the question that makes double descent so interesting:

> **If two models both achieve zero training error, what makes one interpolating solution generalize while another does not?**