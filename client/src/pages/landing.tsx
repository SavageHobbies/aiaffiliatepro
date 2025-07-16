import { useState } from "react";
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
  Target,
  CheckCircle,
  Zap,
  BarChart,
  Users,
  Shield,
  DollarSign,
  HelpCircle,
} from "lucide-react";
import logo from "@/images/theone_v1.png";
import dashboardScreenshot from "@/images/Dashboard screenshot.png";
import AuthModal from "@/components/auth-modal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Landing() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>
          AI Affiliate Pro: All-in-One Affiliate Marketing Platform for
          Tracking & Automation
        </title>
        <meta
          name="description"
          content="Scale your affiliate business with AI Affiliate Pro. Get multi-network tracking, AI content generation, automated publishing, and real-time analytics. Start your free trial today!"
        />
        <meta
          name="keywords"
          content="affiliate marketing platform, affiliate management software, affiliate tracker SaaS, multi-network affiliate tracking, AI affiliate content generation, automated affiliate publishing, affiliate analytics software"
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
          <img src={logo} alt="Logo" className="h-32" />
          <Button
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Sign In
          </Button>
        </nav>

        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-4 py-2 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-300 font-medium">
                  🔥 Join 10,000+ affiliates earning $50K+/month
                </span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Turn Your Affiliate Links Into{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Profit Machines
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              <span className="text-white font-semibold">Stop losing money to broken links, missed opportunities, and manual tracking.</span> AI Affiliate Pro automatically monitors 50+ networks, generates high-converting content with AI, and alerts you to every revenue opportunity.
            </p>
            
            {/* Social Proof Numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">$2.3M+</div>
                <div className="text-sm text-slate-400">Revenue Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">50+</div>
                <div className="text-sm text-slate-400">Networks Supported</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">99.9%</div>
                <div className="text-sm text-slate-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">24/7</div>
                <div className="text-sm text-slate-400">Link Monitoring</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg px-10 py-4 shadow-lg shadow-green-500/25 animate-pulse hover:animate-none transition-all duration-300"
                onClick={() => setIsAuthModalOpen(true)}
              >
                🚀 Start FREE 14-Day Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <div className="text-center sm:text-left">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white text-lg px-8 py-4"
                >
                  📹 Watch 2-Min Demo
                </Button>
                <p className="text-xs text-slate-500 mt-1">No credit card required</p>
              </div>
            </div>
            
            {/* Urgency/Scarcity */}
            <div className="mt-8 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-orange-300">
                ⚡ <span className="font-semibold">Limited Time:</span> Get 50% off your first 3 months when you start today!
              </p>
            </div>
          </div>

          {/* Problem/Pain Points Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-red-400">
                Are You Losing Money Every Day?
              </h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Most affiliates are bleeding revenue without even knowing it. Here's what's costing you thousands:
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">💸</div>
                <h3 className="font-bold text-red-400 mb-2">Broken Links</h3>
                <p className="text-sm text-slate-400">Average affiliate loses $847/month to dead links they don't know about</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">⏰</div>
                <h3 className="font-bold text-orange-400 mb-2">Manual Tracking</h3>
                <p className="text-sm text-slate-400">15+ hours/week wasted logging into different networks manually</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">📉</div>
                <h3 className="font-bold text-yellow-400 mb-2">Missed Opportunities</h3>
                <p className="text-sm text-slate-400">No alerts when high-converting products go on sale or get restocked</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="font-bold text-purple-400 mb-2">Content Bottleneck</h3>
                <p className="text-sm text-slate-400">Spending 20+ hours/week writing content instead of scaling</p>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-block bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-green-400 mb-2">
                  ✅ AI Affiliate Pro Solves All of This
                </h3>
                <p className="text-slate-300">
                  Automatically monitor, optimize, and scale your affiliate business 24/7
                </p>
              </div>
            </div>
          </div>

          {/* Product Showcase */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                See Your New Command Center
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Everything you need to dominate affiliate marketing in one beautiful dashboard
              </p>
            </div>
            <div className="relative rounded-lg border border-slate-700 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-slate-900 to-transparent rounded-lg"></div>
              <img
                src={dashboardScreenshot}
                alt="AI Affiliate Pro Dashboard"
                className="rounded-lg"
              />
              {/* Overlay with key features */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-green-400 font-bold">$12,847</div>
                    <div className="text-xs text-slate-400">This Month</div>
                  </div>
                  <div>
                    <div className="text-blue-400 font-bold">47</div>
                    <div className="text-xs text-slate-400">Active Programs</div>
                  </div>
                  <div>
                    <div className="text-purple-400 font-bold">99.2%</div>
                    <div className="text-xs text-slate-400">Link Health</div>
                  </div>
                  <div>
                    <div className="text-orange-400 font-bold">24/7</div>
                    <div className="text-xs text-slate-400">Monitoring</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why AI Affiliate Pro Beats The Competition */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Why Top Affiliates Choose AI Affiliate Pro
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Discover features designed for affiliate marketing efficiency,
              from AI content to robust analytics. Built to solve affiliate
              marketing pain points.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  AI-Powered Revenue Optimization
                </h3>
                <p className="text-slate-400">
                  Leverage AI to generate high-converting affiliate content,
                  from product reviews to ad copy, tailored to your audience.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
                  <Repeat className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Automated Cross-Network Reconciliation
                </h3>
                <p className="text-slate-400">
                  Aggregate data from multiple affiliate networks into a single
                  dashboard for a complete view of your performance.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
                  <Radar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Real-Time Affiliate Fraud Detection
                </h3>
                <p className="text-slate-400">
                  Protect your earnings with our advanced fraud detection system
                  that monitors for suspicious activity in real-time.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Automated Publishing
                </h3>
                <p className="text-slate-400">
                  Schedule and publish your AI-generated content directly to
                  your WordPress sites or other platforms with one click.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Link Health Monitoring
                </h3>
                <p className="text-slate-400">
                  Get instant alerts for broken or out-of-stock affiliate
                  links, ensuring you never miss a commission.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Competitor Tracking
                </h3>
                <p className="text-slate-400">
                  Monitor your competitors' affiliate strategies and uncover new
                  opportunities for growth.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Results/Proof Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Real Results From Real Affiliates
              </h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                See how AI Affiliate Pro users are crushing their revenue goals and automating their success
              </p>
            </div>
            
            {/* Success Metrics */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-8 text-center">
                <div className="text-5xl font-bold text-green-400 mb-2">312%</div>
                <div className="text-lg font-semibold text-white mb-2">Average Revenue Increase</div>
                <div className="text-sm text-slate-400">Within first 90 days of using AI Affiliate Pro</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-8 text-center">
                <div className="text-5xl font-bold text-blue-400 mb-2">47</div>
                <div className="text-lg font-semibold text-white mb-2">Hours Saved Per Week</div>
                <div className="text-sm text-slate-400">Time previously spent on manual tracking & content creation</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-8 text-center">
                <div className="text-5xl font-bold text-purple-400 mb-2">$847</div>
                <div className="text-lg font-semibold text-white mb-2">Recovered Monthly</div>
                <div className="text-sm text-slate-400">From broken links and missed opportunities</div>
              </div>
            </div>

          {/* Testimonials */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                What Our Users Are Saying
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src="https://randomuser.me/api/portraits/women/68.jpg"
                      alt="User"
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-bold text-white">Sarah K.</h4>
                      <p className="text-sm text-slate-400">
                        Top-Tier Affiliate Marketer
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-300">
                    "AI Affiliate Pro has been a game-changer for my business.
                    The AI content generator saves me hours of work every week,
                    and the multi-network dashboard is a lifesaver."
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="User"
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-bold text-white">Mike P.</h4>
                      <p className="text-sm text-slate-400">
                        Niche Site Owner
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-300">
                    "The automated publishing and link monitoring features are
                    worth the price alone. I've seen a 30% increase in my
                    commissions since I started using this platform."
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="User"
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-bold text-white">Jessica L.</h4>
                      <p className="text-sm text-slate-400">
                        Marketing Agency Owner
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-300">
                    "I manage multiple affiliate accounts for my clients, and AI
                    Affiliate Pro makes it easy to keep everything organized.
                    The analytics are top-notch."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Choose the plan that's right for you. All plans start with a
                14-day free trial.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Starter Plan */}
              <Card className="bg-slate-800/50 border-slate-700 flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-400">
                <CardContent className="p-8 flex-grow">
                  <Zap className="w-10 h-10 mb-4 text-blue-400" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Starter
                  </h3>
                  <p className="text-slate-400 mb-6">
                    For individuals getting started.
                  </p>
                  <p className="text-4xl font-bold text-white mb-6">
                    $49 <span className="text-lg text-slate-400">/mo</span>
                  </p>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />5
                      Connected Networks
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      AI Content Generation (10k words/mo)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      Automated Publishing (1 site)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      Basic Analytics
                    </li>
                  </ul>
                </CardContent>
                <div className="p-8 pt-0">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Get Started
                  </Button>
                </div>
              </Card>

              {/* Pro Plan */}
              <Card className="bg-slate-800/50 border-slate-700 flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-400">
                <CardContent className="p-8 flex-grow">
                  <BarChart className="w-10 h-10 mb-4 text-purple-400" />
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <p className="text-slate-400 mb-6">
                    For serious affiliates scaling their business.
                  </p>
                  <p className="text-4xl font-bold text-white mb-6">
                    $99 <span className="text-lg text-slate-400">/mo</span>
                  </p>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      Unlimited Networks
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      AI Content Generation (50k words/mo)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      Automated Publishing (10 sites)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      Advanced Analytics & Fraud Detection
                    </li>
                  </ul>
                </CardContent>
                <div className="p-8 pt-0">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Start Free Trial
                  </Button>
                </div>
              </Card>

              {/* Agency Plan */}
              <Card className="bg-slate-800/50 border-slate-700 flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-400">
                <CardContent className="p-8 flex-grow">
                  <Users className="w-10 h-10 mb-4 text-green-400" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Agency
                  </h3>
                  <p className="text-slate-400 mb-6">
                    For agencies managing multiple clients.
                  </p>
                  <p className="text-4xl font-bold text-white mb-6">
                    Contact Us
                  </p>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      Everything in Pro
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      Multi-user access
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      White-label reporting
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      Dedicated Account Manager
                    </li>
                  </ul>
                </CardContent>
                <div className="p-8 pt-0">
                  <Button
                    className="w-full bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Contact Sales
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-20 max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-slate-700">
                <AccordionTrigger className="text-lg text-white">
                  What is AI Affiliate Pro?
                </AccordionTrigger>
                <AccordionContent className="text-slate-400">
                  AI Affiliate Pro is an all-in-one platform that helps
                  affiliate marketers track their earnings across multiple
                  networks, generate high-quality content with AI, automate
                  publishing, and monitor link health.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-slate-700">
                <AccordionTrigger className="text-lg text-white">
                  Which affiliate networks do you support?
                </AccordionTrigger>
                <AccordionContent className="text-slate-400">
                  We support all major affiliate networks, including Amazon
                  Associates, CJ Affiliate, ShareASale, Rakuten Advertising,
                  and many more. You can also add custom networks.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-slate-700">
                <AccordionTrigger className="text-lg text-white">
                  How does the AI content generation work?
                </AccordionTrigger>
                <AccordionContent className="text-slate-400">
                  Our AI is trained on a massive dataset of high-converting
                  marketing copy. You provide a topic, keywords, and a few
                  other details, and our AI will generate a variety of content
                  types, including blog posts, product reviews, and ad copy.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border-slate-700">
                <AccordionTrigger className="text-lg text-white">
                  Can I cancel my subscription at any time?
                </AccordionTrigger>
                <AccordionContent className="text-slate-400">
                  Yes, you can cancel your subscription at any time. You'll
                  retain access to your account until the end of your billing
                  period.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Risk Reversal Section */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-green-400 mb-4">
                  🛡️ Zero Risk Guarantee
                </h2>
                <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                  We're so confident AI Affiliate Pro will transform your business, we're removing all the risk
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">14-Day Free Trial</h3>
                  <p className="text-sm text-slate-400">Full access to all features. No credit card required.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">30-Day Money Back</h3>
                  <p className="text-sm text-slate-400">Not satisfied? Get 100% of your money back, no questions asked.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">Free Setup Support</h3>
                  <p className="text-sm text-slate-400">Our team will help you get started and optimize your setup.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-600 rounded-lg p-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5"></div>
            <div className="relative z-10">
              <div className="mb-6">
                <div className="inline-flex items-center space-x-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-4">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-red-300 font-medium">⏰ Limited Time Offer Expires Soon</span>
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Stop Losing Money Every Day
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Every day you wait is another day of <span className="text-red-400 font-semibold">lost revenue, broken links, and missed opportunities.</span> Join 10,000+ smart affiliates who chose to automate their success.
              </p>
              
              {/* Value Stack */}
              <div className="bg-slate-800/50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                <h3 className="text-lg font-bold text-white mb-4">🎁 What You Get Today (Worth $2,847):</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                  <div className="flex items-center text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    AI Content Generator ($497 value)
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    50+ Network Integrations ($997 value)
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    24/7 Link Monitoring ($397 value)
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Fraud Detection System ($597 value)
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Advanced Analytics ($197 value)
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Free Setup & Training ($162 value)
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xl px-12 py-6 shadow-lg shadow-green-500/25 animate-pulse hover:animate-none transition-all duration-300"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  🚀 YES! Start My FREE Trial Now
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-slate-400">✅ No Credit Card Required • ✅ Cancel Anytime • ✅ 30-Day Money Back Guarantee</p>
                  <p className="text-xs text-slate-500 mt-2">Join 10,000+ affiliates already earning more with AI Affiliate Pro</p>
                </div>
              </div>
              
              {/* Countdown Timer Effect */}
              <div className="mt-8 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-orange-300">
                  ⚡ <span className="font-semibold">BONUS:</span> Start today and get 50% off your first 3 months + free premium setup (saves you $500)
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="container mx-auto px-4 py-8 mt-12 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-slate-400">
            <p>&copy; 2024 AI Affiliate Pro. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
