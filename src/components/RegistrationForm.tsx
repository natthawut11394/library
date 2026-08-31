import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  CLASS_LEVELS,
  ACTIVITY_OPTIONS,
  type LibraryVisit,
} from '@/types';
import {
  BookOpen,
  Lightbulb,
  ArrowLeftRight,
  Globe,
  Sparkles,
  Save,
  CheckCircle2,
  Loader2,
  User,
  Hash,
  GraduationCap,
  ClipboardList,
} from 'lucide-react';

interface RegistrationFormProps {
  onSaved: (visit: LibraryVisit) => void;
}

const activityIconMap: Record<string, typeof BookOpen> = {
  'อ่านหนังสือ': BookOpen,
  'สร้างสิ่งประดิษฐ์': Lightbulb,
  'ยืม-คืน หนังสือ': ArrowLeftRight,
  'สืบค้นผ่านอินเทอร์เน็ต': Globe,
  'กิจกรรมอื่นๆ': Sparkles,
};

export default function RegistrationForm({ onSaved }: RegistrationFormProps) {
  const [nickname, setNickname] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTeacher = classLevel === 'ครู/บุคลากร';

  const toggleActivity = (activity: string) => {
    setActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nickname.trim()) {
      setError('กรุณากรอกชื่อเล่น');
      return;
    }
    if (!classLevel) {
      setError('กรุณาเลือกระดับชั้น');
      return;
    }
    if (!isTeacher && !studentNumber.trim()) {
      setError('กรุณากรอกเลขที่');
      return;
    }
    if (activities.length === 0) {
      setError('กรุณาเลือกกิจกรรมอย่างน้อย 1 อย่าง');
      return;
    }

    setSaving(true);
    const payload = {
      nickname: nickname.trim(),
      class_level: classLevel,
      student_number: isTeacher ? null : parseInt(studentNumber, 10),
      activities,
    };

    const { data, error: insertError } = await supabase
      .from('library_visits')
      .insert(payload)
      .select()
      .single();

    setSaving(false);

    if (insertError || !data) {
      setError('เกิดข้อผิดพลาดในการบันทึก กรุณาลองอีกครั้ง');
      return;
    }

    setSuccess(true);
    onSaved(data as LibraryVisit);

    setTimeout(() => {
      setSuccess(false);
      setNickname('');
      setClassLevel('');
      setStudentNumber('');
      setActivities([]);
    }, 2500);
  };

  return (
    <div className="animate-fade-in-up">
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-900/20 backdrop-blur-sm animate-fade-in">
          <div className="animate-scale-in rounded-3xl bg-white px-12 py-10 shadow-2xl ring-1 ring-teal-100">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-teal-400/30" />
                <CheckCircle2 className="relative h-20 w-20 text-teal-500" strokeWidth={1.5} />
              </div>
              <p className="text-2xl font-semibold text-teal-700">บันทึกเรียบร้อย</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-100">
          {/* Form header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">แบบฟอร์มลงทะเบียน</h2>
                <p className="text-sm text-teal-50">กรอกข้อมูลเพื่อลงทะเบียนเข้าใช้ห้องสมุด</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-8">
            {/* Nickname */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <User className="h-4 w-4 text-teal-500" />
                ชื่อเล่น
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="กรอกชื่อเล่น"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
              />
            </div>

            {/* Class level + Student number */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <GraduationCap className="h-4 w-4 text-teal-500" />
                  ชั้น
                </label>
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                >
                  <option value="" disabled>เลือกชั้น</option>
                  {CLASS_LEVELS.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Hash className="h-4 w-4 text-teal-500" />
                  เลขที่
                </label>
                <input
                  type="number"
                  value={isTeacher ? '' : studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  disabled={isTeacher}
                  placeholder={isTeacher ? 'ไม่ต้องระบุ' : 'กรอกเลขที่'}
                  className={`w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all ${
                    isTeacher
                      ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                      : 'bg-slate-50 text-slate-800 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100'
                  }`}
                />
              </div>
            </div>

            {/* Activities */}
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700">
                กิจกรรมที่ทำ
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {ACTIVITY_OPTIONS.map((activity) => {
                  const Icon = activityIconMap[activity];
                  const checked = activities.includes(activity);
                  return (
                    <button
                      key={activity}
                      type="button"
                      onClick={() => toggleActivity(activity)}
                      className={`group flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
                        checked
                          ? 'border-teal-400 bg-teal-50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/50'
                      }`}
                    >
                      <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                        checked ? 'border-teal-500 bg-teal-500' : 'border-slate-300 group-hover:border-teal-300'
                      }`}>
                        {checked && <CheckCircle2 className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                      </div>
                      <Icon className={`h-5 w-5 flex-shrink-0 ${checked ? 'text-teal-600' : 'text-slate-400'}`} />
                      <span className={`text-sm font-medium ${checked ? 'text-teal-700' : 'text-slate-600'}`}>
                        {activity}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="animate-fade-in rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 ring-1 ring-red-100">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 py-4 text-base font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl hover:shadow-teal-500/30 hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  บันทึก
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
