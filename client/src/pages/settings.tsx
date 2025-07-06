import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
});

const settingsSchema = z.object({
  emailNotifications: z.boolean(),
  commissionAlerts: z.boolean(),
  weeklyReports: z.boolean(),
});

const apiKeysSchema = z.object({
  geminiApiKey: z.string().optional(),
  openaiApiKey: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;
type SettingsForm = z.infer<typeof settingsSchema>;
type ApiKeysForm = z.infer<typeof apiKeysSchema>;

export default function Settings() {
  const { toast } = useToast();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["/api/settings"],
  });

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      website: "",
    },
  });

  const settingsForm = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      emailNotifications: true,
      commissionAlerts: true,
      weeklyReports: false,
    },
  });

  const apiKeysForm = useForm<ApiKeysForm>({
    resolver: zodResolver(apiKeysSchema),
    defaultValues: {
      geminiApiKey: "",
      openaiApiKey: "",
    },
  });

  // Update form values when data loads
  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: (user as any).firstName || "",
        lastName: (user as any).lastName || "",
        website: (user as any).website || "",
      });
    }
  }, [user, profileForm]);

  useEffect(() => {
    if (settings) {
      settingsForm.reset({
        emailNotifications: (settings as any).emailNotifications ?? true,
        commissionAlerts: (settings as any).commissionAlerts ?? true,
        weeklyReports: (settings as any).weeklyReports ?? false,
      });
      
      apiKeysForm.reset({
        geminiApiKey: (settings as any).geminiApiKey || "",
        openaiApiKey: (settings as any).openaiApiKey || "",
      });
    }
  }, [settings, settingsForm, apiKeysForm]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileForm) => {
      return await apiRequest("/api/auth/user", "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: SettingsForm) => {
      return await apiRequest("/api/settings", "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const updateApiKeysMutation = useMutation({
    mutationFn: async (data: ApiKeysForm) => {
      return await apiRequest("/api/settings/api-keys", "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Success",
        description: "API keys updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update API keys",
        variant: "destructive",
      });
    },
  });

  const onProfileSubmit = (data: ProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  const onSettingsSubmit = (data: SettingsForm) => {
    updateSettingsMutation.mutate(data);
  };

  const onApiKeysSubmit = (data: ApiKeysForm) => {
    updateApiKeysMutation.mutate(data);
  };

  if (userLoading || settingsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-32"></div>
          <div className="space-y-4">
            <div className="h-64 bg-slate-200 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 bg-slate-200 rounded"></div>
              <div className="h-64 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-slate-900 mb-6">Settings</h3>
      
      <div className="space-y-8">
        {/* API Keys Section */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              AI API Keys
            </CardTitle>
            <p className="text-sm text-slate-500">
              Configure your AI service API keys for content generation. Keys are stored securely and never shared.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...apiKeysForm}>
              <form onSubmit={apiKeysForm.handleSubmit(onApiKeysSubmit)} className="space-y-4">
                <FormField
                  control={apiKeysForm.control}
                  name="geminiApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Gemini API Key</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Enter your Gemini API key" 
                          {...field} 
                        />
                      </FormControl>
                      <p className="text-xs text-slate-500">
                        Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={apiKeysForm.control}
                  name="openaiApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OpenAI API Key</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Enter your OpenAI API key" 
                          {...field} 
                        />
                      </FormControl>
                      <p className="text-xs text-slate-500">
                        Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Platform</a>
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={updateApiKeysMutation.isPending}
                  className="bg-primary hover:bg-primary-700"
                >
                  {updateApiKeysMutation.isPending ? "Saving..." : "Save API Keys"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <Card className="border border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <Input 
                      value={(user as any)?.email || ""} 
                      disabled 
                      className="bg-slate-50"
                    />
                    <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yoursite.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={updateProfileMutation.isPending}
                    className="bg-primary hover:bg-primary-700"
                  >
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...settingsForm}>
                <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-6">
                  <FormField
                    control={settingsForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel className="font-medium text-slate-900">
                            Email Notifications
                          </FormLabel>
                          <p className="text-sm text-slate-500">
                            Receive email updates about your account
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={settingsForm.control}
                    name="commissionAlerts"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel className="font-medium text-slate-900">
                            Commission Alerts
                          </FormLabel>
                          <p className="text-sm text-slate-500">
                            Get notified when you earn new commissions
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={settingsForm.control}
                    name="weeklyReports"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel className="font-medium text-slate-900">
                            Weekly Reports
                          </FormLabel>
                          <p className="text-sm text-slate-500">
                            Receive weekly performance summaries
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={updateSettingsMutation.isPending}
                    className="bg-primary hover:bg-primary-700"
                  >
                    {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}