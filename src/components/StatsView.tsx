import { useMemo } from 'react';
import type { LibraryVisit } from '@/types';
import {
  BookOpen,
  Lightbulb,
  ArrowLeftRight,
  Globe,
  Sparkles,
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
} from 'lucide-react';

interface StatsViewProps {
  visits: LibraryVisit[];
  loading: boolean;
}

const activityIconMap: Record<string, typeof BookOpen> = {
  'อ่านหนังสือ': BookOpen,
  'สร้างสิ่งประดิษฐ์': Lightbulb,
  'ยืม-คืน หนังสือ': ArrowLeftRight,
  'สืบค้นผ่านอินเทอร์เน็ต': Globe,
  'กิจกรรมอื่นๆ': Sparkles,
};

const activityBarColors: Record<string, string> = {
  'อ่านหนังสือ': 'from-blue-400 to-blue-500',
  'สร้างสิ่งประดิษฐ์': 'from-amber-400 to-amber-500',
  'ยืม-คืน หนังสือ': 'from-purple-400 to-purple-500',
  'สืบค้นผ่านอินเทอร์เน็ต': 'from-cyan-400 to-cyan-500',
  'กิจกรรมอื่นๆ': 'from-rose-400 to-rose-500',
};

const ACTIVITY_OPTIONS = [
  'อ่านหนังสือ',
  'สร้างสิ่งประดิษฐ์',
  'ยืม-คืน หนังสือ',
  'สืบค้นผ่านอินเทอร์เน็ต',
  'กิจกรรมอื่นๆ',
];

const CLASS_LEVELS = [
  'อนุบาล 1', 'อนุบาล 2', 'อนุบาล 3',
  'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6',
  'ครู/บุคลากร',
];

export default function StatsView({ visits, loading }: StatsViewProps) {
  const stats = useMemo(() => {
    const activityCounts: Record<string, number> = {};
    ACTIVITY_OPTIONS.forEach((a) => (activityCounts[a] = 0));
    const classCounts: Record<string, number> = {};
    CLASS_LEVELS.forEach((c) => (classCounts[c] = 0));

    // last 7 days
    const dayMap: Record<string, number> = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dayMap[key] = 0;
    }

    visits.forEach((v) => {
      v.activities.forEach((a) => {
        if (a in activityCounts) activityCounts[a]++;
      });
      if (v.class_level in classCounts) classCounts[v.class_level]++;
      const key = new Date(v.created_at).toISOString().slice(0, 10);
      if (key in dayMap) dayMap[key]++;
    });

    const maxActivity = Math.max(1, ...Object.values(activityCounts));
    const maxClass = Math.max(1, ...Object.values(classCounts));
    const maxDay = Math.max(1, ...Object.values(dayMap));

    const dayLabels: { label: string; count: number }[] = Object.entries(dayMap).map(([k, count]) => {
      const d = new Date(k);
      const days = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
      return { label: days[d.getDay()], count };
    });

    return {
      total: visits.length,
      activityCounts,
      classCounts,
      maxActivity,
      maxClass,
      dayLabels,
      maxDay,
    };
  }, [visits]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-teal-200 border-t-teal-500" />
        <p className="mt-4 text-sm">กำลังโหลดสถิติ...</p>
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <BarChart3 className="h-14 w-14" strokeWidth={1} />
        <p className="mt-4 text-sm">ยังไม่มีข้อมูลเพื่อแสดงสถิติ</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100">
            <BarChart3 className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">สถิติการใช้งาน</h2>
            <p className="text-sm text-slate-500">ภาพรวมการเข้าใช้ห้องสมุด</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 p-5 text-white shadow-lg shadow-teal-500/20">
            <div className="flex items-center justify-between">
              <p className="text-sm text-teal-50">ผู้เข้าใช้ทั้งหมด</p>
              <Users className="h-5 w-5 text-teal-100" />
            </div>
            <p className="mt-2 text-3xl font-bold">{stats.total}</p>
            <p className="mt-1 text-xs text-teal-100">ครั้ง</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">วันนี้</p>
              <Calendar className="h-5 w-5 text-teal-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-800">{stats.dayLabels[stats.dayLabels.length - 1]?.count ?? 0}</p>
            <p className="mt-1 text-xs text-slate-400">ครั้ง</p>
          </div>
          <div className="col-span-2 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:col-span-1">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">7 วันล่าสุด</p>
              <TrendingUp className="h-5 w-5 text-teal-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-800">
              {stats.dayLabels.reduce((sum, d) => sum + d.count, 0)}
            </p>
            <p className="mt-1 text-xs text-slate-400">ครั้ง</p>
          </div>
        </div>

        {/* 7-day line chart */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">การเข้าใช้งาน 7 วันล่าสุด</h3>
          <div className="flex h-48 items-end justify-between gap-2">
            {stats.dayLabels.map((day, idx) => {
              const heightPct = (day.count / stats.maxDay) * 100;
              return (
                <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">{day.count}</span>
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-teal-400 to-teal-300 transition-all duration-500"
                      style={{ height: `${Math.max(heightPct, 4)}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{day.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity chart */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">สถิติตามกิจกรรม</h3>
          <div className="space-y-3">
            {ACTIVITY_OPTIONS.map((activity) => {
              const count = stats.activityCounts[activity];
              const pct = (count / stats.maxActivity) * 100;
              const Icon = activityIconMap[activity] ?? Sparkles;
              const color = activityBarColors[activity] ?? 'from-slate-400 to-slate-500';
              return (
                <div key={activity} className="flex items-center gap-3">
                  <div className="flex w-44 flex-shrink-0 items-center gap-2">
                    <Icon className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{activity}</span>
                  </div>
                  <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-slate-100">
                    <div
                      className={`h-full rounded-lg bg-gradient-to-r ${color} transition-all duration-700`}
                      style={{ width: `${Math.max(pct, count > 0 ? 6 : 0)}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-semibold text-slate-700">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Class level chart */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">สถิติตามระดับชั้น</h3>
          <div className="space-y-2.5">
            {CLASS_LEVELS.map((level) => {
              const count = stats.classCounts[level];
              const pct = (count / stats.maxClass) * 100;
              return (
                <div key={level} className="flex items-center gap-3">
                  <span className="w-24 flex-shrink-0 text-sm text-slate-600">{level}</span>
                  <div className="relative h-6 flex-1 overflow-hidden rounded-lg bg-slate-100">
                    <div
                      className="h-full rounded-lg bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-700"
                      style={{ width: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-semibold text-slate-700">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
