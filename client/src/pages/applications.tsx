import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertAffiliateApplicationSchema, type AffiliateApplication, type InsertAffiliateApplication } from "@shared/schema";
import { Plus, Calendar, Clock, AlertCircle, CheckCircle, XCircle, ExternalLink, Search } from "lucide-react";
import { format } from "date-fns";

export default function Applications() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["/api/applications"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertAffiliateApplication) => {
      return await apiRequest("/api/applications", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      setOpen(false);
      toast({
        title: "Success",
        description: "Application tracking added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add application tracking",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertAffiliateApplication> }) => {
      return await apiRequest(`/api/applications/${id}`, "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: "Success",
        description: "Application status updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/applications/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: "Success",
        description: "Application removed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove application",
        variant: "destructive",
      });
    },
  });

  const form = useForm<InsertAffiliateApplication>({
    resolver: zodResolver(insertAffiliateApplicationSchema),
    defaultValues: {
      programName: "",
      companyName: "",
      website: "",
      applicationUrl: "",
      status: "pending",
      expectedResponseTime: "",
      notes: "",
      requirements: "",
      contactEmail: "",
      commissionRate: "",
      priority: "medium",
    },
  });

  const onSubmit = (data: InsertAffiliateApplication) => {
    createMutation.mutate(data);
  };

  const updateStatus = (id: number, status: string) => {
    updateMutation.mutate({ id, data: { status } });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/50"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case "under_review":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50"><Clock className="w-3 h-3 mr-1" />Under Review</Badge>;
      default:
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="secondary">Medium</Badge>;
    }
  };

  const filteredApplications = (applications as AffiliateApplication[]).filter((app: AffiliateApplication) => {
    const matchesSearch = app.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Application Tracking</h1>
          <p className="text-slate-400 mt-2">
            Keep track of your affiliate program applications and never lose sight of potential opportunities.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Track New Application
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add Application to Track</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="programName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Program Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Amazon Associates" className="bg-slate-700 border-slate-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Amazon" className="bg-slate-700 border-slate-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Website</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://affiliate-program.amazon.com" className="bg-slate-700 border-slate-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="applicationUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Application URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://portal.amazon.com/apply" className="bg-slate-700 border-slate-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="under_review">Under Review</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expectedResponseTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Expected Response</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="7-14 days" className="bg-slate-700 border-slate-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Contact Email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="affiliate@company.com" className="bg-slate-700 border-slate-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="commissionRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Commission Rate</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="5-10%" className="bg-slate-700 border-slate-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Requirements</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Monthly traffic requirements, content guidelines, etc." className="bg-slate-700 border-slate-600 text-white min-h-20" />
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
                      <FormLabel className="text-slate-300">Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Additional notes about this application..." className="bg-slate-700 border-slate-600 text-white min-h-20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Adding..." : "Add Application"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications Grid */}
      {filteredApplications.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Applications Found</h3>
            <p className="text-slate-400 text-center max-w-md">
              {searchTerm || filterStatus !== "all" 
                ? "No applications match your search criteria. Try adjusting your filters." 
                : "Start tracking your affiliate program applications to never miss an opportunity."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredApplications.map((application: AffiliateApplication) => (
            <Card key={application.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-white text-lg">{application.programName}</CardTitle>
                    <CardDescription className="text-slate-400">{application.companyName}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    {getStatusBadge(application.status)}
                    {getPriorityBadge(application.priority)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-slate-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  Applied: {application.applicationDate ? format(new Date(application.applicationDate), "MMM d, yyyy") : "N/A"}
                </div>
                
                {application.expectedResponseTime && (
                  <div className="flex items-center text-sm text-slate-400">
                    <Clock className="w-4 h-4 mr-2" />
                    Expected response: {application.expectedResponseTime}
                  </div>
                )}

                {application.commissionRate && (
                  <div className="text-sm">
                    <span className="text-slate-400">Commission: </span>
                    <span className="text-green-400">{application.commissionRate}</span>
                  </div>
                )}

                {application.requirements && (
                  <div className="text-xs text-slate-400 bg-slate-700/50 p-2 rounded">
                    <strong>Requirements:</strong> {application.requirements}
                  </div>
                )}

                {application.notes && (
                  <div className="text-xs text-slate-400">
                    <strong>Notes:</strong> {application.notes}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  {application.website && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(application.website || '', '_blank')}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Website
                    </Button>
                  )}
                  
                  {application.applicationUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(application.applicationUrl || '', '_blank')}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Application
                    </Button>
                  )}
                </div>

                {/* Quick status updates */}
                <div className="flex flex-wrap gap-1 pt-2">
                  {application.status !== "approved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(application.id, "approved")}
                      className="text-xs border-green-600 text-green-400 hover:bg-green-900/20"
                      disabled={updateMutation.isPending}
                    >
                      Approve
                    </Button>
                  )}
                  {application.status !== "rejected" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(application.id, "rejected")}
                      className="text-xs border-red-600 text-red-400 hover:bg-red-900/20"
                      disabled={updateMutation.isPending}
                    >
                      Reject
                    </Button>
                  )}
                  {application.status !== "under_review" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(application.id, "under_review")}
                      className="text-xs border-yellow-600 text-yellow-400 hover:bg-yellow-900/20"
                      disabled={updateMutation.isPending}
                    >
                      Under Review
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(application.id)}
                    className="text-xs border-slate-600 text-slate-400 hover:bg-slate-700"
                    disabled={deleteMutation.isPending}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}