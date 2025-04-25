+++
title = "Tech Risk is Business Risk"
date = 2025-04-25
[taxonomies]
tags = ['risk']
+++

*Tech risk is a business concern. Instead of griping vaguely about "tech debt", explain its potential costs with words the business understands.*

![Diagram Mapping Tech Risks to Business Metrics](../tech_risk_mapping.png "Tech Risks mapped onto Business Metrics")
<div class="text-center">
  <p style="font-style: italic">
    Tech Risks mapped onto Business Metrics
  </p>
</div>

## Introduction

5 months ago, Reddit user _Agent_Aftermath_ posted in _/r/AskProgramming_:

> Why are so many companies so ambivalent or uncommitted to addressing tech-debt?

I think most engineers can empathize with this problem. We've all worked in codebases or infrastructures that smelled worse than a dirty diaper, yet few of us were able to do much to improve it.

The responses enumerated the many disincentives for addressing tech debt and presented only a few tenuous solutions. The top response succinctly captures the diagnosis:

> It is more difficult to quantify the value of addressing tech debt as opposed to creating a new feature. --oofy-gang

The problem is not that tech debt is not real, nor that addressing it is frivolous. The pain lurks in _quantifying it_ and that there are *apparently* more profitable uses of resources.

Note that for the rest of this article, I will use the term *tech risk* instead of *tech debt*. Why: In short, unlike mortgages, quality issues exact repayment suddenly and unpredictably. You can read my more detailed explanation [here](https://www.slater.dev/its-not-tech-debt-its-tech-risk/).

## What a Business Values

Boardrooms always optimize for business metrics, and in capitalism, all business processes reduce to revenue and profit. If technical issues have no _anticipated_ effect on the bottom line, then leadership will readily prioritize other capitalizable work. 

It would be ludicrous for a CTO to stand up in a board meeting and declare, "I'm happy to share that engineering has closed all open bugs in the backlog." This statement conveys no meaning to the board. It is unactionable techno-babble. Rather, the CTO knows to translate to business-speak: "I'm happy to share that this quarter we'll able to deploy 100% of our resources to new feature development, and because of this efficiency we will not renew our offshore QA contract, saving $3M over last quarter."

The key word above is _anticipated_. There is high-quality research<sup>\[[1](#references)\]</sup> and literature<sup>\[[2](#references)\]</sup> demonstrating that internal tech quality _is a business concern after all_. Indirectly, the board _does_ care about the engineering backlog, because engineering is a business unit, and business units cost or earn money. 

Let's now focus on how you, a technical person, can present engineering concerns as business concerns. I have distilled your task into three steps:

1. Identify business metrics
2. Identify tech risks
3. Map tech risks onto business metrics

## Identify Business Metrics

If you're not sure what metrics your business is tracking, ask. They will usually\* be instantiations of "make more money" or "spend less money". However, revenues and profit may be linked to business processes with second-order metrics and performance indicators. For example, a food distributor must:

- procure raw foods from producers
- store raw foods cleanly
- process and package foods efficiently and safely
- find and retain customers
- distribute food quickly to customers via truck, rail, or air before it spoils.

The overall business metric "net profit" will be a complex result of its many business processes.

\* Funded startups, nonprofits, and businesses with philanthropic goals may have more nuanced motives than just net profit.

## Identify Tech Risks

A tech risk is a technology that a business depends on that could have unexpected costs. Examples include a buggy internal codebase, outdated software<sup>\[[3](#references)\]</sup>, servers past their vendor support window, and overcomplicated architectures. Quality is correlated with risk: high-quality software has less bugs and is easier to change.

These risks can cause events which negatively affect business metrics. For example:

- An old software package contains a security flaw which results in data exfiltration.
- A server fails and production is interrupted for a day.
- A complicated architecture makes it expensive and slow to pivot the business to pursue a new revenue stream.

An FMEA<sup>\[[4](#references)\]</sup> is helpful for prioritization, i.e. to decide which risks most merit mitigation. In this style of risk analysis, the risk is quantified in terms of its probability of occurrence and severity of the harm it could cause. You won't be able to fill in the severity column until you've completed the mapping to business metrics below.

| Tech Risk                        | Probability of Occurrence | Severity of Harm                                      |
|----------------------------------|----------------------------|------------------------------------------------------|
| Security flaw in shipment DB     | 1%                         | **Low**. Low-value shipment data exfiltrated         |
| Security flaw in patient DB      | 1%                         | **Severe**. Protected Health Information exfiltrated |
| Server disk fails                | 10% after 5 years          | **Moderate**. Production interrupted 1 day           |

## Map Tech Risks onto Business Metrics

Each risk presents one or more harms, each of which can realize cost to the business. Sometimes the path to a business metric will traverse one or more business processes. For example, it may not be immediately apparent how a damaged brand reputation can affect revenues, but a reduced sales funnel conversion rate will directly impact the bottom line.

| Event                                | Business Metric Impacted                                                      |
|--------------------------------------|-------------------------------------------------------------------------------|
| Low-value shipment data exfiltrated  | None; who cares?                                                              |
| Protected Health Information exfiltrated | Brand reputation damaged → Sales Funnel Conversion % (fewer new customers) |
| Protected Health Information exfiltrated | Brand reputation damaged → Churn (customers leave)                        |
| Production interrupted 1 day         | Can’t fulfill committed sales → 1% loss of quarterly revenue                  |

Step back for a second and compare the items on the left and right. The CEO's eyes may glaze over at the annual HIPAA training, but connecting a PHI breach convincingly to the company's sales conversion rate will make them listen.

Conversely, if you can't meaningfully associate a tech risk with a business cost, then you should accept that it is not a business priority. In the example above, we don't need to prioritize hardening the shipment DB.

## Conclusion

To convince your company to address "tech debt", map from tech risks to business metrics. Be prepared to discover that some tech risks don't matter.

## Next...

Subscribe to my email list below. I plan to write more.

## References

1. [Code Red: The Business Impact of Code Quality](https://arxiv.org/pdf/1908.00150)
2. [Accelerate: The Science of Lean Software and DevOps](https://itrevolution.com/product/accelerate/)
3. [End-of-life (EOL)](https://endoflife.date/)
4. [Failure Mode and Effects Analysis](https://en.wikipedia.org/wiki/Failure_mode_and_effects_analysis)
