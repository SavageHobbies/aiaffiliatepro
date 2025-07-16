import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  MousePointer, 
  Target, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Users,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Plus
} from "lucide-react";
import { Link } from "wouter";
import type { AffiliateProgram } from "@shared/schema";

export default function DashboardOverview() {
  const [timeRange, setTimeRange] = useState("30d");

  const { data: programs } = useQuery<AffiliateProgram[]>({
    queryKey: ["/api/programs"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/analytics/stats"],
    enabled: !!programs,
  });

  const { data: performance } = useQuery({
    queryKey: ["/api/analytics/performance"],
    enabled: !!programs,
  });

  const activePrograms = programs?.filter(p => p.status === 'active') || [];
  const pendingPrograms = programs?.filter(p => p.status === 'pending') || [];
  const syncEnabledPrograms = programs?.filter(p => p.syncEnabled) || [];
  const recentSyncs = programs?.filter(p => p.lastDataSync && 
    new Date(p.lastDataSync) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ) || [];

  const conversionRate = stats?.conversionRate || 0;
  const isPositiveTrend = conversionRate > 2;

  // Mock data for demonstration
  const topPerformers = activePrograms.slice(0, 5).map((program, index) => ({
    ...program,
    earnings: Math.random() * 1000,
    clicks: Math.floor(Math.random() * 5000),
    conversions: Math.floor(Math.random() * 100),
    trend: Math.random() > 0.5 ? 'up' : 'down',
    trendValue: Math.random() * 20
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-600 mt-1">Track your affiliate marketing performance at a glance</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 days
          </Button>
          <Link href="/programs">
            <Button className="bg-primary hover:bg-primary-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Program
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-slate-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Earnings</p>
                <p className="text-3xl font-bold text-green-900">
                  ${stats?.totalEarnings?.toFixed(2) || '0.00'}
                </p>
                <div className="flex items-center mt-2">
                  {isPositiveTrend ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositiveTrend ? '+12.5%' : '-2.3%'} vs last month
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-200 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Clicks</p>
                <p className="text-3xl font-bold text-blue-900">
                  {stats?.totalClicks?.toLocaleString() || '0'}
                </p>
                <div className="flex items-center mt-2">
                  <Activity className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-sm text-blue-600">
                    {stats?.totalConversions || 0} conversions
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-200 rounded-xl flex items-center justify-center">
                <MousePointer className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Conversion Rate</p>
                <p className="text-3xl font-bold text-purple-900">
                  {conversionRate.toFixed(1)}%
                </p>
                <div className="mt-2">
                  <Progress value={conversionRate} className="h-2" />
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-200 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Active Programs</p>
                <p className="text-3xl font-bold text-orange-900">
                  {activePrograms.length}
                </p>
                <div className="flex items-center mt-2">
                  <Users className="h-4 w-4 text-orange-600 mr-1" />
                  <span className="text-sm text-orange-600">
                    {syncEnabledPrograms.length} auto-sync enabled
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-200 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Programs */}
            <Card className="border border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Top Performing Programs
                </CardTitle>
                <Link href="/programs">
                  <Button variant="ghost" size="sm">
                    View All <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((program, index) => (
                    <div key={program.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {program.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{program.name}</p>
                          <p className="text-sm text-slate-500">{program.network || 'Direct'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          ${program.earnings.toFixed(2)}
                        </p>
                        <div className="flex items-center">
                          {program.trend === 'up' ? (
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          <span className={`text-xs ${program.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {program.trendValue.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {topPerformers.length === 0 && (
                    <p className="text-center text-slate-500 py-8">
                      No active programs yet. Add some programs to see performance data.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Recent Sync Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSyncs.slice(0, 5).map((program) => (
                    <div key={program.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-slate-900">{program.name}</p>
                          <p className="text-sm text-slate-500">
                            Synced {program.lastDataSync ? 
                              new Date(program.lastDataSync).toLocaleTimeString() : 'Never'
                            }
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Success
                      </Badge>
                    </div>
                  ))}
                  {recentSyncs.length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500">No recent sync activity</p>
                      <p className="text-sm text-slate-400">Enable auto-sync on your programs</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/programs">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2 hover:bg-primary hover:text-white transition-all duration-200">
                    <Plus className="h-6 w-6" />
                    <span>Add New Program</span>
                  </Button>
                </Link>
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-500 hover:text-white transition-all duration-200">
                  <RefreshCw className="h-6 w-6" />
                  <span>Sync All Data</span>
                </Button>
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2 hover:bg-green-500 hover:text-white transition-all duration-200">
                  <BarChart3 className="h-6 w-6" />
                  <span>View Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <p>Performance chart would go here</p>
                    <p className="text-sm text-slate-400">Connect to analytics service</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle>Network Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Amazon Associates', 'ShareASale', 'CJ Affiliate', 'Direct'].map((network) => {
                    const count = programs?.filter(p => p.network === network || (network === 'Direct' && !p.network)).length || 0;
                    const percentage = programs?.length ? (count / programs.length) * 100 : 0;
                    
                    return (
                      <div key={network} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-slate-700">{network}</span>
                          <span className="text-slate-500">{count} programs</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Program Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Active</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{activePrograms.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Pending</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">{pendingPrograms.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Auto-Sync Enabled</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">{syncEnabledPrograms.length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Sync Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {recentSyncs.length}/{syncEnabledPrograms.length}
                    </div>
                    <p className="text-sm text-slate-500">Programs synced today</p>
                  </div>
                  <Progress 
                    value={syncEnabledPrograms.length > 0 ? (recentSyncs.length / syncEnabledPrograms.length) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {programs?.length || 0}
                    </div>
                    <p className="text-sm text-slate-500">Total Programs</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {conversionRate.toFixed(1)}%
                    </div>
                    <p className="text-sm text-slate-500">Avg. Conversion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="border border-slate-200">
            <CardHeader>
              <CardTitle>Recent Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {programs?.slice(0, 10).map((program, index) => (
                  <div key={program.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        Program "{program.name}" was {program.status === 'active' ? 'activated' : 'created'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {program.createdAt ? new Date(program.createdAt).toLocaleString() : 'Recently'}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {program.status}
                    </Badge>
                  </div>
                ))}
                {(!programs || programs.length === 0) && (
                  <div className="text-center py-8">
                    <Activity className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-500">No activity yet</p>
                    <p className="text-sm text-slate-400">Start by adding your first program</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}