"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  BarChart,
  PieChart,
  Line,
  Bar,
  Pie,
  CartesianGrid,
  CartesianAxis,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface DashboardData {
  totalEnquiries: number;
  activeEnquiries: number;
  enquiriesOverTime: { date: string; count: number }[];
  topicCounts: { topic: string; count: number }[];
  leadQuality: { quality: string; count: number }[];
  outcomeCounts: { outcome: string; count: number }[];
  unanswered: { topic: string; count: number }[];
  hourly: { hour: string; count: number }[];
  conversionRate: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-2xl text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <p className="text-gray-500">
          No data yet. Start chatting with visitors to see insights here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">
        Real-time insights from your visitor conversations
      </p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Total Enquiries"
          value={data.totalEnquiries.toString()}
          icon="📋"
        />
        <KpiCard
          label="Active Now"
          value={data.activeEnquiries.toString()}
          icon="🟢"
        />
        <KpiCard
          label="Conversion Rate"
          value={`${data.conversionRate}%`}
          icon="📈"
        />
        <KpiCard
          label="Unanswered"
          value={data.unanswered.reduce((s: number, t: { count: number }) => s + t.count, 0).toString()}
          icon="❓"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Enquiries over time */}
        <ChartCard title="Enquiries Over Time">
          <div className="w-full h-64">
            <LineChart data={data.enquiriesOverTime.map((d) => ({ date: d.date, count: d.count }))}>
              <CartesianGrid />
              <CartesianAxis />
              <XAxis dataKey="date" />
              <YAxis />
              <Line dataKey="count" />
              <Tooltip />
            </LineChart>
          </div>
        </ChartCard>

        {/* Top topics */}
        <ChartCard title="Top Topics">
          <div className="w-full h-64">
            <BarChart data={data.topicCounts.map((t) => ({ topic: t.topic, count: t.count }))}>
              <CartesianGrid />
              <CartesianAxis />
              <XAxis dataKey="topic" />
              <YAxis />
              <Bar dataKey="count" />
              <Tooltip />
            </BarChart>
          </div>
        </ChartCard>

        {/* Lead quality */}
        <ChartCard title="Lead Quality Split">
          <div className="w-full h-64">
            <PieChart data={data.leadQuality.map((q) => ({ name: q.quality, value: q.count }))}>
              <Pie dataKey="value" nameKey="name" />
              <Legend />
              <Tooltip />
            </PieChart>
          </div>
        </ChartCard>

        {/* Outcomes */}
        <ChartCard title="Outcomes">
          <div className="w-full h-64">
            <PieChart data={data.outcomeCounts.map((o) => ({ name: o.outcome, value: o.count }))}>
              <Pie dataKey="value" nameKey="name" />
              <Legend />
              <Tooltip />
            </PieChart>
          </div>
        </ChartCard>

        {/* Peak hours */}
        <ChartCard title="Peak Hours">
          <div className="w-full h-64">
            <BarChart data={data.hourly.map((h) => ({ hour: `${h.hour}:00`, count: h.count }))}>
              <CartesianGrid />
              <CartesianAxis />
              <XAxis dataKey="hour" />
              <YAxis />
              <Bar dataKey="count" />
              <Tooltip />
            </BarChart>
          </div>
        </ChartCard>

        {/* Unanswered questions */}
        <ChartCard title="Unanswered Questions (Most Valuable)">
          {data.unanswered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 px-3">Topic</th>
                    <th className="py-2 px-3">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data.unanswered.map((t) => (
                    <tr key={t.topic} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3">{t.topic}</td>
                      <td className="py-2 px-3 font-semibold">{t.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No unanswered questions — your knowledge base is working well!
            </p>
          )}
        </ChartCard>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}