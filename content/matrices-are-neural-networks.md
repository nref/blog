+++
title = "Transformation Matrices are Neural Networks"
date = 2020-10-15
[taxonomies]
tags = ['math']
+++

Chances are you've seen a neural network diagram like this one with circles and arrows:

![Image for post](https://miro.medium.com/max/496/1*GTdVep66Ln4N4Zd2JnSXbQ.png)
*Figure: A neural network. Source:* [Medium](https://medium.com/@quantumsteinke/whats-the-difference-between-a-matrix-and-a-tensor-4505fbdc576c)

While that looks fancy, it's basically a matrix. More generally, it's a tensor, but a special kind of tensor which makes it [just a matrix](https://math.stackexchange.com/a/412429).

I was reading [this Medium article comparing matrices and tensors](https://medium.com/@quantumsteinke/whats-the-difference-between-a-matrix-and-a-tensor-4505fbdc576c) which models the following matrix multiplication as the two-layer neural network shown above:

![Image for post](https://miro.medium.com/max/756/1*Bxba1gx4ec2h9qe7UNPvMg.png)

This helped me realize that any linear map can be modeled as a neutral network. Consider rotating a vector around the X, then Y, and Z-axes:

$$
\begin{aligned}
M_x &= Rot_x(15°) \newline
M_y &= Rot_y(15°) \newline
M_z &= Rot_z(15°) \newline
V &= [1,2,3] \newline
V' &= M_xV \newline
&= [1, \pmb{1.155}, \pmb{3.415}] \newline
V'' &= M_yV' \newline
&= [\pmb{1.850}, 1.155, \pmb{3.042}] \newline
V''' &= M_zV'' \newline
&= [\pmb{1.488}, \pmb{1.595}, 3.042] \newline
\end{aligned}
$$

Here is a neural network visualizing the linear mapping sequence $M_zM_yM_xV$:

![](https://drive.google.com/uc?export=view&id=1JZ5nbd-Y55QYEPMk8XQ00cE2w688KX25)
*Figure: Made with [draw.io](https://draw.io/)*

By tracing the paths through the layers of the neural network below, one can gain an intuition of how each transformation operation contributes to the resulting vector $V_{rot}$.

![](https://drive.google.com/uc?export=view&id=1t9ccuXdm87LI7s9Tx5QdnJ0STQQv_V39)
*Figure: Made with [draw.io](https://draw.io/)*
