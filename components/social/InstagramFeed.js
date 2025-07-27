import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';

export default function InstagramFeed() {
  // Mock Instagram posts data
  const instagramPosts = [
    {
      id: 1,
      image: 'https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg',
      likes: 245,
      comments: 12,
      caption: 'Summer vibes in our new floral kurti collection! 🌸 #FashionistaStyle #SummerFashion'
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
      likes: 189,
      comments: 8,
      caption: 'Elegant evening wear for special occasions ✨ #EveningWear #Fashionista'
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
      likes: 312,
      comments: 15,
      caption: 'Casual chic never goes out of style 💫 #CasualWear #OOTD'
    },
    {
      id: 4,
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
      likes: 156,
      comments: 6,
      caption: 'Traditional meets modern in our ethnic collection 🎨 #Traditional #Modern'
    },
    {
      id: 5,
      image: 'https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg',
      likes: 278,
      comments: 18,
      caption: 'Behind the scenes at our latest photoshoot 📸 #BTS #Fashion'
    },
    {
      id: 6,
      image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
      likes: 201,
      comments: 9,
      caption: 'Customer spotlight! Looking gorgeous in our designs 💖 #CustomerLove'
    }
  ];

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Instagram className="h-8 w-8 text-pink-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Follow Us on Instagram</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Get daily fashion inspiration, styling tips, and behind-the-scenes content from our community
          </p>
          <a
            href="https://instagram.com/fashionista"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 font-medium"
          >
            <Instagram className="h-5 w-5" />
            @fashionista
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer"
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-white text-center">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="flex items-center gap-1">
                      <Heart className="h-5 w-5 fill-white" />
                      <span className="font-medium">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-medium">{post.comments}</span>
                    </div>
                  </div>
                  <Instagram className="h-6 w-6 mx-auto" />
                </div>
              </div>

              {/* Instagram icon */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Instagram className="h-5 w-5 text-white" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Tag us <span className="font-semibold text-pink-500">@fashionista</span> and use
            <span className="font-semibold text-pink-500"> #FashionistaStyle</span> for a chance to be featured!
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['#FashionistaStyle', '#OOTD', '#EthnicWear', '#CasualChic', '#Traditional'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-400 rounded-full text-sm font-medium hover:bg-pink-200 dark:hover:bg-pink-900/70 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
