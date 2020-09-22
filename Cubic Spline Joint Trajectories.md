### Introduction
In robot kinematics, a _joint path_ is a sequence of positions for one or more joints. A _joint trajectory_ is the time function interpolating these positions.

This post examines generating joint trajectories with cubic splines.

Say we have a robotic arm with one revolute joint, and we want to rotate its joint position $Q$ from $0$ to $90$ degrees.

$$
\begin{aligned}
Q_{init} &= 0 \\
Q_{final} &= \pi/2 \\
\end{aligned}
$$

![](https://drive.google.com/uc?export=view&id=1m5GK-sDcSwYTzq65qyWgDwImKPglIG3j)
_Figure: The joint start and goal_

We don't care how long it takes, but the joint must start from rest and and end at rest.

$$
\begin{aligned}
V_{init} &= 0 \\
V_{final} &= 0 \\
\end{aligned}
$$

***
### Initial Solution
We can satisfy these constraints by interpolating the joint position, velocity, and acceleration with a  [cubic spline](https://mathworld.wolfram.com/CubicSpline.html),

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

<center>
<iframe src="https://www.desmos.com/calculator/elrzqx76aq?embed" width="500px" height="500px" style="border: 1px solid #ccc" frameborder=0></iframe>
</center>

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
           &= -3\pi, t = 1s \\
\end{aligned}
$$
  
We can reduce the velocity and acceleration by scaling the duration, i.e. making the movement take longer. The time-optimal solution is found analytically according to Melchiorri [1]:

``` c
double get_scale()  
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

<center>
<iframe src="https://www.desmos.com/calculator/uarkx6wols?embed" width="500px" height="500px" style="border: 1px solid #ccc" frameborder=0></iframe>
</center>

_Figure: Scaled Joint Position, Velocity, and Acceleration over Time_

We can see that the joint at  $t = 22.5s$ has position $Q = \pi/2 \>rad$ and velocity $v = 0 \>rad/s$. The maximum velocity is at $t = 11.25s$ with $v = 0.104719755 \>rad/s$. The maximum acceleration is at $t = 0$ and $t = 22.5s$ with $a = 0.0186 \>rad/s^2$ and $a = -0.0186 \>rad/s^2$, respectively. The joint velocity and acceleration constraints are satisfied. $\blacksquare$

***
### Task Space Constraints
Let's add another constraint. Let's say the frame attached to the tip of the joint has maximum translational speed and angular velocity components.

![](https://drive.google.com/uc?export=view&id=1SyYM1NDXyL0JCjo4HGCioj08uTcVwQxJ)
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

The relation from joint space to task space is known as  *[forward kinematics](https://en.wikipedia.org/wiki/Forward_kinematics)*. Conversion from joint position to task space position is  *forward position*, and conversion from joint velocity to task space velocity is  *forward velocity*. This topic is widely covered elsewhere.

Let's say our robot joint has position $Q$, angular velocity $\dot{Q}$ (also known as $V(t)$), and radius $r$ from its center of rotation to the tip frame. Then the following relations apply:

$$
\begin{aligned}
X &= r \cdot cos(Q) \\
Y &= r \cdot sin(Q) \\
Z &= 0 \\
R_x &= 0 \\
R_y &= 0 \\
R_z &= Q \\
\\
\dot{X} &= -\dot{Q} \cdot r \cdot sin(Q) \\
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
\dot{X} &= -1 \>m/s \\
\dot{Y} &= 0 \>m/s \\
\dot{R_z} &= \pi \> rad/s \\
\end{aligned}
$$
 
For details, see this [video lecture](https://robotacademy.net.au/masterclass/robotic-arms-and-forward-kinematics/?lesson=260).
 
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

#### Example
Consider adding a second joint to the previous example to create a two-joint manipulator. This joint has the same velocity and acceleration limits.

$$
\begin{aligned}
V_{limit} &= 0.104719755 \> rad/s \\
A_{limit} &= 0.0523599 \> rad/s^2
\end{aligned}
$$

![](https://drive.google.com/uc?export=view&id=1YFmbgUtKW6srb9yDHVx6TMgpF5-3maH1)
_Figure: A robot with two joints._

[Simulate this robot on Desmos](https://www.desmos.com/calculator/mnga15rnud). Use the $q_1$ and $q_2$ sliders.

The first spline is unchanged.

$$
\begin{array}{c}
\begin{aligned}
Q_{init_1} &= 0 & A_0 &= -\pi \\
Q_{final_1} &= \pi/2  & B_0 &= 3\pi/2 \\
V_{init_1} &= 0 & C_0 &= 0 \\
V_{final_1} &= 0 & D_0 &= 0 \\
\end{aligned}
\end{array}
$$

Here is the second spline. 

$$
\begin{array}{c}
\begin{aligned}
Q_{init_2} &= \pi/2 & A_1 &=2\pi \\
Q_{final_2} &= -\pi/2 & B_1 &= -3\pi \\
V_{init_2} &= 0 & C_1 &= 0 \\
V_{final_2} &= 0 & D_1 &= \pi/2 \\
\end{aligned}
\end{array}
$$

Here is the relation of joint space to task space.

$$
\begin{aligned}
X &= r_1 \cdot cos(Q_1) + r_2 \cdot cos(Q_1 + Q_2) \\
Y &= r_1 \cdot sin(Q_1) + r_2 \cdot sin(Q_1 + Q_2) \\
Z &= 0 \\
R_x &= 0 \\
R_y &= 0 \\
R_z &= Q_1 + Q_2 \\
\\
\dot{X} &= -\dot{Q_1} \cdot r_1 \cdot sin(Q_1) - \dot{Q_1} \cdot \dot{Q_2} \cdot r_2 \cdot sin(Q_1 + Q_2) \\
\dot{Y} &= \dot{Q_1} \cdot r_1 \cdot cos(Q_1) + \dot{Q_1} \cdot \dot{Q_2} \cdot r_2 \cdot cos(Q_1 + Q_2)\\
\dot{Z} &= 0 \\
\dot{Rx} &= 0 \\
\dot{Ry} &= 0 \\
\dot{Rz} &= \dot{Q_1} + \dot{Q_2}\\
\end{aligned}
$$

For details, see the derivation of position [here](https://robotacademy.net.au/masterclass/robotic-arms-and-forward-kinematics/?lesson=262) and the derivation of velocity [here](https://robotacademy.net.au/masterclass/velocity-kinematics-in-2d/?lesson=321).

We now find the maximum velocity, acceleration, and resulting time scale for each joint.

*Note:* The topic of finding polynomial minima or maxima is well-covered elsewhere and can be deferred to a [good algebra library](https://en.wikipedia.org/wiki/Comparison_of_linear_algebra_libraries). Here, we just use Desmos.

<center>
<iframe src="https://www.desmos.com/calculator/lt2t9hn9jd?embed" width="500px" height="500px" style="border: 1px solid #ccc" frameborder=0></iframe>
</center>

_Figure: Joint-space velocities, two-joint manipulator._

##### First Joint

$$
\begin{aligned}
V_{1_{max}} &=  3\pi/4, t = 0.5s \\
A_{1_{max}} &=  3\pi, t = 0s \\
           &= -3\pi, t = 1s \\
V_{1_{scale}} &= \frac{|3π/4|}{0.10471975}  = 22.5 \\
A_{1_{scale}} &= \sqrt{\frac{|3π|}{0.0523599}}  = 13.417 \\
 \end{aligned}
$$

##### Second Joint

$$
\begin{aligned}
V_{2_{max}} &=  3\pi/2, t = 0.5s \\
A_{2_{max}} &=  6\pi, t = 0s \\
           &= -6\pi, t = 1s \\
V_{2_{scale}} &= \frac{|3π/2|}{0.10471975}  = 45 \\
A_{2_{scale}} &= \sqrt{\frac{|6π|}{0.0523599}}  = 18.974 \\
\end{aligned}
$$

Without considering task space velocity, the time-optimal duration is $1s \cdot max(22.5, 13.417, 45, 18.974)=45s$. Clearly, since the second joint has twice as far to rotate as the first joint, it constrains the duration of the movement.

Let's now consider task space velocity.

<center>
<iframe src="https://www.desmos.com/calculator/bkieqkwpew?embed" width="500px" height="500px" style="border: 1px solid #ccc" frameborder=0></iframe>
</center>

_Figure: Task-space velocities, two-joint manipulator._

$$
\begin{aligned}
\dot{X}_{max} &= |3.245|m/s, t=0.3624s \\
\dot{Y}_{max} &= |-3.245|m/s, t=0.6376s \\
\dot{R_z}_{max} &= -3\pi/4 rad/s, t=0.5s \\
X_{ratio} &= 3245/100  = 32.45 \\
Y_{ratio} &= 3245/100  = 32.45 \\
R_{z_{ratio}} &= \frac{\frac{3\pi}{4} \>rad/s}{9°/s} = 15 \\
\end{aligned}
$$

Since $32.45 < 45$,  the joint space constraints dominate the task space constraints. *The time-optimal duration is $1s \cdot max(45, 32.45, 15)=45s$.* $\blacksquare$
***
### Longer Paths
If a path  $\pmb{Q}_j$ of length $n | n>2$ is given for joint $j$, i.e. intermediate points between $Q_{init}$ and $Q_{final}$ are given, and if the joint begins and ends with zero velocity ($V_{init} = V_{final} = 0$), then by enforcing the constraints of continuity on velocity and acceleration, the intermediate point velocities can be calculated with a system of linear equations following the method described by Melchiorri [1]. 

#### Example
Consider an extension of the previous 2-joint trajectory, where each joint passes through three positions: an initial position, an intermediate position, and a final position. 

$$
\begin{aligned}
\pmb{Q}_1 &= [Q_{1_{init}} Q_{1_{intermediate}} Q_{1_{final}}] \\
\pmb{Q}_2 &= [Q_{2_{init}} Q_{2_{intermediate}} Q_{2_{final}}] \\
\end{aligned}
$$

Let the given intermediate positions be

$$
\begin{aligned}
Q_{1_{intermediate}} &= \pi/4 \\
Q_{2_{intermediate}} &= 0
\end{aligned}
$$

...along with the initial and final velocities.

$$V_{1_{init}} = V_{1_{final}} = V_{2_{init}} = V_{2_{final}}= 0$$

We must find the intermediate velocities $V_{1_{intermediate}}$ and $V_{2_{intermediate}}$. We can do this by solving the system

$$
A\pmb{v} = \pmb{c}
$$

where

$$
A=
\begin{bmatrix}
2(T_1+T_2) & T_1 \\
T_3 &2(T_2+T_3) &T_2 \\
& & \ddots \ddots \ddots \\
& & &  T_{n-2} & 2(T_{n-3}+T_{n-2}) & T_{n-3} \\
& & & & T_{n-1} & 2(T_{n-2} + T_{n-1})  
\end{bmatrix}
$$

$$
\pmb{v} =
\begin{bmatrix}
V_2 \\
V_3 \\
\vdots \\
V_{n-2} \\
V_{n-1} \\
\end{bmatrix}
$$

$$
\pmb{c} =
\begin{bmatrix}
\frac{3}{T_1T_2}[T_1^2(Q_3-Q_2)+T_2^2(Q_2-Q_1)] \pmb{- T_2V_1} \\
\frac{3}{T_2T_3}[T_2^2(Q_4-Q_3)+T_3^2(Q_3-Q_2)] \\
\vdots \\
\frac{3}{T_{n-3}T_{n-2}}[T_{n-3}^2(Q_{n-1}-Q_{n-2})+T_{n-2}^2(Q_{n-2}-Q_{n-3})] \\
\frac{3}{T_{n-2}T_{n-1}}[T_{n-2}^2(Q_{n}-Q_{n-1})+T_{n-1}^2(Q_{n-1}-Q_{n-2})] \pmb{- T_{n-2}V_n}\\
\end{bmatrix}
$$

and

$$
\begin{aligned}
T_i &= Duration_i & \text{// The duration of segment $i$} \\
Q_i &= Q_{i_{init}} & \text{// The initial position of segment $i$ } \\
V_i &= V_{i_{init}} & \text{// The initial velocity of segment $i$} \\
V_n &= V_{n_{final}} & \text{ // The final velocity of the last segment} \\
\end{aligned}
$$

*Reminder*: There are $n-1$ splines interpolating $n$ control points (also called knots), and our indexing starts at $1$, not $0$. Therefore,  $i==1$ refers to the first spline, and $i == n-1$ refers to the last spline.

*Aside:* [Here](https://github.com/roboticslibrary/rl/blob/cba76ed3e54676d430205a0dfdf03ce33ed3850c/src/rl/math/Spline.h#L108) is an example implementation of the above algorithm. 
##### Joint 1

We solve for $V_{1_{intermediate}}$.

$$
\begin{array}{ccc}
\begin{bmatrix}
2(T_1+T_2)
\end{bmatrix}
\begin{bmatrix} 
V_{1_{intermediate}}
\end{bmatrix} 
&=
\begin{bmatrix} 
\frac{3}{T_1T_2}[T_1^2(Q_{1_{final}}-Q_{1_{intermediate}})+T_2^2(Q_{1_{intermediate}}-Q_{1_{init}})]-T_2 \cdot V_{1_{init}}
\end{bmatrix}
\end{array}
$$

If we choose again arbitrarily that each segment should have 1 second of duration, then $T_1=1$ and $T_2=2$. Then

$$
\begin{aligned}
\begin{bmatrix}
2(1+1)
\end{bmatrix}
\begin{bmatrix} 
V_{1_{intermediate}}
\end{bmatrix} 
&=
\begin{bmatrix} 
\frac{3}{1 \cdot 1}[1^2(\pi/2-\pi/4)+1^2(\pi/4-0)]-2\cdot 0 
\end{bmatrix}
\\
4 \cdot V_{1_{intermediate}}&=
\begin{bmatrix} 
3[\pi/4+\pi/4] 
\end{bmatrix}
\\
V_{1_{intermediate}} &= 3\pi/8 \ rad/s
\end{aligned}
$$

We can now plot the two splines.

$$
\begin{aligned}
Duration_{1 \rightarrow 2} &= 1 \\
Displacement_{1 \rightarrow 2} &= \pi/4 \\
A_{1 \rightarrow 2} &= \frac{(2 \cdot - \pi/4 + 0 + 3\pi/8)}{1^2} &&= -\pi/8\\
B_{1 \rightarrow 2} &= \frac{(3 \cdot \pi/4 - 2 \cdot 0 - 3\pi/8)}{1} &&= 3\pi/8\\
C_{1 \rightarrow 2} &= V_{init} &&= 0\\
D_{1 \rightarrow 2} &= Q_{init} &&= 0\\
\end{aligned}
$$

$$
\begin{aligned}
Duration_{2 \rightarrow 3} &= 1 \\
Displacement_{2 \rightarrow 3} &= \pi/4 \\
A_{2 \rightarrow 3} &= \frac{(2 \cdot - \pi/4 + 3\pi/8 + 0)}{1^2} &&= -\pi/8\\
B_{2 \rightarrow 3} &= \frac{(3 \cdot \pi/4 - 2 \cdot 3\pi/8 - 0)}{1} &&= 0\\
C_{2 \rightarrow 3} &= V_{init} &&= 3\pi/8\\
D_{2 \rightarrow 3} &= Q_{init} &&= \pi/4\\
\end{aligned}
$$

<center>
<iframe src="https://www.desmos.com/calculator/2vstdsov0i?embed" width="500px" height="500px" style="border: 1px solid #ccc" frameborder=0></iframe>
</center>

_Figure: Two cubic splines for joint 1. Can you see where they meet? Hint: Each spline has 1s of duration._

We only see one spline, but there are actually two. The first spline is valid on the interval $t=(0,1)$, and the second spline is valid on the interval $t=(1,2)$. The two splines are identical because they have the same duration, displacement, and absolute change in velocity. Therefore, while we chose to use two splines, this movement could have been interpolated by a single spline. 

##### Joint 2

We solve for $V_{2_{intermediate}}$.

$$
\begin{aligned}
\begin{bmatrix}
2(1+1)
\end{bmatrix}
\begin{bmatrix} 
V_{2_{intermediate}}
\end{bmatrix} 
&=
\begin{bmatrix} 
\frac{3}{1 \cdot 1}[1^2(-\pi/2-0)+1^2(0-\pi/2)]-2\cdot 0 
\end{bmatrix}
\\
4 \cdot V_{2_{intermediate}}&=
\begin{bmatrix} 
3[-\pi/2-\pi/2] 
\end{bmatrix}
\\
V_{2_{intermediate}} &= -3\pi/4 \ rad/s
\end{aligned}
$$

$$
A = \frac{(2  \cdot  -Displacement / Duration + V_{init} + V_{final})}{Duration^2} \\
B = \frac{(3  \cdot  Displacement / Duration - 2  \cdot  V_{init} - V_{final})}{Duration} \\
$$

$$
\begin{aligned}
Duration_{1 \rightarrow 2} &= 1 \\
Displacement_{1 \rightarrow 2} &= -\pi/2 \\
A_{1 \rightarrow 2} &= \frac{(2 \cdot - (- \pi/2) + 0 + (- 3\pi/4))}{1^2} &&= \pi/4\\
B_{1 \rightarrow 2} &= \frac{(3 \cdot (- \pi/2) - 2 \cdot  0 - (-3\pi/4))}{1} &&= -3\pi/4\\
C_{1 \rightarrow 2} &= V_{init} &&= 0\\
D_{1 \rightarrow 2} &= Q_{init} &&= \pi/2\\
\end{aligned}
$$

$$
\begin{aligned}
Duration_{2 \rightarrow 3} &= 1 \\
Displacement_{2 \rightarrow 3} &= -\pi/2 \\
A_{2 \rightarrow 3} &= \frac{(2 \cdot - (-\pi/2) + (- 3\pi/4) + 0)}{1^2} &&= \pi/4\\
B_{2 \rightarrow 3} &= \frac{(3 \cdot (- \pi/2) - 2 \cdot  (-3\pi/4) - 0)}{1} &&= 0\\
C_{2 \rightarrow 3} &= V_{init} &&= -3\pi/4\\
D_{2 \rightarrow 3} &= Q_{init} &&= 0\\
\end{aligned}
$$

<center>
<iframe src="https://www.desmos.com/calculator/ouilnuznpg?embed" width="500px" height="500px" style="border: 1px solid #ccc" frameborder=0></iframe>
</center>

_Figure: Two cubic splines for joint 2. They meet at $t=1s$._

#### Scaling Longer Trajectories

In order to satisfy joint-space and task-space velocity and acceleration limits, the $m(n-1)$ resulting cubic splines ($m=$ number of joints, $n$ = number of control points) must each be scaled by the method described previously. 

*Pseudocode:*
``` c
// segments: sequence of splines, lenth n - 1 
//          (n == number of interpolated points)
// task_space_limit: e.g. Xlim = 100, Ylim = 100mm/s, etc.
void scale(segments, task_space_limit): 

  for segment in segments:

    joints = segment.joints // joints: container of size m
	  
    // get_scale: See Joint Constraints section
    joint_space_ratio = joints.max(joint => joint.get_scale()) 
    task_space_ratio = joints.forward_velocity() / task_space_limit
	
	r_max = max(joint_space_ratio, task_space_ratio)
    scale(segment, r_max)
```
*Above:* For each segment $i$, $m$ ratios are calculated, one for each joint, and the task space ratio is calculated. The maximum ratio $r_{max}$ is selected. Then all $m$ splines at segment $i$ are scaled by $r_{max}$.

*Pseudocode:*
``` c
// Scale the given spline
void scale(segment, ratio): 

  segment.duration *= ratio // Update duration

  // Update velocity
  if (segment.is_first()) spline.Vinit /= ratio
  if (segment.is_last()) spline.Vfinal /= ratio
  if (segment.is_intermediate()) spline.Vintermediate /= ratio
   
  forward_propagate(segment.next);
  segment.compute_velocities() // e.g. find new Vintermediate
  segment.compute_coefficients() // e.g. get A B C D

// Update segment start and finish times
void forward_propagate(segment):

  while (next_segment != null):
    next_segment.forward_propagate() // e.g. Tinit = Tinit_prev + Duration
    next_segment= segment.next
    
```
*Above:* When a segment is scaled, the following changes occur 
1. the segment duration 
2. the segment initial or final velocity (or both)

*Forward propagation*: All segments after the scaled segment are affected: the start time of each spline becomes the finishing time of the previous. These values propagate to the last spline.

Finally, the resulting intermediate velocities and polynomial coefficients must be recomputed. 

***
### References
[1] Biagiotti, L., & Melchiorri, C. (2009). _[Trajectory Planning for Automatic Machines and Robots](https://www.blogger.com/blog/post/edit/8646226552989795436/981000181203813289#)_. Berlin, Heidelberg: Springer Berlin Heidelberg.

***
### Discussion
Please feel free to start a discussion [on GitHub](https://github.com/slater1/blog/issues).
