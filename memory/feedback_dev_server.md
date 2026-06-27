---
name: feedback-dev-server-already-running
description: Don't start the dev server — user keeps it running and can see live changes directly.
metadata:
  type: feedback
---

Don't launch the dev server or use the /run skill. The user keeps `npm run dev` running in the background and observes changes live in the browser.

**Why:** User preference — they monitor the running app themselves.

**How to apply:** After making code changes, simply tell the user what was changed. Do not attempt to start the server or verify via browser automation.
