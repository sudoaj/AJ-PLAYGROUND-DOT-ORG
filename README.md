# AJ-Playground

A dynamic portfolio website and experimental playground showcasing my web development projects, interactive tools, and creative coding experiments.

## Overview

AJ-Playground is a Next.js-based personal portfolio and blog site that showcases projects through markdown-based content management. It features a clean, modern design, responsive layout optimized for all devices, and an interactive playground section with functional web tools and experiments.

## Features

- **Interactive Playground**: A collection of functional web tools and experimental projects
- **Markdown-Based Project Portfolio**: Projects managed through markdown files with frontmatter metadata
- **Blog Section**: Technical articles and development insights using markdown
- **Modern UI**: Built with Next.js, Tailwind CSS, and ShadCN UI components
- **Responsive Design**: Fully responsive for all devices and screen sizes
- **Static Content Management**: File-based content system for easy project and blog management


## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Content**: Markdown with gray-matter
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20.x
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sudoaj/AJ-PLAYGROUND-DOT-ORG.git
   cd AJ-PLAYGROUND-DOT-ORG
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Set up email notifications (optional):
   ```bash
   # Copy the environment variables template
   cp .env.example .env.local
   ```
   
   Then add your Resend API key to `.env.local`:
   ```
   RESEND_API_KEY=your_resend_api_key_here
   ```
   
   **To get a Resend API key:**
   1. Sign up at [resend.com](https://resend.com)
   2. Go to [API Keys](https://resend.com/api-keys) 
   3. Create a new API key
   4. Add it to your `.env.local` file
   
   **Note:** Without the API key, newsletter subscriptions will fail, but the rest of the site will work normally.

5. Open [http://localhost:9002](http://localhost:9002) in your browser

## Project Structure

```
src/
├── app/
│   ├── api/            # API routes for projects, blog, and playground
│   ├── blog/           # Blog pages with dynamic routing
│   ├── playground/     # Interactive playground section
│   │   └── [slug]/     # Dynamic routes for individual playground projects
│   ├── projects/       # Project showcase pages
│   └── resume/         # Resume page
├── components/
│   ├── layout/         # Header, Footer, and layout components
│   ├── sections/       # Hero, Projects, Blog, and Playground sections
│   ├── ui/             # Reusable UI components (cards, animations, etc.)
│   └── TipCalculator.tsx  # Functional tip calculator tool
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and content management
├── services/           # API services
└── types/              # TypeScript type definitions
content/
├── projects/           # Project markdown files
├── posts/              # Blog post markdown files
└── images/             # Static images for content
```

## Features in Detail

### Interactive Playground

The playground section features a collection of interactive tools and experimental projects:

#### Live Tools
- **💰 Tip Calculator**: A fully functional tip calculator with bill splitting, customizable tip percentages, and service quality guides
  - Smart calculations for multiple people
  - Pre-set tip percentage buttons (15%, 18%, 20%, 22%, 25%)
  - Custom tip percentage input
  - Real-time calculations and visual breakdown
  - Service quality tipping guide

#### Coming Soon Projects
- **🚀 Future OS Concept Visualizer**: Interactive visualization of futuristic operating system concepts
- **🎮 Retro Games**: Classic arcade games recreated with modern web technologies
- **📝 Developer Cheatsheet**: Interactive reference guide with searchable syntax and code snippets

Each playground project has its own dedicated page with either functional tools or animated "coming soon" previews with progress indicators and feature hints.

### Markdown-Based Content Management

Projects and blog posts are managed through markdown files with frontmatter metadata:
- Project details including title, description, technologies, and status
- Blog posts with publication dates and tags
- Static images organized by content type

### Project Showcase

Each project includes:
- Project title and description
- Technologies used
- Last updated date
- Repository links
- Project images and detailed markdown content

### Navigation & User Experience

- **Responsive Header**: Dynamic navigation with playground dropdown showing project grid
- **Mobile-Optimized**: Full mobile navigation with collapsible menus
- **Interactive Cards**: Project and playground cards with hover effects and status indicators
- **Coming Soon Animations**: Animated previews for upcoming playground projects with sparkle effects and progress indicators
- **Seamless Routing**: Dynamic routing between projects, blog posts, and playground tools

### Blog

A collection of technical articles about topics like:
- Server Components in Next.js
- TypeScript for Large Scale Apps
- Modern React State Management

## Key Technologies & Architecture

- **Next.js 15**: App Router with server components and dynamic routing
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **ShadCN UI**: High-quality, accessible component library
- **Lucide React**: Modern icon library for consistent iconography
- **Gray-matter**: Frontmatter parsing for markdown content
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts

## Development

### Commands

- `npm run dev` - Start the development server on port 9002
- `npm run build` - Build the production application
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality

### Development Features

- **Hot Reload**: Instant updates during development
- **TypeScript Support**: Full type checking and IntelliSense
- **Component-Based Architecture**: Modular, reusable components
- **API Routes**: Built-in API endpoints for content management
- **Static Generation**: Optimized builds with static site generation

## Playground Projects Status

| Project | Status | Features |
|---------|--------|----------|
| 💰 Tip Calculator | ✅ Live | Bill splitting, custom tips, service guide |
| 🚀 Future OS Visualizer | 🚧 Coming Soon | Interactive UI concepts, animations |
| 🎮 Retro Games | 🚧 Coming Soon | Classic arcade games, pixel graphics |
| 📝 Developer Cheatsheet | 🚧 Coming Soon | Syntax references, code snippets |

## License

All rights reserved. © AJ-Playground.org

## Contact

- GitHub: [https://github.com/sudoaj](https://github.com/sudoaj)
- LinkedIn: [https://www.linkedin.com/aj/](https://www.linkedin.com/in/abdulsalam-ajayi-a9722a33b/)

---

Built with Next.js, Tailwind CSS, and ShadCN UI. Deployed on Vercel.
