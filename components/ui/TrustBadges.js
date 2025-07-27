import { Shield, Truck, RotateCcw, CreditCard, Award, Users } from 'lucide-react';

export default function TrustBadges({ variant = 'default' }) {
  const badges = [
    {
      icon: Shield,
      title: '100% Secure',
      description: 'SSL encryption & secure payments',
      color: 'text-green-600'
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over ₹999',
      color: 'text-blue-600'
    },
    {
      icon: RotateCcw,
      title: '30-Day Returns',
      description: 'Easy returns & exchanges',
      color: 'text-purple-600'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Premium fabrics & craftsmanship',
      color: 'text-orange-600'
    }
  ];

  const socialProof = {
    customers: '500K+',
    orders: '1M+',
    rating: '4.8/5',
    countries: '50+'
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-center gap-6 py-4 bg-gray-50 border-y">
        {badges.map((badge, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <badge.icon className={`h-4 w-4 ${badge.color}`} />
            <span className="font-medium text-gray-700">{badge.title}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'social') {
    return (
      <div className="bg-gradient-to-r from-primary to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Trusted by Fashion Lovers Worldwide</h3>
            <p className="text-primary-100">Join our community of satisfied customers</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-1">{socialProof.customers}</div>
              <div className="text-sm opacity-90">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">{socialProof.orders}</div>
              <div className="text-sm opacity-90">Orders Delivered</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">{socialProof.rating}</div>
              <div className="text-sm opacity-90">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">{socialProof.countries}</div>
              <div className="text-sm opacity-90">Countries Served</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Why Choose Fashionista?</h3>
          <p className="text-gray-600">Your satisfaction is our priority</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center`}>
                <badge.icon className={`h-8 w-8 ${badge.color}`} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{badge.title}</h4>
              <p className="text-gray-600 text-sm">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
