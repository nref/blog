+++
title = "It's Not Tech Debt. It's Tech Risk."
date = 2025-04-09
[taxonomies]
tags = ['risk']
+++

*Tech Debt becomes due swiftly and chaotically. Tech Risk is a better metaphor.*

![Space Shuttle Challenger, 1986](../challenger_explosion.jpg "Space Shuttle Challenger, 1986")
<div class="text-center">
  <p style="font-style: italic">
    Space Shuttle Challenger, 1986. 
  </p>
</div>

## What is Tech Debt?

*Tech debt* is a metaphor coined in 1992 by Ward Cunningham<sup>[1](#references)</sup>.

In software engineering and adjacent disciplines like DevOps, it relates shortcuts on quality to financial debt. 

We all know how financial debt works: you pay to use someone else's money. The amount you pay is proportional to the amount you borrow, how long you borrow it, and the interest rate. Borrowing can be a good idea since having money *right now* enables valuable events like buying a house or starting a business.

Wardites hold that tech debt, like financial debt, incurs a penalty which over time compounds the amount of labor required to continue delivering. Etiologies vary: Some folks hold that tech debt originates when stakeholders *intentionally* trade quality for delivery speed. Others say it happens *inadvertently*. Some distinguish between *reckless* and *prudent* tech debt<sup>[2](#references)</sup>.

## Financial Debt is Predictable

The tech debt metaphor appeals because it is easy to explain. Unfortunately, the metaphor is strained. *Tech debt is not like financial debt*. Let's see why not.

Mortgages and other loan products are *predictable*, for both the lender and the borrower. Borrowers repay on a steady schedule which has a specified maturity term, e.g. 15 or 30 years. The interest rate is fixed or mostly fixed. From day one, a spreadsheet predicts exactly how much principal and interest the borrower will still owe in month 137. For a bank, any loan is part of a diversified portfolio of many loans. While banks do fail<sup>[3](#references)</sup>, stricter underwriting rules since 2008 have made it less common. Moreover, the societal harm of any individual bank failure is mitigated by distributing its cost across the entire banking system, facilitated by the full faith and assurance of the US Federal Reserve.

## Tech Debt Detonates

Here's how financial debt could be like tech debt. Imagine a hypothetical dystopian financial system in which banks could demand full mortgage repayment on a whim. We'll call these *detonating mortgages*<sup>[4](#references)</sup> — If you can't pay a few hundred thousand dollars *right now*, you lose your home. No, you didn't do anything wrong, but the bank needs some liquidity today, so you and your children are now living in a hotel.

![Banker on the Phone and Family in a Hotel](../bank_and_family.jpg "Banker on the Phone and Family in a Hotel")
<div class="text-center">
  <p style="font-style: italic">
    A detonating mortgage
  </p>
</div>

Tech debt is like a detonating mortgage. Its payment becomes due unpredictably. Its timing is not fair or uniformly distributed.

The people who investigated the Challenger disaster<sup>[5](#references)</sup> didn't have the term tech debt, but they listed quality shortcuts among the root causes. These quality shortcuts exposed the space program to risk. If NASA could have had at their disposal a spreadsheet predicting that the O-ring would fail on January 28, 1986, they would have decided not to fly.

## Conclusion

Quality shortcuts create risk. Some risk is necessary to reach our goals; how much we can tolerate depends on the expected reward<sup>[6](#references)</sup>. 

Let's not delude ourselves when we're taking risks. Deferred tech quality is not like a loan. The cost of quality shortcuts doesn't manifest on a schedule. 

Use the term **tech risk**. 

## Next...

Want to identify, prioritize, and mitigate tech risk? Subscribe to my email list below. I plan to write more about this topic.

## References

1. [Ward Cunningham](https://en.wikipedia.org/wiki/Ward_Cunningham)
2. [Technical Debt Quadrant](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html)
3. [Banking in Very Uncertain Times](https://www.bitsaboutmoney.com/archive/banking-in-very-uncertain-times/)
4. Patrick McKenzie invented this thought experiment in *Banking in Very Uncertain Times*
5. [Rogers Commission Report](https://en.wikipedia.org/wiki/Rogers_Commission_Report)
6. [The Most Important Thing](https://waynehale.wordpress.com/2024/01/10/the-most-important-thing/) 
