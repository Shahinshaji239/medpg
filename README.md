# DriveAI — Aether Motors

**Live URL:** *(You will update this with your Vercel/Render link after deployment)*

## Setup Instructions
To run this project locally, you will need two terminal windows.
1. **Backend (Django):** 
   - `python -m venv venv`
   - `.\venv\Scripts\activate`
   - `pip install django djangorestframework django-cors-headers`
   - `python manage.py migrate`
   - `python manage.py runserver`
2. **Frontend (React/Vite):**
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Tech Stack & Rationale
*   **Frontend:** React (Vite). Chosen for its lightning-fast HMR and modern component-based architecture.
*   **Styling:** Custom Vanilla CSS. Chosen to demonstrate a deep understanding of CSS Grid, Flexbox, custom variables, and modern glassmorphism techniques without relying on utility classes or component libraries, proving I can build premium web experiences from scratch.
*   **Backend:** Django & Django REST Framework. Chosen for its robust, secure-by-default architecture, allowing rapid API routing. 
*   **AI Engine:** To adhere to the strict "No Cost" rule of this challenge, the AI is a custom-built semantic parser in Django rather than a paid LLM. It flawlessly intercepts natural language requests and returns structured commands that the React frontend uses to act on the DOM.

## AI Query Types Supported
Our AI assistant seamlessly handles the following 6 distinct queries:
1. **Filtering:** *"Show me SUVs under 20 lakhs"* 
   - Action: Intercepts the request, highlights the model section, and dynamically filters the React state to only render vehicles matching the criteria.
2. **Comparison:** *"Compare your top two models"* 
   - Action: Smooth-scrolls to the Specifications table and highlights the top two models side-by-side.
3. **Pre-filling Form:** *"I'd like to book a test drive for your flagship model this Saturday in Kochi"* 
   - Action: Captures intention, date, and location, scrolling instantly to the booking form and populating the respective fields automatically.
4. **Recommendation:** *"Which car is best for a family of five?"*
Our AI assistant seamlessly handles the following 8 distinct queries:

### 🤖 Nova AI: 8 Advanced Query Types
The platform features a multi-modal assistant capable of executing 8 distinct architectural actions:
1.  **Categorical Filtering**: "Show me SUVs under 70 Lakhs."
2.  **Head-to-Head Comparison**: "Compare the Phantom and the Nexus."
3.  **Cross-Sectional Navigation**: "Show me all your cars."
4.  **Transaction Automation**: "Book a test drive for the Titan in Bangalore."
5.  **Inventory Analytics**: "Can you tell me the perfomance of Aether Phantom?"
6.  **Spotlight Mode**: "Recommend the best car for off-roading."
7.  **Financial Localization**: "Switch all pricing to USD."

## What I'd Build Next (With 1 More Week)
I would integrate a WebGL (Three.js) interactive 3D model of the flagship car in the hero section, allowing the AI to actually rotate or change the paint color of the 3D model based on conversational prompts. I'd also swap the Simulated AI parser for an open-source LLM (like Llama-3) hosted via Groq for deeper conversational memory.
