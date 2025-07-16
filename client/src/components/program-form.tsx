import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertAffiliateProgramSchema, type InsertAffiliateProgram, type AffiliateProgram } from "@shared/schema";
import { Eye, EyeOff, TestTube, RefreshCw } from "lucide-react";

interface ProgramFormProps {
  program?: AffiliateProgram | null;
  onSuccess: () => void;
}

export default function ProgramForm({ program, onSuccess }: ProgramFormProps) {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  const form = useForm<InsertAffiliateProgram>({
    resolver: zodResolver(insertAffiliateProgramSchema),
    defaultValues: {
      name: program?.name || "",
      network: program?.network || "",
      category: program?.category || "",
      dashboardUrl: program?.dashboardUrl || "",
      loginUrl: program?.loginUrl || "",
      username: program?.username || "",
      password: program?.password || "",
      apiKey: program?.apiKey || "",
      apiSecret: program?.apiSecret || "",
      affiliateId: program?.affiliateId || "",
      trackingId: program?.trackingId || "",
      commissionStructure: program?.commissionStructure || "",
      cookieDuration: program?.cookieDuration || "",
      paymentThreshold: program?.paymentThreshold || "",
      paymentMethod: program?.paymentMethod || "",
      contactEmail: program?.contactEmail || "",
      status: program?.status || "pending",
      syncEnabled: program?.syncEnabled || false,
      syncFrequency: program?.syncFrequency || "daily",
      notes: program?.notes || "",
      dateJoined: program?.dateJoined ? new Date(program.dateJoined) : undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertAffiliateProgram) => {
      const response = await apiRequest("POST", "/api/programs", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      toast({
        title: "Success",
        description: "Program created successfully",
      });
      form.reset();
      onSuccess();
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
        description: "Failed to create program",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertAffiliateProgram) => {
      const response = await apiRequest("PUT", `/api/programs/${program!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      toast({
        title: "Success",
        description: "Program updated successfully",
      });
      onSuccess();
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
        description: "Failed to update program",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertAffiliateProgram) => {
    if (program) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      if (!program?.id) throw new Error("Program ID required");
      const response = await apiRequest("POST", `/api/programs/${program.id}/test-connection`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: data.success ? "Success" : "Warning",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to test connection",
        variant: "destructive",
      });
    },
  });

  const handleTestConnection = () => {
    setTestingConnection(true);
    testConnectionMutation.mutate();
    setTimeout(() => setTestingConnection(false), 2000);
  };

  const mutation = program ? updateMutation : createMutation;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="sync">Auto-Sync</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Amazon Associates" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="network"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affiliate Network</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Network" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Amazon Associates">Amazon Associates</SelectItem>
                        <SelectItem value="ShareASale">ShareASale</SelectItem>
                        <SelectItem value="CJ Affiliate">CJ Affiliate</SelectItem>
                        <SelectItem value="Impact">Impact</SelectItem>
                        <SelectItem value="Rakuten">Rakuten</SelectItem>
                        <SelectItem value="Direct">Direct</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., E-commerce, Technology, Health" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dashboardUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dashboard URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="commissionStructure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission Structure</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5% per sale" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cookieDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cookie Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 30 days" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="paymentThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Threshold</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., $100" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input placeholder="support@example.com" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="credentials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Login Credentials</CardTitle>
                <CardDescription>
                  For networks without API access, we'll use web scraping with your login credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="loginUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://affiliate-program.example.com/login" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username/Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your-email@example.com" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••" 
                              {...field} 
                              value={field.value || ""}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Credentials</CardTitle>
                <CardDescription>
                  If the network provides API access, enter your API credentials here
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input placeholder="your-api-key" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apiSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Secret</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showApiSecret ? "text" : "password"}
                              placeholder="your-api-secret" 
                              {...field} 
                              value={field.value || ""}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowApiSecret(!showApiSecret)}
                            >
                              {showApiSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="affiliateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Affiliate ID</FormLabel>
                        <FormControl>
                          <Input placeholder="your-affiliate-id" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="trackingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tracking ID</FormLabel>
                        <FormControl>
                          <Input placeholder="your-tracking-id" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {program && (
                  <div className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleTestConnection}
                      disabled={testingConnection || testConnectionMutation.isPending}
                      className="w-full"
                    >
                      {testingConnection || testConnectionMutation.isPending ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Testing Connection...
                        </>
                      ) : (
                        <>
                          <TestTube className="mr-2 h-4 w-4" />
                          Test Connection
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sync" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Sync Settings</CardTitle>
                <CardDescription>
                  Configure automatic data synchronization from your affiliate networks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="syncEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Auto-Sync</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Automatically pull performance data from this affiliate network
                        </div>
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
                  control={form.control}
                  name="syncFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sync Frequency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "daily"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hourly">Every Hour</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="manual">Manual Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., PayPal, Bank Transfer" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateJoined"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Joined</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      value={field.value ? new Date(field.value).toISOString().split('T')[0] : ""}
                      onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional notes..."
                      rows={4}
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            className="bg-primary hover:bg-primary-700"
          >
            {mutation.isPending 
              ? (program ? "Updating..." : "Creating...") 
              : (program ? "Update Program" : "Create Program")
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
