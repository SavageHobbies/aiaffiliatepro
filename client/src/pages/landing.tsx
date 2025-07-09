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
  Star,
  Brain,
  Radar,
  Repeat,
  Globe,
  Clock,
  Target
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-2xl font-bold text-white">AI Affiliate Pro</span>
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
            The only affiliate platform with AI-powered optimization, automated cross-network reconciliation, 
            and real-time fraud detection. 10x your revenue with features others can't match.
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

        {/* Why AI Affiliate Pro Beats The Competition */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Why Top Affiliates Choose AI Affiliate Pro
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Features that other platforms wish they had. Built by affiliates, for affiliates.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500 to-purple-600 text-white text-xs px-3 py-1 rounded-bl-lg font-semibold">
              AI POWERED
            </div>
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">AI Revenue Optimization</h3>
              <p className="text-slate-400 leading-relaxed">
                Our AI analyzes 100+ data points to automatically optimize your campaigns and predict your best-performing content.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-red-500 to-orange-600 text-white text-xs px-3 py-1 rounded-bl-lg font-semibold">
              EXCLUSIVE
            </div>
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Radar className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Real-Time Fraud Detection</h3>
              <p className="text-slate-400 leading-relaxed">
                Advanced ML algorithms detect click fraud, bot traffic, and suspicious patterns before they cost you money.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500 to-teal-600 text-white text-xs px-3 py-1 rounded-bl-lg font-semibold">
              AUTOMATED
            </div>
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Repeat className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Cross-Network Reconciliation</h3>
              <p className="text-slate-400 leading-relaxed">
                Automatically sync and reconcile data across 50+ affiliate networks. No more manual CSV imports or data mismatches.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-pink-600 text-white text-xs px-3 py-1 rounded-bl-lg font-semibold">
              ENTERPRISE
            </div>
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Global Tax Compliance</h3>
              <p className="text-slate-400 leading-relaxed">
                Built-in tax reporting for 195+ countries. Automatically categorize earnings and generate compliant reports for any jurisdiction.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-500 to-orange-600 text-white text-xs px-3 py-1 rounded-bl-lg font-semibold">
              INSTANT
            </div>
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Sub-Second Data Sync</h3>
              <p className="text-slate-400 leading-relaxed">
                See your conversions as they happen. Our real-time API sync shows earnings within 0.3 seconds of a sale.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-blue-600 text-white text-xs px-3 py-1 rounded-bl-lg font-semibold">
              PREDICTIVE
            </div>
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Revenue Forecasting</h3>
              <p className="text-slate-400 leading-relaxed">
                AI-powered 90-day revenue predictions with 94% accuracy. Plan campaigns and scale with confidence.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Competitive Comparison */}
        <div className="bg-slate-800/30 rounded-3xl p-8 md:p-12 border border-slate-700 mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              See How We Stack Up
            </h2>
            <p className="text-slate-400 text-lg">
              Other platforms charge more for less. We deliver more for less.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="py-4 px-6 text-slate-400 font-medium"></th>
                  <th className="py-4 px-6 text-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold">
                      AI Affiliate Pro
                    </div>
                  </th>
                  <th className="py-4 px-6 text-center text-slate-400">ClickBank Analytics</th>
                  <th className="py-4 px-6 text-center text-slate-400">VolunteerHQ</th>
                  <th className="py-4 px-6 text-center text-slate-400">AffTracker</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-700/50">
                  <td className="py-4 px-6 text-slate-300">AI Revenue Optimization</td>
                  <td className="py-4 px-6 text-center text-green-400">✓</td>
                  <td className="py-4 px-6 text-center text-red-400">✗</td>
                  <td className="py-4 px-6 text-center text-red-400">✗</td>
                  <td className="py-4 px-6 text-center text-red-400">✗</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-4 px-6 text-slate-300">Real-time Fraud Detection</td>
                  <td className="py-4 px-6 text-center text-green-400">✓</td>
                  <td className="py-4 px-6 text-center text-red-400">✗</td>
                  <td className="py-4 px-6 text-center text-red-400">✗</td>
                  <td className="py-4 px-6 text-center text-yellow-400">Basic</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-4 px-6 text-slate-300">Cross-Network Auto Sync</td>
                  <td className="py-4 px-6 text-center text-green-400">50+ Networks</td>
                  <td className="py-4 px-6 text-center text-yellow-400">Limited</td>
                  <td className="py-4 px-6 text-center text-red-400">✗</td>
                  <td className="py-4 px-6 text-center text-yellow-400">Manual</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-4 px-6 text-slate-300">Global Tax Compliance</td>
                  <td className="py-4 px-6 text-center text-green-400">195 Countries</td>
                  <td className="py-4 px-6 text-center text-red-400">✗</td>
                  <td className="py-4 px-6 text-center text-red-400">✗</td>
                  <td className="py-4 px-6 text-center text-red-400">✗</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-4 px-6 text-slate-300">Sub-Second Data Updates</td>
                  <td className="py-4 px-6 text-center text-green-400">0.3s</td>
                  <td className="py-4 px-6 text-center text-yellow-400">15min</td>
                  <td className="py-4 px-6 text-center text-yellow-400">1hr</td>
                  <td className="py-4 px-6 text-center text-yellow-400">5min</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-slate-300 font-semibold">Monthly Price</td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-green-400 font-bold text-lg">$49</span>
                  </td>
                  <td className="py-4 px-6 text-center text-slate-400">$97</td>
                  <td className="py-4 px-6 text-center text-slate-400">$79</td>
                  <td className="py-4 px-6 text-center text-slate-400">$129</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-3xl p-12 border border-slate-700">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Ready to 10x Your Affiliate Revenue?
          </h2>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of affiliate marketers who trust AI Affiliate Pro to scale their business and maximize their earnings.
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
              <span className="text-lg font-semibold text-slate-300">AI Affiliate Pro</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2025 AI Affiliate Pro. Built for affiliate marketers who mean business.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
