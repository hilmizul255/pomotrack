# Pomotrack

Pomotrack is a feature-rich Pomodoro timer application built with Next.js 16, designed to help you manage your time effectively with focus sessions and breaks.

## Features

- **Customizable Timer**: Adjust Pomodoro, Short Break, and Long Break durations.
- **Session Tracking**: Track your daily progress and session counts.
- **Reports**: Visualize your productivity over time.
- **Settings**: Configure auto-resume, sound alerts, and notifications.
- **Authentication**: Secure user accounts using NextAuth.js.
- **Responsive Design**: Beautiful UI built with Tailwind CSS v4.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: PostgreSQL
- **Authentication**: [NextAuth.js v5](https://authjs.dev/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd pomotrack
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/pomotrack"
   AUTH_SECRET="your-auth-secret"
   # Add other provider keys (Google, GitHub, etc.) as needed
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm start`: Runs the built app in production mode.
