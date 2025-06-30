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
-   **Build Tool**: Vite
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
    git clone https://github.com/joe-watkins/kfdb.git
    cd kfdb
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Install the Netlify CLI** (for local development):
    ```sh
    npm install -g netlify-cli
    ```

4.  **Set up your API Key:**
    This application uses a secure serverless function approach to protect the Gemini API key.

    For local development:
    - Create a `.env` file in the project root
    - Add your Gemini API key:
      ```
      # For Netlify Functions (server-side, secure)
      GEMINI_API_KEY=your_gemini_api_key_here
      ```

    For production deployment:
    - In your Netlify dashboard, go to Site settings > Environment variables
    - Add `GEMINI_API_KEY` with your API key as the value

    **Security Note**: This project uses Netlify Functions to proxy API requests to Gemini, keeping your API key secure on the server side rather than exposing it in client-side code.

### 3. Running the Application

This project uses Vite as its build tool and Netlify Functions for the backend API.

1.  Start the development server with Netlify Functions:
    ```sh
    netlify dev
    ```

    This will:
    - Start the Vite development server for the frontend
    - Run your Netlify Functions locally
    - Set up the proxy configuration automatically

2.  Open your browser and navigate to the URL provided (typically `http://localhost:8888`)

### 4. Building for Production

To create a production build:

```sh
npm run build
```

This will generate optimized assets in the `dist` directory, which can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

---

## 🔒 Security

**NEVER commit your API key to a public Git repository.**

This project follows best security practices by:

1. **Using Netlify Functions as a secure proxy** for all Gemini API requests
   - Your API key is stored server-side only
   - Never exposed in client-side code
   - Not vulnerable to browser inspection or network request analysis
   
2. **Proper environment variable handling**
   - Local: `.env` file (excluded by `.gitignore`)
   - Production: Netlify environment variables (secure, encrypted)

3. **Zero client-side API key usage**
   - No more `process.env` variables in browser code
   - Protected against common frontend security vulnerabilities