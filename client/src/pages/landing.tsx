import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart3,
  Handshake,
  Link,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  Star
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-2xl font-bold text-white">AffiliateHub</span>
          </div>
          <Button 
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            onClick={() => window.location.href = "/api/login"}
          >
            Sign In
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-1 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-slate-300">Trusted by 10,000+ affiliates</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Scale Your Affiliate
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Business
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            The most powerful affiliate dashboard to manage programs, track performance, 
            and maximize earnings. Built for serious affiliate marketers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-8 py-4 shadow-lg shadow-blue-500/25"
              onClick={() => window.location.href = "/api/login"}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white text-lg px-8 py-4"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Handshake className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Program Management</h3>
              <p className="text-slate-400 leading-relaxed">
                Centrally manage all your affiliate programs with detailed tracking and organization.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Link className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Smart Link Tracking</h3>
              <p className="text-slate-400 leading-relaxed">
                Track clicks, conversions, and performance of all your affiliate links in real-time.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Advanced Analytics</h3>
              <p className="text-slate-400 leading-relaxed">
                Get detailed insights into your performance with comprehensive analytics and reports.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Revenue Optimization</h3>
              <p className="text-slate-400 leading-relaxed">
                Identify top-performing programs and optimize your strategy for maximum earnings.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Secure & Private</h3>
              <p className="text-slate-400 leading-relaxed">
                Your data is encrypted and secure with enterprise-grade protection.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Easy Integration</h3>
              <p className="text-slate-400 leading-relaxed">
                Connect with popular affiliate networks and start tracking immediately.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-3xl p-12 border border-slate-700">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Ready to 10x Your Affiliate Revenue?
          </h2>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of affiliate marketers who trust AffiliateHub to scale their business and maximize their earnings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-10 py-4 shadow-lg shadow-blue-500/25"
              onClick={() => window.location.href = "/api/login"}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <div className="text-sm text-slate-500">
              ✓ No credit card required  ✓ 14-day free trial  ✓ Cancel anytime
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-slate-800">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
              <span className="text-lg font-semibold text-slate-300">AffiliateHub</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2025 AffiliateHub. Built for affiliate marketers who mean business.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
