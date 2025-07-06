import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Programs from "@/pages/programs";
import Links from "@/pages/links";
import Applications from "@/pages/applications";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import Content from "@/pages/content";
import Onboarding from "@/pages/onboarding";
import Publish from "@/pages/publish";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/programs" component={Programs} />
          <Route path="/links" component={Links} />
          <Route path="/applications" component={Applications} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/content" component={Content} />
          <Route path="/publish" component={Publish} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
