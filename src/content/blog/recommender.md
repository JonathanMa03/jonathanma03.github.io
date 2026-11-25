---
title: "How Does Spotify Know What I Like? The Mathematics of Recommendation Systems"
date: "2026-11-24"
excerpt: "An exploration of embedding-based recommendation systems, how vector geometry captures musical preferences, and why reinforcement learning helps balance familiar recommendations with musical discovery."
tags: [Machine Learning, Recommendation Systems, Reinforcement Learning, Statistical Learning]
---

One thing I find interesting about Spotify is how it recommends songs that I have never heard before but somehow fit my musical preferences.

At first, this seems like a straightforward prediction problem: learn what someone likes and recommend more of it.

But suppose we could mathematically represent every song as a vector and every listener as another vector describing their musical preferences.

Recommending music could then become a simple application of linear algebra.

However, this raises a more interesting question:

> **If a recommendation system already knows what I like, why should it ever recommend something different?**

This is where recommendation systems start connecting to statistical learning, optimization, and reinforcement learning.

Let's build a simplified Spotify-like recommendation system to understand why.

---

# Representing Music as Vectors

Suppose we describe every song using five musical genres: pop, rock, jazz, classical, and electronic.

We could represent a song as a vector

$$
v_i\in\mathbb R^5,
$$

where each coordinate describes how strongly the song belongs to a particular genre.

For example, an electronic pop song might look like

$$
v_1=
\begin{bmatrix}
0.3\\
0.0\\
0.0\\
0.0\\
0.7
\end{bmatrix},
$$

while a song combining jazz and classical influences might look like

$$
v_2=
\begin{bmatrix}
0.0\\
0.0\\
0.8\\
0.2\\
0.0
\end{bmatrix}.
$$

Now suppose we represent a listener using a preference vector,

$$
u=
\begin{bmatrix}
0.6\\
0.4\\
0.1\\
0.2\\
0.9
\end{bmatrix}.
$$

This listener strongly prefers electronic music and pop, occasionally listens to rock, and appears less interested in jazz and classical music.

Both the listener and the songs now exist in the same vector space.

The recommendation problem becomes a question of measuring how well these vectors align.

---

# Recommendation as a Dot Product

One of the simplest ways to measure compatibility between two vectors is the dot product,

$$
s(u,v_i)=u^\top v_i.
$$

Expanding,

$$
u^\top v_i
=
\sum_{j=1}^{d}u_jv_{ij}.
$$

Each musical characteristic contributes to the recommendation score according to how strongly the listener prefers it.

For our electronic pop song,

$$
\begin{aligned}
u^\top v_1
&=0.6(0.3)+0.9(0.7)\\
&=0.81.
\end{aligned}
$$

For our jazz-classical song,

$$
\begin{aligned}
u^\top v_2
&=0.1(0.8)+0.2(0.2)\\
&=0.12.
\end{aligned}
$$

The electronic song receives a substantially higher score.

Given a catalog of $N$ songs, we could simply recommend

$$
i^*
=
\arg\max_{i\in\{1,\ldots,N\}}
u^\top v_i.
$$

If we wanted to generate an entire playlist, we could select the songs with the $k$ largest dot products.

There is also a nice geometric interpretation.

Recall that

$$
u^\top v_i
=
\|u\|_2\|v_i\|_2\cos(\theta_i).
$$

If we normalize both vectors, the dot product becomes cosine similarity:

$$
\operatorname{sim}(u,v_i)
=
\frac{u^\top v_i}
{\|u\|_2\|v_i\|_2}.
$$

Songs whose vectors point in similar directions to the preference vector receive higher similarity scores.

If we collect all song vectors into a matrix,

$$
V=
\begin{bmatrix}
v_1^\top\\
v_2^\top\\
\vdots\\
v_N^\top
\end{bmatrix},
$$

then the recommendation scores for the entire music library become

$$
s=Vu.
$$

In principle, recommending music is just a matrix-vector multiplication followed by sorting.

In practice, approximate nearest-neighbor and maximum inner-product search algorithms allow recommendation systems to retrieve promising candidates from millions of songs without scoring every song individually.

---

# From Genres to Learned Embeddings

Of course, music is considerably more complicated than five genres.

Two electronic songs might differ in tempo, mood, instrumentation, energy, and production style.

