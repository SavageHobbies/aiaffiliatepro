import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Search, Edit, Trash2, RefreshCw, Download, TrendingUp, DollarSign, MousePointer, Target, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ProgramForm from "@/components/program-form";
import OnboardingFlow from "@/components/onboarding-flow";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { AffiliateProgram } from "@shared/schema";

export default function Programs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [networkFilter, setNetworkFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingProgram, setEditingProgram] = useState<AffiliateProgram | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [syncingPrograms, setSyncingPrograms] = useState<Set<number>>(new Set());
  const [syncingAll, setSyncingAll] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { toast } = useToast();

  const { data: programs, isLoading } = useQuery<AffiliateProgram[]>({
    queryKey: ["/api/programs"],
  });

  // Add stats query for overview cards
  const { data: stats } = useQuery({
    queryKey: ["/api/analytics/stats"],
    enabled: !!programs,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/programs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      toast({
        title: "Success",
        description: "Program deleted successfully",
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
        description: "Failed to delete program",
        variant: "destructive",
      });
    },
  });

  const syncProgramMutation = useMutation({
    mutationFn: async (programId: number) => {
      const response = await apiRequest("POST", `/api/programs/${programId}/sync`);
      return response.json();
    },
    onSuccess: (data, programId) => {
      setSyncingPrograms(prev => {
        const newSet = new Set(prev);
        newSet.delete(programId);
        return newSet;
      });
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      toast({
        title: data.success ? "Success" : "Warning",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
    },
    onError: (error, programId) => {
      setSyncingPrograms(prev => {
        const newSet = new Set(prev);
        newSet.delete(programId);
        return newSet;
      });
      toast({
        title: "Error",
        description: "Failed to sync program data",
        variant: "destructive",
      });
    },
  });

  const syncAllMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/sync-all");
      return response.json();
    },
    onSuccess: (data) => {
      setSyncingAll(false);
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      
      const successCount = data.results?.filter((r: any) => r.success).length || 0;
      const totalCount = data.results?.length || 0;
      
      toast({
        title: "Sync Complete",
        description: `Successfully synced ${successCount} of ${totalCount} programs`,
      });
    },
    onError: () => {
      setSyncingAll(false);
      toast({
        title: "Error",
        description: "Failed to sync programs",
        variant: "destructive",
      });
    },
  });

  const filteredPrograms = Array.isArray(programs) ? programs.filter((program: AffiliateProgram) => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNetwork = !networkFilter || networkFilter === "all" || program.network === networkFilter;
    const matchesStatus = !statusFilter || statusFilter === "all" || program.status === statusFilter;
    return matchesSearch && matchesNetwork && matchesStatus;
  }) : [];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { class: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      pending: { class: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      rejected: { class: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
      inactive: { class: "bg-gray-100 text-gray-800 border-gray-200", icon: AlertCircle },
    };
    return variants[status as keyof typeof variants] || variants.inactive;
  };

  const getNetworkIcon = (network: string) => {
    // You could add specific network icons here
    const firstLetter = network ? network.charAt(0).toUpperCase() : 'D';
    return firstLetter;
  };

  const handleEdit = (program: AffiliateProgram) => {
    setEditingProgram(program);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number, programName: string) => {
    // We'll handle this with AlertDialog in the JSX
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProgram(null);
  };

  const handleSyncProgram = (programId: number) => {
    setSyncingPrograms(prev => new Set(prev).add(programId));
    syncProgramMutation.mutate(programId);
  };

  const handleSyncAll = () => {
    setSyncingAll(true);
    syncAllMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-64"></div>
          <div className="h-32 bg-slate-200 rounded"></div>
          <div className="h-96 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Affiliate Programs</h3>
          <p className="text-slate-600 mt-1">Manage your affiliate partnerships and track performance</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleSyncAll}
            disabled={syncingAll || filteredPrograms.length === 0}
            className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
          >
            {syncingAll ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing All...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Sync All Data
              </>
            )}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Plus className="mr-2 h-4 w-4" />
                Add Program
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProgram ? "Edit Program" : "Add New Program"}
                </DialogTitle>
              </DialogHeader>
              <ProgramForm 
                program={editingProgram} 
                onSuccess={handleDialogClose}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview Cards */}
      {programs && programs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="border border-slate-200 hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${stats?.totalEarnings?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {stats?.conversionRate ? `${stats.conversionRate.toFixed(1)}% conversion rate` : 'No conversions yet'}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Clicks</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats?.totalClicks?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MousePointer className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {stats?.totalConversions || 0} conversions
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Programs</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats?.activePrograms || filteredPrograms.filter(p => p.status === 'active').length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {programs.length} total programs
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Performance</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats?.conversionRate ? `${stats.conversionRate.toFixed(1)}%` : '0.0%'}
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Conversion rate
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      <Card className="mb-6 border border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-slate-700">Filter & Search</h4>
              {(searchTerm || networkFilter || statusFilter) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setNetworkFilter("");
                    setStatusFilter("");
                  }}
                  className="text-slate-500 hover:text-slate-700"
                >
                  Clear filters
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Select value={networkFilter} onValueChange={setNetworkFilter}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="All Networks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Networks</SelectItem>
                  <SelectItem value="Amazon Associates">Amazon Associates</SelectItem>
                  <SelectItem value="ShareASale">ShareASale</SelectItem>
                  <SelectItem value="CJ Affiliate">CJ Affiliate</SelectItem>
                  <SelectItem value="Impact">Impact</SelectItem>
                  <SelectItem value="Rakuten">Rakuten</SelectItem>
                  <SelectItem value="Direct">Direct</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {filteredPrograms.length !== programs?.length && (
              <p className="text-sm text-slate-500">
                Showing {filteredPrograms.length} of {programs?.length || 0} programs
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Programs Table */}
      <Card className="border border-slate-200">
        <CardContent className="p-0">
          {filteredPrograms.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-medium text-slate-500">Program</TableHead>
                  <TableHead className="font-medium text-slate-500">Network</TableHead>
                  <TableHead className="font-medium text-slate-500">Commission</TableHead>
                  <TableHead className="font-medium text-slate-500">Status</TableHead>
                  <TableHead className="font-medium text-slate-500">Last Sync</TableHead>
                  <TableHead className="font-medium text-slate-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrograms.map((program: AffiliateProgram) => (
                  <TableRow key={program.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary rounded-lg mr-3 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {program.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{program.name}</div>
                          <div className="text-sm text-slate-500">{program.category}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-900">
                      {program.network || "Direct"}
                    </TableCell>
                    <TableCell className="text-slate-900">
                      {program.commissionStructure || "N/A"}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const statusInfo = getStatusBadge(program.status);
                        const StatusIcon = statusInfo.icon;
                        return (
                          <Badge className={`${statusInfo.class} border flex items-center gap-1 w-fit`}>
                            <StatusIcon className="h-3 w-3" />
                            {program.status}
                          </Badge>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-slate-900">
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {program.lastDataSync 
                            ? new Date(program.lastDataSync).toLocaleDateString()
                            : 'Never'
                          }
                        </span>
                        {program.syncEnabled && (
                          <Badge variant="outline" className="text-xs mt-1 w-fit">
                            Auto: {program.syncFrequency}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSyncProgram(program.id)}
                          disabled={syncingPrograms.has(program.id) || program.status !== 'active'}
                          className="text-blue-600 hover:text-blue-700"
                          title={program.status !== 'active' ? 'Program must be active to sync' : 'Sync data now'}
                        >
                          {syncingPrograms.has(program.id) ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(program)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Affiliate Program</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{program.name}"? This action cannot be undone and will permanently remove all associated data including links, performance history, and sync settings.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(program.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Program
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {searchTerm || networkFilter || statusFilter 
                  ? "No programs match your filters"
                  : "Start Your Affiliate Journey"
                }
              </h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                {searchTerm || networkFilter || statusFilter 
                  ? "Try adjusting your search criteria or clear the filters to see all programs."
                  : "Add your first affiliate program to start tracking performance, managing links, and earning commissions."
                }
              </p>
              
              {!searchTerm && !networkFilter && !statusFilter ? (
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <Button 
                      onClick={() => setShowOnboarding(true)}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-white shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      🚀 Quick Start Guide
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-200">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Program
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add New Program</DialogTitle>
                        </DialogHeader>
                        <ProgramForm onSuccess={handleDialogClose} />
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
                    <div className="p-4 bg-slate-50 rounded-lg text-center">
                      <Target className="h-6 w-6 text-primary mx-auto mb-2" />
                      <h4 className="font-medium text-slate-900 mb-1">Track Performance</h4>
                      <p className="text-sm text-slate-600">Monitor clicks, conversions, and earnings</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg text-center">
                      <RefreshCw className="h-6 w-6 text-primary mx-auto mb-2" />
                      <h4 className="font-medium text-slate-900 mb-1">Auto-Sync Data</h4>
                      <p className="text-sm text-slate-600">Automatically pull data from networks</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg text-center">
                      <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                      <h4 className="font-medium text-slate-900 mb-1">Optimize Results</h4>
                      <p className="text-sm text-slate-600">Get insights to improve performance</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setNetworkFilter("");
                    setStatusFilter("");
                  }}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Onboarding Flow */}
      <OnboardingFlow 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        programCount={programs?.length || 0}
      />
    </div>
  );
}
