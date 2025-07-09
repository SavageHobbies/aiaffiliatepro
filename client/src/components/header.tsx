import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";

export default function Header() {
  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/src/images/logo_aiaffiliatepro.png" alt="AI Affiliate Pro Logo" className="h-8 w-8" />
          <span className="text-2xl font-bold text-slate-900">AI Affiliate Pro</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="p-2 text-slate-400 hover:text-slate-600">
            <Bell className="h-5 w-5" />
          </Button>
          <Button 
            onClick={handleLogout}
            className="bg-primary hover:bg-primary-700 text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
