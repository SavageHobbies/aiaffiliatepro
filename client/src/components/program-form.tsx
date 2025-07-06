import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertAffiliateProgramSchema, type InsertAffiliateProgram, type AffiliateProgram } from "@shared/schema";

interface ProgramFormProps {
  program?: AffiliateProgram | null;
  onSuccess: () => void;
}

export default function ProgramForm({ program, onSuccess }: ProgramFormProps) {
  const { toast } = useToast();

  const form = useForm<InsertAffiliateProgram>({
    resolver: zodResolver(insertAffiliateProgramSchema),
    defaultValues: {
      name: program?.name || "",
      network: program?.network || "",
      category: program?.category || "",
      dashboardUrl: program?.dashboardUrl || "",
      commissionStructure: program?.commissionStructure || "",
      cookieDuration: program?.cookieDuration || "",
      paymentThreshold: program?.paymentThreshold || "",
      paymentMethod: program?.paymentMethod || "",
      contactEmail: program?.contactEmail || "",
      status: program?.status || "pending",
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

  const mutation = program ? updateMutation : createMutation;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <Input placeholder="e.g., E-commerce, Technology, Health" {...field} />
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
                <Input placeholder="https://..." {...field} />
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
                  <Input placeholder="e.g., 5% per sale" {...field} />
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
                  <Input placeholder="e.g., 30 days" {...field} />
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
                  <Input placeholder="e.g., $100" {...field} />
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
                <Input placeholder="support@example.com" {...field} />
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
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
