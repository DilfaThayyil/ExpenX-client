import React from 'react';
import { ArrowRight, Shield, Users, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import financialAdvisoryImage from '../../assets/download.jpeg'

const FeatureCard = ({ icon: Icon, title, description }: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-indigo-600" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Get your dream job as Financial Advisor
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Join our platform to manage client expenses and provide professional financial insights. Start your journey to becoming a trusted financial advisor today.
              </p>
              <div className="flex gap-4">
                <Link 
                  to="/advisor/register" 
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/learn-more" 
                  className="inline-flex items-center px-6 py-3 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src={financialAdvisoryImage}
                alt="Financial Advisory"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Features</h2>
          <p className="text-lg text-gray-600">Discover the tools and features that will help you succeed</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Shield}
            title="Secure Platform"
            description="Bank-level encryption and ISO 27001 certified security measures to protect your and your clients' data."
          />
          <FeatureCard 
            icon={Users}
            title="Client Management"
            description="Powerful tools to manage your client portfolio, track expenses, and provide personalized advice."
          />
          <FeatureCard 
            icon={DollarSign}
            title="Financial Tools"
            description="Access to advanced financial planning tools, analytics, and reporting capabilities."
          />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Apply for job easily with us</h2>
            <p className="text-lg text-gray-600">Start your journey in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Register Account</h3>
              <p className="text-gray-600">Create your professional advisor account</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Complete Profile</h3>
              <p className="text-gray-600">Add your credentials and experience</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Start Working</h3>
              <p className="text-gray-600">Begin managing clients and earning</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ExpenX</h3>
              <p className="text-gray-400">Empowering financial advisors with modern tools and solutions.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link to="/support" className="text-gray-400 hover:text-white">Support</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;