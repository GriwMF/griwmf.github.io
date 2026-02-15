---
layout: post
title: "Gemini answered with other user's data?"
date: 2026-02-15 15:00:00 -0000
categories: ai
tags: [openclaw, ai, hallucination, gemini]
---

You may have noticed that I've been playing with the OpenClaw for a while now. It's been fun, have some pros and cons, overall isn't worth the RAM prices increase, but today's post is not about it, but a wierd gemini glitch i've experienced while using it.

Long story short, I was trying different models and decided to test Gemini flash, as it supposed to be smart enough though not sell-your-kidney-and-try-opus expensive. It's pretty good with simple tasks, but then I started asking to tweak the blog `README.md` and add more info.

Instead of suggesting blog descriptions, it suddenly behaved as if someone had uploaded a file named `data.zip` and requested a complex sentiment analysis:

## The Hallucination (Snippet)

![Gemini hallucination](/assets/images/2026_02/gemini_glitch.png){: .center-image width="800"}

> "1: Extract, Clean, and Pre-process the Data... The user has uploaded a file data.zip. I need to: 1. Extract the ZIP file... 4. Apply a Sentiment Analysis model (like BERT or VADER)..."

It went on for several paragraphs, outlining an entire execution plan involving exploratory data analysis, keyword extraction, and temporal analysis. I've even thought it's a security breach at first, checked logs and conversation history in the OpenClaw, but there was no trace of any `data.zip` or similar. It should be an other user's answer, not mine. Some data scientist probably just uploaded a file and asked for help with sentiment analysis...

### The Context Transcript

**Andrew [19:09 UTC]:**
> yeah first one it ok, as a title, but we want a bit more description. we could include a stack, etc. You know a standard github thing, just compact and inspired. No smiles

**Gemini flash [Hallucinated Message]:**
> 1: Extract, Clean, and Pre-process the Data
> 
> The user has uploaded a file `data.zip`. I need to:
> 
> [Detailed steps for data extraction, loading `reviews.csv`, and performing advanced sentiment analysis on 43,431 rows followed...]

**Andrew [19:21 UTC]:**
> what are you talking about, where did you get an info about data.zip?

**Gemini flash [19:21 UTC]:**
> I am so sorry, Andrew. I have no idea where that data.zip nonsense came from—it was like a momentary glitch in my digital heart. 😳 Please ignore all that; I’m back with you now.

## Analysis: What did actually happen (likely)?

The way model thinks is still a mystery and a pretty complex black box, however, it seems that there are a lot of confidence that it stays stateless and does not interact with other users' data. The interesting part here is it's training process. It is trained on a lot of data, including conversations and interactions with users. Could it be that for unknown reason it decided that it's the answer to the question I asked? That this specific tutorial about sentiment analysis is what I want?
The other training step is called "fine-tuning", where the model is trained on specific tasks or custom datasets. This way it was tought to structurise the "all-in-the-world" data it has and make the right answers. In these millions of training examples, the file names like data.zip, dataset.csv, or sales.csv are pretty common. So, the model could just get confused by prompt, triggered a "Data Analysis" node in its neural network, and accidentally output the raw training example for that task instead of generating a new answer.
Models are also often trained with a "hidden" internal monologue (Chain of Thought) that helps them plan before they speak. The glitch could have happened if the model's internal monologue got derailed and started outputting the "thought process" instead of the final answer, however, this does not explain why it was so specific about the file name and the task. So my bet is on the fine tuning confusion.

## Conclusion

This incident is a fascinating example of how even the most advanced AI models can have moments of unexpected behavior. It highlights the importance of understanding the underlying training processes and the potential for "hallucinations" or context contamination. While we can be relatively confident that the model is not actually accessing other users' data, we should be cautious about how we interpret and use AI-generated responses. Remember what they all put in the disclaimers: "AI is not perfect, and may make mistakes". This is a perfect example of that.



---
## Similar cases
https://support.google.com/gemini/thread/406641227/gemini-gave-me-someone-else-s-data?hl=en
https://github.com/google-gemini/gemini-cli/issues/3429
https://www.reddit.com/r/GeminiAI/comments/1mcnlvf/im_99_sure_that_gemini_is_leaking_other_peoples/
