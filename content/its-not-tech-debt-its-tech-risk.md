+++
title = "It's Not Tech Debt. It's Tech Risk."
date = 2025-04-09
[taxonomies]
tags = ['risk']
+++

![Challenger Explosion](../challenger_explosion.jpg)
<div class="text-center">
  <p style="font-style: italic">
    Tech debt becomes due swiftly and chaotically. Tech risk is a better metaphor.
  </p>
</div>

## What is Tech Debt?

"Tech debt" is a metaphor coined in 1992 by [Ward Cunningham](https://en.wikipedia.org/wiki/Ward_Cunningham). In software engineering and adjacent disciplines like DevOps, it relates shortcuts on quality to financial debt. 

We all know how financial debt works: you pay to use someone else's money. The amount you pay is proportional to the amount you borrow, how long you borrow it, and the interest rate. Borrowing can be a good idea since having money *right now* enables valuable events like buying a house or starting a business.

Wardites hold that tech debt, like financial debt, incurs a penalty which over time compounds the amount of labor required to continue delivering. Etiologies [vary](https://waynehale.wordpress.com/2024/01/10/the-most-important-thing/): Some folks hold that tech debt originates when stakeholders intentionally trade quality for delivery speed. Others say it happens inadvertently. Some distinguish between *reckless* and *prudent* tech debt.

## Tech Debt Is Not Like Financial Debt

The tech debt metaphor appeals because it is easy to explain. Unfortunately, the metaphor is strained. *Tech debt is not like financial debt*. Let's see why not.

Mortgages and other loan products are *predictable*, for both the lender and the borrower. Borrowers repay on a steady schedule which has a specified maturity term, e.g. 15 or 30 years. The interest rate is fixed or mostly fixed. From day one, a spreadsheet predicts exactly how much principal and interest the borrower will still owe in month 137. For a bank, any loan is part of a diversified portfolio of many loans. While [banks do fail](https://www.bitsaboutmoney.com/archive/banking-in-very-uncertain-times/), it's rare in the post-2008 financial crisis, where underwriting rules are tighter. Moreover, the societal harm of any individual bank failure is mitigated by distributing its cost across the entire banking system, facilitated by the full faith and assurance of the US Federal Reserve.

## Tech Debt Explodes

Here's how financial debt could be like tech debt. Imagine a hypothetical dystopian financial system in which banks could demand full mortgage repayment on a whim. We'll call these detonating mortgages — If you can't pay a few hundred thousand dollars *right now*, you lose your home. No, you didn't do anything wrong, but the bank needs some liquidity today, so you and your children are now living in a hotel.

![Banker on the Phone and Family in a Hotel](../bank_and_family.jpg)

Tech debt is like a detonating mortgage. Its payment becomes due unpredictably. Its timing is not fair or uniformly distributed.

The people who [investigated](https://en.wikipedia.org/wiki/Rogers_Commission_Report) the Challenger explosion didn't have the term tech debt, but they listed quality shortcuts among the root causes. These quality shortcuts exposed the program to risk. It was an intentional decision to fly on a cold day with faulty O-rings. If NASA could have had at their disposal a spreadsheet predicting when seven astronauts would crash into the Atlantic ocean, they would have engineered right up to that point but not past it. 

In software development, quality shortcuts expose future delivery to risk. An engineer starts working on a ticket, updates a business rule, get the code reviewed, and ships it to production. Lo and behold, a year ago another engineer who doesn't even work here anymore duplicated the business rule in another service. The mismatch cost customers money, and now they switching to a competitor.

## Conclusion

Business, like spaceflight, is full of risky bets, but since we [must go](https://waynehale.wordpress.com/2024/01/10/the-most-important-thing/), let's not delude ourselves when we're taking risks. 

Deferred tech quality is not like a loan. The cost of quality shortcuts doesn't manifest on a schedule. 

Use the term **tech risk**. 

## Next...

Want to identify and mitigate tech risk? Subscribe to my email list. I plan to write more about this topic.
