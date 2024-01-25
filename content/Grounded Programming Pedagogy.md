+++
title = "Grounded Programming Pedagogy"
date = 2024-01-25
[taxonomies]
tags = ['code']
+++

 In the alum chat for [Mirdin](https://www.mirdin.com), someone posted the following question, "Would it be better to start teaching beginners functional or imperative programming first?"
 
 Pretending for a second that [FP](https://en.wikipedia.org/wiki/Functional_programming) and [IP](https://en.wikipedia.org/wiki/Imperative_programming) are the only choices (they're [not](https://info.ucl.ac.be/~pvr/VanRoyChapter.pdf)), an answer depends on where your beginner comes from.

A meta-pedagogical (teaching about teaching) answer acknowledges that learning starts in a place the learner feels [grounded](https://argumatronic.com/posts/2018-09-02-effective-metaphor.html) and connects them from there to new knowledge. For example, [subitizing](https://en.wikipedia.org/wiki/Subitizing) is an innate ability. A developmentally normal child can instantly know how many objects are presented, for values up to about 5.

<div style="text-align: center; width: 60%; margin: 0 auto;">
  <img src="../img/5_die.png"/>
  <p style="font-style: italic">Image: How many dots are there? You just subitized.</p>
</div>

From there, you can teach a 5-year-old arithmetic, for example to add, by having them subitize groups of objects alongside numerals and the math symbol `+`. This connects their innate notion of quantity to the abstract notion of numbers.

[SICP](https://web.mit.edu/6.001/6.037/sicp.pdf), a masterpiece in teaching programming, falls heavily on the FP side, though they didn't have that vocabulary at the time. Watch Sussman absolutely rip apart side effects in [lecture 5A](https://ocw.mit.edu/courses/6-001-structure-and-interpretation-of-computer-programs-spring-2005/resources/5a-assignment-state-and-side-effects/). But not everybody "gets" this approach easily. Even Hal acknowledges in this [Corecursive interview](https://corecursive.com/039-hal-abelson-sicp/) that the FP approach didn't work for everyone: 

> In the very beginning days, we would teach a sort of short courses for MIT faculty and some of the electrical engineers would just get stuck. "You haven’t showed us how the transistors work". ...People think different ways. Some people have to be grounded on where they’re comfortable and for some people, well, it really is transistors. 

Contrast that to somebody who knows what a function is, in the math sense. The machinery of a [transistor](https://en.wikipedia.org/wiki/Transistor), of gates, sources, drains, and [TTL](https://en.wikipedia.org/wiki/Transistor%E2%80%93transistor_logic) will be an irritating detail, like multiplying matrices by hand.

So in the dichotomy between introducing FP and IP first, the answer might depend on where the learner is coming from. I learned IP and OOP first because that's what material was available. I was first exposed to FP in college in the form of Scheme. It was disorienting. I couldn't count all the parentheses, let alone grok tail recursion. I wish it could have been presented to me grounded in terms of what I was already comfortable with, for example high school algebra.

I say, introduce multiple programming paradigms early, and ground it in what the learner knows. A fundamental programming skill is to think at [multiple levels of abstraction](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/). The Haskell programmer needs to be aware that even monads at some point are just bits in a memory hierarchy, just as it's important for an assembly programmer to know that while register allocation is critical to performance, registers are not really what the program is about.

To close, let's ground this discussion in something we all know. To design a cathedral, the architect needs to know what bricks will be used. To build a cathedral, the bricklayer needs to envision the noble end to which each brick is set down.
