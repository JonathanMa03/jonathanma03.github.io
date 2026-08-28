---
title: "Shower Thought: Can We Treat Sudoku as a Matrix?"
date: "2026-08-27"
excerpt: "An exploratory thought experiment on representing Sudoku as a 9×9 matrix and using linear algebra, constraint operators, and optimization to construct a solver."
tags: [Linear Algebra, Algorithms, Optimization, Mathematical Modeling]
---

Sudoku is usually presented as a logic puzzle: fill a $9\times9$ grid with the numbers $1,\ldots,9$ such that every row, column, and $3\times3$ block contains each number exactly once.

But staring at a Sudoku board raises a different question:

> **What happens if we stop thinking of Sudoku as a puzzle and start treating it as a matrix?**

A Sudoku board already has the right form,

$$
X\in\{1,\ldots,9\}^{9\times9}.
$$

The rules then become mathematical constraints on $X$. This made me wonder whether a solver could be constructed by exploiting matrix operations and analytical properties rather than explicitly implementing the usual human rules like "naked singles" or "hidden pairs."

This is more of a mathematical shower thought than a claim that linear algebra is the best way to solve Sudoku, but the formulation leads somewhere surprisingly interesting.

---

# Sudoku as a Matrix

Let

$$
X=
\begin{bmatrix}
x_{11} & \cdots & x_{19}\\
\vdots & \ddots & \vdots\\
x_{91} & \cdots & x_{99}
\end{bmatrix},
$$

where each entry satisfies

$$
x_{ij}\in\{1,2,\ldots,9\}.
$$

The first interesting observation is that every completed row contains exactly the same numbers.

Therefore every row must satisfy

$$
\sum_{j=1}^{9}x_{ij}
=
1+2+\cdots+9
=
45.
$$

Likewise, every column satisfies

$$
\sum_{i=1}^{9}x_{ij}=45.
$$

If $\mathbf{1}$ denotes the nine-dimensional vector of ones, then a valid Sudoku solution must satisfy

$$
X\mathbf{1}
=
45\mathbf{1}
$$

and

$$
X^\top\mathbf{1}
=
45\mathbf{1}.
$$

So immediately, Sudoku has some very clean matrix constraints.

Unfortunately, these equations alone are nowhere near enough.

The row

$$
[5,5,5,5,5,5,5,5,5]
$$

also sums to $45$, and it is obviously not a valid Sudoku row.

What we really need is a mathematical representation of **uniqueness**.

---

# Power Sums as a Fingerprint

Every valid row is a permutation of

$$
\{1,2,\ldots,9\}.
$$

Its sum must therefore be $45$, but its sum of squares must also equal

$$
\sum_{k=1}^{9}k^2
=
285.
$$

Similarly,

$$
\sum_{k=1}^{9}k^3
=
2025.
$$

This suggests describing each row through its moments,

$$
\sum_j x_{ij}^m
=
\sum_{k=1}^{9}k^m.
$$

In principle, enough of these power sums characterize the multiset of entries.

So instead of saying

> "every number from 1 through 9 must occur exactly once,"

we could impose a collection of algebraic conditions.

That already starts making Sudoku look less like a puzzle and more like a constrained nonlinear system.

---

# A Better Representation

There is probably an even cleaner approach.

Rather than representing each cell by its number, introduce a binary variable

$$
z_{ijk}
=
\begin{cases}
1, & x_{ij}=k,\\
0, & \text{otherwise}.
\end{cases}
$$

Now Sudoku becomes a three-dimensional binary object,

$$
Z\in\{0,1\}^{9\times9\times9}.
$$

Each cell must contain exactly one number,

$$
\sum_{k=1}^{9}z_{ijk}=1.
$$

Each number must appear exactly once in every row,

$$
\sum_{j=1}^{9}z_{ijk}=1.
$$

Each number must appear exactly once in every column,

$$
\sum_{i=1}^{9}z_{ijk}=1.
$$

And for each $3\times3$ block $B$,

$$
\sum_{(i,j)\in B}z_{ijk}=1.
$$

Suddenly, nearly the entire puzzle has become a collection of linear equations with binary constraints.

---

# Sudoku as a Linear System

Flatten $Z$ into a vector

$$
z\in\{0,1\}^{729}.
$$

All of the Sudoku rules can then be collected into something resembling

$$
Az=b,
$$

subject to

$$
z\in\{0,1\}^{729}.
$$

The clues simply fix certain coordinates.

If the puzzle tells us that cell $(i,j)$ contains $7$, then

$$
z_{ij7}=1
$$

and

$$
z_{ijk}=0
\qquad
k\neq7.
$$

So a Sudoku puzzle can essentially be viewed as a **binary feasibility problem**.

The interesting part is that the difficulty does not really come from the linear equations themselves. It comes from the discrete condition

$$
z\in\{0,1\}^{729}.
$$

Without integrality, we could solve

$$
Az=b
$$

using ordinary linear algebra. But fractional solutions such as

$$
z_{ijk}=0.5
$$

obviously do not correspond to Sudoku boards.

The combinatorial difficulty is hiding inside the domain of the variables.

---

# Matrix Operations as Constraint Propagation

Still, this representation suggests an algorithm.

Start with a candidate tensor $Z$ where each unknown cell initially permits every value,

$$
z_{ijk}=1
\qquad
\forall k.
$$

The given clues immediately eliminate possibilities.

