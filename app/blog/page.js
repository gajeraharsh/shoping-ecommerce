import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BlogCard from '@/components/blog/BlogCard';
import BlogHero from '@/components/blog/BlogHero';
import BlogCategories from '@/components/blog/BlogCategories';
import BlogImage, { AuthorAvatar } from '@/components/blog/BlogImage';
import { Calendar, User, Tag } from 'lucide-react';

export default function BlogPage() {
  // Mock blog posts data - replace with your CMS/database data
  const blogPosts = [
    {
      id: 1,
      title: "5 Ways to Style Your Kurti for Every Occasion",
      excerpt: "Discover versatile styling tips to transform your favorite kurti from casual day wear to elegant evening attire.",
      content: "Kurtis are the ultimate versatile piece in every woman's wardrobe...",
      author: "Priya Sharma",
      authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Styling Tips",
      tags: ["kurti", "styling", "fashion"],
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop",
      featured: true,
      likes: 245,
      comments: 18
    },
    {
      id: 2,
      title: "The Art of Layering: Master the Ethnic Chic Look",
      excerpt: "Learn how to layer ethnic pieces to create stunning, contemporary outfits that blend tradition with modern style.",
      content: "Layering ethnic wear is an art that requires understanding of fabrics, colors, and proportions...",
      author: "Anita Desai",
      authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      date: "2024-01-12",
      readTime: "7 min read",
      category: "Fashion Guide",
      tags: ["ethnic", "layering", "style"],
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=600&fit=crop",
      featured: false,
      likes: 189,
      comments: 12
    },
    {
      id: 3,
      title: "Sustainable Fashion: Building an Eco-Friendly Wardrobe",
      excerpt: "Explore how to make conscious fashion choices that are both stylish and environmentally responsible.",
      content: "Sustainable fashion is not just a trend; it's a movement towards a more responsible future...",
      author: "Meera Kapoor",
      authorImage: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop&crop=face",
      date: "2024-01-10",
      readTime: "6 min read",
      category: "Sustainability",
      tags: ["sustainable", "eco-friendly", "conscious"],
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop",
      featured: false,
      likes: 167,
      comments: 9
    },
    {
      id: 4,
      title: "Trending Colors This Season: What to Wear Now",
      excerpt: "Discover the hottest color trends for this season and how to incorporate them into your wardrobe effortlessly.",
      content: "Color trends define each season and influence our fashion choices...",
      author: "Kavya Menon",
      authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      date: "2024-01-08",
      readTime: "4 min read",
      category: "Trends",
      tags: ["colors", "trends", "seasonal"],
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop",
      featured: false,
      likes: 203,
      comments: 15
    },
    {
      id: 5,
      title: "From Office to Dinner: Transitional Outfits",
      excerpt: "Master the art of day-to-night dressing with these effortless outfit transformation tips.",
      content: "The modern woman needs outfits that can seamlessly transition from professional to personal...",
      author: "Rhea Pillai",
      authorImage: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=100&h=100&fit=crop&crop=face",
      date: "2024-01-05",
      readTime: "5 min read",
      category: "Styling Tips",
      tags: ["office", "evening", "transition"],
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=600&fit=crop",
      featured: false,
      likes: 156,
      comments: 11
    },
    {
      id: 6,
      title: "Wedding Season Fashion: Guest Outfit Ideas",
      excerpt: "Look stunning at every wedding celebration with these carefully curated outfit ideas for different ceremonies.",
      content: "Wedding season calls for special occasion dressing that's both elegant and appropriate...",
      author: "Deepika Rao",
      authorImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
      date: "2024-01-03",
      readTime: "8 min read",
      category: "Occasion Wear",
      tags: ["wedding", "guest", "ceremony"],
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=600&fit=crop",
      featured: false,
      likes: 287,
      comments: 22
    }
  ];

  const categories = [
    { name: "All", count: blogPosts.length, active: true },
    { name: "Styling Tips", count: 2, active: false },
    { name: "Fashion Guide", count: 1, active: false },
    { name: "Trends", count: 1, active: false },
    { name: "Sustainability", count: 1, active: false },
    { name: "Occasion Wear", count: 1, active: false }
  ];

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <BlogHero />
      
      <div className="container mx-auto px-4 py-12">
        <BlogCategories categories={categories} />
        
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Featured Story
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-pink-200 to-purple-200"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-xl">
              <div className="relative group overflow-hidden rounded-2xl">
                <BlogImage
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                  aspectRatio="h-80 lg:h-96"
                  priority={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                    {featuredPost.category}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <AuthorAvatar
                    src={featuredPost.authorImage}
                    alt={featuredPost.author}
                    className="w-12 h-12 rounded-full object-cover border-3 border-white shadow-lg"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{featuredPost.author}</div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(featuredPost.date).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                      <span>•</span>
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {featuredPost.title}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    {featuredPost.tags.map(tag => (
                      <span key={tag} className="bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-400 px-3 py-1 rounded-full text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <a 
                  href={`/blog/${featuredPost.id}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg w-fit"
                >
                  Read Full Story
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
        
        {/* Regular Posts Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Latest Fashion Stories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
        
        {/* Load More Button */}
        <div className="text-center">
          <button className="bg-white dark:bg-gray-800 border-2 border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 px-8 py-4 rounded-full font-semibold hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all transform hover:scale-105">
            Load More Stories
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
