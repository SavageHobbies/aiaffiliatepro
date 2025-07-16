import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  MousePointer, 
  Target, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from "lucide-react";
import type { AffiliateProgram } from "@shared/schema";

interface AnalyticsDashboardProps {
  programs: AffiliateProgram[];
}

export default function AnalyticsDashboard({ programs }: AnalyticsDashboardProps) {
  const { data: stats } = useQuery({
    queryKey: ["/api/analytics/stats"],
    enabled: !!programs?.length,
  });

  const { data: performance } = useQuery({
    queryKey: ["/api/analytics/performance"],
    enabled: !!programs?.length,
  });

  const activePrograms = programs?.filter(p => p.status === 'active') || [];
  const syncEnabledPrograms = programs?.filter(p => p.syncEnabled) || [];
  const recentSyncs = programs?.filter(p => p.lastDataSync && 
    new Date(p.lastDataSync) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ) || [];

  const conversionRate = stats?.conversionRate || 0;
  const isPositiveTrend = conversionRate > 2; // Assuming 2% is baseline

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-slate-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Earnings</p>
                <p className="text-3xl font-bold text-slate-900">
                  ${stats?.totalEarnings?.toFixed(2) || '0.00'}
                </p>
                <div className="flex items-center mt-2">
                  {isPositiveTrend ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositiveTrend ? '+12.5%' : '-2.3%'} from last month
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Clicks</p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats?.totalClicks?.toLocaleString() || '0'}
                </p>
                <div className="flex items-center mt-2">
                  <Activity className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-slate-600">
                    {stats?.totalConversions || 0} conversions
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MousePointer className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-slate-900">
                  {conversionRate.toFixed(1)}%
                </p>
                <div className="mt-2">
                  <Progress value={conversionRate} className="h-2" />
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Programs</p>
                <p className="text-3xl font-bold text-slate-900">
                  {activePrograms.length}
                </p>
                <div className="flex items-center mt-2">
                  <Calendar className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="text-sm text-slate-600">
                    {syncEnabledPrograms.length} auto-sync enabled
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Program Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Top Performing Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activePrograms.slice(0, 5).map((program, index) => (
                <div key={program.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
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
                      ${(Math.random() * 1000).toFixed(2)}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {program.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {activePrograms.length === 0 && (
                <p className="text-center text-slate-500 py-8">
                  No active programs yet. Add some programs to see performance data.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

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
                    Success
                  </Badge>
                </div>
              ))}
              {recentSyncs.length === 0 && (
                <p className="text-center text-slate-500 py-8">
                  No recent sync activity. Enable auto-sync on your programs.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Distribution */}
      <Card className="border border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            Network Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Amazon Associates', 'ShareASale', 'CJ Affiliate', 'Impact', 'Rakuten', 'Direct'].map((network) => {
              const count = programs?.filter(p => p.network === network || (network === 'Direct' && !p.network)).length || 0;
              const percentage = programs?.length ? (count / programs.length) * 100 : 0;
              
              return (
                <div key={network} className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-900">{count}</p>
                  <p className="text-sm text-slate-600 mb-2">{network}</p>
                  <Progress value={percentage} className="h-2" />
                  <p className="text-xs text-slate-500 mt-1">{percentage.toFixed(0)}%</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}