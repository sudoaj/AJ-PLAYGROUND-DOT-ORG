# AJ-Playground

A dynamic portfolio website and experimental playground showcasing my web development, artificial intelligence, and creative coding projects.

## Overview

AJ-Playground is a Next.js-based personal portfolio and blog site that integrates with GitHub to display projects dynamically. It features an AI-powered assistant (AJ-GPT) that can answer questions about the showcased projects.

## Features

- **Dynamic Project Portfolio**: Automatically pulls and displays project information from GitHub
- **Blog Section**: Showcases technical articles and development insights
- **AI Project Assistant**: Uses AI to answer questions about the showcased projects
- **Modern UI**: Built with Next.js, Tailwind CSS, and ShadCN UI components
- **Responsive Design**: Fully responsive for all devices and screen sizes

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **AI Integration**: Custom AI flows for project QA and summaries
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20.x
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/AJ-PLAYGROUND-DOT-ORG.git
   cd AJ-PLAYGROUND-DOT-ORG
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   GITHUB_TOKEN=your_github_token
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── ai/           # AI flows and assistants
├── app/          # Next.js app directory and pages
├── components/   # React components
├── hooks/        # Custom React hooks
├── lib/          # Utility functions
├── services/     # API services
└── types/        # TypeScript type definitions
```

## Features in Detail

### GitHub Project Integration

Fetches and displays project information from GitHub, including:
- Project title and description
- Technologies used
- Last updated date
- Repository links

### AI Project Assistant (AJ-GPT)

Implemented in the `project-qa.ts` file, this feature allows users to ask questions about projects and receive AI-generated responses based on the project data.

### Blog

A collection of technical articles about topics like:
- Server Components in Next.js
- TypeScript for Large Scale Apps
- Modern React State Management

## Development

### Commands

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## License

All rights reserved. © AJ-Playground.org

## Contact

- GitHub: [https://github.com/sudoaj](https://github.com/sudoaj)
- LinkedIn: [https://www.linkedin.com/aj/](https://www.linkedin.com/in/abdulsalam-ajayi-a9722a33b/)

---

Built with Next.js, Tailwind CSS, and ShadCN UI. Deployed on Vercel.
