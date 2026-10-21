---
title: "What Happens When You Combine DiD and RDD? Difference-in-Discontinuities"
date: "2026-10-21"
excerpt: "A derivation of difference-in-discontinuities by combining the before-and-after logic of difference-in-differences with the local threshold comparison of regression discontinuity."
tags: [Econometrics, Causal Inference, Difference-in-Differences, Regression Discontinuity]
---

Two of the most recognizable tools in causal inference are **difference-in-differences (DiD)** and **regression discontinuity designs (RDD)**.

They seem to exploit very different sources of quasi-experimental variation.

DiD asks:

> **Did the treated group change differently over time than the control group?**

RDD asks:

> **Is there a discontinuous change in outcomes exactly where treatment assignment changes?**

But suppose we have both.

There is a treatment threshold, and we observe outcomes before and after a new policy is introduced at that threshold.

Then we can essentially take the **difference of the discontinuities**.

This gives us **difference-in-discontinuities (DiDC)**.

And the easiest way to understand it is to build it from DiD and RDD.

---

# Start With Difference-in-Differences

Suppose we have two groups and two periods.

Let

$$
Y_{g,t}
$$

denote the expected outcome for group $g$ at time $t$, where

$$
g\in\{0,1\},
\qquad
t\in\{0,1\}.
$$

The usual DiD estimator is

$$
\tau_{\text{DiD}}
=
(Y_{1,1}-Y_{1,0})
-
(Y_{0,1}-Y_{0,0}).
$$

The first difference,

$$
Y_{1,1}-Y_{1,0},
$$

asks how the treated group changed over time.

The second,

$$
Y_{0,1}-Y_{0,0},
$$

asks how the control group changed.

Subtracting them removes changes that would have occurred anyway:

$$
\tau_{\text{DiD}}
=
\Delta Y_1-\Delta Y_0.
$$

So DiD is fundamentally a **difference across time, followed by a difference across groups**.

---

# Now Think About RDD

RDD creates the two groups differently.

Suppose treatment assignment depends on a running variable $Z$ and threshold $z_0$:

$$
D_i
=
\mathbf 1\{Z_i\geq z_0\}.
$$

Instead of comparing all treated and untreated observations, RDD compares units immediately above and below the threshold.

Define

$$
\mu(z)
=
\mathbb E[Y_i\mid Z_i=z].
$$

The RDD estimand is

$$
\tau_{\text{RDD}}
=
\lim_{z\to z_0^+}\mu(z)
-
\lim_{z\to z_0^-}\mu(z).
$$

So we are measuring the jump

$$
\text{RDD}
=
\text{right side of threshold}
-
\text{left side of threshold}.
$$

If potential outcomes would otherwise evolve smoothly through $z_0$, a discontinuity at exactly that point can identify a local treatment effect.

---

# Now Add Time to the RDD

Suppose we observe the same threshold in two periods,

$$
t=0
\qquad\text{and}\qquad
t=1,
$$

with the treatment of interest introduced sometime between them.

Define the conditional outcome function in each period as

$$
\mu_t(z)
=
\mathbb E[Y_{i,t}\mid Z_i=z].
$$

We can estimate an RDD before the treatment:

$$
\tau_0^{\text{RDD}}
=
\lim_{z\to z_0^+}\mu_0(z)
-
\lim_{z\to z_0^-}\mu_0(z).
$$

And another RDD after the treatment:

$$
\tau_1^{\text{RDD}}
=
\lim_{z\to z_0^+}\mu_1(z)
-
\lim_{z\to z_0^-}\mu_1(z).
$$

If there were no pre-existing discontinuity, we might simply use

$$
\tau_1^{\text{RDD}}
$$

as our treatment effect.

But what if the outcome already jumped at $z_0$ before the treatment existed?

Then the post-treatment discontinuity contains two things:

$$
\text{post-treatment jump}
=
\text{pre-existing jump}
+
\text{new treatment effect}.
$$

A standard post-treatment RDD cannot automatically distinguish between them.

This is where the DiD idea becomes useful.

---

# Difference the RDDs

If the pre-treatment discontinuity captures the confounding jump already present at the threshold, subtract it:

$$
\tau_{\text{DiDC}}
=
\tau_1^{\text{RDD}}
-
\tau_0^{\text{RDD}}.
$$

Expanding this gives

$$
\tau_{\text{DiDC}}
=
\left[
\mu_1(z_0^+)-\mu_1(z_0^-)
\right]
-
\left[
\mu_0(z_0^+)-\mu_0(z_0^-)
\right].
$$

