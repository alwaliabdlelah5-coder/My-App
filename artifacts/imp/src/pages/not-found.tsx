import { Link } from 'wouter';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="text-center space-y-8 p-12">
        <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-dashed border-primary/20">
          <AlertCircle className="w-12 h-12 text-primary/60" />
        </div>
        <div className="space-y-3">
          <h1 className="text-7xl font-black text-gray-900 tracking-tighter font-mono">404</h1>
          <h2 className="text-2xl font-black text-gray-700 italic tracking-tighter">الصفحة غير موجودة</h2>
          <p className="text-gray-400 font-bold text-sm max-w-sm mx-auto">
            الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>
        </div>
        <Link href="/">
          <button className="inline-flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all italic tracking-tighter">
            <Home className="w-5 h-5" />
            العودة للرئيسية
          </button>
        </Link>
      </div>
    </div>
  );
}
