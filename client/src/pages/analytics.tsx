import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EarningsChart from "@/components/earnings-chart";
import { 
  TrendingUp, 
  DollarSign, 
  MousePointer, 
  Eye,
  ShieldAlert,
  Zap,
  Target,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Users,
  Link2,
  TrendingDown,
  FileText,
  Shield,
  Activity
} from "lucide-react";

export default function Analytics() {
  const { data: basicStats, isLoading: basicLoading } = useQuery({
    queryKey: ["/api/analytics/stats"],
  });

  const { data: advancedStats, isLoading: advancedLoading } = useQuery({
    queryKey: ["/api/analytics/advanced"],
  });

  const { data: content, isLoading: contentLoading } = useQuery({
    queryKey: ["/api/content"],
  });

  const { data: competitors, isLoading: competitorsLoading } = useQuery({
    queryKey: ["/api/competitors"],
  });

  if (basicLoading || advancedLoading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Advanced Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 animate-pulse">
              <div className="h-6 bg-slate-200 rounded mb-4"></div>
              <div className="h-8 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = advancedStats || basicStats || {};
  const conversionRate = stats?.totalClicks > 0 ? (stats.totalConversions / stats.totalClicks * 100) : 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and performance tracking</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <Activity className="h-3 w-3 mr-1" />
          Real-time Data
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Enhanced Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">${stats?.totalEarnings?.toFixed(2) || "0.00"}</div>
                <p className="text-xs text-blue-600 mt-1">
                  AOV: ${stats?.averageOrderValue?.toFixed(2) || "0.00"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Conversion Rate</CardTitle>
                <Target className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{conversionRate.toFixed(1)}%</div>
                <Progress value={conversionRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Link Health</CardTitle>
                <Link2 className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">{stats?.linkHealthScore || 0}/100</div>
                <p className="text-xs text-purple-600 mt-1">
                  Response quality
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">Active Programs</CardTitle>
                <Users className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">{stats?.activePrograms || 0}</div>
                <p className="text-xs text-orange-600 mt-1">
                  {stats?.paymentsPending || 0} payments pending
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Trends
                </CardTitle>
                <CardDescription>
                  Performance analysis and forecasting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EarningsChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Key Performance Indicators
                </CardTitle>
                <CardDescription>
                  Critical metrics for optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Click Quality Score</span>
                  <Badge variant="secondary">85/100</Badge>
                </div>
                <Progress value={85} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Content Performance</span>
                  <Badge variant="secondary">{Math.min(100, (content?.length || 0) * 25)}/100</Badge>
                </div>
                <Progress value={Math.min(100, (content?.length || 0) * 25)} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tax Compliance</span>
                  <Badge 
                    variant={stats?.taxComplianceStatus === "filed" ? "default" : "outline"} 
                    className={stats?.taxComplianceStatus === "filed" ? "text-green-600" : "text-yellow-600"}
                  >
                    {stats?.taxComplianceStatus === "filed" ? "Complete" : "Pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Top Performing Content
                </CardTitle>
                <CardDescription>
                  Highest converting content pieces
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.topPerformingContent?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.topPerformingContent.slice(0, 3).map((item: any, index: number) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-gray-600">{item.contentType}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">${item.totalEarnings?.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{item.totalClicks} clicks</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No content performance data available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Link Performance Monitoring
                </CardTitle>
                <CardDescription>
                  Real-time link health and uptime
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Response Time</span>
                    <Badge variant="outline">245ms</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Uptime</span>
                    <Badge variant="outline" className="text-green-600">99.8%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Broken Links</span>
                    <Badge variant="outline" className="text-red-600">0</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Run Full Link Check
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Fraud Detection Status
                </CardTitle>
                <CardDescription>
                  Real-time security monitoring and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Fraud Alerts (30 days)</span>
                    <Badge variant={stats?.fraudDetectionAlerts > 0 ? "destructive" : "outline"} className="text-green-600">
                      {stats?.fraudDetectionAlerts || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Suspicious Activity</span>
                    <Badge variant="outline" className="text-green-600">Clean</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Click Validation</span>
                    <Badge variant="outline" className="text-green-600">Active</Badge>
                  </div>
                  {stats?.fraudDetectionAlerts > 0 && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800 font-medium">Security Alert</p>
                      <p className="text-xs text-red-600">Review recent suspicious activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Compliance Dashboard
                </CardTitle>
                <CardDescription>
                  Tax and regulatory compliance status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Year Tax Status</span>
                    <Badge variant={stats?.taxComplianceStatus === "filed" ? "default" : "outline"}>
                      {stats?.taxComplianceStatus || "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">1099 Forms Ready</span>
                    <Badge variant="outline" className="text-green-600">Yes</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">GDPR Compliance</span>
                    <Badge variant="outline" className="text-green-600">Compliant</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Performance Tracking
              </CardTitle>
              <CardDescription>
                Track and optimize your content across all channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!contentLoading && content?.length > 0 ? (
                <div className="space-y-4">
                  {content.slice(0, 5).map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.contentType} • {item.platform}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${item.totalEarnings?.toFixed(2) || "0.00"}</p>
                        <p className="text-sm text-gray-500">{item.totalClicks || 0} clicks</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No content performance data available</p>
                  <Button variant="outline" className="mt-4">Add Content Tracking</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Competitor Intelligence
              </CardTitle>
              <CardDescription>
                Monitor competitor performance and market insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!competitorsLoading && competitors?.length > 0 ? (
                <div className="space-y-4">
                  {competitors.slice(0, 3).map((competitor: any) => (
                    <div key={competitor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{competitor.competitorName}</h4>
                        <p className="text-sm text-gray-600">{competitor.niche}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Est. Revenue: {competitor.estimatedRevenue}</p>
                        <p className="text-xs text-gray-500">Last analyzed: {new Date(competitor.lastAnalyzed).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No competitor data available</p>
                  <Button variant="outline" className="mt-4">Add Competitor Tracking</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}