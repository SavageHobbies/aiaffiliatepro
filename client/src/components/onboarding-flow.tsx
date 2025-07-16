import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Target, 
  RefreshCw, 
  TrendingUp, 
  ArrowRight, 
  Play,
  BookOpen,
  Lightbulb,
  Rocket,
  Users,
  DollarSign,
  MousePointer
} from "lucide-react";
import ProgramForm from "./program-form";

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  programCount: number;
}

export default function OnboardingFlow({ isOpen, onClose, programCount }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showProgramForm, setShowProgramForm] = useState(false);

  const steps = [
    {
      title: "Welcome to Your Affiliate Dashboard!",
      description: "Let's get you set up to track and optimize your affiliate marketing success.",
      icon: Rocket,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Rocket className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Ready to Supercharge Your Affiliate Marketing?
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              This dashboard will help you manage programs, track performance, and maximize your earnings across all affiliate networks.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Target className="h-6 w-6 text-primary mx-auto mb-2" />
              <h4 className="font-medium text-slate-900 mb-1">Track Everything</h4>
              <p className="text-sm text-slate-600">Monitor clicks, conversions, and earnings in real-time</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <RefreshCw className="h-6 w-6 text-primary mx-auto mb-2" />
              <h4 className="font-medium text-slate-900 mb-1">Auto-Sync Data</h4>
              <p className="text-sm text-slate-600">Automatically pull data from affiliate networks</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
              <h4 className="font-medium text-slate-900 mb-1">Optimize Performance</h4>
              <p className="text-sm text-slate-600">Get insights to improve your results</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Add Your First Affiliate Program",
      description: "Connect your affiliate networks to start tracking performance automatically.",
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Connect Your Affiliate Programs
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Add your affiliate programs to start tracking performance. We support major networks like Amazon Associates, ShareASale, and more.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Amazon Associates',
              'ShareASale', 
              'CJ Affiliate',
              'Impact',
              'Rakuten',
              'Direct Programs'
            ].map((network) => (
              <div key={network} className="p-3 bg-slate-50 rounded-lg text-center">
                <div className="w-8 h-8 bg-primary rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{network.charAt(0)}</span>
                </div>
                <p className="text-sm font-medium text-slate-700">{network}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Pro Tip</h4>
                <p className="text-sm text-blue-700">
                  You can add both API credentials and login details. We'll automatically choose the best method to sync your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Set Up Auto-Sync",
      description: "Enable automatic data synchronization to keep your dashboard up-to-date.",
      icon: RefreshCw,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <RefreshCw className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Automate Your Data Collection
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Set up automatic synchronization to keep your performance data fresh without manual work.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-slate-900">Hourly Sync</p>
                  <p className="text-sm text-slate-500">For high-volume programs</p>
                </div>
              </div>
              <Badge variant="outline">Recommended</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-slate-900">Daily Sync</p>
                  <p className="text-sm text-slate-500">Perfect for most users</p>
                </div>
              </div>
              <Badge variant="outline">Popular</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-slate-900">Weekly Sync</p>
                  <p className="text-sm text-slate-500">For casual tracking</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900 mb-1">Automatic & Secure</h4>
                <p className="text-sm text-green-700">
                  Your credentials are encrypted and stored securely. You can change sync settings anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Start Tracking Success!",
      description: "You're all set! Here's what you can do next to maximize your affiliate earnings.",
      icon: TrendingUp,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              You're Ready to Rock! 🚀
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Your affiliate dashboard is set up and ready to help you track and optimize your performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3 mb-3">
                <DollarSign className="h-6 w-6 text-green-600" />
                <h4 className="font-medium text-green-900">Track Earnings</h4>
              </div>
              <p className="text-sm text-green-700">
                Monitor your revenue across all programs in real-time with detailed breakdowns.
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3 mb-3">
                <MousePointer className="h-6 w-6 text-blue-600" />
                <h4 className="font-medium text-blue-900">Analyze Performance</h4>
              </div>
              <p className="text-sm text-blue-700">
                See which programs and content perform best to optimize your strategy.
              </p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <BookOpen className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-900 mb-1">Next Steps</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Add your first affiliate program</li>
                  <li>• Set up auto-sync for hands-free tracking</li>
                  <li>• Check your dashboard daily for insights</li>
                  <li>• Optimize based on performance data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddProgram = () => {
    setShowProgramForm(true);
  };

  if (showProgramForm) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Your First Affiliate Program</DialogTitle>
          </DialogHeader>
          <ProgramForm 
            onSuccess={() => {
              setShowProgramForm(false);
              onClose();
            }} 
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <currentStepData.icon className="h-5 w-5 text-primary" />
              <span>{currentStepData.title}</span>
            </DialogTitle>
            <Badge variant="outline" className="text-xs">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-slate-600">{currentStepData.description}</p>
          </div>
        </DialogHeader>

        <div className="py-6">
          {currentStepData.content}
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          <div className="flex space-x-2">
            {currentStep === 1 && (
              <Button
                onClick={handleAddProgram}
                className="bg-primary hover:bg-primary-700"
              >
                <Play className="mr-2 h-4 w-4" />
                Add Program Now
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              className={currentStep === steps.length - 1 ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary-700"}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Get Started!
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}