# Learnings & Reflections

### What was new to me in this challenge?
The concept of building an "Agentic UI" where a chat interface actively mutates the DOM was incredibly fascinating. While I have built standard single-page applications and standard chatbots before, connecting the two so that natural language directly controls React state (filtering arrays, switching themes, executing CSS animations) was a completely fresh paradigm for me. 

### How I figured it out
I initially wondered if I needed to use complex DOM querying inside the chat component, but my AI assistant helped me arrive at a much cleaner architectural pattern: **Action-Payload Routing**. 

Instead of the backend trying to decipher the DOM, it simply parses the intent and returns a "Command Object":
```json
{
  "action": "PREFILL_FORM",
  "payload": {"city": "Kochi", "date": "2026-04-18"}
}
```
The React frontend then acts as a pure state machine, receiving this command, updating the `booking` state, and triggering a smooth scroll. This drastically decoupled the logic and made the app highly scalable.

### Sources and Documentation Used
1.  **React Docs (`useRef` and `useEffect`):** I had to review how to use `useRef` combined with `.scrollIntoView({ behavior: 'smooth' })` to ensure the chat history inherently scrolled to the bottom whenever a new message was added, and similarly to make the AI scroll the main window.
2.  **MDN Web Docs (CSS Animations):** I researched how to create the `pulse-glow` effect. I learned that simply adding a class sometimes requires triggering a DOM reflow (`void el.offsetWidth;`) if the animation needs to be restarted immediately upon consecutive AI triggers.
3.  **Django REST Framework Docs:** Used briefly to ensure my API Endpoint `api_view(['POST'])` decorator was properly configured to accept the JSON payload from Axios and return standard REST Responses.

### Final Thoughts
This challenge shifted my perspective on frontend development. Interfaces are no longer just clickable elements; they are environments that can react to conversation. Thank you for the opportunity to build this!
