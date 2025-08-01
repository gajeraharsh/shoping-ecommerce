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
    { year: '2018', title: 'Founded', description: 'Modave was born with a vision to democratize fashion' },
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <div className="container-fluid section-padding">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="heading-xl text-gray-900 dark:text-white mb-6">About Modave</h1>
          <p className="body-lg text-fade max-w-3xl mx-auto">
            We're more than just a fashion retailer. We're your style companion, 
            dedicated to helping you express your unique personality through carefully curated, 
            high-quality fashion pieces.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-lg text-gray-900 dark:text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  Founded in 2018, Modave started with a simple belief: that everyone deserves 
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
              <div className="card-minimal p-8 text-center">
                <div className="space-y-6">
                  <div>
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">1M+</div>
                    <div className="text-gray-600 dark:text-gray-400">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">50+</div>
                    <div className="text-gray-600 dark:text-gray-400">Countries Served</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">10K+</div>
                    <div className="text-gray-600 dark:text-gray-400">Products Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="heading-lg text-center text-gray-900 dark:text-white mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-50 dark:bg-gray-800 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                </div>
                <h3 className="heading-sm text-gray-900 dark:text-white mb-3">{value.title}</h3>
                <p className="body-base text-fade">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-16">
          <h2 className="heading-lg text-center text-gray-900 dark:text-white mb-12">Our Journey</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200 dark:bg-gray-700"></div>
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-full max-w-md ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="card-minimal p-6">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{milestone.year}</div>
                      <h3 className="heading-sm text-gray-900 dark:text-white mb-2">{milestone.title}</h3>
                      <p className="body-base text-fade">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 dark:bg-white rounded-full border-4 border-white dark:border-gray-900"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="heading-lg text-center text-gray-900 dark:text-white mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-48 h-48 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-6 overflow-hidden flex items-center justify-center">
                  <div className="text-6xl">👤</div>
                </div>
                <h3 className="heading-sm text-gray-900 dark:text-white mb-2">{member.name}</h3>
                <div className="text-gray-700 dark:text-gray-300 font-medium mb-3">{member.role}</div>
                <p className="body-base text-fade">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-black dark:bg-white rounded-2xl p-12 text-center text-white dark:text-black">
          <h2 className="heading-lg mb-6">Our Mission</h2>
          <p className="body-lg max-w-4xl mx-auto">
            To empower individuals to express their unique style through accessible, high-quality fashion 
            while building a more sustainable and inclusive industry for future generations.
          </p>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <h2 className="heading-md text-gray-900 dark:text-white mb-4">Want to Know More?</h2>
          <p className="body-base text-fade mb-6">
            We'd love to hear from you! Get in touch with any questions or feedback.
          </p>
          <a href="/contact" className="btn-primary">
            Contact Us
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