Instead of manually defining every musical characteristic, we can learn vector representations directly from data.

These representations are called **embeddings**.

Suppose we construct a listener-song interaction matrix,

$$
R\in\mathbb R^{m\times n},
$$

where $R_{ij}$ represents some measure of interaction between listener $i$ and song $j$.

This could incorporate listening frequency, skips, saves, or playlist additions.

One classical approach is to approximate this matrix through low-rank factorization,

$$
R\approx UV^\top,
$$

where

$$
U\in\mathbb R^{m\times d},
\qquad
V\in\mathbb R^{n\times d}.
$$

The rows of $U$ represent listener embeddings, while the rows of $V$ represent song embeddings.

The predicted affinity between listener $i$ and song $j$ becomes

$$
\widehat R_{ij}=u_i^\top v_j.
$$

We can learn these embeddings by solving

$$
\min_{U,V}
\sum_{(i,j)\in\Omega}
(R_{ij}-u_i^\top v_j)^2
+
\lambda
\left(
\|U\|_F^2+\|V\|_F^2
\right),
$$

where $\Omega$ represents observed interactions and $\lambda$ controls regularization.

This is a form of **collaborative filtering**.

The interesting part is that individual embedding dimensions no longer need to correspond to explicitly defined genres.

Two songs might acquire similar embeddings simply because similar listeners enjoy them.

Modern recommendation systems can combine these behavioral embeddings with representations learned from audio, lyrics, metadata, and listening history.

The genre example is therefore just an interpretable illustration of a much more general mathematical framework.

---

# How Does the Preference Vector Change?

Suppose a listener receives a recommendation at time $t$ and provides feedback $r_t$.

We might model their expected response as

$$
\widehat r_t=u_t^\top v_t.
$$

To update our preference vector, we could minimize the squared prediction error,

$$
L(u_t)
=
\frac{1}{2}(r_t-u_t^\top v_t)^2.
$$

Taking the gradient gives

$$
\nabla_{u_t}L
=
-(r_t-u_t^\top v_t)v_t.
$$

A gradient descent update therefore becomes

$$
u_{t+1}
=
u_t+\eta(r_t-u_t^\top v_t)v_t.
$$

This has a surprisingly intuitive geometric interpretation.

If the listener enjoys a song more than expected, the preference vector moves toward the song's embedding.

If the listener enjoys it less than expected, the preference vector moves away.

Over time, the system gradually learns which directions in the embedding space correspond to the listener's musical preferences.

But there is a catch.

The system can only learn from songs that the listener actually encounters.

---

# Why Not Just Maximize the Dot Product?

Suppose Spotify always recommended songs according to

$$
v_t
=
\arg\max_{v\in\mathcal V}
u_t^\top v.
$$

This seems like a perfectly reasonable strategy.

But imagine that I primarily listen to electronic music.

The system learns that I enjoy electronic music, recommends more electronic music, observes more electronic music consumption, and becomes increasingly confident that electronic music is what I want.

We get a feedback loop:

$$
\text{preferences}
\longrightarrow
\text{recommendations}
\longrightarrow
\text{observed behavior}
\longrightarrow
\text{updated preferences}.
$$

Meanwhile, I might have an undiscovered interest in jazz.

The system never learns about it because it never recommends jazz in the first place.

There is an important statistical distinction between

- observing that someone dislikes jazz, and
- never observing someone listen to jazz.

Both might produce a low estimated preference, but they represent very different levels of uncertainty.

The recommendation system is actively determining which data it gets to observe.

This creates a form of exposure bias, where existing recommendations influence the data used to construct future recommendations.

> **How can a system learn that I enjoy something if it never gives me the opportunity to experience it?**

There is also a practical issue.

Even if the system perfectly understands my preferences, listening to nearly identical songs repeatedly might eventually become boring.

Maximizing immediate predicted satisfaction is not necessarily equivalent to maximizing long-term satisfaction.

---

# Exploration vs. Exploitation

This motivates one of the fundamental problems in reinforcement learning.

**Exploitation** means recommending songs that the system already believes I will enjoy.

**Exploration** means recommending songs whose appeal is uncertain, potentially discovering new preferences.

Suppose we have two candidate songs:

