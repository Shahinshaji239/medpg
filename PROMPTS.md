# My AI Prompting Log

This file contains the actual prompts used with my AI coding assistant during this challenge.

**Prompt 1:** *"Give a clarity what we need all other things"*
*   **Worked first time?** Yes, the AI summarized the brief beautifully, extracting the precise requirements into a checklist.
*   **What I changed:** I refined the plan to avoid paid APIs by deciding on a Simulated AI backend to strictly adhere to the "No Cost" rule.

**Prompt 2:** *"What the plan in ai section? Explain how we can achieve real DOM manipulation based on chat."*
*   **Worked first time?** Yes. The AI explained "Function Calling/Tool Use", where the backend returning structured JSON (`{"action": "FILTER", "payload": ...}`) is the industry standard approach for Agentic UIs.
*   **What I changed:** I adopted this architecture entirely.

**Prompt 3:** *"Is ui i need to create in sketch?"*
*   **Worked first time?** Yes. AI clarified that code-first is acceptable for a full stack role.
*   **What I changed:** I asked the AI to actually generate a premium UI concept for me using its internal image generator so we had a solid visual target before coding.

**Prompt 4:** *"No no make a better design. Show me a concept for 'Aether Motors' featuring dark mode, glassmorphism, and neon accents."*
*   **Worked first time?** The initial image generation model hit a capacity limit (503 error), but the AI smoothly pivoted to using a specialized internal MCP server (StitchMCP) to generate a stunning, production-ready frontend design system in code.
*   **What I changed:** We utilized the generated "Atmospheric Precision" design language (Manrope fonts, glowing accents, #111318 backgrounds) directly in my standard Vanilla CSS integration.

**Prompt 5:** *"Okey this is full stack project you know we use django and react okey do well and meet all requirements okey"*
*   **Worked first time?** Yes. The AI instantly understood the architecture, writing shell scripts to bootstrap Django and React concurrently, and setting up the CORS configuration.
*   **What I changed:** I let the AI execute the bootstrapping commands to save 15 minutes of boilerplate setup.

**Prompt 6:** *"Write the React App.jsx with the ChatWidget and the DOM manipulation logic based on our 6 query rules."*
*   **Worked first time?** Almost. It wrote a brilliant implementation using `scrollIntoView` and `useEffect` hooks for the chat auto-scrolling. 
*   **What I changed:** I ensured the car ID formatting matched exactly so the `highlightSection` logic didn't break on spaces in the car names.
