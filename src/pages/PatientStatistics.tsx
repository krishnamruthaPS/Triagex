import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, UserCheck, UserX, AlertTriangle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

// Fallback mock data (used when no live data available)
const fallbackCriticalityTrend = [
  { hour: "8 AM", avgCriticality: 5.5, patientCount: 5 },
  { hour: "10 AM", avgCriticality: 6.1, patientCount: 7 },
  { hour: "12 PM", avgCriticality: 6.8, patientCount: 10 },
];
const fallbackCriticalityDistribution = [
  { range: "1-2", count: 0, severity: "Low" },
  { range: "3-4", count: 0, severity: "Mild" },
  { range: "5-6", count: 0, severity: "Moderate" },
  { range: "7-8", count: 0, severity: "High" },
  { range: "9-10", count: 0, severity: "Critical" },
];
const fallbackPatientTypes = [
  { type: 'Pediatric', count: 0, percentage: 0 },
  { type: 'Adult', count: 0, percentage: 0 },
  { type: 'Elderly', count: 0, percentage: 0 }
];
const fallbackAdmission = [
  { time: '0-6', accepted: 0, rejected: 0 },
  { time: '6-12', accepted: 0, rejected: 0 },
  { time: '12-18', accepted: 0, rejected: 0 },
  { time: '18-24', accepted: 0, rejected: 0 }
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

interface AlertDoc {
  _id: string;
  createdAt: string;
  priority?: 'critical' | 'serious' | 'moderate';
  aiScore?: number;
  status?: string; // pending, acknowledged, arrived, cancelled
  patientSnapshot?: { age?: number; gender?: string; };
}

const PatientStatistics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<AlertDoc[]>([]);
  const navigate = useNavigate();

  // fetch hospital auth + alerts
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await fetch('http://localhost:5001/auth/me', { credentials: 'include' });
        if (me.status === 401) { navigate('/login'); return; }
        const meJson = await me.json();
        if (!meJson.hospital) {
          setError('Not a hospital account.');
          return;
        }
        const res = await fetch('http://localhost:5001/api/alerts/incoming', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load alerts');
        const data = await res.json();
        if (mounted) setAlerts(data);
      } catch (e:any) {
        if (mounted) setError(e.message);
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [navigate]);

  // Derived metrics
  const {
    criticalityTrend,
    criticalityDistribution,
    patientTypes,
    admissionData,
    totalPatients,
    avgCriticality,
    acceptanceRate,
    criticalCases,
    acceptedCount,
    rejectedCount
  } = useMemo(() => {
    if (!alerts.length) {
      return {
        criticalityTrend: fallbackCriticalityTrend,
        criticalityDistribution: fallbackCriticalityDistribution,
        patientTypes: fallbackPatientTypes,
        admissionData: fallbackAdmission,
        totalPatients: 0,
        avgCriticality: 0,
        acceptanceRate: 0,
        criticalCases: 0,
        acceptedCount: 0,
        rejectedCount: 0
      };
    }

    const scores: number[] = [];
    const distBuckets = [0,0,0,0,0]; // 1-2,3-4,5-6,7-8,9-10
    const hourMap: Record<string,{sum:number;count:number;patients:number}> = {};
    let accepted = 0, rejected = 0, criticalCaseCount = 0;
    let peds=0, adults=0, elders=0;

    alerts.forEach(a => {
      const rawScore = typeof a.aiScore === 'number' ? a.aiScore : (a.priority === 'critical' ? 9 : a.priority === 'serious' ? 6 : 3);
      scores.push(rawScore);
      if (rawScore >=9) { criticalCaseCount++; }
      // buckets
      if (rawScore <=2) distBuckets[0]++; else if (rawScore <=4) distBuckets[1]++; else if (rawScore <=6) distBuckets[2]++; else if (rawScore <=8) distBuckets[3]++; else distBuckets[4]++;
      // admission status mapping
      if (a.status === 'cancelled') rejected++; else accepted++;
      // patient type from age
      const age = a.patientSnapshot?.age;
      if (typeof age === 'number') {
        if (age < 18) peds++; else if (age >= 65) elders++; else adults++;
      }
      // hour trend (local hour to 12h label)
      const h = new Date(a.createdAt).getHours();
      const hourLabel = ((h % 12) || 12) + ' ' + (h < 12 ? 'AM' : 'PM');
      if (!hourMap[hourLabel]) hourMap[hourLabel] = { sum:0, count:0, patients:0 };
      hourMap[hourLabel].sum += rawScore;
      hourMap[hourLabel].count++;
      hourMap[hourLabel].patients++;
    });

    const avgCriticality = scores.reduce((a,b)=>a+b,0) / scores.length;
    const acceptanceRate = accepted + rejected === 0 ? 0 : (accepted / (accepted + rejected)) * 100;
    // build distributions
    const criticalityDistribution = [
      { range: '1-2', count: distBuckets[0], severity: 'Low' },
      { range: '3-4', count: distBuckets[1], severity: 'Mild' },
      { range: '5-6', count: distBuckets[2], severity: 'Moderate' },
      { range: '7-8', count: distBuckets[3], severity: 'High' },
      { range: '9-10', count: distBuckets[4], severity: 'Critical' },
    ];
    const typeTotal = peds + adults + elders || 1;
    const patientTypes = [
      { type: 'Pediatric', count: peds, percentage: Math.round((peds/typeTotal)*100) },
      { type: 'Adult', count: adults, percentage: Math.round((adults/typeTotal)*100) },
      { type: 'Elderly', count: elders, percentage: Math.round((elders/typeTotal)*100) },
    ];
    // admission time blocks (6-hour windows)
    const blocks = [0,0,0,0];
    const blocksRejected = [0,0,0,0];
    alerts.forEach(a => {
      const h = new Date(a.createdAt).getHours();
      const idx = Math.min(3, Math.floor(h/6));
      if (a.status === 'cancelled') blocksRejected[idx]++; else blocks[idx]++;
    });
    const admissionData = [
      { time: '0-6', accepted: blocks[0], rejected: blocksRejected[0] },
      { time: '6-12', accepted: blocks[1], rejected: blocksRejected[1] },
      { time: '12-18', accepted: blocks[2], rejected: blocksRejected[2] },
      { time: '18-24', accepted: blocks[3], rejected: blocksRejected[3] },
    ];
    // Hour trend sorted by chronological order of 24h hours present
    const hourOrder = Object.keys(hourMap).sort((a,b)=>{
      const pa = parseInt(a); const pb = parseInt(b); // 12 AM case handled by parseInt
      // convert to 24h for sort
      const to24 = (label:string, parsed:number) => label.includes('AM') ? (parsed === 12 ? 0 : parsed) : (parsed === 12 ? 12 : parsed+12);
      return to24(a,pa) - to24(b,pb);
    });
    const criticalityTrend = hourOrder.map(h => ({ hour: h, avgCriticality: +(hourMap[h].sum / hourMap[h].count).toFixed(2), patientCount: hourMap[h].patients }));

    return {
      criticalityTrend: criticalityTrend.length ? criticalityTrend : fallbackCriticalityTrend,
      criticalityDistribution,
      patientTypes,
      admissionData,
      totalPatients: alerts.length,
      avgCriticality: +avgCriticality.toFixed(1),
      acceptanceRate: +acceptanceRate.toFixed(1),
      criticalCases: criticalCaseCount,
      acceptedCount: accepted,
      rejectedCount: rejected
    };
  }, [alerts]);

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
              Real-time overview of today's hospital patient metrics
            </p>
            {loading && <p className="text-sm text-gray-500">Loading live data...</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          {/* Key Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Today's Patients" value={String(totalPatients)} description="Alerts received today" icon={Users} />
            <StatCard title="Average Criticality" value={avgCriticality.toString()} description="Avg AI / severity score" icon={AlertTriangle} />
            <StatCard title="Acceptance Rate" value={acceptanceRate.toFixed(1) + '%'} description="Accepted vs cancelled" icon={UserCheck} />
            <StatCard title="Critical Cases" value={String(criticalCases)} description="Score 9-10" icon={UserX} />
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
                  <LineChart data={criticalityTrend}>
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
                  <BarChart data={criticalityDistribution}>
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
                      {criticalityDistribution.map((entry, index) => (
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
                      data={patientTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill={COLORS[0]}
                      dataKey="count"
                      label={({ type, percentage }) => `${type} ${percentage}%`}
                    >
                      {patientTypes.map((entry, index) => (
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
                  <BarChart data={admissionData}>
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
                    {criticalityDistribution.map((item) => (
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
                    {patientTypes.map((item) => (
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
                      <span className="font-medium text-success">{acceptedCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Today's Rejected
                      </span>
                      <span className="font-medium text-warning">{rejectedCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Today's Acceptance Rate
                      </span>
                      <span className="font-medium text-foreground">{acceptanceRate.toFixed(1)}%</span>
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
