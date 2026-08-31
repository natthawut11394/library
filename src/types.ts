export interface LibraryVisit {
  id: string;
  nickname: string;
  class_level: string;
  student_number: number | null;
  activities: string[];
  created_at: string;
}

export const CLASS_LEVELS = [
  'อนุบาล 1',
  'อนุบาล 2',
  'อนุบาล 3',
  'ป.1',
  'ป.2',
  'ป.3',
  'ป.4',
  'ป.5',
  'ป.6',
  'ครู/บุคลากร',
] as const;

export const ACTIVITY_OPTIONS = [
  'อ่านหนังสือ',
  'สร้างสิ่งประดิษฐ์',
  'ยืม-คืน หนังสือ',
  'สืบค้นผ่านอินเทอร์เน็ต',
  'กิจกรรมอื่นๆ',
] as const;

export const ACTIVITY_ICONS: Record<string, string> = {
  'อ่านหนังสือ': 'BookOpen',
  'สร้างสิ่งประดิษฐ์': 'Lightbulb',
  'ยืม-คืน หนังสือ': 'ArrowLeftRight',
  'สืบค้นผ่านอินเทอร์เน็ต': 'Globe',
  'กิจกรรมอื่นๆ': 'Sparkles',
};
