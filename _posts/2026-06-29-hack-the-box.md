---
layout: post
title: 'SQLi, Privesc, CVEs, and Frustration: My "Easy" Introduction to Hack The Box'
date: 2026-04-27 19:00:00 -0000
categories: linux hacking
tags: [linux, hacking, hackthebox, penetration testing]
---

It was June 23, 2026, when I stumbled upon Hack The Box, a platform for penetration testing and cybersecurity challenges. I can't recall exactly how I ended up there—maybe a random Reddit thread or an AI hallucination—but I decided to dive in.

I had heard about it before and could vaguely imagine what it was about, but I had never actually tried it. Since I'm using Linux now and have some web DevOps experience, I figured it might be worth checking out.

They feature "Machines"—virtual machines running various software. I saw one with a fun name to try. What's more, it was marked as "easy"!

Pffft. I have never made a bigger mistake in my life.

P.S. They also have "Challenges", which are smaller tasks like reviewing a script, as well as very easy machines with step-by-step guidelines. But who needs those when there are "easy" machines available, right?

As it turns out, we do.

### SQL Injection
So, we have a machine with a web server and its admin panel. That was basically as far as I got using my own knowledge. Luckily, I found out on Reddit that most easy machines are actually based on known vulnerabilities (CVEs). After a bit of Googling, I found this example:

`/endpoint.php?param=x'+AND+EXTRACTVALUE(1,CONCAT('~USER:',(SELECT USER()),'~'))--+"`

Which allows us to extract the database user. How does it work? The developers likely used a query like
`SELECT * FROM products WHERE param = '$param';`

By injecting `'+AND+EXTRACTVALUE...--+`, we can manipulate the SQL code and get
`SELECT * FROM products WHERE param = 'x' AND EXTRACTVALUE(1,CONCAT('~USER:',(SELECT USER()),'~'))--+';`
This forces an error that reveals the database user (we use -- at the end to comment out the remaining trailing quote).

MySQL's error-handling behavior is designed to help developers debug by showing exactly what string caused a failure. By leveraging the `EXTRACTVALUE` function, we trigger a database error containing `~USER:someuser@localhost~`

Unfortunately, the fun part ended right there. The rest of the machine was well beyond my current knowledge and incredibly painful. It required moving from the SQL injection to a reverse shell, and then finding a way to get root.

The entire "fun" process took more than 9 hours, and I was deeply frustrated at the end.

### The Other Machine
Despite the frustration, the pain was weirdly addictive. A few days later, I spun up another "easy" box. This machine was just as challenging, but much more sophisticated. It featured a web server, a mail server, and a mountable network file system.

The web server was vulnerable to a CVE that allowed for remote code execution, which I exploited to gain a reverse shell. I even found some leftover internal communications that leaked sensitive info! Additionally, I cracked a user password from a database hash using
`hashcat -m 3200 hash.txt /path/to/wordlists/rockyou.txt`

### Machine Names
Apparently, Hack The Box is pretty restrictive about what you can post online about active machines. That's why I won't be sharing the names of the machines nor the CVEs I used. I hope you got a sense of the overall fun and frustration of my experience.

### AI Cybersecurity
I also want to mention that I used AI tools to help me understand the vulnerabilities.

- Gemini: Too restrictive. Its safety filters make it pretty useless for offensive security, even in a CTF context.
- Deepseek: Doesn't give a shit if you ask it about hacking the Pentagon, but its technical logic and troubleshooting can be pretty flawed.
- Claude: Great at first, but eventually hit me with an Acceptable Use Policy warning and threatened to lock down my chats. Hard to recommend for heavy CTF work.
- ChatGPT: Provided the best balance. It gave really good, accurate explanations of the exploits without constantly scolding me.
