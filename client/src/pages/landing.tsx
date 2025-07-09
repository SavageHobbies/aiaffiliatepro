import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  ArrowRight,
  Brain,
  Radar,
  Repeat,
  Globe,
  Clock,
  Target
} from "lucide-react";
import logo from "@/images/logo_aiaffiliatepro.png";

export default function Landing() {
  return (
    <>
      <Helmet>
        <title>AI Affiliate Pro: All-in-One Affiliate Marketing Platform for Tracking & Automation</title>
        <meta name="description" content="Scale your affiliate business with AI Affiliate Pro. Get multi-network tracking, AI content generation, automated publishing, and real-time analytics. Start your free trial today!" />
        <meta name="keywords" content="affiliate marketing platform, affiliate management software, affiliate tracker SaaS, multi-network affiliate tracking, AI affiliate content generation, automated affiliate publishing, affiliate analytics software" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <img src={logo} alt="Logo" className="h-32 w-32" />
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
              onClick={() => (window.location.href = "/api/auth/google")}
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
              Scale Your Affiliate Business with the Leading{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Affiliate Marketing Platform
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              AI Affiliate Pro is your all-in-one affiliate marketing platform, offering AI-powered revenue optimization, automated cross-network reconciliation for multi-network affiliate tracking, and real-time affiliate fraud detection. Streamline affiliate operations and 10x your revenue with our advanced affiliate tracker SaaS features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-8 py-4 shadow-lg shadow-blue-500/25"
                onClick={() => (window.location.href = "/api/auth/google")}
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

          {/* Why AI Affiliate Pro Beats The Competition */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Why Top Affiliates Choose AI Affiliate Pro
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Discover features designed for affiliate marketing efficiency, from AI content to robust analytics. Built to solve affiliate marketing pain points.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {/* Cards omitted for brevity */}
          </div>

          {/* Competitive Comparison, CTA, and Footer omitted for brevity */}
        </div>
      </div>
    </>
  );
}
