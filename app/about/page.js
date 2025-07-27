import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Heart, Award, Truck, Shield, Users, Star } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Passion for Fashion',
      description: 'We believe fashion is a form of self-expression that should be accessible to everyone.'
    },
    {
      icon: Award,
      title: 'Quality First',
      description: 'Every piece in our collection is carefully selected for its quality, style, and craftsmanship.'
    },
    {
      icon: Users,
      title: 'Customer Focused',
      description: 'Your satisfaction is our priority. We strive to provide exceptional service and support.'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Shop with confidence knowing your personal information and payments are secure.'
    }
  ];

  const milestones = [
    { year: '2018', title: 'Founded', description: 'Fashionista was born with a vision to democratize fashion' },
    { year: '2019', title: '10K Customers', description: 'Reached our first major milestone of 10,000 happy customers' },
    { year: '2021', title: 'Sustainable Line', description: 'Launched our eco-friendly sustainable fashion collection' },
    { year: '2023', title: 'Global Reach', description: 'Expanded internationally, now serving customers worldwide' },
    { year: '2024', title: '1M+ Items Sold', description: 'Celebrating over 1 million fashion items delivered globally' }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      image: '/api/placeholder/300/300',
      description: 'Fashion industry veteran with 15+ years of experience in retail and design.'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Head of Design',
      image: '/api/placeholder/300/300',
      description: 'Award-winning designer who brings creativity and innovation to our collections.'
    },
    {
      name: 'Emily Johnson',
      role: 'Customer Experience Director',
      image: '/api/placeholder/300/300',
      description: 'Passionate about creating exceptional shopping experiences for our customers.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About Fashionista</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're more than just a fashion retailer. We're your style companion, 
            dedicated to helping you express your unique personality through carefully curated, 
            high-quality fashion pieces.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2018, Fashionista started with a simple belief: that everyone deserves 
                  access to beautiful, well-made clothing that makes them feel confident and authentic.
                </p>
                <p>
                  What began as a small online boutique has grown into a global fashion destination, 
                  serving customers across continents. We've built our reputation on three core 
                  principles: exceptional quality, inclusive sizing, and outstanding customer service.
                </p>
                <p>
                  Today, we continue to evolve, embracing sustainable practices and innovative 
                  technologies while staying true to our original mission of making fashion 
                  accessible and enjoyable for all.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl p-8 text-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8">
                  <div className="text-4xl font-bold text-primary mb-2">1M+</div>
                  <div className="text-gray-600 mb-4">Happy Customers</div>
                  <div className="text-4xl font-bold text-primary mb-2">50+</div>
                  <div className="text-gray-600 mb-4">Countries Served</div>
                  <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                  <div className="text-gray-600">Products Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Journey</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary/20"></div>
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-full max-w-md ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                      <div className="text-2xl font-bold text-primary mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                    <div className="text-6xl">👤</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <div className="text-primary font-medium mb-3">{member.role}</div>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl leading-relaxed max-w-4xl mx-auto">
            To empower individuals to express their unique style through accessible, high-quality fashion 
            while building a more sustainable and inclusive industry for future generations.
          </p>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Want to Know More?</h2>
          <p className="text-gray-600 mb-6">
            We'd love to hear from you! Get in touch with any questions or feedback.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
