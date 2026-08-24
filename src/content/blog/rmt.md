---
title: "Random Matrix Theory for Medical Imaging: From Spectral Structure to Abnormality Detection"
date: "2026-08-24"
excerpt: "An intuitive look at how random matrix theory can separate structured anatomical signal from high-dimensional noise, and how spectral methods can support medical image segmentation and lesion detection."
tags: [Random Matrix Theory, Medical Imaging, Computer Vision, Statistical Learning]
---

Medical images are naturally high-dimensional objects. An OCT B-scan, MRI slice, or CT image may contain hundreds of thousands of pixels, while a three-dimensional volume can contain millions of voxels. Modern imaging studies then repeat these measurements across patients, locations, slices, or time.

This creates an interesting statistical problem: **how much of the observed variation represents meaningful anatomical structure, and how much is simply high-dimensional noise?**

Random matrix theory (RMT) provides one way of thinking about this problem. Instead of analyzing individual pixels independently, RMT studies the spectral behavior of large matrices and asks whether their eigenvalues and eigenvectors look like what we would expect from random variation alone.

For medical image analysis, this creates a useful perspective on denoising, dimensionality reduction, segmentation, and abnormality detection.

---

# Images as High-Dimensional Matrices

Consider an image represented by

$$
X\in\mathbb{R}^{H\times W},
$$

where $H$ and $W$ are the image height and width.

Rather than analyzing the raw image directly, we might divide it into $n$ patches and flatten each patch into a $p$-dimensional feature vector,

$$
x_i\in\mathbb{R}^{p}.
$$

Stacking these vectors produces a data matrix

$$
X=
\begin{bmatrix}
x_1^\top\\
x_2^\top\\
\vdots\\
x_n^\top
\end{bmatrix}
\in\mathbb{R}^{n\times p}.
$$

The features do not necessarily have to be raw pixel intensities. They could instead represent

- convolutional features,
- texture measurements,
- retinal layer thicknesses,
- wavelet coefficients,
- embeddings from a neural network.

From here, we can construct a sample covariance matrix,

$$
S=\frac{1}{n}X^\top X.
$$

Its eigendecomposition is

$$
S
=
V\Lambda V^\top,
$$

where

$$
\Lambda
=
\operatorname{diag}(\lambda_1,\ldots,\lambda_p).
$$

Large eigenvalues correspond to directions containing substantial variation. The difficult question is whether that variation represents meaningful anatomical structure or merely noise.

---

# The High-Dimensional Problem

Classical statistics often assumes that the number of observations is much larger than the number of variables,

$$
n\gg p.
$$

Medical imaging frequently violates this assumption.

A dataset might contain a few hundred patients while each image contributes thousands or millions of measurements. We may therefore operate in a regime where

$$
\frac{p}{n}\rightarrow\gamma,
$$

for some non-negligible constant $\gamma>0$.

In this setting, sample covariance matrices behave differently from their low-dimensional counterparts. Even if the underlying data contain only independent noise, their empirical eigenvalues will not all equal the true variance.

They spread across a nontrivial spectrum.

Random matrix theory tells us what that spectrum should look like.

---

# The Marchenko-Pastur Distribution

Suppose the entries of $X$ are independent with

$$
\mathbb{E}[X_{ij}]=0
$$

and

$$
\operatorname{Var}(X_{ij})=\sigma^2.
$$

When

$$
\frac{p}{n}\rightarrow\gamma,
$$

the eigenvalue distribution of

$$
S=\frac{1}{n}X^\top X
$$

converges to the **Marchenko-Pastur distribution**.

Its support is approximately

$$
\lambda_{\pm}
=
\sigma^2(1\pm\sqrt{\gamma})^2.
$$

Under this idealized noise model, most eigenvalues should therefore lie between

$$
\lambda_-
\quad\text{and}\quad
\lambda_+.
$$

This gives us a useful statistical baseline.

If an empirical eigenvalue satisfies

$$
\lambda_i>\lambda_+,
$$

it may represent structured signal that cannot easily be explained by isotropic random noise.

This does not automatically mean that the eigenvector represents a lesion or meaningful anatomy. But it gives us a principled way to ask which spectral components deserve further attention.

---

# Signal Plus Noise

A medical image can be conceptualized as

$$
X=S+E,
$$

where

