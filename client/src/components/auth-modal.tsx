
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Chrome } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

  const handleGoogleSignIn = () => {
    window.location.href = "/api/auth/google";
  };

  const handleAuthAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const endpoint = isLogin ? "/api/login" : "/api/register";
    
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({ title: isLogin ? "Login Successful" : "Registration Successful" });
        window.location.href = "/"; // Redirect to dashboard
      } else {
        const errorData = await response.json();
        toast({ title: "Authentication Failed", description: errorData.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "An error occurred", description: "Please try again later.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-white">
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            {isLogin
              ? "Sign in to access your dashboard."
              : "Join thousands of affiliates scaling their business."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Button
            variant="outline"
            className="w-full bg-transparent border-slate-700 hover:bg-slate-800 hover:text-white"
            onClick={handleGoogleSignIn}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <div className="my-4 flex items-center">
            <Separator className="flex-1 bg-slate-700" />
            <span className="mx-4 text-xs text-slate-500">OR</span>
            <Separator className="flex-1 bg-slate-700" />
          </div>
          <Tabs defaultValue="login" className="w-full" onValueChange={(value) => setIsLogin(value === 'login')}>
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form className="space-y-4" onSubmit={handleAuthAction}>
                <div className="space-y-2">
                  <Label htmlFor="email-login" className="text-slate-300">Email</Label>
                  <Input id="email-login" name="email" type="email" placeholder="m@example.com" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login" className="text-slate-300">Password</Label>
                  <Input id="password-login" name="password" type="password" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Sign In
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form className="space-y-4" onSubmit={handleAuthAction}>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" placeholder="John" className="bg-slate-800 border-slate-700 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" placeholder="Doe" className="bg-slate-800 border-slate-700 text-white" />
                    </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register" className="text-slate-300">Email</Label>
                  <Input id="email-register" name="email" type="email" placeholder="m@example.com" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register" className="text-slate-300">Password</Label>
                  <Input id="password-register" name="password" type="password" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
