import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Handshake, 
  Link as LinkIcon, 
  TrendingUp, 
  Settings,
  User,
  FileText,
  Bot,
  Globe,
  Rocket,
  HelpCircle
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Programs", href: "/programs", icon: Handshake },
  { name: "Links", href: "/links", icon: LinkIcon },
  { name: "Applications", href: "/applications", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
];

const publishingTools = [
  { name: "Content Generator", href: "/content", icon: Bot },
  { name: "SSH Deployment", href: "/publish", icon: Globe },
];

const supportTools = [
  { name: "Getting Started", href: "/onboarding", icon: Rocket },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="w-64 bg-white shadow-lg border-r border-slate-200">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-xl font-bold text-slate-900">AI Affiliate Pro</h1>
      </div>
      
      {/* Navigation */}
      <nav className="mt-6 flex-1 overflow-y-auto">
        {/* Main Navigation */}
        <div className="px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "flex items-center px-4 py-3 text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all",
                    isActive && "bg-primary-50 text-primary-700"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </div>

        {/* Publishing Tools Section */}
        <div className="mt-8 px-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Publishing
          </h3>
          <div className="space-y-2">
            {publishingTools.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      "flex items-center px-4 py-3 text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all",
                      isActive && "bg-primary-50 text-primary-700"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-8 px-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Support
          </h3>
          <div className="space-y-2">
            {supportTools.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      "flex items-center px-4 py-3 text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all",
                      isActive && "bg-primary-50 text-primary-700"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      
      {/* User Profile */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-slate-200">
        <Link href="/settings">
          <a className="flex items-center hover:bg-slate-50 p-2 rounded-lg transition-colors">
            {(user as any)?.profileImageUrl ? (
              <img 
                src={(user as any).profileImageUrl} 
                alt="User avatar" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-slate-900">
                {(user as any)?.firstName && (user as any)?.lastName 
                  ? `${(user as any).firstName} ${(user as any).lastName}`
                  : (user as any)?.email?.split("@")[0] || "User"
                }
              </p>
              <p className="text-xs text-slate-500">{(user as any)?.email}</p>
            </div>
            <Settings className="h-4 w-4 text-slate-400" />
          </a>
        </Link>
      </div>
    </div>
  );
}
