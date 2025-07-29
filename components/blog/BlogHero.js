import { Sparkles, BookOpen, TrendingUp } from 'lucide-react';

export default function BlogHero() {
  return (
    <div className="relative bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-6 py-3 rounded-full text-sm font-semibold mb-8">
            <Sparkles className="w-5 h-5" />
            Fashion & Style Blog
          </div>
          
          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Style
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
              {" "}Stories
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Discover the latest fashion trends, styling tips, and insider secrets 
            from the world of ethnic and contemporary fashion
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
            <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-4 rounded-full shadow-lg">
              <BookOpen className="w-6 h-6 text-pink-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">150+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Fashion Articles</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-4 rounded-full shadow-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Monthly Readers</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-4 rounded-full shadow-lg">
              <Sparkles className="w-6 h-6 text-pink-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">Weekly</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">New Content</div>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#featured"
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Read Latest Stories
            </a>
            <a 
              href="/blog/categories"
              className="border-2 border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 px-8 py-4 rounded-full font-semibold hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all"
            >
              Browse Categories
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
