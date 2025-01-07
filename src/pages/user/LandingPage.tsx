import { Wallet, Users, Calculator, Receipt, ChevronRight, MessageSquare, PieChart, Shield, Clock } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Wallet className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900">ExpenX</span>
            </div>
            <div className="flex gap-4">
              <a href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2">Login</a>
              <a href="/register" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Signup
              </a>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Split Expenses, Simplify Friendships
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Effortlessly manage shared expenses, track group spending, and maintain crystal-clear financial relationships with friends and roommates.
            </p>
            <a href="/advisor" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors text-lg font-medium">
              Start as a Financial advisor
              <ChevronRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Group Expenses</h3>
              <p className="text-gray-600">Easily split bills among friends and track who owes what</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
              <Calculator className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Calculations</h3>
              <p className="text-gray-600">Automatic expense splitting and debt simplification</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
              <Receipt className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Bill Scanning</h3>
              <p className="text-gray-600">Scan receipts to automatically add expenses</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
              <MessageSquare className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Group Chat</h3>
              <p className="text-gray-600">Discuss expenses and settle up within the app</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Preview Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Instant Team Chat</h2>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 rounded-full p-2">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1 bg-gray-100 rounded-lg p-3">
                  <p className="text-gray-800">Hey everyone! I've added the dinner bill from last night.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 justify-end">
                <div className="flex-1 bg-emerald-600 rounded-lg p-3">
                  <p className="text-white">Perfect! I'll settle up my share now.</p>
                </div>
                <div className="bg-emerald-100 rounded-full p-2">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ExpenX?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <Shield className="h-12 w-12 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">Bank-level security and data encryption</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock className="h-12 w-12 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Save Time</h3>
              <p className="text-gray-600">Automate expense tracking and calculations</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <PieChart className="h-12 w-12 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Clear Overview</h3>
              <p className="text-gray-600">Visual reports and spending insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
              <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center">
          <p>© 2024 ExpenX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;