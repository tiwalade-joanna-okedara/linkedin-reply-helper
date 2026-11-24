# LinkedIn reply helper 💬

**Reply to every comment without sounding like a bot.** Give it a CSV of the comments on your post and it drafts a reply to each one in your voice, using a style guide you write once. You read, edit and approve every reply, then post them yourself.

```text
Ada: This is so real. Which payment provider did you settle on in the end?
  → Paystack, mainly for split payments. Settling straight into the seller's account saved us a lot of reconciling.
```
*(Example output. Your drafts depend on your post and your style guide.)*

## Why

When a post does well, the comments are where the real conversations start, and replying to all of them takes hours. I wanted help with the first draft without handing my voice, or my account, to a bot.

## What it won't do

- It doesn't log in to LinkedIn, scrape or auto-post. You paste or export the comments; you post the replies.
- It doesn't invent results or numbers (the style guide forbids it; still check every draft).

## Run it

```bash
export ANTHROPIC_API_KEY=...
cp comments.example.csv comments.csv      # columns: name,comment
node reply.js comments.csv --post post.txt --out drafts.csv
```

Edit [`style.md`](style.md) to match how you write.

---
Made by [Tiwalade Joanna Okedara-Kalu](https://github.com/tiwalade-joanna-okedara) · MIT licence
