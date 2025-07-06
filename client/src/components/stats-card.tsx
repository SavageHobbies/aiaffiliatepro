import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: "up" | "down";
  iconColor?: string;
  iconBg?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = "up",
  iconColor = "text-primary",
  iconBg = "bg-primary-100",
}: StatsCardProps) {
  return (
    <Card className="border border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={cn("p-3 rounded-full", iconBg)}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-2xl font-semibold text-slate-900">{value}</p>
          </div>
        </div>
        {trend && (
          <div className="mt-4">
            <span 
              className={cn(
                "text-sm font-medium",
                trendDirection === "up" ? "text-green-600" : "text-red-600"
              )}
            >
              {trend}
            </span>
            <span className="text-slate-500 text-sm"> from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
