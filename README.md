# KFDB - AI-Powered "Know, Feel, Do, Be" Planner

KFDB is a modern web application designed for teachers, coaches, and leaders to structure their sessions using the powerful "Know, Feel, Do, Be" framework. It features a sleek, intuitive interface and an integrated AI assistant (powered by the Google Gemini API) to help brainstorm and populate ideas, turning a blank slate into a structured plan in seconds.

---

## ✨ Key Features

-   **Intuitive KFDB Interface**: Four distinct cards for "Know, Feel, Do, and Be" categories.
-   **AI-Powered Idea Generation**: Kickstart your session planning by providing a topic and letting the Gemini-powered AI generate a title and initial ideas for all four categories.
-   **Category-Specific Suggestions**: Get more targeted ideas from the AI for any specific category as you refine your plan.
-   **Drag-and-Drop Sorting**: Easily reorder items within a list to prioritize and structure your content.
-   **Responsive Design**: Fully functional and beautiful on desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI Engine**: Google Gemini API (`@google/genai`)
-   **Component Libraries**:
    -   `lucide-react` for icons
    -   `react-dnd` for drag-and-drop functionality

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### 1. Prerequisites

-   You will need a **Google Gemini API Key**. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Installation & Configuration

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2.  **Provide API Key:**
    The application is configured to read the Gemini API key from an environment variable `process.env.API_KEY`. In a simple static project setup like this (without a build tool like Vite or Next.js), you'll need to make this variable available to the browser's execution context.

    For local development, the simplest way is to replace `process.env.API_KEY` in `services/geminiService.ts` with your actual key as a string.

    **IMPORTANT**: This is **not secure** for a public repository or production. If you deploy this project, you must use your hosting provider's system (e.g., Vercel, Netlify, Google Cloud) to manage environment variables securely.

### 3. Running the Application

This project is a static site that uses ES modules via an `importmap`. You can run it with any simple local web server. The easiest way is using `npx serve`.

1.  Install `serve` if you haven't already:
    ```sh
    npm install -g serve
    ```

2.  Run the server from the project's root directory:
    ```sh
    serve
    ```

3.  Open your browser and navigate to the local URL provided by the server (e.g., `http://localhost:3000`).

---

## 🔒 Security

**NEVER commit your API key to a public Git repository.**

If you follow the local development instructions and hard-code your key, be sure not to commit that change. For production environments, always use a secure method for handling environment variables provided by your hosting platform.