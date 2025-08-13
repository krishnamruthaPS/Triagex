import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
} from "lucide-react";

// Today's data - hourly breakdown
const todayCriticalityData = [
  { hour: "8 AM", avgCriticality: 5.8, patientCount: 12 },
  { hour: "10 AM", avgCriticality: 6.2, patientCount: 18 },
  { hour: "12 PM", avgCriticality: 7.1, patientCount: 25 },
  { hour: "2 PM", avgCriticality: 6.9, patientCount: 22 },
  { hour: "4 PM", avgCriticality: 6.5, patientCount: 19 },
  { hour: "6 PM", avgCriticality: 6.8, patientCount: 15 },
];

// Today's criticality distribution
const todayCriticalityDistribution = [
  { range: "1-2", count: 8, severity: "Low" },
  { range: "3-4", count: 15, severity: "Mild" },
  { range: "5-6", count: 23, severity: "Moderate" },
  { range: "7-8", count: 18, severity: "High" },
  { range: "9-10", count: 7, severity: "Critical" },
];

// Today's patient types
const todayPatientTypeData = [
  { type: "Pediatric", count: 24, percentage: 34 },
  { type: "Accident", count: 21, percentage: 30 },
  { type: "Elderly", count: 26, percentage: 36 },
];

// Today's admission data - hourly breakdown
const todayAdmissionData = [
  { time: "8-10 AM", accepted: 8, rejected: 1 },
  { time: "10-12 PM", accepted: 12, rejected: 2 },
  { time: "12-2 PM", accepted: 15, rejected: 1 },
  { time: "2-4 PM", accepted: 11, rejected: 2 },
  { time: "4-6 PM", accepted: 9, rejected: 1 },
];

const COLORS = [
  "#2563eb", // blue (primary)
  "#e5e7eb", // light gray (secondary)
  "#f87171", // red (negative)
  "#facc15", // yellow (optional, for variety)
];

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  description: string;
  icon: any;
  trend?: string;
}) => (
  <Card className="shadow-card hover:shadow-medical transition-all duration-300 bg-white border border-gray-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-black">{title}</CardTitle>
      <Icon className="h-4 w-4 text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {trend && (
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          <TrendingUp className="h-3 w-3" />
          {trend}
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

const PatientStatistics = () => {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8 animate-fade-in">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-blue-700">
              Today's Patient Statistics
            </h1>
            <p className="text-lg font-semibold text-red-600">
              Real-time overview of today's hospital patient metrics - August 13
            </p>
          </div>

          {/* Key Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Today's Patients"
              value="71"
              description="Patients treated today"
              icon={Users}
              trend="+5 from yesterday"
            />
            <StatCard
              title="Average Criticality"
              value="6.4"
              description="Today's average score"
              icon={AlertTriangle}
              trend="+0.1 from yesterday"
            />
            <StatCard
              title="Acceptance Rate"
              value="87.5%"
              description="Today's admission rate"
              icon={UserCheck}
              trend="+2.1% from yesterday"
            />
            <StatCard
              title="Critical Cases"
              value="7"
              description="Criticality 9-10 today"
              icon={UserX}
              trend="-2 from yesterday"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Criticality Trend */}
            <Card className="shadow-card bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">
                  Today's Criticality Trend
                </CardTitle>
                <CardDescription>
                  Patient criticality scores throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={todayCriticalityData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="hour"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="avgCriticality"
                      stroke="hsl(var(--chart-primary))"
                      strokeWidth={3}
                      name="Avg Criticality"
                      dot={{
                        fill: "hsl(var(--chart-primary))",
                        strokeWidth: 2,
                        r: 4,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Criticality Distribution */}
            <Card className="shadow-card bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">
                  Criticality Score Distribution
                </CardTitle>
                <CardDescription>
                  Patient count by criticality ranges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={todayCriticalityDistribution}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="range"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      radius={[4, 4, 0, 0]}
                      name="Patient Count"
                    >
                      {todayCriticalityDistribution.map((entry, index) => (
                        <Cell
                          key={`bar-cell-${index}`}
                          fill={index === 4 ? COLORS[2] : COLORS[0]} // red for 'Critical', blue for others
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Patient Types */}
            <Card className="shadow-card bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">
                  Patient Types Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown by patient categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={todayPatientTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill={COLORS[0]}
                      dataKey="count"
                      label={({ type, percentage }) => `${type} ${percentage}%`}
                    >
                      {todayPatientTypeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 1 ? COLORS[2] : COLORS[0]} // red for 'Accident', blue for others
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Admission Stats */}
            <Card className="shadow-card bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">
                  Today's Accepted vs Rejected Patients
                </CardTitle>
                <CardDescription>
                  Hourly admission statistics for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={todayAdmissionData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="time"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="accepted"
                      stackId="a"
                      fill={COLORS[0]}
                      name="Accepted"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="rejected"
                      stackId="a"
                      fill={COLORS[2]}
                      name="Rejected"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Summary Table */}
          <Card className="shadow-card bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Summary Statistics</CardTitle>
              <CardDescription>
                Detailed breakdown of current metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Criticality Summary */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b border-border pb-2">
                    Criticality Ranges
                  </h3>
                  <div className="space-y-2">
                    {todayCriticalityDistribution.map((item) => (
                      <div
                        key={item.range}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-muted-foreground">
                          {item.range} ({item.severity})
                        </span>
                        <span className="font-medium text-foreground">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Patient Types Summary */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b border-border pb-2">
                    Patient Types
                  </h3>
                  <div className="space-y-2">
                    {todayPatientTypeData.map((item) => (
                      <div
                        key={item.type}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-muted-foreground">
                          {item.type}
                        </span>
                        <span className="font-medium text-foreground">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admission Summary */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b border-border pb-2">
                    Admission Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Today's Accepted
                      </span>
                      <span className="font-medium text-success">55</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Today's Rejected
                      </span>
                      <span className="font-medium text-warning">7</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Today's Acceptance Rate
                      </span>
                      <span className="font-medium text-foreground">88.7%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientStatistics;