- $S$ contains structured anatomical or pathological signal,
- $E$ contains noise.

If $S$ is approximately low-rank, then only a relatively small number of directions may contain strong coherent structure.

This leads to a decomposition resembling

$$
X
=
\sum_{i=1}^{r}
\sigma_i u_i v_i^\top
+
E.
$$

The first term captures dominant spatial structure, while the remaining components increasingly resemble noise.

This perspective connects RMT naturally with principal component analysis and singular value decomposition. The important difference is that RMT provides theoretical guidance for deciding **when a spectral component is unusually large relative to what noise alone would produce**.

---

# Spiked Covariance Models

A particularly useful model is the **spiked covariance model**.

Suppose

$$
\Sigma
=
\sigma^2I
+
\sum_{k=1}^{r}
\theta_k u_k u_k^\top.
$$

The isotropic component

$$
\sigma^2I
$$

represents background variation, while the low-rank perturbations

$$
\theta_k u_k u_k^\top
$$

represent structured signals.

In medical imaging, those signals might correspond to

- anatomical boundaries,
- lesions,
- fluid compartments,
- abnormal texture,
- localized transmission patterns.

If a signal is sufficiently strong, its corresponding sample eigenvalue separates from the random spectral bulk.

Conceptually,

$$
\text{background noise}
\longrightarrow
\text{bulk eigenvalues},
$$

while

$$
\text{structured abnormality}
\longrightarrow
\text{spectral outlier}.
$$

This provides a natural bridge between random matrix theory and abnormality detection.

---

# From Global Spectra to Local Detection

A global covariance matrix tells us whether unusual structure exists, but lesion detection requires knowing **where** it exists.

One approach is to perform spectral analysis locally.

Suppose an image is divided into patches

$$
P_1,P_2,\ldots,P_K.
$$

For each local region, construct a feature matrix $X_k$ and covariance matrix

$$
S_k
=
\frac{1}{n_k}
X_k^\top X_k.
$$

We can then compare the largest local eigenvalue against an estimated noise edge,

$$
A_k
=
\frac{\lambda_{\max}(S_k)}
{\lambda_{+,k}}.
$$

Regions satisfying

$$
A_k>1
$$

contain more dominant spectral structure than expected under the reference noise model.

The resulting values can be mapped back into image space to produce an **anomaly map**.

Rather than asking a classifier directly whether each pixel is diseased, we first ask whether a local region has departed from its expected spectral structure.

---

# Lesion Detection as Spectral Change Detection

This idea becomes particularly interesting when healthy reference data are available.

Suppose

$$
\Sigma_0
$$

describes the covariance structure of normal tissue, while

$$
\Sigma_1
$$

describes a region containing pathology.

Abnormality detection can then be framed as

$$
H_0:\Sigma=\Sigma_0
$$

versus

$$
H_1:\Sigma\neq\Sigma_0.
$$

A lesion may alter

- the leading eigenvalue,
- the shape of the eigenspectrum,
- eigenvector localization,
- effective rank,
- correlations between neighboring features.

An anomaly score could therefore incorporate several spectral quantities,

$$
A(x)
=
\alpha_1\lambda_{\max}
+
\alpha_2D_{\text{spectral}}
+
\alpha_3L_{\text{eigenvector}},
$$

where $D_{\text{spectral}}$ measures departure from a reference spectrum and $L_{\text{eigenvector}}$ measures localization of dominant spectral directions.

The result is a statistical detector based on changes in covariance structure rather than only changes in intensity.

---

# Segmentation Through Spectral Structure

Segmentation presents a related problem.

Suppose neighboring pixels or patches belong to the same anatomical region. Their features should exhibit relatively coherent dependence. Crossing a tissue boundary changes that dependence structure.

We can construct an affinity matrix

$$
W_{ij}
=
\exp
\left(
-\frac{\|x_i-x_j\|^2}{2\sigma^2}
\right)
$$

and define the graph Laplacian

$$
L=D-W,
$$

where

$$
D_{ii}
=
\sum_j W_{ij}.
$$

The eigenvectors of $L$ reveal low-dimensional structure in the image graph and form the basis of spectral clustering and segmentation methods.

Random matrix ideas become useful when deciding which spectral components represent genuine organization rather than fluctuations produced by noisy high-dimensional features.

