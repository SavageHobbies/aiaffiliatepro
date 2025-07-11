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
              <div className="flex items-center space-x-1 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-slate-300">
                  Trusted by 10,000+ affiliates
                </span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Scale Your Affiliate Business with the Leading{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Affiliate Marketing Platform
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              AI Affiliate Pro is your all-in-one affiliate marketing platform,
              offering AI-powered revenue optimization, automated cross-network
              reconciliation for multi-network affiliate tracking, and real-time
              affiliate fraud detection. Streamline affiliate operations and 10x
              your revenue with our advanced affiliate tracker SaaS features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-8 py-4 shadow-lg shadow-blue-500/25"
                onClick={() => setIsAuthModalOpen(true)}
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

          {/* Product Showcase */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                A Glimpse Inside
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Explore a platform designed for clarity and power.
              </p>
            </div>
            <div className="relative rounded-lg border border-slate-700 shadow-2xl shadow-blue-500/10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-slate-900 to-transparent rounded-lg"></div>
              <img
                src={dashboardScreenshot}
                alt="AI Affiliate Pro Dashboard"
                className="rounded-lg"
              />
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

          {/* Testimonials */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Loved by Affiliates Worldwide
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our users say.
              </p>
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

          {/* Final CTA */}
          <div className="text-center bg-slate-800/50 border border-slate-700 rounded-lg p-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Ready to 10x Your Affiliate Revenue?
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Join thousands of successful affiliates who trust AI Affiliate Pro
              to automate their workflow, optimize their content, and scale
              their business. Start your free trial today and experience the
              future of affiliate marketing.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-8 py-4 shadow-lg shadow-blue-500/25"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Start Your Free Trial Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
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
