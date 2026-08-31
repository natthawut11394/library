import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { LibraryVisit } from '@/types';
import RegistrationForm from '@/components/RegistrationForm';
import HistoryView from '@/components/HistoryView';
import StatsView from '@/components/StatsView';
import { Library, ClipboardList, History, BarChart3 } from 'lucide-react';

type Tab = 'register' | 'history' | 'stats';

export default function App() {
  const [tab, setTab] = useState<Tab>('register');
  const [visits, setVisits] = useState<LibraryVisit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVisits = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('library_visits')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setVisits(data as LibraryVisit[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const handleSaved = (visit: LibraryVisit) => {
    setVisits((prev) => [visit, ...prev]);
  };

  const tabs: { id: Tab; label: string; icon: typeof ClipboardList }[] = [
    { id: 'register', label: 'ลงทะเบียน', icon: ClipboardList },
    { id: 'history', label: 'ประวัติ', icon: History },
    { id: 'stats', label: 'สถิติ', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-10 top-0 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-1/3 top-1/2 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-10 text-center sm:py-14">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-md ring-1 ring-white/20">
              <Library className="h-9 w-9 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            ระบบลงทะเบียนเข้าใช้ห้องสมุด
          </h1>
          <p className="mt-2 text-lg font-medium text-teal-50 sm:text-xl">
            โรงเรียนวัดดาวนาเม๊ค
          </p>
        </div>

        {/* Wave divider */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path
            d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
            fill="rgb(242 248 247)"
            className="fill-slate-50"
          />
        </svg>
      </header>

      {/* Tab navigation */}
      <nav className="sticky top-0 z-30 border-b border-slate-100 bg-slate-50/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-1 px-4 py-3 sm:gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all sm:px-6 ${
                tab === id
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-500/25'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-teal-600'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="px-4 py-8 sm:py-10">
        {tab === 'register' && <RegistrationForm onSaved={handleSaved} />}
        {tab === 'history' && <HistoryView visits={visits} loading={loading} />}
        {tab === 'stats' && <StatsView visits={visits} loading={loading} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        ระบบลงทะเบียนเข้าใช้ห้องสมุด · โรงเรียนวัดดาวนาเม๊ค
      </footer>
    </div>
  );
}
