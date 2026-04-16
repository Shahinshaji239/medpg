# DriveAI — Aether Motors

**Live Demo:**
https://medpg.vercel.app/

---

## Overview

DriveAI — Aether Motors is an AI-powered automotive experience platform that transforms how users explore vehicles.

Instead of navigating through traditional UI elements, users interact with the system using natural language. The AI dynamically controls the interface in real time — filtering data, navigating sections, comparing models, and automating actions.

This project demonstrates how conversational interfaces can directly manipulate frontend state and UI behavior without relying on traditional input flows.

---

## Local Setup

Run the project using two terminals:

### Backend (Django + DRF)

```bash
python -m venv venv
.\venv\Scripts\activate
pip install django djangorestframework django-cors-headers
python manage.py migrate
python manage.py runserver
```

---

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

---

## Tech Stack & Architecture

### Frontend — React (Vite)

* Fast development with Hot Module Replacement (HMR)
* Component-driven architecture
* Real-time UI updates based on AI responses

### Styling — Vanilla CSS

* Built without UI frameworks
* Uses Flexbox, Grid, and custom variables
* Implements modern UI techniques

### Backend — Django + Django REST Framework

* RESTful API architecture
* Secure and scalable backend
* Handles AI parsing and request routing

### AI Engine — Google Gemini

* Powered by the Gemini 2.5 Flash model for advanced intent detection
* Performs zero-shot classification to convert natural language into structured JSON commands
* Orchestrates real-time frontend behavior and state manipulation via dynamic API responses

---

## Nova AI — Core Capabilities

The system maps user intent into 7 structured action types, enabling direct UI manipulation:

### 1. Categorical Filtering

Example:
"Show me SUVs under 90 Lakhs"
Filters vehicles dynamically based on price and category

---

### 2. Head-to-Head Comparison

Example:
"Compare the Phantom and the Nexus"
Highlights selected models side-by-side

---

### 3. Cross-Sectional Navigation

Example:
"Show me all your cars"
Scrolls to relevant UI sections

---

### 4. Transaction & Form Automation

Example:
"Book a test drive for the Titan this Saturday in Kochi"
Extracts intent, vehicle, date, and location, then navigates and auto-fills the form

---

### 5. Inventory Analytics

Example:
"Tell me the performance of Aether Phantom"
Displays specifications and performance insights

---

### 6. Recommendation Engine

Example:
"Best car for off-roading?"
Suggests the most suitable vehicle based on user needs

---

### 7. Financial Localization

Example:
"Switch pricing to USD"
Dynamically converts and updates all pricing

---

## Key Features

* AI-driven UI interaction without traditional navigation
* Real-time DOM updates via structured AI responses
* Smart filtering, comparison, and recommendations
* Automated form filling using natural language
* Clean and responsive UI
* Full frontend and backend integration

---

## System Design (High-Level)

User Input → Django API (Gemini 2.5 Flash) → Structured JSON Action → React State → UI Update

This architecture ensures:

* Clear separation of concerns
* Scalable AI logic
* Predictable frontend behavior

---

## Future Enhancements

With more time, the platform can be extended to:

* Integrate Three.js for interactive 3D car visualization
* Enable AI-controlled car rotation and color customization
* Implement multi-turn conversational memory for deep context handling
* Add voice-controlled navigation features for a truly hands-free experience

---

## Author

Shahin
Aspiring Full Stack Developer (React + Django)

---
