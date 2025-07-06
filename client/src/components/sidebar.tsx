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
  FileText
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Programs", href: "/programs", icon: Handshake },
  { name: "Links", href: "/links", icon: LinkIcon },
  { name: "Applications", href: "/applications", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="w-64 bg-white shadow-lg border-r border-slate-200">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-xl font-bold text-slate-900">AffiliateHub</h1>
      </div>
      
      {/* Navigation */}
      <nav className="mt-6">
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
      </nav>
      
      {/* User Profile */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-slate-200">
        <div className="flex items-center">
          {user?.profileImageUrl ? (
            <img 
              src={user.profileImageUrl} 
              alt="User avatar" 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
          )}
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-900">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.email?.split("@")[0] || "User"
              }
            </p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