Now rearrange:

$$
\tau_{\text{DiDC}}
=
\left[
\mu_1(z_0^+)-\mu_0(z_0^+)
\right]
-
\left[
\mu_1(z_0^-)-\mu_0(z_0^-)
\right].
$$

And suddenly it looks exactly like DiD.

We are comparing the change over time just above the threshold with the change over time just below it.

In other words,

$$
\boxed{
\text{DiDC}
=
\text{DiD evaluated locally at the RDD cutoff}
}
$$

or, equivalently,

$$
\boxed{
\text{DiDC}
=
\text{post-treatment RDD}
-
\text{pre-treatment RDD}.
}
$$

---

# Or Difference First, Then Run the RDD

There is another way to derive exactly the same object.

For each observation, define the change in its outcome:

$$
\Delta Y_i
=
Y_{i,1}-Y_{i,0}.
$$

Now forget about the original outcome for a moment and treat

$$
\Delta Y_i
$$

as the dependent variable.

Define

$$
\Delta\mu(z)
=
\mathbb E[\Delta Y_i\mid Z_i=z].
$$

Then simply run an RDD on the change:

$$
\tau_{\text{DiDC}}
=
\lim_{z\to z_0^+}\Delta\mu(z)
-
\lim_{z\to z_0^-}\Delta\mu(z).
$$

Expanding,

$$
\tau_{\text{DiDC}}
=
\lim_{z\to z_0^+}
\left[
\mu_1(z)-\mu_0(z)
\right]
-
\lim_{z\to z_0^-}
\left[
\mu_1(z)-\mu_0(z)
\right].
$$

Which is exactly the same expression as before.

So there are two equivalent ways of thinking about the design:

$$
\text{DiDC}
=
\text{difference of RDDs}
$$

and

$$
\text{DiDC}
=
\text{RDD of differences}.
$$

The paper by Picchetti, Pinto, and Shinoki focuses primarily on the second interpretation because it connects naturally with the established nonparametric RDD framework.

---

# What Exactly Are We Differencing Away?

This is where I think the intuition becomes clearest.

Imagine the threshold already creates a discontinuity before our policy is introduced.

Suppose

$$
\tau_0^{\text{RDD}}=3.
$$

Then after the policy,

$$
\tau_1^{\text{RDD}}=8.
$$

A post-treatment RDD alone would see a jump of $8$.

But we already know that a jump of $3$ existed before the policy.

DiDC instead estimates

$$
\tau_{\text{DiDC}}
=
8-3
=
5.
$$

The idea is that the old discontinuity gets differenced away.

Graphically, we are not really asking whether there is a jump after treatment.

We are asking:

> **Did the size of the jump itself change after treatment?**

That is the DiD logic applied to an RDD.

---

# The Important Assumption

Of course, subtracting the old discontinuity only works if it is reasonable to use that old discontinuity as the counterfactual for the new one.

The paper formalizes this through a **time-invariance assumption on the confounding effect**.

Conceptually, suppose

$$
C_t
$$

is the discontinuity caused by some pre-existing confounding policy.

We need

$$
C_1=C_0.
$$

Then the pre-treatment RDD is

$$
\tau_0^{\text{RDD}}=C,
$$

while the post-treatment RDD becomes

$$
\tau_1^{\text{RDD}}
=
C+\tau.
$$

Subtracting gives

$$
\tau_{\text{DiDC}}
=
(C+\tau)-C
=
\tau.
$$

But if the confounding discontinuity itself changes,

$$
C_1\neq C_0,
$$

then

$$
\tau_{\text{DiDC}}
=
\tau+(C_1-C_0).
$$

Now the estimator mixes the treatment effect with the changing confounding effect.

So DiDC does not magically remove every discontinuity-related confounder.

It removes **time-invariant discontinuities**.

---

# This Is Similar to Parallel Trends, But Local

This reminds me of the logic behind DiD.

Standard DiD requires us to believe that, without treatment, the treated and control groups would have experienced comparable changes over time.

DiDC replaces that broad comparison with something much more local.

We care about observations near

$$
Z=z_0.
$$

The identifying argument becomes roughly:

> Whatever was already causing the jump at this threshold would have continued generating the same jump if the new treatment had never appeared.

So instead of relying entirely on global treated-versus-control comparisons, we combine temporal differencing with the local comparison provided by RDD.

