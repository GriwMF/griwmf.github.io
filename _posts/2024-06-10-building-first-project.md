---
layout: post
title: "Building My First Real Project"
date: 2024-06-10 09:00:00 -0000
categories: projects web-development
tags: [projects, web-development, javascript, learning]
---

After months of tutorials and coding exercises, I finally took the plunge and built something real. Not a tutorial project, not a code-along—something entirely my own. Here's what I learned.

## The Idea

I wanted to build a personal expense tracker. Nothing fancy, just a simple web app where I could log expenses, categorize them, and see where my money was going. It seemed simple enough... or so I thought.

## The Tech Stack

I decided to use:

- **Frontend**: HTML, CSS, JavaScript (vanilla—no frameworks yet)
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Version Control**: Git and GitHub

Looking back, this was probably more complex than necessary for a first project, but I wanted to challenge myself.

## The Journey

### Week 1: Planning and Setup

I spent the first week planning. I created wireframes (just sketches in a notebook), outlined features, and set up my development environment. This planning phase was crucial—it gave me a roadmap to follow when I inevitably got lost in the weeds.

### Week 2-3: Frontend Development

Building the UI was fun but humbling. CSS, which I thought I understood, showed me how much I still had to learn. Centering a div shouldn't be that hard, right? (Spoiler: it can be.)

Key challenges:
- Making it responsive (mobile vs. desktop)
- Form validation
- Creating a decent user experience

### Week 4-5: Backend Development

This is where things got real. Setting up the server, creating API endpoints, and handling database operations was completely different from frontend work. I had to learn:

- RESTful API design
- Asynchronous JavaScript (callbacks, promises, async/await)
- Database schema design
- Error handling and validation

### Week 6: Integration and Debugging

Connecting the frontend to the backend revealed so many edge cases I hadn't considered:

- What happens when the server is down?
- How do I handle failed requests?
- What if someone enters invalid data?
- How do I protect against malicious input?

## Major Challenges

### 1. CORS Errors

```javascript
// This simple addition solved hours of frustration
app.use(cors());
```

Understanding CORS (Cross-Origin Resource Sharing) through trial by fire was not fun, but I won't forget it now.

### 2. Async/Await Confusion

Asynchronous JavaScript was a major hurdle. I'd read about it, watched videos, but truly understanding it only came through breaking things repeatedly.

### 3. State Management

Keeping the UI in sync with the backend data was trickier than expected. When do I fetch new data? How do I handle updates? Should I refresh the entire list or just update one item?

## What Went Well

Despite the challenges, some things worked out great:

- **Git workflow**: Committing regularly and using branches saved me multiple times
- **Documentation**: Taking notes as I built helped when I returned to the code later
- **Testing as I go**: Rather than building everything then testing, I tested each feature as I completed it

## Lessons Learned

### Technical Lessons

1. **Start smaller than you think** - My initial feature list was way too ambitious
2. **Read the documentation** - Seriously, read it. Don't just skim
3. **Error handling matters** - Add it from the start, not as an afterthought
4. **Security is not optional** - Input validation, sanitization, authentication—all essential

### Process Lessons

1. **Break it down** - Big tasks into small, manageable pieces
2. **Version control everything** - Commit early, commit often
3. **Take breaks** - Fresh eyes catch bugs faster
4. **Celebrate small wins** - Each working feature is progress

### Personal Lessons

1. **Imposter syndrome is a liar** - Yes, I Googled things constantly. So does everyone
2. **Frustration is temporary** - That bug that seems impossible today will make sense tomorrow
3. **Building is learning** - You learn more from one project than ten tutorials
4. **Perfection is the enemy** - Ship something that works, improve it later

## The End Result

After six weeks, I had a working expense tracker. It wasn't perfect—the CSS could be better, there were features I wanted to add, and the code could be cleaner—but it worked! I could log expenses, view them by category, and see my spending patterns.

More importantly, I learned:
- How to structure a full-stack application
- How to debug across multiple layers
- How to persist through frustration
- That I could actually build something real

## What's Next

This project opened doors. I now have:
- A portfolio piece to show potential employers
- Confidence to tackle bigger projects
- A long list of improvements and features to add
- Real experience to talk about in interviews

I'm already planning my next project, armed with everything I learned from this one.

## Advice for Your First Project

If you're about to build your first real project:

1. **Choose something you'll use** - Personal investment keeps you motivated
2. **Start simple** - You can always add features later
3. **Don't aim for perfection** - Aim for completion
4. **Document your journey** - You'll forget the details otherwise
5. **Ask for feedback** - Others will see what you miss
6. **Finish it** - Even if it's not perfect, finish something

## Conclusion

Building my first real project was the best thing I did for my development journey. It transformed me from someone who could follow tutorials to someone who could create. The confidence and skills I gained were worth every frustrating moment.

Your first project won't be perfect. It doesn't need to be. It just needs to be done.

---

*What was your first real project? What did you learn from it?*
