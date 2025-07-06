import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, BarChart3 } from "lucide-react";
import EarningsChart from "@/components/earnings-chart";

export default function Analytics() {
  const [dateRange, setDateRange] = useState("30");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/stats"],
  });

  const { data: programs, isLoading: programsLoading } = useQuery({
    queryKey: ["/api/programs"],
  });

  const { data: links } = useQuery({
    queryKey: ["/api/links"],
  });

  const activePrograms = programs?.filter((p: any) => p.status === "active") || [];

  const exportData = () => {
    // Create CSV data
    const csvData = [
      ["Program", "Clicks", "Conversions", "Conv. Rate", "Earnings", "EPC"],
      ...activePrograms.map((program: any) => {
        const programLinks = links?.filter((link: any) => link.programId === program.id) || [];
        const totalClicks = programLinks.reduce((sum: number, link: any) => sum + (link.clicks || 0), 0);
        const totalConversions = programLinks.reduce((sum: number, link: any) => sum + (link.conversions || 0), 0);
        const totalEarnings = programLinks.reduce((sum: number, link: any) => sum + parseFloat(link.earnings || "0"), 0);
        const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : "0.0";
        const epc = totalClicks > 0 ? (totalEarnings / totalClicks).toFixed(2) : "0.00";
        
        return [
          program.name,
          totalClicks.toString(),
          totalConversions.toString(),
          `${conversionRate}%`,
          `$${totalEarnings.toFixed(2)}`,
          `$${epc}`,
        ];
      }),
    ];

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `affiliate-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (statsLoading || programsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-64"></div>
          <div className="h-32 bg-slate-200 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-slate-200 rounded"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-slate-900 mb-6">Analytics & Reports</h3>

      {/* Date Range Selector */}
      <Card className="mb-6 border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-slate-900">Performance Overview</h4>
            <div className="flex items-center space-x-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">This year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportData} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <EarningsChart />
        
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <span className="text-blue-800 font-medium">Total Clicks</span>
                <span className="text-blue-900 font-bold">
                  {stats?.totalClicks?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <span className="text-yellow-800 font-medium">Conversions</span>
                <span className="text-yellow-900 font-bold">
                  {stats?.totalConversions?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <span className="text-green-800 font-medium">Total Earnings</span>
                <span className="text-green-900 font-bold">
                  ${stats?.totalEarnings?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <span className="text-purple-800 font-medium">Conversion Rate</span>
                <span className="text-purple-900 font-bold">
                  {stats?.conversionRate?.toFixed(1) || '0.0'}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Table */}
      <Card className="border border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            Program Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {activePrograms.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-medium text-slate-500">Program</TableHead>
                  <TableHead className="font-medium text-slate-500">Links</TableHead>
                  <TableHead className="font-medium text-slate-500">Clicks</TableHead>
                  <TableHead className="font-medium text-slate-500">Conversions</TableHead>
                  <TableHead className="font-medium text-slate-500">Conv. Rate</TableHead>
                  <TableHead className="font-medium text-slate-500">Earnings</TableHead>
                  <TableHead className="font-medium text-slate-500">EPC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activePrograms.map((program: any) => {
                  const programLinks = links?.filter((link: any) => link.programId === program.id) || [];
                  const totalClicks = programLinks.reduce((sum: number, link: any) => sum + (link.clicks || 0), 0);
                  const totalConversions = programLinks.reduce((sum: number, link: any) => sum + (link.conversions || 0), 0);
                  const totalEarnings = programLinks.reduce((sum: number, link: any) => sum + parseFloat(link.earnings || "0"), 0);
                  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
                  const epc = totalClicks > 0 ? totalEarnings / totalClicks : 0;

                  return (
                    <TableRow key={program.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary rounded-lg mr-3 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {program.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-slate-900">{program.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-900">{programLinks.length}</TableCell>
                      <TableCell className="text-slate-900">{totalClicks.toLocaleString()}</TableCell>
                      <TableCell className="text-slate-900">{totalConversions.toLocaleString()}</TableCell>
                      <TableCell className="text-slate-900">{conversionRate.toFixed(1)}%</TableCell>
                      <TableCell className="font-medium text-green-600">
                        ${totalEarnings.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-slate-900">${epc.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No data to analyze</h3>
              <p className="text-slate-500">
                Add some affiliate programs and links to see your performance analytics
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
