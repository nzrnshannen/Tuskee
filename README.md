# 🌸 Tuskee

Tuskee is a cozy, retro-inspired personal dashboard and productivity application built with React, Vite, and Tailwind CSS. It is designed to feel like a vintage desktop OS workspace, combining task management, focus tools, and entertainment into a single, beautifully crafted interface.

## ✨ Features

- **📓 Master Notebook**: A dedicated space for your daily journaling and notes. 
- **✅ Task Checklist**: Manage your daily to-dos with add, edit, complete, and delete functionalities.
- **⏰ Focus Timer**: A Pomodoro-style countdown timer with custom duration support and retro alarm sounds to keep you deep in your work.
- **📻 Cozy Jukebox**: An embedded music player to stream lofi beats while you work.
- **🧮 Calculator**: A fully functional, retro-themed calculator for quick math.
- **🎮 Arcade Games**: Need a break? Tuskee includes built-in classic games:
  - 🐍 Snake
  - ❌⭕ Tic-Tac-Toe
  - 🔢 Sudoku
- **🔐 Secure Accounts**: Powered by Supabase, allowing you to create an account, securely log in, and sync your settings.
- **🎨 Custom Backgrounds**: Personalize your workspace with different retro background patterns (Peach, Mint, Cream).
- **🖥️ Desktop OS Shell**: The layout is engineered to behave like a native desktop application, locking the viewport and preventing unwanted browser scrolling.

## 🛠️ Technology Stack

- **Frontend Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Backend & Auth**: Supabase (PostgreSQL + GoTrue Auth)
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nzrnshannen/Tuskee.git
   cd Tuskee
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root of your project and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

## 📜 Deployment

This project is configured to be seamlessly deployed on **Vercel**. 
When deploying, make sure to add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your Vercel Project Environment Variables to ensure authentication works in production!
