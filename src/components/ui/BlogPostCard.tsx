import type { BlogPost } from '@/types';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, ArrowRight } from 'lucide-react';

const getBlogGradient = (slug: string) => {
  const gradients = [
    'bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 [--gradient-start:theme(colors.cyan.500)] [--gradient-middle:theme(colors.blue.600)] [--gradient-end:theme(colors.purple.700)]',
    'bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-700 [--gradient-start:theme(colors.emerald.500)] [--gradient-middle:theme(colors.teal.600)] [--gradient-end:theme(colors.blue.700)]',
    'bg-gradient-to-br from-pink-500 via-rose-600 to-orange-700 [--gradient-start:theme(colors.pink.500)] [--gradient-middle:theme(colors.rose.600)] [--gradient-end:theme(colors.orange.700)]',
    'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 [--gradient-start:theme(colors.violet.500)] [--gradient-middle:theme(colors.purple.600)] [--gradient-end:theme(colors.indigo.700)]',
    'bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 [--gradient-start:theme(colors.amber.500)] [--gradient-middle:theme(colors.orange.600)] [--gradient-end:theme(colors.red.700)]',
    'bg-gradient-to-br from-lime-500 via-green-600 to-emerald-700 [--gradient-start:theme(colors.lime.500)] [--gradient-middle:theme(colors.green.600)] [--gradient-end:theme(colors.emerald.700)]',
    'bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-700 [--gradient-start:theme(colors.sky.500)] [--gradient-middle:theme(colors.indigo.600)] [--gradient-end:theme(colors.purple.700)]',
    'bg-gradient-to-br from-fuchsia-500 via-pink-600 to-rose-700 [--gradient-start:theme(colors.fuchsia.500)] [--gradient-middle:theme(colors.pink.600)] [--gradient-end:theme(colors.rose.700)]'
  ];

  // Generate a consistent index based on the slug
  const hash = slug.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  return gradients[Math.abs(hash) % gradients.length];
};

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardHeader className="p-0 relative aspect-[16/9]">
        <div 
          className={`w-full h-full ${getBlogGradient(post.slug)}`}
          style={{
            backgroundImage: `
              radial-gradient(circle at 15% 25%, rgba(255,255,255,0.12) 2px, transparent 2px),
              radial-gradient(circle at 85% 75%, rgba(255,255,255,0.08) 1px, transparent 1px),
              radial-gradient(circle at 45% 60%, rgba(255,255,255,0.06) 1.5px, transparent 1.5px),
              linear-gradient(45deg, var(--gradient-start) 0%, var(--gradient-middle) 60%, var(--gradient-end) 100%)
            `,
            backgroundSize: '60px 60px, 40px 40px, 80px 80px, 100% 100%'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10"></div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl lg:text-2xl mb-2 hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </CardTitle>
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <CalendarDays className="mr-2 h-4 w-4" />
          <span>{post.date}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button variant="outline" size="sm" asChild className="w-full">
          <Link href={`/blog/${post.slug}`}>
            Read More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}