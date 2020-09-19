### Introduction
In robot kinematics, a _joint path_ is a sequence of positions for one or more joints. A _joint trajectory_ is the time function interpolating these positions.

This post examines generating joint trajectories with cubic splines.

Say we have a robotic arm with one revolute joint, and we want to rotate its joint position $Q$ from $0$ to $90$ degrees.

$$
\begin{aligned}
Q_{init} &= 0 \\
Q_{final} &= \pi/2
\end{aligned}
$$

[![](https://drive.google.com/uc?export=view&id=1m5GK-sDcSwYTzq65qyWgDwImKPglIG3j)](https://www.blogger.com/blog/post/edit/8646226552989795436/981000181203813289#)
_Figure: The joint start and goal_

We don't care how long it takes, but the joint must start from rest and and end at rest.

$$
\begin{aligned}
V_{init} &= 0 \\
V_{final} &= 0
\end{aligned}
$$

***
### Initial Solution
We can satisfy these constraints by interpolating the joint position, velocity, and acceleration with a  [cubic spline](https://www.blogger.com/blog/post/edit/8646226552989795436/981000181203813289#),

$$
\begin{aligned}
Q(t) &= At^3 + Bt^2 + Ct + D &&\text{// Position} \\
V(t) &= 3At^2 + 2Bt + C &&\text{// Velocity} \\
A(t) &= 6At + 2B &&\text{// Acceleration} \\
\end{aligned}
$$
  

where $t$ is the time since the movement started.

We start by finding the coefficients $A$, $B$, $C$, and $D$.

$$
\begin{aligned}
Duration &=  \textit{(To be Determined)} \\
Displacement &= Q_{final} - Q_{init} \\
A &= \frac{(2  \cdot  -Displacement / Duration + V_{init} + V_{final})}{Duration^2} \\
B &= \frac{(3  \cdot  Displacement / Duration - 2  \cdot  V_{init} - V_{final})}{Duration} \\
C &= V_{init} \\
D &= Q_{init} \\
\end{aligned}
$$
Since we don't care how long the movement takes, let's choose arbitrarily that the movement should last $1$ second:

$$
Duration = 1
$$
  
then we have the coefficients

$$
\begin{aligned}
A &= (2 \cdot -(\pi/2)/1 + 0 + 0)/1^2 = -\pi \\
B &= (3 \cdot (\pi/2)/1 - 2 \cdot 0 -0)/1  = 3\pi/2 \\
C &= 0 \\
D &= 0 \\
\end{aligned}
$$
  
Plugging these values back into the cubic equations, we can see in the figure that the joint at $t = 1s$ has position $Q = \pi/2\>rad$ and velocity $v = 0\>rad/s$.

[![](https://1.bp.blogspot.com/-QsZzP5zjyfQ/X1lNqmo_-SI/AAAAAAAAJ4U/iXMfNwBC4Vga8TI-nzXIiMiCp22SadpxwCLcBGAsYHQ/w640-h522/demos1.png)](https://www.blogger.com/blog/post/edit/8646226552989795436/981000181203813289#)

_Figure: Joint Position, Velocity, and Acceleration over Time_

***
### Joint Constraints
In reality, a joint may not physically be able to move in 1 second, so let's consider some realistic constraints.

Say the joint has a maximum angular velocity of  $6°/s$  and a maximum angular acceleration of $3°/s^2$. Assume this holds true regardless of its payload or position, i.e. ignore dynamics.

$$
\begin{aligned}
V_{limit} &= 0.104719755 \> rad/s \\
A_{limit} &= 0.0523599 \> rad/s^2
\end{aligned}
$$

Clearly the solution plotted above exceeds these limits:

$$
\begin{aligned}
V_{max} &=  3\pi/4, t = 0.5s \\
A_{max} &=  3\pi, t = 0s \\
           &= -3\pi, t = 1s
\end{aligned}
$$
  
We can reduce the velocity and acceleration by scaling the duration, i.e. making the movement take longer. The time-optimal solution is found analytically according to Melchiorri [1]:

``` c
double GetScale()  
{
  double v_scale = abs(Vmax) / Vlimit
  double a_scale = sqrt(abs(Amax) / Alimit)
  return max(v_scale, a_scale)
}
```
  
If  ```a_scale``` is larger than  ```v_scale```, then the acceleration limit is constraining the duration. If  ```v_scale``` is larger than  ```a_scale```, then the velocity limit is constraining the duration.

```
v_scale = abs(3π/4) / 0.104719755  = 22.5
a_scale = sqrt(abs(3π)/0.0523599)  = 13.417
```
  
In this case, the velocity limit is the dominating constraint.  *The time-optimal duration is 22.5 seconds.*

We can verify by recalculating the polynomial coefficients with the new duration.

$$
\begin{aligned}
A &= (2 \cdot -(\pi/2)/22.5)/22.5^2 = -0.00027580511 \\
B &= (3 \cdot (\pi/2)/22.5)/22.5  = 0.00930842267 \\
C &= 0 \\
D &= 0 \\
\end{aligned}
$$

[![](https://1.bp.blogspot.com/-pj5O4FjVstI/X1lz3sIkvzI/AAAAAAAAJ4g/Cxb97ORkT3UCbztGnn8OXYguSFXXkN5lgCLcBGAsYHQ/w640-h322/desmos2.png)](https://www.blogger.com/blog/post/edit/8646226552989795436/981000181203813289#)
_Figure: Scaled Joint Position, Velocity, and Acceleration over Time_

We can see that the joint at  $t = 22.5s$ has position $Q = \pi/2 \>rad$ and velocity $v = 0 \>rad/s$. The maximum velocity is at $t = 11.25s$ with $v = 0.104719755 \>rad/s$. The maximum acceleration is at $t = 0$ and $t = 22.5s$ with $a = 0.0186 \>rad/s^2$ and $a = -0.0186 \>rad/s^2$, respectively. The joint velocity and acceleration constraints are satisfied. $\blacksquare$

***
### Task Space Constraints
Let's add another constraint. Let's say the frame attached to the tip of the joint has maximum translational speed and angular velocity components.

[![](https://drive.google.com/uc?export=view&id=1SyYM1NDXyL0JCjo4HGCioj08uTcVwQxJ)](https://www.blogger.com/blog/post/edit/8646226552989795436/981000181203813289#)
_Figure: Diagram of a frame at the joint tip. The frame is right-handed, i.e. Z points out of the page._

$$
\begin{aligned}
\dot{X}_{max} &= 100mm/s \\
\dot{Y}_{max} &= 100mm/s \\
\dot{Z}_{max} &= 100mm/s \\
\dot{R_x}_{max} &= 9°/s \\
\dot{R_y}_{max} &= 9°/s \\ 
\dot{R_z}_{max} &= 9°/s \\
\end{aligned}
$$
  
*Aside:* I say *components* because e.g. a velocity vector moving with $\dot{X} = \dot{Y} = \dot{Z} = 100mm/s$ would actually be moving at $\sqrt{(100²+100²+100²)} ~= 173mm/s$. One could certainly solve for a velocity vector constraint, too.

Similar to joint space constraints, we can meet task space constraints by scaling the duration of the trajectory, but we need to know the relation from joint space to task space.

The relation from joint space to task space is known as  *[forward kinematics](https://www.blogger.com/blog/post/edit/8646226552989795436/981000181203813289#)*. Conversion from joint position to task space position is  *forward position*, and conversion from joint velocity to task space velocity is  *forward velocity*. This topic is widely covered elsewhere.

Let's say our robot joint has position $Q$, angular velocity $\dot{Q}$, and radius $r$ from its center of rotation to the tip frame. Then the following relations apply:

$$
\begin{aligned}
X &= r \cdot cos(Q) \\
Y &= r \cdot sin(Q) \\
Z &= 0 \\
R_x &= 0 \\
R_y &= 0 \\
R_z &= Q \\
\\
\dot{X} &= \dot{Q} \cdot r \cdot sin(Q) \\
\dot{Y} &= \dot{Q} \cdot r \cdot cos(Q) \\
\dot{Z} &= 0 \\
\dot{Rx} &= 0 \\
\dot{Ry} &= 0 \\
\dot{Rz} &= \dot{Q} \\
\end{aligned}
$$
  
For example, if $r = 1 \>meter$,  $Q = 0 \>rad$, and $Qdot = \pi \> rad/s$, then

$$
\begin{aligned}
X &= 1m \\
Y &= 0m \\
R_z &= 0m \\
\dot{X} &= 0 \>m/s \\
\dot{Y} &= 1 \>m/s \\
\dot{R_z} &= \pi \> rad/s \\
\end{aligned}
$$

For another example, if $r = 1 \>meter$,  $Q = \pi/2 \>rad$, and $Qdot = \pi \> rad/s$, then

$$
\begin{aligned}
X &= 0m \\
Y &= 1m \\
R_z &= 0m \\
\dot{X} &= 1 \>m/s \\
\dot{Y} &= 0 \>m/s \\
\dot{R_z} &= \pi \> rad/s \\
\end{aligned}
$$
  
Going back to our 1-second trajectory, since the joint velocity is a parabola, which is symmetric, the maximum occurs at any of $t = 0$, $t = 0.5$, or $t = 1$. Since $V_{init} = V_{final} = 0$, the maximum occurs at $t = 0.5$. This results in the following task space velocities:

$$
\begin{aligned}
Q(0.5) &= -\pi t³ + \frac{3\pi}{2}t² = \pi/4 \>rad \\
V(0.5) &= -3\pi(1/2)² +3\pi/2  = \frac{3\pi}{4} rad/s \\
\dot{X}_{max} &= \frac{3\pi}{4} rad/s \cdot 1m \cdot cos(\pi/4) = 1.67m/s  = 1670 \>mm/s \\
\dot{Y}_{max} &=  \frac{3\pi}{4} rad/s \cdot 1m \cdot sin(\pi/4) = 1.67m/s  = 1670 \>mm/s \\
\dot{Z}_{max} &= 0 \>m/s \\
\dot{R_x} &= 0 \>rad/s \\
\dot{R_y} &= 0 \>rad/s \\
\dot{R_z}  &= \frac{3\pi}{4} \>rad/s \\
\end{aligned}
$$

Dividing by the given task space constraints yields the following ratios:

$$
\begin{aligned}
X_{ratio} &= 1670/100  = 16.7 \\
Y_{ratio} &= 1670/100  = 16.7 \\
Z_{ratio} &= 0 \\
R_{x_{ratio}} &= 0 \\
R_{y_{ratio}} &= 0 \\
R_{z_{ratio}} &= \frac{\frac{3\pi}{4} \>rad/s}{9°/s} = 15 \\
\end{aligned}
$$

The maximum task space ratio is $16.7$, which is less than the previous value of $v_{scale} = 22.5$.  *The previous scaled trajectory duration of 22.5s also satisfies the given task space constraints.* $\blacksquare$

***
### Multiple Joints
The same approach applies to robots with more than one joint. 

In this case, if we have $m$ joints, then we will have $m$ cubic splines, and $a_{scale}$ and $v_{scale}$ must be calculated for each joint. 

The scale resulting from dividing the forward velocity by the task space limit is also calculated. The maximum of the joint space ratios and the task space ratio yields the optimal trajectory duration.

***
### Longer Paths
If a path  $\pmb{Q}$ of length $n | n>2$ is given (i.e. more than just $Q_{init}$ and $Q_{final}$ are given), and if the joint begins and ends with zero velocity ($V_{init} = V_{final} = 0$), then by enforcing the constraints of continuity on velocity and acceleration, the intermediate point velocities can be calculated automatically following the method described by Melchiorri [1]. The $n-1$ resulting cubic splines must each be scaled by the method described previously, taking care to forward-propagate the resulting segment positions and velocities to not-yet scaled segments. Coverage of these algorithms is planned for a future blog post.

***
### References
[1] Biagiotti, L., & Melchiorri, C. (2009). _[Trajectory Planning for Automatic Machines and Robots](https://www.blogger.com/blog/post/edit/8646226552989795436/981000181203813289#)_. Berlin, Heidelberg: Springer Berlin Heidelberg.

***
### Discussion
Please feel free to start a discussion [on GitHub](https://github.com/slater1/blog/issues).
