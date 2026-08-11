---
title: "nnU-Net and Why Simplicity Still Wins in Medical Image Segmentation"
date: "2026-07-04"
excerpt: "Thoughts on nnU-Net, automated medical image segmentation, and how its design philosophy applies to retinal OCT hypertransmission detection."
tags: [Medical Imaging, Deep Learning, OCT, nnU-Net, Segmentation]
---

Medical image segmentation has become one of the defining applications of deep learning in healthcare. Since the introduction of U-Net in 2015, hundreds of architectural variants have appeared: Residual U-Nets, Attention U-Nets, Dense U-Nets, Transformers, hybrid CNN-transformer models, and countless combinations thereof.

One of the most influential papers in this area is **nnU-Net (No-New-Net)** by Isensee et al., whose central claim is surprisingly simple:

> Better preprocessing, training, and inference are often more important than inventing another neural network architecture. 1809.10486v1.pdf

Rather than proposing another segmentation network, nnU-Net proposes something arguably more useful: a framework that automatically configures nearly every aspect of the segmentation pipeline for a new medical imaging dataset.

---

# The Segmentation Problem

Medical image segmentation seeks to estimate a pixel- or voxel-wise label map

$$
f_\theta(X) = \hat{Y},
$$

where

- $X$ denotes the medical image,
- $Y$ is the ground-truth segmentation,
- $\theta$ are network parameters.

Unlike image classification,

$$
f(X)\rightarrow c,
$$

segmentation requires

$$
f(X)\rightarrow
\{0,1,\ldots,K\}^{H\times W}
$$

or in 3D,

$$
f(X)\rightarrow
\{0,1,\ldots,K\}^{H\times W\times D},
$$

making localization just as important as recognition.

For retinal OCT images this could represent

- retinal layers,
- drusen,
- geographic atrophy,
- fluid,
- or hypertransmission regions.

---

# Revisiting U-Net

The original U-Net consists of

- an encoder,
- a decoder,
- skip connections joining corresponding resolutions.

If

$$
E_i
$$

denotes encoder features and

$$
D_i
$$

decoder features,

the skip connection performs

$$
D_i
=
g(D_{i+1},E_i),
$$

where $g(\cdot)$ is concatenation followed by convolution.

These skip connections preserve fine anatomical detail that would otherwise disappear after repeated pooling operations. This is especially valuable for thin retinal structures only a few pixels thick.

---

# The Core Idea of nnU-Net

The paper argues that most performance gains attributed to "new architectures" are actually caused by improvements elsewhere in the pipeline:

- preprocessing,
- normalization,
- patch size,
- data augmentation,
- inference,
- post-processing,
- ensemble selection.

Accordingly, nnU-Net keeps the architecture close to the original U-Net while automatically adapting the surrounding pipeline to each dataset. 1809.10486v1.pdf

This philosophy is refreshing.

Instead of asking

> *"What new network should we invent?"*

the paper asks

> *"How do we automatically configure the network we already know works?"*

---

# Dynamic Network Configuration

Medical datasets differ dramatically.

A liver CT volume might contain

$$
512\times512\times482
$$

voxels,

while a hippocampus MRI may only contain

$$
50\times35\times36.
$$

Using identical architectures for both is clearly suboptimal.

Instead, nnU-Net automatically chooses

- patch size,
- pooling depth,
- batch size,
- network depth,

based on image geometry and available GPU memory. The paper describes dynamically adapting pooling operations until feature maps reach an appropriate spatial resolution while respecting memory constraints. 1809.10486v1.pdf

This removes much of the manual trial-and-error that traditionally accompanies segmentation projects.

---

# Automatic Preprocessing

Perhaps the most underrated contribution is preprocessing.

The framework automatically performs

- cropping,
- resampling,
- intensity normalization,

without user intervention. 1809.10486v1.pdf

Resampling is particularly important because voxel spacing differs across scanners.

Conceptually,

if

$$
x=(x,y,z)
$$

is a voxel coordinate,

resampling estimates

$$
I'(x)
=
I(T(x)),
$$

where

$$
T
$$

maps coordinates into a common spatial resolution.

