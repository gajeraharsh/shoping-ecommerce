import { BookOpen, TrendingUp, Sparkles } from 'lucide-react';

export default function BlogHero() {
  return (
    <div className="relative bg-gray-50 dark:bg-gray-800 py-20">
      <div className="container-fluid relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full text-sm font-semibold mb-8">
            <Sparkles className="w-5 h-5" />
            Fashion & Style Blog
          </div>
          
          {/* Main heading */}
          <h1 className="heading-xl text-gray-900 dark:text-white mb-6">
            Style
            <span className="text-gray-600 dark:text-gray-400">
              {" "}Stories
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="body-lg text-fade mb-8 max-w-2xl mx-auto">
            Discover the latest fashion trends, styling tips, and insider secrets 
            from the world of ethnic and contemporary fashion
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
            <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-6 py-4 rounded-xl shadow-sm">
              <BookOpen className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">150+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Fashion Articles</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-6 py-4 rounded-xl shadow-sm">
              <TrendingUp className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Readers</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-6 py-4 rounded-xl shadow-sm">
              <Sparkles className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">Weekly</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">New Content</div>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#featured"
              className="btn-primary"
            >
              Read Latest Stories
            </a>
            <a 
              href="/blog/categories"
              className="btn-outline"
            >
              Browse Categories
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