| Song | Predicted Satisfaction | Uncertainty |
|---|---:|---:|
| Electronic | 0.85 | 0.02 |
| Jazz | 0.65 | 0.25 |

A greedy recommendation system always chooses electronic music.

But notice that we are considerably more uncertain about the listener's preference for jazz.

The electronic song provides relatively predictable satisfaction.

The jazz song might provide information that improves hundreds of future recommendations.

One simple solution is an $\epsilon$-greedy policy:

$$
a_t=
\begin{cases}
\arg\max_i u_t^\top v_i,
& \text{with probability }1-\epsilon,\\
\text{random eligible song},
& \text{with probability }\epsilon.
\end{cases}
$$

If $\epsilon=0.1$, the system exploits its existing knowledge 90% of the time and explores alternatives 10% of the time.

However, randomly recommending songs is not necessarily an efficient way to learn.

Ideally, exploration should be directed toward songs that are both potentially enjoyable and informative.

---

# Adding Uncertainty to the Dot Product

Suppose the listener's true preference vector is unknown, and their feedback follows a linear model,

$$
r_t=u^\top v_t+\varepsilon_t.
$$

Using previous interactions, we can construct a regularized least-squares estimate,

$$
\widehat u_t=A_t^{-1}b_t,
$$

where

$$
A_t
=
\lambda I+
\sum_{s=1}^{t-1}v_sv_s^\top
$$

and

$$
b_t
=
\sum_{s=1}^{t-1}r_sv_s.
$$

The matrix $A_t$ contains information about which directions in the embedding space we have already explored.

Rather than simply maximizing the predicted preference, we could construct an uncertainty-adjusted recommendation score,

$$
\boxed{
s_t(v)
=
\underbrace{\widehat u_t^\top v}_{\text{exploitation}}
+
\underbrace{
\alpha\sqrt{v^\top A_t^{-1}v}
}_{\text{exploration}}
}
$$

This is the intuition behind the Linear Upper Confidence Bound algorithm, or **LinUCB**.

The first term measures predicted satisfaction.

The second measures uncertainty about that prediction, scaled by an exploration parameter $\alpha$.

Using our earlier example with $\alpha=1$, the electronic song receives

$$
s_{\text{electronic}}
=
0.85+0.02
=
0.87,
$$

while the jazz song receives

$$
s_{\text{jazz}}
=
0.65+0.25
=
0.90.
$$

The system now recommends jazz.

Not because it necessarily believes jazz is better, but because learning whether it is better has value.

As the system observes more jazz-related interactions, its uncertainty in that direction decreases.

What I find particularly elegant is that we have not abandoned the original dot product.

We have simply augmented it with a statistical measure of what we do not yet know.

---

# A Bayesian Interpretation

Another approach is to represent the listener's preferences using an entire probability distribution rather than a single estimated vector.

Suppose

$$
u\mid\mathcal D_t
\sim
\mathcal N(\mu_t,\Sigma_t),
$$

where $\mathcal D_t$ represents the observed listening history.

The latent preference score for a song then follows

$$
u^\top v\mid\mathcal D_t
\sim
\mathcal N
\left(
\mu_t^\top v,
v^\top\Sigma_t v
\right).
$$

We now have both an expected preference and uncertainty surrounding that preference.

One approach is to sample a plausible preference vector from the posterior,

$$
\widetilde u_t
\sim
p(u\mid\mathcal D_t),
$$

and recommend

$$
v_t
=
\arg\max_{v\in\mathcal V}
\widetilde u_t^\top v.
$$

This is known as **Thompson sampling**.

If we are highly confident about the listener's preferences, posterior samples will look similar, resulting primarily in exploitation.

If we are uncertain about particular genres, some posterior samples will favor those genres, naturally encouraging exploration.

Rather than explicitly introducing randomness into recommendations, we allow uncertainty about the listener's preferences to drive exploration.

---

# From Recommendation to Reinforcement Learning

The methods we have discussed so far are examples of bandit algorithms.

They address the problem of learning which recommendations produce desirable rewards.

But music consumption is inherently sequential.

The song I hear now may influence what I want to hear next.

Discovering a new artist might change my listening habits for months. Hearing five nearly identical songs might make me want something completely different.

This motivates a more general reinforcement learning formulation.

We can describe the recommendation problem as a Markov decision process,

