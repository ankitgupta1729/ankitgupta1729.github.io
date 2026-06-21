---
title: "Data Cleaning: The Unglamorous 80% of Data Science"
description: "Models get the glory, but data preparation decides whether a project succeeds. A field guide to the messy, essential work nobody puts in their portfolio."
category: "data-science"
tags: ["data-cleaning", "eda", "workflow", "pandas"]
author: "Ankit Gupta"
pubDate: 2026-06-06
heroEmoji: "🔬"
---

There's a well-worn statistic that data scientists spend about 80% of their time cleaning and preparing data, and only 20% modeling. The number is fuzzy, but anyone who has done the job nods knowingly. Here's why this "boring" part is actually where projects are won or lost.

## Garbage in, gospel out

A model treats its training data as ground truth. If the data is biased, mislabeled, or full of silent errors, the model will faithfully learn those flaws and present them back to you with confidence. The most expensive mistakes in machine learning are rarely algorithmic — they're data problems that nobody caught.

## The usual suspects

**1. Missing values.** Are they missing at random, or is the *absence* itself meaningful? A blank "income" field might be random — or it might mean the person declined to answer, which is information. Don't blindly fill with the mean.

**2. Duplicates.** Exact duplicates are easy. The dangerous ones are *near*-duplicates: "Apple Inc." vs "Apple, Inc." vs "APPLE INC". These quietly inflate counts and leak between train and test sets.

**3. Inconsistent units and formats.** Dates as `MM/DD/YYYY` and `DD-MM-YYYY` in the same column. Temperatures mixing Celsius and Fahrenheit. Currencies that aren't labeled.

**4. Outliers.** Is a \$0 transaction a data error, a refund, or a free trial? The answer changes how you handle it. Never delete outliers reflexively — investigate them.

**5. Leakage.** The silent killer. A feature that accidentally encodes the answer (like an "account_closed_date" when predicting churn) gives you suspiciously perfect validation scores and a model that's useless in production.

## A sane workflow

1. **Look at the raw data first.** Open it. Scroll. Read actual rows. Tools hide what your eyes catch.
2. **Profile every column.** Counts, ranges, unique values, missing rates. Distributions reveal lies that summary stats hide.
3. **Write down assumptions as you go.** "Negative ages are errors." "Country codes follow ISO-3166." These become your validation checks.
4. **Make cleaning reproducible.** Do it in code, not by hand-editing a spreadsheet. Future-you needs to rerun it on next month's data.
5. **Validate continuously.** Cleaning isn't one-and-done — add automated checks that fail loudly when new data violates your assumptions.

## A mindset shift

Treat data cleaning not as a chore before the "real work," but as the real work. Every hour spent understanding your data is an hour you don't spend debugging a mysteriously bad model later. The best data scientists aren't the ones with the fanciest models — they're the ones who deeply, almost suspiciously, understand their data.

*What's the weirdest data-quality bug you've ever hunted down? The comments are open.*
