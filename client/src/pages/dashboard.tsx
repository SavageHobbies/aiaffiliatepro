import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/stats-card";
import EarningsChart from "@/components/earnings-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  MousePointer, 
  TrendingUp, 
  Handshake,
  CheckCircle,
  UserPlus,
  AlertTriangle
} from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/stats"],
  });

  const { data: programs, isLoading: programsLoading } = useQuery({
    queryKey: ["/api/programs"],
  });

  if (statsLoading || programsLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 animate-pulse">
              <div className="h-12 bg-slate-200 rounded mb-4"></div>
              <div className="h-8 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const topPrograms = programs
    ?.filter((p: any) => p.status === "active")
    ?.slice(0, 3) || [];

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Earnings"
          value={`$${stats?.totalEarnings?.toLocaleString() || '0'}`}
          icon={DollarSign}
          trend="+12.5%"
          trendDirection="up"
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        
        <StatsCard
          title="Total Clicks"
          value={stats?.totalClicks?.toLocaleString() || '0'}
          icon={MousePointer}
          trend="+8.2%"
          trendDirection="up"
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        
        <StatsCard
          title="Conversion Rate"
          value={`${stats?.conversionRate?.toFixed(1) || '0.0'}%`}
          icon={TrendingUp}
          trend="+0.8%"
          trendDirection="up"
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
        
        <StatsCard
          title="Active Programs"
          value={stats?.activePrograms?.toString() || '0'}
          icon={Handshake}
          trend="+3"
          trendDirection="up"
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
        />
      </div>

      {/* Charts and Top Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <EarningsChart />
        
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Top Performing Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPrograms.length > 0 ? (
                topPrograms.map((program: any) => (
                  <div key={program.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary rounded-lg mr-3 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {program.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-slate-900">{program.name}</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {program.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Handshake className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p>No active programs yet</p>
                  <p className="text-sm">Add your first affiliate program to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {programs?.length > 0 ? (
              <>
                <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="text-green-600 mr-4 h-5 w-5" />
                  <div>
                    <p className="font-medium text-slate-900">Dashboard setup complete</p>
                    <p className="text-sm text-slate-600">Welcome to AffiliateHub! Your dashboard is ready.</p>
                  </div>
                  <span className="ml-auto text-sm text-slate-500">Just now</span>
                </div>
                {programs.slice(0, 2).map((program: any) => (
                  <div key={program.id} className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <UserPlus className="text-blue-600 mr-4 h-5 w-5" />
                    <div>
                      <p className="font-medium text-slate-900">Program added</p>
                      <p className="text-sm text-slate-600">{program.name} has been added to your dashboard</p>
                    </div>
                    <span className="ml-auto text-sm text-slate-500">
                      {new Date(program.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="text-yellow-600 mr-4 h-5 w-5" />
                <div>
                  <p className="font-medium text-slate-900">Get started</p>
                  <p className="text-sm text-slate-600">Add your first affiliate program to start tracking your performance</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
