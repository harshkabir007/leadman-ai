"use client";

import { useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { Loader2, Users, Mail, MailOpen, MousePointerClick, Activity } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardData {
  total_leads: number;
  emails_sent: number;
  emails_opened: number;
  emails_not_opened: number;
  link_clicks: number;
  open_rate: number;
  click_rate: number;
  todays_leads: number;
  weekly_leads: number;
  monthly_leads: number;
  daily_chart_labels: string[];
  daily_chart_data: number[];
  category_labels: string[];
  category_data: number[];
}

export default function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/dashboard/');
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600 w-10 h-10" /></div>;
  }

  if (!data) return <div>Failed to load dashboard data</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Here&apos;s what&apos;s happening with your leads today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Leads" value={data.total_leads} icon={<Users className="w-5 h-5" />} color="indigo" />
        <KPICard title="Emails Sent" value={data.emails_sent} icon={<Mail className="w-5 h-5" />} color="blue" />
        <KPICard title="Open Rate" value={`${data.open_rate.toFixed(1)}%`} icon={<MailOpen className="w-5 h-5" />} color="emerald" />
        <KPICard title="Click Rate" value={`${data.click_rate.toFixed(1)}%`} icon={<MousePointerClick className="w-5 h-5" />} color="purple" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Today's Leads" value={data.todays_leads} icon={<Activity className="w-5 h-5" />} color="orange" />
        <KPICard title="Weekly Leads" value={data.weekly_leads} icon={<Activity className="w-5 h-5" />} color="amber" />
        <KPICard title="Monthly Leads" value={data.monthly_leads} icon={<Activity className="w-5 h-5" />} color="yellow" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Leads Over Time (Last 30 Days)</h3>
          <div className="h-72">
            <Line 
              data={{
                labels: data.daily_chart_labels,
                datasets: [
                  {
                    label: 'Leads',
                    data: data.daily_chart_data,
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    fill: true,
                    tension: 0.4,
                  }
                ]
              }} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, grid: { color: 'rgba(156, 163, 175, 0.1)' } },
                  x: { grid: { display: false } }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Lead Categories (AI Classified)</h3>
          <div className="h-72 relative flex items-center justify-center">
            {data.category_labels.length > 0 ? (
              <Doughnut 
                data={{
                  labels: data.category_labels,
                  datasets: [{
                    data: data.category_data,
                    backgroundColor: [
                      '#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'
                    ],
                    borderWidth: 0,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 12, padding: 15 } }
                  },
                  cutout: '70%',
                }}
              />
            ) : (
              <p className="text-gray-400">No category data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, color }: { title: string, value: string | number, icon: ReactNode, color: string }) {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${colorMap[color] || colorMap.indigo}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  );
}
