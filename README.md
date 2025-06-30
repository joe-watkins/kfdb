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

3.  **Provide API Key:**
    The application uses Vite and is configured to read the Gemini API key from an environment variable `VITE_API_KEY`.

    For local development:
    - Create a `.env` file in the project root
    - Add your Gemini API key:
      ```
      VITE_API_KEY=your_gemini_api_key_here
      ```

    For production deployment on platforms like Netlify, set the `VITE_API_KEY` environment variable in your project settings.

    **IMPORTANT**: This is **not secure** for a public repository. The `.env` file is added to `.gitignore` to prevent accidentally committing it. If you deploy this project, you must use your hosting provider's system (e.g., Vercel, Netlify, Google Cloud) to manage environment variables securely.

### 3. Running the Application

This project uses Vite as its build tool and development server.

1.  Start the development server:
    ```sh
    npm run dev
    ```

2.  Open your browser and navigate to the URL provided by Vite (typically `http://localhost:5173`).

### 4. Building for Production

To create a production build:

```sh
npm run build
```

This will generate optimized assets in the `dist` directory, which can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

---

## 🔒 Security

**NEVER commit your API key to a public Git repository.**

The project is set up with:
1. Environment variables using Vite's `.env` file system
2. A `.gitignore` file that excludes the `.env` file containing your API key
3. Configuration in `vite.config.ts` to properly expose the environment variable to your application

For production environments, always use a secure method for handling environment variables provided by your hosting platform (such as Netlify's environment variable settings).