$$
\mathcal M=(\mathcal S,\mathcal A,P,R,\gamma).
$$

The state $s_t$ could contain the listener's preference embedding, recent listening history, and current context.

The action $a_t$ is the song being recommended.

The reward $r_t$ represents the listener's response, while the state evolves according to

$$
s_{t+1}
\sim
P(\cdot\mid s_t,a_t).
$$

Rather than maximizing the predicted satisfaction of the next song, we seek a policy $\pi$ that maximizes expected cumulative satisfaction,

$$
J(\pi)
=
\mathbb E_\pi
\left[
\sum_{t=0}^{\infty}
\gamma^t r_t
\right].
$$

The discount factor $\gamma$ determines how much importance we place on future rewards relative to immediate rewards.

The recommendation problem is no longer simply

$$
\max_v u^\top v.
$$

It becomes an optimization problem over an entire sequence of recommendations.

---

# Why the Best Song Right Now Might Not Be the Best Recommendation

The distinction becomes particularly clear through the Bellman equation,

$$
Q^*(s,a)
=
\mathbb E
\left[
r_t+
\gamma\max_{a'}Q^*(s_{t+1},a')
\mid s_t=s,a_t=a
\right].
$$

The value of recommending a song now contains two components:

$$
\text{action value}
=
\text{immediate reward}
+
\text{discounted future value}.
$$

Suppose recommending another electronic song produces an immediate reward of $0.9$, while recommending an unfamiliar jazz song produces an expected reward of $0.6$.

A greedy system chooses electronic music.

But suppose discovering jazz leads to better future recommendations.

For illustration, let

$$
\gamma=0.9.
$$

If the expected continuation values are $2.0$ and $3.0$, respectively, then

$$
Q_{\text{electronic}}
=
0.9+0.9(2.0)
=
2.7,
$$

while

$$
Q_{\text{jazz}}
=
0.6+0.9(3.0)
=
3.3.
$$

The jazz recommendation has a lower immediate reward but a higher long-term value.

This is the fundamental distinction between greedy recommendation and reinforcement learning.

If the state also includes the system's current knowledge about the listener, then acquiring information can itself improve future decision-making.

Reinforcement learning provides a framework for capturing these downstream consequences.

It does not automatically solve exploration, however. We still need an appropriate exploration strategy, state representation, and reward function.

---

# What Should Spotify Actually Optimize?

There is one final complication.

What exactly constitutes a good recommendation?

Is it listening duration? Playlist additions? Discovering new artists? Long-term satisfaction?

These are not necessarily equivalent objectives.

We could imagine a reward function of the form

$$
r_t
=
w_1r_t^{\text{engagement}}
+
w_2r_t^{\text{discovery}}
+
w_3r_t^{\text{satisfaction}}
-
w_4r_t^{\text{repetition}}.
$$

Different choices of weights produce different recommendation behaviors.

A system that exclusively maximizes listening duration might favor familiar songs because they are less likely to be skipped.

A system that places more value on discovery might produce a more diverse listening experience.

This connects to a broader problem in reinforcement learning:

> **Optimizing a measurable proxy for satisfaction is not necessarily the same as optimizing satisfaction itself.**

Even a mathematically optimal recommendation policy can produce undesirable behavior if it is optimizing the wrong objective.

---

# The Bigger Picture

What I find interesting about recommendation systems is how naturally they connect several areas of mathematics and statistics.

We start with a simple dot product,

$$
u^\top v,
$$

which measures compatibility between a listener and a song.

Matrix factorization allows us to learn latent representations of musical preferences.

Statistical learning allows us to update those representations from observed behavior.

Bandit algorithms introduce uncertainty and exploration into the recommendation process.

Reinforcement learning extends the problem to long-term sequential decision-making.

We essentially move from

$$
\text{vector geometry}
\longrightarrow
\text{statistical estimation}
\longrightarrow
\text{sequential optimization}.
$$

The original dot product remains useful. It provides an efficient way to identify songs that align with our current understanding of a listener.

But a good recommendation system should do more than reproduce that understanding.

It should recognize what it does not know, explore uncertain preferences, and account for how its recommendations influence future behavior.

And perhaps that is what makes recommendation systems so interesting.

> **Should a recommendation system simply predict what I like, or should it also help me discover what I didn't know I liked?**