This is what allows DiDC to be useful in settings where a conventional DiD parallel-trends assumption may be questionable but a threshold provides credible local variation.

---

# Estimation Becomes Surprisingly Simple

Once we use the "RDD of differences" interpretation, estimation becomes very familiar.

First calculate

$$
\Delta Y_i
=
Y_{i,1}-Y_{i,0}.
$$

Then estimate local regressions on each side of the threshold.

For a local linear specification, we could write

$$
\Delta Y_i
=
\alpha_-
+
\beta_-(Z_i-z_0)
+
\varepsilon_i,
\qquad
Z_i<z_0,
$$

and

$$
\Delta Y_i
=
\alpha_+
+
\beta_+(Z_i-z_0)
+
\varepsilon_i,
\qquad
Z_i\geq z_0.
$$

The DiDC estimate is simply the difference between the fitted intercepts at the cutoff:

$$
\hat\tau_{\text{DiDC}}
=
\hat\alpha_+
-
\hat\alpha_-.
$$

So computationally, DiDC can look almost exactly like an ordinary RDD.

The main difference is that the outcome being analyzed is now

$$
\Delta Y
$$

rather than $Y$.

The paper develops this idea using local polynomial estimation and the robust RDD framework of Calonico, Cattaneo, and Titiunik.

---

# There Is Also a Bias Interpretation

There is another interesting reason to think about the estimator as a difference of RDDs.

The paper shows that its bias can be decomposed as

$$
\operatorname{Bias}
(
\hat\tau_{\text{DiDC}}
)
=
\operatorname{Bias}
(
\hat\tau_1^{\text{RDD}}
)
-
\operatorname{Bias}
(
\hat\tau_0^{\text{RDD}}
).
$$

This means the pre-treatment period can potentially subtract away not only a pre-existing discontinuity, but also some of the approximation bias that would appear in a post-treatment RDD.

If the shapes of the underlying regression functions are sufficiently stable over time, those biases can cancel.

That gives DiDC an interesting interpretation beyond confounding adjustment:

$$
\text{additional pre-treatment information}
\longrightarrow
\text{potential bias cancellation}.
$$

Of course, that benefit depends on stability across time. If the underlying data-generating process changes substantially, the pre-period may no longer provide the useful comparison we hoped for.

---

# Why Not Just Use DiD or RDD?

The interesting case is where neither design alone is completely satisfying.

Suppose there is a pre-existing discontinuity at the treatment threshold.

Then

$$
\text{RDD alone}
$$

can mistakenly attribute that existing jump to the new treatment.

At the same time, suppose treated and control observations away from the threshold evolve differently.

Then

$$
\text{DiD alone}
$$

may have an implausible parallel-trends assumption.

DiDC tries to exploit both dimensions:

$$
\boxed{
\text{variation across time}
+
\text{variation around a threshold}.
}
$$

The time dimension helps remove persistent discontinuities.

The threshold dimension keeps the comparison local.

That is the sense in which DiDC really does feel like combining the identifying ideas behind DiD and RDD rather than merely giving a new name to another regression specification.

---

# The Bigger Picture

What I like about difference-in-discontinuities is that the estimator almost derives itself once DiD and RDD are written next to each other.

DiD gives

$$
(\text{treated after}-\text{treated before})
-
(\text{control after}-\text{control before}).
$$

RDD gives

$$
\text{right of cutoff}
-
\text{left of cutoff}.
$$

Put them together and we get

$$
\begin{aligned}
\tau_{\text{DiDC}}
&=
(\text{right after}-\text{left after})\\
&\quad-
(\text{right before}-\text{left before}).
\end{aligned}
$$

Or, after rearranging,

$$
\begin{aligned}
\tau_{\text{DiDC}}
&=
(\text{right after}-\text{right before})\\
&\quad-
(\text{left after}-\text{left before}).
\end{aligned}
$$

The first expression looks like a **difference of RDDs**.

The second looks like a **local DiD**.

And if we define

$$
\Delta Y=Y_{\text{after}}-Y_{\text{before}},
$$

the entire thing collapses into one particularly elegant expression:

$$
\boxed{
\tau_{\text{DiDC}}
=
\lim_{z\to z_0^+}
\mathbb E[\Delta Y\mid Z=z]
-
\lim_{z\to z_0^-}
\mathbb E[\Delta Y\mid Z=z].
}
$$

In other words:

> **Take the difference over time, then look for a discontinuity in that difference.**

Sometimes combining two causal inference designs really is that intuitive.