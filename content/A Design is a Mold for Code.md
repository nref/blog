+++
title = "A Design is a Mold for Code"
date = 2024-01-15
[taxonomies]
tags = ['code']
+++

I'm always in search of good metaphors for software design. Good or not, here's one:

> A Design is a Mold for Code

In manufacturing, a mold is a hollow shape that fills with fluid material which expands into the space and sets to form a casting. 

![Example of a mold](../img/Bronze_spearhead_mold.JPG)
*Image: Bronze age spear head mold [Wikipedia](https://en.wikipedia.org/wiki/Molding_(process))*

Like manufacturing, code fills the [negative space](https://en.wikipedia.org/wiki/Negative_space) of a software design. Imagine two engineering teams who independently "fill" (implement) a design. Let's imagine the design is for a C compiler, e.g. the C99 language specification. The two resulting implementations are `gcc` and `clang`. They're implemented in different languages (C and C++) and take vastly different shapes, but as far as the spec is concerned, the two are equal. People in the know call such implementations [isomorphic](https://blog.ploeh.dk/2018/01/08/software-design-isomorphisms/)\*.

\* Isomorphic with respect to the design/interface/specification. Given the same C code, the two compilers produce different binaries, but for compliant C they are equivalent within the specification.

It's important not to reverse the causality: a design causes the work product, not the converse. A mold causes a casting, and a software design causes code. Nevertheless, to some extent, one can go in reverse, i.e. reconstruct a mold from a casting or infer a design from code. 

The reconstructed mold might lose some fidelity, like sharp edges or precise dimensions, but it's far worse for code. Looking at code without supplemental information, a new dev can only infer a dim, vague notion of its design. She might even sense the mind(s) behind the design. However, it would be costly if even possible to losslessly reconstruct the design, i.e. to such a fidelity that it could be used as the specification for an isomorphic implementation.

In pseudocode:

```
[Test]
fn Reverse_ProducesIsomorphicDesign()
    let design1 : ...
    let code1 = implement(design1)
    let design2 = reverse(code1)
    let code2 = implement(design2)
    assert(isomorphic(code1, code2)) // Fails
```

Above: The roundtrip from a design to code back to code is lossy.

There are a few reasons for this:

- A codebase maybe too large to fit into a dev's head. Examples: `gcc` and `clang`. Like the limited context window of ChatGPT, a human has limited working memory and forgets. Though with time and repetition, knowledge transitions to long-term memory.
- It's hard to infer high-level concepts from low-level details. For example, decompiling assembly back to C.
- Design and code have a many-to-many relationship.
	- There can be many implementations that satisfy a design.
	- There can be many designs that result in the same code.

This is a problem for software that outlives its creator(s). The software will die unless knowledge is [retained](https://en.wikipedia.org/wiki/Organizational_memory) and [replicated](https://en.wikipedia.org/wiki/Bus_factor).

There are some things developers can do to keep their software alive:

- Write down the design. Use [natural language](https://en.wikipedia.org/wiki/Literate_programming)
- Make the [design apparent in the code](https://www.pathsensitive.com/2018/01/the-design-of-software-is-thing-apart.html)
- Use [precise abstractions](https://www.pathsensitive.com/2022/03/abstraction-not-what-you-think-it-is.html)
- Use [effective](https://argumatronic.com/posts/2018-09-02-effective-metaphor.html) [metaphors](https://gist.github.com/onlurking/fc5c81d18cfce9ff81bc968a7f342fb1#tacit-knowledge-and-documentation)
- Make the code [fit in your head](https://www.oreilly.com/library/view/code-that-fits/9780137464302/)
