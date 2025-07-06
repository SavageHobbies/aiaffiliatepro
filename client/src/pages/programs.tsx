import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ProgramForm from "@/components/program-form";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { AffiliateProgram } from "@shared/schema";

export default function Programs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [networkFilter, setNetworkFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingProgram, setEditingProgram] = useState<AffiliateProgram | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: programs, isLoading } = useQuery<AffiliateProgram[]>({
    queryKey: ["/api/programs"],
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

  const filteredPrograms = Array.isArray(programs) ? programs.filter((program: AffiliateProgram) => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNetwork = !networkFilter || networkFilter === "all" || program.network === networkFilter;
    const matchesStatus = !statusFilter || statusFilter === "all" || program.status === statusFilter;
    return matchesSearch && matchesNetwork && matchesStatus;
  }) : [];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
      inactive: "bg-gray-100 text-gray-800",
    };
    return variants[status as keyof typeof variants] || variants.inactive;
  };

  const handleEdit = (program: AffiliateProgram) => {
    setEditingProgram(program);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this program?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProgram(null);
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
        <h3 className="text-xl font-semibold text-slate-900">Affiliate Programs</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-700">
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

      {/* Search and Filter */}
      <Card className="mb-6 border border-slate-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={networkFilter} onValueChange={setNetworkFilter}>
              <SelectTrigger>
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
              <SelectTrigger>
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
                  <TableHead className="font-medium text-slate-500">Date Joined</TableHead>
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
                      <Badge className={getStatusBadge(program.status)}>
                        {program.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-900">
                      {program.dateJoined 
                        ? new Date(program.dateJoined).toLocaleDateString()
                        : program.createdAt ? new Date(program.createdAt).toLocaleDateString() : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(program)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(program.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-slate-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Plus className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No programs found</h3>
              <p className="text-slate-500 mb-4">
                {searchTerm || networkFilter || statusFilter 
                  ? "Try adjusting your search criteria"
                  : "Get started by adding your first affiliate program"
                }
              </p>
              {!searchTerm && !networkFilter && !statusFilter && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary-700">
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
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
