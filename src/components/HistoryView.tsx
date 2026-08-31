import { useState, useMemo } from 'react';
import type { LibraryVisit } from '@/types';
import {
  BookOpen,
  Lightbulb,
  ArrowLeftRight,
  Globe,
  Sparkles,
  Search,
  Calendar,
  Clock,
  History,
  Inbox,
} from 'lucide-react';

interface HistoryViewProps {
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

const activityColors: Record<string, string> = {
  'อ่านหนังสือ': 'bg-blue-50 text-blue-600 ring-blue-100',
  'สร้างสิ่งประดิษฐ์': 'bg-amber-50 text-amber-600 ring-amber-100',
  'ยืม-คืน หนังสือ': 'bg-purple-50 text-purple-600 ring-purple-100',
  'สืบค้นผ่านอินเทอร์เน็ต': 'bg-cyan-50 text-cyan-600 ring-cyan-100',
  'กิจกรรมอื่นๆ': 'bg-rose-50 text-rose-600 ring-rose-100',
};

function formatThaiDate(iso: string) {
  const d = new Date(iso);
  const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  const months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ];
  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear() + 543;
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} น.`;
  return { dateStr: `${day} ${date} ${month} ${year}`, timeStr: time };
}

export default function HistoryView({ visits, loading }: HistoryViewProps) {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = useMemo(() => {
    return visits.filter((v) => {
      const matchSearch = search
        ? v.nickname.includes(search) ||
          v.class_level.includes(search) ||
          v.activities.some((a) => a.includes(search))
        : true;
      const matchDate = dateFilter
        ? new Date(v.created_at).toISOString().slice(0, 10) === dateFilter
        : true;
      return matchSearch && matchDate;
    });
  }, [visits, search, dateFilter]);

  return (
    <div className="animate-fade-in-up">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100">
            <History className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">ประวัติการเข้าใช้งาน</h2>
            <p className="text-sm text-slate-500">รายการลงทะเบียนทั้งหมด (ใหม่ล่าสุดด้านบน)</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาด้วยชื่อเล่น, ชั้น, กิจกรรม..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all focus:border-teal-400 focus:ring-4 focus:ring-teal-100 sm:w-auto"
            />
          </div>
          {(search || dateFilter) && (
            <button
              onClick={() => { setSearch(''); setDateFilter(''); }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50"
            >
              ล้าง
            </button>
          )}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-teal-200 border-t-teal-500" />
            <p className="mt-4 text-sm">กำลังโหลด...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Inbox className="h-14 w-14" strokeWidth={1} />
            <p className="mt-4 text-sm">
              {visits.length === 0 ? 'ยังไม่มีข้อมูลการเข้าใช้งาน' : 'ไม่พบข้อมูลที่ตรงกับการค้นหา'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((visit, idx) => {
              const { dateStr, timeStr } = formatThaiDate(visit.created_at);
              return (
                <div
                  key={visit.id}
                  className="animate-slide-in-right rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md hover:ring-teal-100"
                  style={{ animationDelay: `${Math.min(idx * 40, 400)}ms`, animationFillMode: 'both' }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 text-lg font-semibold text-white">
                        {visit.nickname.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{visit.nickname}</p>
                        <p className="text-sm text-slate-500">
                          {visit.class_level}
                          {visit.student_number != null && ` · เลขที่ ${visit.student_number}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {dateStr}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {timeStr}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {visit.activities.map((act) => {
                      const Icon = activityIconMap[act] ?? Sparkles;
                      const color = activityColors[act] ?? 'bg-slate-50 text-slate-600 ring-slate-100';
                      return (
                        <span
                          key={act}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ring-1 ${color}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {act}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
