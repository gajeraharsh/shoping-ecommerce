import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { useMemo } from 'react';
import SmartImage from '@/components/ui/SmartImage';

export default function InstagramFeed() {
  const instagramPosts = useMemo(() => [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop&auto=format&q=80',
      likes: 2847,
      comments: 124,
      caption: 'Elegant summer collection featuring our bestselling maxi dress ✨ #FaxioStyle'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=800&fit=crop&auto=format&q=80',
      likes: 1923,
      comments: 89,
      caption: 'Behind the scenes at our autumn photoshoot 📸 #BehindTheScenes'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=800&fit=crop&auto=format&q=80',
      likes: 3456,
      comments: 156,
      caption: 'Sustainable fashion meets contemporary style 🌱 #SustainableFashion'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&h=800&fit=crop&auto=format&q=80',
      likes: 2167,
      comments: 92,
      caption: 'Customer spotlight: Looking absolutely stunning! 💫 #CustomerLove'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=800&fit=crop&auto=format&q=80',
      likes: 1876,
      comments: 78,
      caption: 'New arrivals: Timeless pieces for modern women 👗 #NewArrivals'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=800&h=800&fit=crop&auto=format&q=80',
      likes: 2345,
      comments: 103,
      caption: 'Effortless elegance in our workwear collection 💼 #WorkwearStyle'
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=800&fit=crop&auto=format&q=80',
      likes: 1654,
      comments: 67,
      caption: 'Evening glamour redefined ✨ #EveningWear'
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&h=800&fit=crop&auto=format&q=80',
      likes: 2789,
      comments: 134,
      caption: 'Casual sophistication for everyday moments 🌸 #CasualChic'
    }
  ], []);

  // Limit: only 4 images on homepage
  const displayPosts = useMemo(() => instagramPosts.slice(0, 4), [instagramPosts]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="container-fluid">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Instagram className="h-8 w-8 text-gray-900 dark:text-white" />
            <h2 className="heading-lg text-gray-900 dark:text-white">Follow Our Journey</h2>
          </div>
          <p className="body-lg text-fade max-w-2xl mx-auto mb-8">
            Get daily fashion inspiration, styling tips, and behind-the-scenes content from our community
          </p>
          <a
            href="https://instagram.com/faxio_official"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Instagram className="h-5 w-5" />
            @faxio_official
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-12">
          {displayPosts.map((post) => (
            <a
              key={post.id}
              href={`https://instagram.com/faxio_official`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden block"
              style={{ transform: 'translateZ(0)' }}
            >
              <div className="absolute inset-0">
                <SmartImage
                  src={post.image}
                  alt="Instagram post"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-90 group-hover:scale-100">
                  <div className="flex items-center justify-center gap-6 mb-3">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 fill-white" />
                      <span className="font-semibold">{formatNumber(post.likes)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-semibold">{formatNumber(post.comments)}</span>
                    </div>
                  </div>
                  <Instagram className="h-8 w-8 mx-auto" />
                </div>
              </div>

              {/* Instagram icon indicator */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                  <Instagram className="h-4 w-4 text-white" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm">
          <h3 className="heading-sm text-gray-900 dark:text-white mb-4">
            Join Our Style Community
          </h3>
          <p className="body-base text-fade mb-6">
            Tag us <span className="font-semibold text-gray-900 dark:text-white">@faxio_official</span> and use
            <span className="font-semibold text-gray-900 dark:text-white"> #FaxioStyle</span> for a chance to be featured!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['#FaxioStyle', '#OOTD', '#ElegantFashion', '#TimelessStyle', '#ModernWoman'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
