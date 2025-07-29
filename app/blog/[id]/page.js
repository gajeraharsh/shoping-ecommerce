import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BlogCard from '@/components/blog/BlogCard';
import { Calendar, Clock, User, Heart, MessageCircle, Share2, BookOpen, Tag, ArrowLeft } from 'lucide-react';

export default function BlogPostPage({ params }) {
  // Mock blog post data - replace with your CMS/database data
  const blogPost = {
    id: params.id,
    title: "5 Ways to Style Your Kurti for Every Occasion",
    content: `
      <p>Kurtis are the ultimate versatile piece in every woman's wardrobe. Whether you're heading to the office, meeting friends for brunch, or attending a special celebration, a well-styled kurti can be your perfect companion. Today, we'll explore five distinct ways to transform your favorite kurti for any occasion.</p>

      <h2>1. Professional Office Look</h2>
      <p>Transform your kurti into sophisticated office wear by pairing it with well-fitted trousers or a pencil skirt. Choose solid colors or subtle prints, and add a structured blazer for extra polish. Complete the look with closed-toe shoes and minimal jewelry. This combination strikes the perfect balance between traditional and contemporary professional style.</p>

      <h2>2. Casual Weekend Vibes</h2>
      <p>For a relaxed weekend look, pair your kurti with comfortable leggings or straight pants. Roll up the sleeves, add a denim jacket or light cardigan, and finish with sneakers or flats. This effortless combination is perfect for shopping trips, casual lunch dates, or running errands while looking put-together.</p>

      <h2>3. Elegant Evening Ensemble</h2>
      <p>Elevate your kurti for evening events by choosing pieces with embellishments, rich fabrics, or intricate embroidery. Pair with palazzo pants or a flowing skirt, add statement jewelry, and complete with heels or embellished flats. A light dupatta can add an extra layer of elegance to your evening look.</p>

      <h2>4. Festive Celebration Style</h2>
      <p>For festivals and celebrations, opt for vibrant colors and traditional prints. Layer with a contrasting jacket or shrug, add oxidized jewelry, and choose traditional footwear like juttis or wedges. Don't forget to carry a potli bag or clutch that complements your outfit's color scheme.</p>

      <h2>5. Date Night Chic</h2>
      <p>Create a romantic date night look by choosing a kurti in soft pastels or rich jewel tones. Pair with fitted bottom wear, add delicate jewelry, and finish with heels or elegant sandals. A light scarf or shawl can add a feminine touch while keeping you comfortable throughout the evening.</p>

      <h2>Final Styling Tips</h2>
      <p>Remember, the key to styling kurtis is understanding the occasion and choosing appropriate accessories. Always ensure the fit is flattering, colors complement your skin tone, and accessories enhance rather than overwhelm your look. With these five styling approaches, your kurti collection will work harder for you, providing endless outfit possibilities for every occasion in your calendar.</p>
    `,
    author: "Priya Sharma",
    authorBio: "Fashion stylist and blogger with over 8 years of experience in ethnic wear styling. Priya specializes in making traditional fashion accessible and modern for today's woman.",
    authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Styling Tips",
    tags: ["kurti", "styling", "fashion", "ethnic wear", "versatile", "occasion wear"],
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1200&h=600&fit=crop",
    likes: 245,
    comments: 18,
    shares: 34
  };

  // Related posts
  const relatedPosts = [
    {
      id: 2,
      title: "The Art of Layering: Master the Ethnic Chic Look",
      excerpt: "Learn how to layer ethnic pieces to create stunning, contemporary outfits.",
      author: "Anita Desai",
      authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      date: "2024-01-12",
      readTime: "7 min read",
      category: "Fashion Guide",
      tags: ["ethnic", "layering", "style"],
      image: "https://images.unsplash.com/photo-1594736797933-d0e501ba2fe6?w=800&h=600&fit=crop",
      likes: 189,
      comments: 12
    },
    {
      id: 4,
      title: "Trending Colors This Season: What to Wear Now",
      excerpt: "Discover the hottest color trends for this season and how to incorporate them.",
      author: "Kavya Menon",
      authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      date: "2024-01-08",
      readTime: "4 min read",
      category: "Trends",
      tags: ["colors", "trends", "seasonal"],
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop",
      likes: 203,
      comments: 15
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      {/* Back to Blog Button */}
      <div className="container mx-auto px-4 pt-8">
        <a 
          href="/blog"
          className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to All Stories
        </a>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 py-16 mt-4">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Category */}
            <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Tag className="w-4 h-4" />
              {blogPost.category}
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {blogPost.title}
            </h1>
            
            {/* Author and meta info */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-3">
                <img 
                  src={blogPost.authorImage} 
                  alt={blogPost.author}
                  className="w-12 h-12 rounded-full object-cover border-3 border-white shadow-lg"
                />
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {blogPost.author}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(blogPost.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {blogPost.readTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Engagement stats */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {blogPost.likes} likes
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {blogPost.comments} comments
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="w-4 h-4" />
                {blogPost.shares} shares
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={blogPost.image} 
              alt={blogPost.title}
              className="w-full h-96 md:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="prose prose-lg prose-pink dark:prose-invert max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                  className="leading-relaxed text-gray-700 dark:text-gray-300"
                />
              </article>
              
              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {blogPost.tags.map(tag => (
                    <span 
                      key={tag}
                      className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Author Bio */}
              <div className="mt-12 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  About the Author
                </h3>
                <div className="flex items-start gap-6">
                  <img 
                    src={blogPost.authorImage} 
                    alt={blogPost.author}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {blogPost.author}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {blogPost.authorBio}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Share buttons */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Share this story
                  </h3>
                  <div className="flex flex-col gap-3">
                    <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                      Twitter
                    </button>
                    <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                    <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                      </svg>
                      Pinterest
                    </button>
                  </div>
                </div>

                {/* Newsletter signup */}
                <div className="bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">
                    Never Miss a Story
                  </h3>
                  <p className="text-pink-100 text-sm mb-4">
                    Get the latest fashion tips and trends delivered to your inbox
                  </p>
                  <form className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Your email address"
                      className="w-full px-4 py-2 rounded-lg text-gray-900 bg-white/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button className="w-full bg-white text-pink-600 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
