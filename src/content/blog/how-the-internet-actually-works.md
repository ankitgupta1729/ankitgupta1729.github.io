---
title: "What Actually Happens When You Open a Website"
description: "You type a URL and a page appears. Between those two moments, a remarkable global relay race takes place in milliseconds. Here's the whole journey."
category: "technology"
tags: ["internet", "networking", "dns", "http"]
author: "Ankit Gupta"
pubDate: 2026-05-22
heroEmoji: "🌐"
---

You type an address, hit Enter, and a page appears almost instantly. It feels like nothing. In reality, your request just bounced across continents, consulted a global directory, negotiated encryption, and reassembled data from packets — all faster than you can blink. Let's slow it down.

## Step 1: Finding the address (DNS)

Computers don't speak in names like `example.com`; they speak in numbers — IP addresses like `93.184.216.34`. So first your browser asks the **Domain Name System**, the internet's phone book: "What's the IP for this name?"

This lookup walks a hierarchy — your computer's cache, your ISP's resolver, root servers, then the domain's authoritative server — until it gets an answer. The result is cached so next time is instant.

## Step 2: Knocking on the door (TCP)

Now your browser opens a connection to that IP using **TCP**, which begins with a three-way handshake:

```
You:    "SYN"      (Can we talk?)
Server: "SYN-ACK"  (Yes, can you hear me?)
You:    "ACK"      (Yes — let's go.)
```

TCP guarantees that data arrives complete and in order, re-sending anything lost along the way.

## Step 3: Locking the door (TLS)

If the site uses HTTPS (it should), browser and server now perform a **TLS handshake**. They agree on encryption keys so that everything exchanged is scrambled to anyone watching. This is the padlock in your address bar — and it relies on the public-key cryptography that secures the modern web.

## Step 4: Making the request (HTTP)

Finally, your browser sends an **HTTP request**:

```
GET /index.html HTTP/2
Host: example.com
```

The server responds with a status code (`200 OK`, the dreaded `404 Not Found`, etc.) and the page's HTML.

## Step 5: Building the page (rendering)

The HTML is just the skeleton. As the browser reads it, it discovers it needs more — CSS for styling, JavaScript for behavior, images, fonts — and fires off more requests for each. Then it assembles everything into the **DOM**, applies styles, runs scripts, and paints pixels to your screen.

## The hidden helper: CDNs

How does a site load fast whether you're in Tokyo or Toronto? **Content Delivery Networks** keep copies of the site on servers around the world, so your request is answered by a machine physically near you rather than one across an ocean. (This very site is served this way — which is part of why it's fast and free.)

## The quiet miracle

The astonishing part isn't any single step — it's that no one is in charge of the whole thing. The internet is a loose agreement between millions of independent networks to follow the same protocols. There's no central computer, no master switch. It works because everyone speaks the same languages: DNS, TCP, TLS, HTTP. A decentralized system of staggering scale, coordinating perfectly, billions of times a second.

*Want a deeper dive into any single step — DNS, TLS, or HTTP/3? Request it in the comments.*
