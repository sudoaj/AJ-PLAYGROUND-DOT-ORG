# AJ-Playground

A dynamic portfolio website and experimental playground showcasing my web development projects and creative coding experiments.

## Overview

AJ-Playground is a Next.js-based personal portfolio and blog site that showcases projects through markdown-based content management. It features a clean, modern design and responsive layout optimized for all devices.

## Features

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

4. Open [http://localhost:9002](http://localhost:9002) in your browser

## Project Structure

```
src/
├── app/          # Next.js app directory and pages
├── components/   # React components
├── hooks/        # Custom React hooks
├── lib/          # Utility functions and content management
├── services/     # API services (if needed)
└── types/        # TypeScript type definitions
content/
├── projects/     # Project markdown files
├── posts/        # Blog post markdown files
└── /images/       # Static images for content
```

## Features in Detail

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