In this sense, RMT does not necessarily replace a segmentation algorithm. Instead, it can provide a statistical framework for determining which parts of the spectrum are informative enough to retain.

---

# Eigenvector Localization

Eigenvalues are only part of the story.

An eigenvector

$$
v=(v_1,\ldots,v_p)
$$

describes where a spectral component places its weight.

A useful quantity is the **inverse participation ratio**,

$$
\operatorname{IPR}(v)
=
\sum_{i=1}^{p}v_i^4.
$$

For a normalized eigenvector spread approximately uniformly across all $p$ dimensions,

$$
v_i\approx\frac{1}{\sqrt p},
$$

giving

$$
\operatorname{IPR}(v)
\approx
\frac{1}{p}.
$$

A highly localized eigenvector has a much larger IPR.

This is potentially useful for lesion detection because pathological structure is often spatially localized. A spectral outlier accompanied by a localized eigenvector may be more interesting than a large eigenvalue representing a global imaging artifact.

---

# Application to Retinal OCT

Retinal OCT provides a particularly interesting setting for these ideas because the images contain strong anatomical structure alongside acquisition noise and localized pathology.

Consider hypertransmission associated with retinal atrophy. These regions often appear as vertically oriented areas of increased signal transmission beneath the retinal pigment epithelium.

Rather than relying only on intensity, one could construct local feature vectors containing

- intensity,
- vertical gradients,
- texture,
- retinal layer position,
- local transmission statistics,
- learned CNN features.

For each local region, we could estimate a covariance matrix and compare its spectrum with the spectrum observed in normal tissue.

A hypertransmission region might then produce

$$
\lambda_{\max}(S_{\text{HT}})
>
\lambda_+(S_{\text{normal}}),
$$

or alter the spectral distribution more generally.

The important idea is that pathology may not simply make pixels brighter. It may change the **correlation structure of the image**.

That is precisely the type of high-dimensional structure spectral methods are designed to detect.

---

# RMT and Deep Learning

These ideas do not have to compete with deep neural networks.

Suppose a CNN produces an intermediate representation

$$
Z\in\mathbb{R}^{n\times p}.
$$

Instead of applying RMT directly to raw pixels, we could study

$$
C_Z
=
\frac{1}{n}Z^\top Z.
$$

This creates several possibilities:

- detect abnormal feature spectra,
- identify redundant learned representations,
- distinguish signal-dominated from noise-dominated components,
- monitor representation changes under distribution shift,
- construct spectral anomaly scores from learned features.

A segmentation network could therefore provide the representation while RMT provides diagnostics about its high-dimensional geometry.

This is especially appealing in medical imaging, where understanding **why** a model considers a region unusual can be almost as important as producing the prediction itself.

---

# Important Limitations

The classical random matrix models are intentionally idealized.

Medical images clearly violate assumptions such as

$$
X_{ij}\overset{iid}{\sim}(0,\sigma^2).
$$

Pixels are spatially correlated, anatomical structures are highly organized, scanner noise may be heteroskedastic, and feature representations from neural networks are certainly not independent.

Therefore, observing

$$
\lambda_i>\lambda_+
$$

should not be interpreted as automatic proof of pathology.

The Marchenko-Pastur law is better thought of as a **null model**: a theoretical description of what an unstructured high-dimensional system might look like. The scientifically interesting part is then understanding how real imaging data depart from that null.

---

# Looking Forward

Random matrix theory offers a different way of thinking about medical images.

Instead of viewing an image only as a collection of pixels, we can view it as a high-dimensional system whose covariance structure contains information about anatomy, pathology, and noise.

That perspective naturally connects

$$
\text{Random Matrix Theory}
\longrightarrow
\text{Spectral Analysis}
\longrightarrow
\text{Signal Detection}
\longrightarrow
\text{Medical Image Analysis}.
$$

For lesion detection, the interesting question becomes whether abnormal tissue creates statistically detectable departures from the spectral structure of normal anatomy. For segmentation, spectral structure can help identify coherent regions and determine which high-dimensional components contain meaningful information.

And for modern deep learning systems, RMT provides tools for studying the representations themselves rather than treating a neural network as a completely opaque feature extractor.

The broader idea is one I find particularly appealing: **a lesion can be viewed not only as something that looks different, but as something that changes the high-dimensional statistical geometry of an image.**