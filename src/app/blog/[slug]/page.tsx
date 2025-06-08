import { getAllBlogPosts, getBlogPostBySlug, BlogPostWithContent } from '@/lib/blog';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import 'highlight.js/styles/github-dark.css'; // or your preferred theme

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'This blog post could not be found.',
    };
  }
  return {
    title: `${post.title} | AJ's Blog`,
    description: post.excerpt,
    openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.date,
        images: post.imageUrl ? [{ url: post.imageUrl }] : [],
    },
    twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: post.imageUrl ? [post.imageUrl] : [],
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Format date for display
  let displayDate = post.date;
  try {
    displayDate = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    console.warn(`Could not parse date for post "${post.title}": ${post.date}`);
  }

  return (
    <article className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-3">
          {post.title}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Posted on {displayDate}
        </p>
      </header>
      
      <div className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none mx-auto 
                      prose-headings:text-foreground 
                      prose-p:text-foreground/90 prose-p:leading-relaxed
                      prose-strong:text-foreground prose-strong:font-semibold
                      prose-ul:text-foreground/90 prose-ol:text-foreground/90
                      prose-li:marker:text-primary prose-li:leading-relaxed
                      prose-img:rounded-lg prose-img:shadow-lg
                      prose-hr:border-border
                      prose-table:border-collapse prose-th:border prose-th:border-border prose-td:border prose-td:border-border
                      prose-thead:bg-muted/50">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeSlug]}
          components={{
            code(props) {
              const { children, className, ...rest } = props;
              const match = /language-(\w+)/.exec(className || '');
              
              if (match) {
                // This is a code block with language specification
                return (
                  <code className={`${className} hljs font-mono text-sm`} {...rest}>
                    {children}
                  </code>
                );
              }
              
              // This is inline code
              return (
                <code className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-sm font-mono border" {...rest}>
                  {children}
                </code>
              );
            },
            pre(props) {
              const { children, ...rest } = props;
              return (
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-6 border border-slate-700" {...rest}>
                  {children}
                </pre>
              );
            },
            h1(props) {
              return <h1 className="text-4xl font-bold mb-6 mt-8 text-foreground" {...props} />;
            },
            h2(props) {
              return <h2 className="text-2xl font-semibold mb-4 mt-8 text-foreground" {...props} />;
            },
            h3(props) {
              return <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground" {...props} />;
            },
            p(props) {
              return <p className="mb-4 leading-relaxed text-foreground/90" {...props} />;
            },
            blockquote(props) {
              return (
                <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-foreground/80 bg-muted/30 py-2 rounded-r" {...props} />
              );
            },
            img(props) {
              return (
                <img 
                  className="rounded-lg shadow-lg my-8 w-full h-auto" 
                  {...props} 
                  alt={props.alt || 'Blog image'} 
                />
              );
            },
            a(props) {
              const { href, children, ...rest } = props;
              
              // Check if it's an external link
              const isExternal = href && (href.startsWith('http') || href.startsWith('https'));
              
              if (isExternal) {
                return (
                  <a 
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary/60 transition-colors duration-200 font-medium"
                    {...rest}
                  >
                    {children}
                    <span className="inline-block ml-1 text-xs">↗</span>
                  </a>
                );
              }
              
              // Internal link - use Next.js Link component
              return (
                <Link 
                  href={href || '#'}
                  className="text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary/60 transition-colors duration-200 font-medium"
                  {...rest}
                >
                  {children}
                </Link>
              );
            },
            ul(props) {
              return (
                <ul className="list-disc list-inside space-y-2 my-4 text-foreground/90" {...props} />
              );
            },
            ol(props) {
              return (
                <ol className="list-decimal list-inside space-y-2 my-4 text-foreground/90" {...props} />
              );
            },
            li(props) {
              return (
                <li className="leading-relaxed" {...props} />
              );
            },
            hr(props) {
              return (
                <hr className="border-border my-8" {...props} />
              );
            },
            table(props) {
              return (
                <div className="overflow-x-auto my-6">
                  <table className="min-w-full border-collapse border border-border rounded-lg" {...props} />
                </div>
              );
            },
            thead(props) {
              return (
                <thead className="bg-muted/50" {...props} />
              );
            },
            th(props) {
              return (
                <th className="border border-border px-4 py-2 text-left font-semibold text-foreground" {...props} />
              );
            },
            td(props) {
              return (
                <td className="border border-border px-4 py-2 text-foreground/90" {...props} />
              );
            }
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <hr className="my-12" />

      <div className="text-center">
        <Button variant="outline" size="lg" asChild>
            <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                View More Posts
            </Link>
        </Button>
      </div>
    </article>
  );
}