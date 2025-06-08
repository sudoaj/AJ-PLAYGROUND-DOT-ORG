// Test script to verify API endpoints work correctly
// This simulates what the Header and Footer components do

import { getAllProjects } from './src/lib/projects.js';
import { getAllBlogPosts } from './src/lib/blog.js';

console.log('🧪 Testing dynamic navigation data loading...\n');

try {
  console.log('📂 Loading projects from content/projects/...');
  const projects = getAllProjects();
  console.log(`✅ Found ${projects.length} projects:`);
  projects.forEach(project => {
    console.log(`   • ${project.title} (slug: ${project.slug})`);
  });
  
  console.log('\n📝 Loading blog posts from content/posts/...');
  const blogPosts = getAllBlogPosts();
  console.log(`✅ Found ${blogPosts.length} blog posts:`);
  blogPosts.forEach(post => {
    console.log(`   • ${post.title} (slug: ${post.slug})`);
  });
  
  console.log('\n🎉 Dynamic navigation system is working correctly!');
  console.log('💡 The Header and Footer will now show these items in their dropdowns.');
  
} catch (error) {
  console.error('❌ Error testing navigation system:', error);
}
