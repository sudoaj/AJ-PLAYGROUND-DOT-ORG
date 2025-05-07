import { type BlogPost } from '@/types';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Sample blog posts data - in a real app, this would come from a CMS or markdown files
const sampleBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Why React is My Go-To Library',
    date: '2024',
    imageUrl: 'https://picsum.photos/seed/react/800/450',
    imageHint: 'abstract code',
    slug: 'why-react',
    excerpt: 'An in-depth look at why React continues to be a dominant force in web development and my personal favorite for building modern UIs.',
  },
  {
    id: '2',
    title: 'The Rise of Server Components',
    date: '2023',
    imageUrl: 'https://picsum.photos/seed/server/800/450',
    imageHint: 'cloud architecture',
    slug: 'server-components',
    excerpt: 'Exploring the paradigm shift with server components in Next.js and how they are changing the way we build web applications.',
  },
  {
    id: '3',
    title: 'Mastering TypeScript for Large Scale Apps',
    date: '2022',
    imageUrl: 'https://picsum.photos/seed/typescript/800/450',
    imageHint: 'geometric pattern',
    slug: 'mastering-typescript',
    excerpt: 'Tips and tricks for leveraging TypeScript effectively in large-scale projects to improve code quality and maintainability.',
  },
];

// Function to generate static paths
export async function generateStaticParams() {
  return sampleBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Function to get post data
async function getPostData(slug: string): Promise<BlogPost | undefined> {
  return sampleBlogPosts.find((post) => post.slug === slug);
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostData(params.slug);
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  return {
    title: `${post.title} | AJ-Playground Blog`,
    description: post.excerpt,
  };
}


export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostData(params.slug);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-8">Sorry, we couldn't find the blog post you're looking for.</p>
        <Button asChild>
          <Link href="/#blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-8 text-primary hover:text-primary/80">
        <Link href="/#blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </Button>

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-foreground leading-tight">
        {post.title}
      </h1>
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <CalendarDays className="mr-2 h-4 w-4" />
        <span>Published: {post.date}</span>
      </div>
      
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-8 shadow-lg">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          data-ai-hint={post.imageHint}
          priority
        />
      </div>
      
      <Separator className="my-8" />

      {/* Placeholder for actual blog content */}
      <div className="prose prose-invert prose-lg max-w-none dark:prose-invert 
                      prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-primary hover:prose-a:text-primary/80
                      prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-foreground/70
                      prose-code:text-sm prose-code:bg-muted prose-code:p-1 prose-code:rounded-sm">
        <p>
          This is a placeholder for the full content of the blog post titled &quot;{post.title}&quot;.
          In a real application, this content would be fetched from a CMS, Markdown files, or a database.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <h2>Key Takeaways</h2>
        <ul>
          <li>First key point about {post.title}.</li>
          <li>Second important aspect to consider.</li>
          <li>Concluding thought or action item.</li>
        </ul>
        <p>
          Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. 
          Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. 
          Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. 
          Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. 
          Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat.
        </p>
        <pre><code className="language-javascript">{`
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
        `}</code></pre>
        <p>
          This section is designed to be styled by Tailwind Typography plugin (prose classes). You can customize these styles further in your global CSS or Tailwind config.
        </p>
      </div>
    </article>
  );
}