Without this step, convolutional filters effectively "see" different physical scales across datasets.

---

# Loss Function

Training minimizes

$$
L
=
L_{\mathrm{Dice}}
+
L_{\mathrm{CE}},
$$

combining Dice loss with cross-entropy loss. 1809.10486v1.pdf

Dice coefficient measures overlap between prediction and ground truth,

$$
\mathrm{Dice}
=
\frac{2|A\cap B|}
{|A|+|B|},
$$

while the corresponding loss becomes

$$
L_{\mathrm{Dice}}
=
1-
\mathrm{Dice}.
$$

Dice loss is particularly appropriate for medical segmentation because lesions often occupy only a tiny fraction of an image.

---

# Heavy Data Augmentation

Rather than changing the architecture, nnU-Net aggressively augments data using

- rotations,
- scaling,
- elastic deformation,
- gamma correction,
- mirroring,

all applied automatically during training. 1809.10486v1.pdf

This substantially improves generalization without increasing model complexity.

---

# Test-Time Ensembling

Inference is equally sophisticated.

Instead of relying on a single prediction,

nnU-Net combines

- overlapping patches,
- mirrored test-time augmentations,
- five-fold cross-validation models,
- multiple U-Net variants.

The final prediction effectively averages dozens of individual segmentations for improved robustness. 1809.10486v1.pdf

---

# Why This Matters for Hypertransmission Detection

Our current retinal OCT work focuses on detecting **hypertransmission ("barcoding")** associated with age-related macular degeneration.

Unlike many segmentation problems,

hypertransmission regions are

- thin,
- vertically elongated,
- highly anisotropic,
- dependent on retinal anatomy,
- difficult to distinguish from shadows or imaging artifacts.

It is tempting to immediately search for a more complicated architecture.

nnU-Net suggests the opposite.

Several ideas transfer directly.

## 1. Automatic ROI Standardization

Instead of manually selecting retinal regions,

the preprocessing pipeline could automatically

- flatten the RPE,
- normalize retinal thickness,
- crop to the choroidal region,

before training.

This removes unnecessary variability while preserving clinically meaningful structure.

---

## 2. Resolution-Aware Networks

Different OCT devices produce different pixel resolutions.

Rather than resizing every image identically,

the segmentation pipeline could adapt patch sizes according to retinal geometry,

mirroring nnU-Net's dataset-specific adaptation strategy.

---

## 3. Better Loss Functions

Hypertransmission occupies only a small fraction of each B-scan.

Dice loss naturally addresses this imbalance.

One could even combine

$$
L
=
\lambda_1L_{\mathrm{Dice}}
+
\lambda_2L_{\mathrm{CE}}
+
\lambda_3L_{\mathrm{Boundary}},
$$

where a boundary loss encourages sharper localization of vertical transmission columns.

---

## 4. Domain-Specific Augmentation

General computer vision augmentations are insufficient.

Instead,

augmentation could include

- simulated acquisition noise,
- retinal curvature variation,
- brightness shifts,
- synthetic hypertransmission masks,
- small anatomical deformations.

The lesson from nnU-Net is that these engineering decisions may matter more than replacing U-Net itself.

---

# Bigger Picture

One of the most interesting philosophical points from this paper is that **architecture is only one component of a segmentation system.**

Performance is really a function of

$$
\text{Performance}
=
f(
\text{Architecture},
\text{Preprocessing},
\text{Training},
\text{Inference},
\text{Postprocessing}
).
$$

Modern literature often focuses almost entirely on the first variable.

nnU-Net reminds us that the remaining terms are equally important—and often easier to improve.

---

# Final Thoughts

Reading nnU-Net reinforced something I've begun noticing across medical image analysis projects:

> robust engineering often beats architectural novelty.

As my own work shifts toward automated hypertransmission detection in retinal OCT images, I find this philosophy increasingly appealing.

Rather than asking

> *"Which segmentation network should I use?"*

the better question is often

> *"How can I build a pipeline that automatically adapts itself to new imaging data?"*

For retinal biomarkers—where scanners, acquisition protocols, anatomy, and disease severity all introduce variability—that question may ultimately be more important than designing yet another neural network.