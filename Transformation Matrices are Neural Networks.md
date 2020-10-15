I was reading [this Medium article on tensors](https://medium.com/@quantumsteinke/whats-the-difference-between-a-matrix-and-a-tensor-4505fbdc576c) which models the following matrix multiplication as a two-layer neural network:

![Image for post](https://miro.medium.com/max/756/1*Bxba1gx4ec2h9qe7UNPvMg.png)
![Image for post](https://miro.medium.com/max/496/1*GTdVep66Ln4N4Zd2JnSXbQ.png)

This made me realize that any linear map can be modeled as a neutral network. Consider rotating a vector around the X, then Y, and Z-axes:

$$
\begin{aligned}
M_x &= Rot_x(15°) \\
M_y &= Rot_y(15°) \\
M_z &= Rot_z(15°) \\
V &= [1,2,3] \\
V' &= M_xV \\
&= [1, \pmb{1.155}, \pmb{3.415}] \\
V'' &= M_yV' \\
&= [\pmb{1.850}, 1.155, \pmb{3.042}] \\
V''' &= M_zV'' \\
&= [\pmb{1.488}, \pmb{1.595}, 3.042] \\
\end{aligned}
$$

Here is a neural network visualizing the linear mapping sequence $M_zM_yM_xV$:

[![](https://1.bp.blogspot.com/-YTDB2hrFi9I/Xx4V06dJjXI/AAAAAAAAJ28/CY6v_QTgHh0wDJ9hWvIuOJ3J4fHrfAdTQCLcBGAsYHQ/d/rotations.png)
*Figure: Made with [draw.io](https://draw.io/)*

By tracing the paths through the layers of the neural network below, one can gain an intuition of how each transformation operation contributes to the resulting vector $V_{rot}$.
