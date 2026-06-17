---
title: "The Monty Hall Problem: When Intuition Goes to War with Math"
description: "Three doors, one car, two goats. A puzzle so counterintuitive it fooled mathematicians — and a perfect lesson in how new information changes probability."
category: "mathematics"
tags: ["probability", "puzzles", "intuition"]
author: "Ankit Gupta"
pubDate: 2026-06-07
heroEmoji: "🚪"
---

Few math problems have started as many arguments as the Monty Hall problem. When the correct answer was published in 1990, thousands of readers — including people with PhDs — wrote in to say it was wrong. It wasn't. Here's the puzzle, the answer, and why our brains rebel against it.

## The setup

You're on a game show. There are three doors. Behind one is a car; behind the other two, goats. You want the car.

1. You pick a door — say, Door 1.
2. The host, **who knows what's behind every door**, opens a different door — say Door 3 — revealing a goat.
3. He offers you a choice: stick with Door 1, or switch to Door 2.

Should you switch?

## The answer: always switch

Switching wins **2/3 of the time**. Staying wins only **1/3**. Switching literally doubles your chances. Most people are certain it's 50/50. Most people are wrong.

## Why it works

The key is that the host's action isn't random — **he knows where the car is and always reveals a goat.** That injects information.

Think about your first pick:

- The chance your original door has the car: **1/3**.
- The chance the car is behind one of the *other two* doors: **2/3**.

When the host opens a goat door from those other two, that 2/3 probability doesn't vanish — it **collapses onto the single remaining unopened door**. So switching gives you the full 2/3.

## The 100-door version that makes it obvious

Imagine 100 doors. You pick one — a 1-in-100 shot. The host then opens 98 other doors, all goats, leaving just your door and one other. Do you still feel it's 50/50? Almost everyone now sees it: your original pick was almost certainly wrong (99% chance), so the other door is almost certainly the car. Switch. The three-door version is the same logic, just less dramatic.

## Why our intuition fails

Our brains treat the two remaining doors as symmetric — "two doors, one car, 50/50." But they aren't symmetric: one door survived *your* random guess, the other survived the host's *informed* filtering. The host's knowledge is doing work, and intuition ignores it.

This is the same blind spot behind the [base-rate fallacy](/blog/bayes-theorem-updating-beliefs/): we struggle to update probabilities correctly when new, non-random information arrives.

## The takeaway

The Monty Hall problem is a humbling reminder that probability is not common sense, and that *how* information is revealed matters as much as the information itself. When your gut and the math disagree, it's worth slowing down — the math is usually trying to teach you something.

*Still not convinced? Simulate it: pick, reveal, switch, repeat 100 times. The data settles every argument. Share your results below.*
