import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Edit, MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { AffiliateLink, AffiliateProgram } from "@shared/schema";

interface LinkCardProps {
  link: AffiliateLink;
  program?: AffiliateProgram;
  onDelete: () => void;
}

export default function LinkCard({ link, program, onDelete }: LinkCardProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
    });
  };

  const displayUrl = link.shortUrl || link.originalUrl;
  const conversions = link.conversions || 0;
  const clicks = link.clicks || 0;

  return (
    <Card className="border border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-lg mr-3 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {program?.name?.charAt(0) || link.name.charAt(0)}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">{link.name}</h4>
              <p className="text-sm text-slate-500">
                {program?.name || "No Program"}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => copyToClipboard(displayUrl)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-slate-600 mb-2">
            {link.shortUrl ? "Short URL:" : "Original URL:"}
          </p>
          <div className="bg-slate-50 p-3 rounded-lg">
            <code className="text-xs text-slate-700 break-all">{displayUrl}</code>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Clicks</p>
            <p className="text-lg font-semibold text-slate-900">{clicks.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Conversions</p>
            <p className="text-lg font-semibold text-slate-900">{conversions.toLocaleString()}</p>
          </div>
        </div>

        {link.earnings && parseFloat(link.earnings) > 0 && (
          <div className="mb-4">
            <p className="text-xs text-slate-500 mb-1">Earnings</p>
            <p className="text-lg font-semibold text-green-600">
              ${parseFloat(link.earnings).toFixed(2)}
            </p>
          </div>
        )}

        {!link.isActive && (
          <div className="mb-4">
            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
              Inactive
            </Badge>
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button 
            className="flex-1 bg-primary-50 text-primary hover:bg-primary-100"
            size="sm"
            onClick={() => copyToClipboard(displayUrl)}
          >
            <Copy className="mr-1 h-3 w-3" />
            Copy
          </Button>
          <Button 
            className="flex-1 bg-slate-50 text-slate-600 hover:bg-slate-100"
            size="sm"
          >
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
