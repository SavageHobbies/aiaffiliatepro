import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Globe, 
  Server, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  Settings,
  Terminal,
  FileText
} from "lucide-react";
import { z } from "zod";

const sshConfigSchema = z.object({
  sshHost: z.string().min(1, "SSH host is required"),
  sshUsername: z.string().min(1, "SSH username is required"),
  sshPassword: z.string().min(1, "SSH password is required"),
  sshPort: z.number().min(1).max(65535).default(22),
  webRootPath: z.string().default("/public_html"),
});

type SSHConfigForm = z.infer<typeof sshConfigSchema>;

export default function Publish() {
  const { toast } = useToast();
  const [selectedContent, setSelectedContent] = useState<number | null>(null);

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["/api/settings"],
  });

  const { data: generatedContent, isLoading: contentLoading } = useQuery({
    queryKey: ["/api/content/generated"],
  });

  const sshForm = useForm<SSHConfigForm>({
    resolver: zodResolver(sshConfigSchema),
    defaultValues: {
      sshHost: "",
      sshUsername: "",
      sshPassword: "",
      sshPort: 22,
      webRootPath: "/public_html",
    },
  });

  // Update form when settings load
  useState(() => {
    if (settings) {
      sshForm.reset({
        sshHost: (settings as any).sshHost || "",
        sshUsername: (settings as any).sshUsername || "",
        sshPassword: (settings as any).sshPassword || "",
        sshPort: (settings as any).sshPort || 22,
        webRootPath: (settings as any).webRootPath || "/public_html",
      });
    }
  });

  const updateSSHConfigMutation = useMutation({
    mutationFn: async (data: SSHConfigForm) => {
      return await apiRequest("/api/settings", "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Success",
        description: "SSH configuration saved successfully",
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
        description: "Failed to save SSH configuration",
        variant: "destructive",
      });
    },
  });

  const deployContentMutation = useMutation({
    mutationFn: async (contentId: number) => {
      return await apiRequest(`/api/content/${contentId}/deploy`, "POST");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/content/generated"] });
      toast({
        title: "Success",
        description: `Content deployed successfully to ${(data as any).deploymentUrl}`,
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
        description: "Failed to deploy content",
        variant: "destructive",
      });
    },
  });

  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/settings/ssh/test", "POST");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "SSH connection test successful",
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
        title: "Connection Failed",
        description: "Unable to connect to SSH server. Please check your credentials.",
        variant: "destructive",
      });
    },
  });

  const onSSHConfigSubmit = (data: SSHConfigForm) => {
    updateSSHConfigMutation.mutate(data);
  };

  const handleDeploy = (contentId: number) => {
    setSelectedContent(contentId);
    deployContentMutation.mutate(contentId);
  };

  const hasSSHConfig = settings && (settings as any).sshHost && (settings as any).sshUsername;

  if (settingsLoading || contentLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-slate-200 rounded"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Publish & Deploy</h1>
        <p className="text-slate-600 mt-2">
          Deploy your AI-generated content to your web hosting via SSH
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* SSH Configuration */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              SSH Configuration
            </CardTitle>
            <p className="text-sm text-slate-500">
              Configure your web hosting SSH credentials for automatic deployment
            </p>
          </CardHeader>
          <CardContent>
            <Form {...sshForm}>
              <form onSubmit={sshForm.handleSubmit(onSSHConfigSubmit)} className="space-y-4">
                <FormField
                  control={sshForm.control}
                  name="sshHost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSH Host</FormLabel>
                      <FormControl>
                        <Input placeholder="your-domain.com or IP address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={sshForm.control}
                    name="sshUsername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="root or username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={sshForm.control}
                    name="sshPort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Port</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="22" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 22)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={sshForm.control}
                  name="sshPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Your SSH password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={sshForm.control}
                  name="webRootPath"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Web Root Path</FormLabel>
                      <FormControl>
                        <Input placeholder="/public_html or /var/www/html" {...field} />
                      </FormControl>
                      <p className="text-xs text-slate-500">
                        The directory where your website files should be uploaded
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={updateSSHConfigMutation.isPending}
                    className="bg-primary hover:bg-primary-700"
                  >
                    {updateSSHConfigMutation.isPending ? "Saving..." : "Save Configuration"}
                  </Button>

                  {hasSSHConfig && (
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => testConnectionMutation.mutate()}
                      disabled={testConnectionMutation.isPending}
                    >
                      {testConnectionMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Terminal className="w-4 h-4 mr-1" />
                      )}
                      Test Connection
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Deployment Status */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Deployment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {hasSSHConfig ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                  <span className="font-medium">SSH Configuration</span>
                </div>
                <Badge variant={hasSSHConfig ? "default" : "secondary"}>
                  {hasSSHConfig ? "Configured" : "Not Set"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Generated Content</span>
                </div>
                <Badge variant="outline">
                  {(generatedContent as any[])?.length || 0} Pages
                </Badge>
              </div>

              {hasSSHConfig && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Ready to deploy! Your SSH configuration is set up correctly.
                  </p>
                </div>
              )}

              {!hasSSHConfig && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    Configure SSH settings to enable automatic deployment.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated Content for Deployment */}
      <Card className="border border-slate-200">
        <CardHeader>
          <CardTitle>Deploy Generated Content</CardTitle>
          <p className="text-sm text-slate-500">
            Select content to deploy to your web hosting
          </p>
        </CardHeader>
        <CardContent>
          {!generatedContent || (generatedContent as any[]).length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No Content Generated</h3>
              <p className="text-slate-500 mb-4">
                Create some AI-generated content first to deploy it to your website.
              </p>
              <Button asChild>
                <a href="/content">Generate Content</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {(generatedContent as any[]).map((content) => (
                <div
                  key={content.id}
                  className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{content.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Type: {content.contentType} • Created: {new Date(content.createdAt).toLocaleDateString()}
                      </p>
                      {content.deploymentUrl && (
                        <p className="text-sm text-blue-600 mt-1">
                          <ExternalLink className="w-3 h-3 inline mr-1" />
                          <a href={content.deploymentUrl} target="_blank" rel="noopener noreferrer">
                            {content.deploymentUrl}
                          </a>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge 
                        variant={content.status === "published" ? "default" : "secondary"}
                      >
                        {content.status}
                      </Badge>
                      <Button
                        onClick={() => handleDeploy(content.id)}
                        disabled={!hasSSHConfig || deployContentMutation.isPending && selectedContent === content.id}
                        size="sm"
                      >
                        {deployContentMutation.isPending && selectedContent === content.id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4 mr-1" />
                        )}
                        {content.status === "published" ? "Redeploy" : "Deploy"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}