If a row already contains $5$, matrix operations can eliminate the candidate $5$ from every other cell in that row. Similar operators can be constructed for columns and blocks.

We could think of one iteration as

$$
Z^{(t+1)}
=
\mathcal P_B
\mathcal P_C
\mathcal P_R
\left(
Z^{(t)}
\right),
$$

where

- $\mathcal P_R$ enforces row constraints,
- $\mathcal P_C$ enforces column constraints,
- $\mathcal P_B$ enforces block constraints.

Repeated application would propagate constraints until either the puzzle is solved or the algorithm reaches a fixed point,

$$
Z^{(t+1)}=Z^{(t)}.
$$

At that point, unresolved cells would require some form of search.

This is essentially human Sudoku reasoning expressed as operations on a structured mathematical object.

---

# Sudoku as Optimization

Another possibility is to define an objective measuring violations of Sudoku rules.

For the original matrix representation, something like

$$
L(X)
=
L_{\text{row}}(X)
+
L_{\text{col}}(X)
+
L_{\text{block}}(X)
+
L_{\text{clue}}(X).
$$

A valid Sudoku solution satisfies

$$
L(X)=0.
$$

We could then formulate

$$
X^*
=
\arg\min_X L(X)
$$

subject to

$$
x_{ij}\in\{1,\ldots,9\}.
$$

With the binary representation, the formulation becomes even cleaner. Sudoku can be written as an integer linear program,

$$
\min_z 0
$$

subject to

$$
Az=b,
\qquad
z\in\{0,1\}^{729}.
$$

There is technically no objective needed—we simply want any feasible point.

That is an interesting conceptual shift:

> **Solving Sudoku is equivalent to finding a point in a discrete feasible region.**

---

# What Happens on Larger Boards?

The asymptotics become interesting if we generalize Sudoku.

Suppose the board is

$$
n^2\times n^2,
$$

with $n\times n$ subgrids.

Standard Sudoku corresponds to

$$
n=3.
$$

There are

$$
n^4
$$

cells, and each cell can take one of

$$
n^2
$$

symbols.

The binary representation therefore requires

$$
n^4\cdot n^2
=
n^6
$$

variables.

For ordinary Sudoku,

$$
3^6=729,
$$

which is exactly the number of binary variables above.

The naive number of possible assignments to the original board is

$$
(n^2)^{n^4},
$$

which grows extraordinarily quickly.

So although the matrix itself grows polynomially in storage,

$$
O(n^4),
$$

the underlying combinatorial search space grows exponentially.

This is an important distinction. Representing Sudoku with matrices does not magically remove its combinatorial complexity.

What it does is expose structure that an algorithm can exploit.

---

# Could Eigenvalues Help?

This is where the shower thought becomes a little more speculative.

Once Sudoku is represented as a matrix, it is tempting to ask whether familiar spectral properties—eigenvalues, rank, determinants, singular values—contain useful information.

For example,

$$
Xv=\lambda v
$$

describes invariant directions of a completed Sudoku matrix.

Could valid Sudoku solutions occupy some interesting spectral family? Could partial boards be compared to feasible completed boards through low-rank perturbations? Could singular values provide useful heuristics for selecting which unresolved region to branch on?

Maybe.

But there is an important warning: **not every property of a matrix is useful merely because Sudoku can be written as a matrix.**

The actual Sudoku rules concern permutations and combinatorial constraints, not spectral invariance. I would therefore expect binary constraint matrices, graph representations, and optimization to be substantially more useful than simply calculating $\det(X)$ or its eigenvalues.

Still, exploring whether completed Sudoku matrices have interesting spectral statistics sounds like a fun experiment in its own right.

---

# The Graph Interpretation

There is another representation hiding behind the matrix.

Treat every cell as a vertex in a graph,

$$
G=(V,E).
$$

Two vertices are connected whenever their cells share

- a row,
- a column,
- or a block.

Sudoku then becomes a graph-coloring problem with nine colors.

If $c(v)$ denotes the number assigned to vertex $v$, then

$$
c(u)\neq c(v)
\qquad
\forall (u,v)\in E.
$$

Now the matrix and graph perspectives meet naturally through the adjacency matrix

$$
A_G.
$$

That opens another collection of analytical tools involving graph Laplacians, spectral graph theory, constraint propagation, and combinatorial optimization.

The same puzzle can therefore be viewed as

$$
\text{Sudoku}
\longleftrightarrow
\text{Matrix Problem}
\longleftrightarrow
\text{Binary Optimization}
\longleftrightarrow
\text{Graph Coloring}.
$$

---

# Looking Forward

I originally started thinking about this simply because a Sudoku board looks suspiciously like a matrix.

But following that thought reveals something deeper.

The ordinary $9\times9$ representation exposes row and column structure. A $9\times9\times9$ binary representation turns the rules into linear constraints. Flattening that tensor produces a binary feasibility system, while viewing cells as vertices transforms the same puzzle into graph coloring.

None of these representations necessarily produces a better Sudoku solver than highly optimized existing algorithms. That is not really the interesting part.

What I find more interesting is how changing the mathematical representation changes the way we think about the problem.

A puzzle that appears to involve filling numbers into boxes can instead become

$$
Az=b,
\qquad
z\in\{0,1\}^{729},
$$

and suddenly concepts from linear algebra, discrete optimization, graph theory, and algorithms all become relevant.

Sometimes the fun part of applied mathematics is simply looking at something familiar and asking:

> **What mathematical object is this, really?**