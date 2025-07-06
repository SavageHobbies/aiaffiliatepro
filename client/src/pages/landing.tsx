import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart3,
  Handshake,
  Link,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            AffiliateHub
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Your all-in-one affiliate dashboard to manage programs, track performance, 
            and maximize your earnings all in one place.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-blue-50 text-lg px-8 py-4"
            onClick={() => window.location.href = "/api/login"}
          >
            Get Started Free
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6">
              <Handshake className="h-12 w-12 text-blue-200 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Program Management</h3>
              <p className="text-blue-100">
                Centrally manage all your affiliate programs with detailed tracking and organization.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6">
              <Link className="h-12 w-12 text-blue-200 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Link Tracking</h3>
              <p className="text-blue-100">
                Track clicks, conversions, and performance of all your affiliate links in real-time.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6">
              <BarChart3 className="h-12 w-12 text-blue-200 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-blue-100">
                Get detailed insights into your performance with comprehensive analytics and reports.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6">
              <TrendingUp className="h-12 w-12 text-blue-200 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Revenue Optimization</h3>
              <p className="text-blue-100">
                Identify top-performing programs and optimize your strategy for maximum earnings.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6">
              <Shield className="h-12 w-12 text-blue-200 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-blue-100">
                Your data is encrypted and secure with enterprise-grade protection.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6">
              <Zap className="h-12 w-12 text-blue-200 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
              <p className="text-blue-100">
                Connect with popular affiliate networks and start tracking immediately.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to supercharge your affiliate marketing?
          </h2>
          <p className="text-blue-100 mb-8">
            Join thousands of affiliate marketers who trust AffiliateHub to grow their business.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-blue-50 text-lg px-8 py-4"
            onClick={() => window.location.href = "/api/login"}
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
}
