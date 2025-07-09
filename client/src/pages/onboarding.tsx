import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  BarChart3, 
  Link, 
  Bot, 
  Shield,
  Users,
  Globe,
  Target,
  TrendingUp,
  Settings,
  Rocket
} from "lucide-react";
import { Link as RouterLink } from "wouter";

const features = [
  {
    icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
    title: "Multi-Network Analytics",
    description: "Track performance across all your affiliate programs in one dashboard",
    benefits: ["Real-time earnings tracking", "Commission reconciliation", "ROI analysis"]
  },
  {
    icon: <Link className="w-8 h-8 text-green-600" />,
    title: "Smart Link Management",
    description: "Monitor link health, detect broken links, and optimize performance",
    benefits: ["Uptime monitoring", "Click tracking", "A/B testing"]
  },
  {
    icon: <Bot className="w-8 h-8 text-purple-600" />,
    title: "AI Content Generation",
    description: "Create high-converting comparison pages and product reviews automatically",
    benefits: ["SEO-optimized content", "Multiple content types", "Automated deployment"]
  },
  {
    icon: <Shield className="w-8 h-8 text-red-600" />,
    title: "Fraud Detection",
    description: "Advanced algorithms protect against invalid clicks and fraudulent activity",
    benefits: ["Real-time monitoring", "Risk scoring", "Automated alerts"]
  }
];

const setupSteps = [
  {
    id: "profile",
    title: "Complete Your Profile",
    description: "Add your basic information to get started",
    route: "/settings",
    icon: <Users className="w-5 h-5" />
  },
  {
    id: "api-keys", 
    title: "Configure AI API Keys",
    description: "Add your OpenAI or Gemini keys for content generation",
    route: "/settings",
    icon: <Settings className="w-5 h-5" />
  },
  {
    id: "programs",
    title: "Add Affiliate Programs",
    description: "Connect your first affiliate program to start tracking",
    route: "/programs",
    icon: <Target className="w-5 h-5" />
  },
  {
    id: "content",
    title: "Generate Your First Content",
    description: "Create a comparison page or product review",
    route: "/content",
    icon: <Bot className="w-5 h-5" />
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const markStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const progress = (completedSteps.length / setupSteps.length) * 100;

  return (
    <>
      <Helmet>
        <title>Getting Started with AI Affiliate Pro | Setup & Features</title>
        <meta name="description" content="Learn how to set up your AI Affiliate Pro account. Explore features like multi-network analytics, smart link management, AI content generation, and fraud detection." />
        <meta name="keywords" content="AI Affiliate Pro setup, affiliate marketing getting started, affiliate platform features, affiliate analytics, affiliate link management, AI content generation affiliate" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Welcome to AI Affiliate Pro! 🚀
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Your all-in-one platform for affiliate marketing success. Let's get you set up to start 
            tracking, optimizing, and scaling your affiliate business.
          </p>
        </div>

        {/* Platform Capabilities */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
            What You Can Do With AI Affiliate Pro
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border border-slate-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Setup Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Getting Started Checklist
            </CardTitle>
            <div className="flex items-center gap-4">
              <Progress value={progress} className="flex-1" />
              <span className="text-sm font-medium">
                {completedSteps.length}/{setupSteps.length} Complete
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {setupSteps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id);
                const isCurrent = index === currentStep && !isCompleted;
                
                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-lg border transition-all ${
                      isCompleted 
                        ? "bg-green-50 border-green-200" 
                        : isCurrent 
                        ? "bg-blue-50 border-blue-200" 
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          isCompleted 
                            ? "bg-green-500 text-white" 
                            : isCurrent 
                            ? "bg-blue-500 text-white" 
                            : "bg-slate-300 text-slate-600"
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            step.icon
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{step.title}</h3>
                          <p className="text-sm text-slate-600">{step.description}</p>
                        </div>
                      </div>
                      <RouterLink href={step.route}>
                        <Button 
                          variant={isCompleted ? "outline" : "default"}
                          size="sm"
                          className="ml-4"
                        >
                          {isCompleted ? "Review" : "Start"}
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </RouterLink>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Preview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">$0</div>
              <p className="text-sm text-slate-600">Total Earnings</p>
              <p className="text-xs text-slate-500 mt-1">Start tracking to see growth</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">0</div>
              <p className="text-sm text-slate-600">Active Programs</p>
              <p className="text-xs text-slate-500 mt-1">Add programs to begin</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600">0</div>
              <p className="text-sm text-slate-600">Generated Content</p>
              <p className="text-xs text-slate-500 mt-1">AI content awaiting creation</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600">0%</div>
              <p className="text-sm text-slate-600">Conversion Rate</p>
              <p className="text-xs text-slate-500 mt-1">Track performance metrics</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <RouterLink href="/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Go to Dashboard
              <TrendingUp className="w-5 h-5 ml-2" />
            </Button>
          </RouterLink>
          <p className="text-sm text-slate-500">
            You can always access this guide from the help menu
          </p>
        </div>
      </div>
    </div></>
  );
}