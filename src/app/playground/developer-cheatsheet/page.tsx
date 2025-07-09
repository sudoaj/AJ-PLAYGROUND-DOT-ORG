
import type { Metadata } from 'next';
import DeveloperCheatsheet from '@/components/DeveloperCheatsheet';

export const metadata: Metadata = {
  title: 'Developer Cheatsheet | AJ-Playground',
  description: 'Comprehensive developer reference guide with searchable syntax, code snippets, and quick lookup tools for multiple programming languages and frameworks.',
};

export default function DeveloperCheatsheetPage() {
  return <DeveloperCheatsheet />;
}
