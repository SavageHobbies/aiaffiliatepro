import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGeneratedContentSchema } from "@shared/schema";
import type { GeneratedContent } from "@shared/schema";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  PlusCircle, 
  Globe, 
  Edit, 
  Trash2, 
  Upload, 
  Eye, 
  BarChart3,
  Bot,
  FileText,
  Wand2,
  ExternalLink
} from "lucide-react";

// Form schema for content generation
const contentGenerationFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  contentType: z.string().min(1, "Content type is required"),
  aiPrompt: z.string().min(1, "Description is required"),
  selectedPrograms: z.string().min(1, "Please select at least one affiliate program"),
  seoKeywords: z.string().optional(),
  metaDescription: z.string().optional(),
  aiProvider: z.enum(["gemini", "openai"]),
  apiKey: z.string().min(1, "API key is required"),
});

export default function ContentPage() {
  const { toast } = useToast();
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch generated content
  const { data: content = [], isLoading } = useQuery<GeneratedContent[]>({
    queryKey: ["/api/generated-content"],
  });

  // Fetch affiliate programs for selection
  const { data: programs = [] } = useQuery({
    queryKey: ["/api/programs"],
  });

  // Create content mutation
  const createContentMutation = useMutation({
    mutationFn: async (data: z.infer<typeof contentGenerationFormSchema>) => {
      setIsGenerating(true);
      try {
        // First create the content record
        const contentData = {
          title: data.title,
          contentType: data.contentType,
          aiPrompt: data.aiPrompt,
          selectedPrograms: [data.selectedPrograms],
          generatedHtml: "", // Will be populated by AI
          seoKeywords: data.seoKeywords ? data.seoKeywords.split(',').map(k => k.trim()) : [],
          metaDescription: data.metaDescription,
          status: "draft" as const,
        };

        // First save the content record
        const response = await apiRequest("/api/generated-content", "POST", contentData);

        // If AI API key is provided, generate content
        if (data.apiKey && data.aiPrompt) {
          try {
            const generationResponse = await apiRequest("/api/generate-content", "POST", {
              aiApiKey: data.apiKey,
              prompt: data.aiPrompt,
              contentType: data.contentType,
              keywords: data.seoKeywords,
              selectedPrograms: data.selectedPrograms,
              title: data.title
            });
            
            // Update the content with generated HTML
            if (generationResponse && typeof generationResponse === 'object' && 'content' in generationResponse) {
              await apiRequest(`/api/generated-content/${(response as any).id}`, "PATCH", {
                generatedHtml: (generationResponse as any).content,
                status: "ready"
              });
            }
          } catch (genError) {
            console.error("AI generation failed:", genError);
            // Content was still saved, just without AI generation
          }
        }
        
        return response;
      } finally {
        setIsGenerating(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/generated-content"] });
      toast({
        title: "Success",
        description: "Content generation started successfully!",
      });
      setSelectedContent(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete content mutation
  const deleteContentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/generated-content/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/generated-content"] });
      toast({
        title: "Success",
        description: "Content deleted successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof contentGenerationFormSchema>>({
    resolver: zodResolver(contentGenerationFormSchema),
    defaultValues: {
      title: "",
      aiPrompt: "",
      contentType: "product_comparison",
      seoKeywords: "",
      selectedPrograms: "",
      aiProvider: "gemini",
      apiKey: "",
      metaDescription: "",
    },
  });

  const onSubmit = (values: z.infer<typeof contentGenerationFormSchema>) => {
    createContentMutation.mutate(values);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      published: "default",
      generating: "outline",
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "product_comparison":
        return <BarChart3 className="h-4 w-4" />;
      case "product_review":
        return <FileText className="h-4 w-4" />;
      case "landing_page":
        return <Globe className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">AI Content Generation</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Content Generation</h1>
          <p className="text-muted-foreground">
            Create high-converting affiliate content with AI
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Bot className="h-4 w-4 mr-2" />
              Generate Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Generate AI Content</DialogTitle>
              <DialogDescription>
                Create affiliate marketing content using AI. Choose your content type, affiliate programs, and AI provider.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Best Gaming Laptops 2025" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select content type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="product_comparison">Product Comparison</SelectItem>
                            <SelectItem value="product_review">Product Review</SelectItem>
                            <SelectItem value="landing_page">Landing Page</SelectItem>
                            <SelectItem value="blog_post">Blog Post</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="aiPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what you want the AI to create..." 
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="seoKeywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Keywords</FormLabel>
                        <FormControl>
                          <Input placeholder="gaming laptop, best laptop 2025" {...field} />
                        </FormControl>
                        <FormDescription>
                          Comma-separated keywords for SEO optimization
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="selectedPrograms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Affiliate Program</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select program" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {programs.map((program: any) => (
                              <SelectItem key={program.id} value={program.id.toString()}>
                                {program.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">AI Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="aiProvider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AI Provider</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select AI provider" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="gemini">Google Gemini</SelectItem>
                              <SelectItem value="openai">OpenAI GPT</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Key</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter your API key" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Your API key is used once and not stored
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="submit" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {content.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No content generated yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start creating high-converting affiliate content with AI
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Your First Content
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.map((item) => (
                <Card key={item.id} className="group hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getContentTypeIcon(item.contentType)}
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {item.aiPrompt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Views: {item.totalViews || 0}</span>
                        <span>Clicks: {item.totalClicks || 0}</span>
                      </div>
                      
                      {item.seoKeywords && (
                        <div className="flex flex-wrap gap-1">
                          {item.seoKeywords.split(',').slice(0, 3).map((keyword: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                        
                        <div className="flex space-x-1">
                          {item.status === "published" && (
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Visit
                            </Button>
                          )}
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteContentMutation.mutate(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="draft">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.filter(item => item.status === 'draft').map((item) => (
              <Card key={item.id}>
                {/* Same card content as above but filtered */}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="published">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.filter(item => item.status === 'published').map((item) => (
              <Card key={item.id}>
                {/* Same card content as above but filtered */}
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}