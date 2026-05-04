'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Stethoscope, 
  ClipboardList, 
  FlaskConical, 
  Settings, 
  LogOut,
  ChevronLeft,
  Search,
  Settings2,
  Tablets,
  CreditCard,
  UserCircle,
  Package,
  TrendingUp,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

import Image from 'next/image';

const navItems: NavItem[] = [
  { name: 'لوحة القيادة', href: '/', icon: LayoutDashboard },
  { name: 'المرضى', href: '/patients', icon: Users },
  { name: 'المواعيد', href: '/appointments', icon: Calendar },
  { name: 'العيادات', href: '/clinic', icon: Stethoscope },
  { name: 'المختبر', href: '/lab', icon: FlaskConical },
  { name: 'القائمة الحية', href: '/queue', icon: ClipboardList },
  { name: 'الصيدلية', href: '/pharmacy', icon: Tablets },
  { name: 'المخزون العام', href: '/inventory', icon: Package },
  { name: 'المالية', href: '/finance', icon: CreditCard },
  { name: 'الموارد البشرية', href: '/hr', icon: Users },
  { name: 'المستخدمين', href: '/users', icon: UserCircle },
  { name: 'التقارير', href: '/reports', icon: Activity },
  { name: 'الإعدادات', href: '/settings', icon: Settings },
];

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !user && pathname !== '/auth') {
      router.push('/auth');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Activity className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!user && pathname !== '/auth') {
    return null;
  }

  const searchResults = [
    { id: 1, name: 'سناء علي عبد الله', file: 'P-1001', phone: '777123456' },
    { id: 2, name: 'محمد حسن صالح', file: 'P-1002', phone: '770987654' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? '80px' : '260px' }}
        className="fixed top-0 right-0 h-full border-l bg-white z-50 overflow-hidden shadow-sm"
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 flex items-center justify-between border-b h-20">
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-black text-2xl text-primary whitespace-nowrap italic tracking-tighter"
              >
                IMP <span className="text-gray-300 font-normal">v1.2</span>
              </motion.span>
            )}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-100 shadow-sm"
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
              >
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </motion.div>
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative",
                    isActive 
                      ? "bg-primary text-white shadow-xl shadow-primary/30" 
                      : "text-gray-600 hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "group-hover:text-primary")} />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="whitespace-nowrap font-bold text-sm"
                    >
                      {item.name}
                    </motion.span>
                  )}
                  {isCollapsed && (
                    <div className="absolute right-full mr-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t mt-auto space-y-2 bg-gray-50/50">
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100",
              )}
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden relative">
                {user?.user_metadata?.avatar_url ? (
                  <Image 
                    src={user.user_metadata.avatar_url} 
                    alt={user.user_metadata.full_name || ''} 
                    fill
                    className="object-cover" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Users className="w-5 h-5 text-primary" />
                )}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-black text-gray-900 truncate max-w-[120px] tracking-tight">
                    {user?.user_metadata?.full_name || 'مستخدم النظام'}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider italic">
                    {user?.email || 'Medical Staff'}
                  </span>
                </div>
              )}
            </Link>
            <button 
              onClick={() => logout()}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-black text-sm italic tracking-tighter"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">تسجيل الخروج</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main 
        className="flex-1 transition-all duration-300 min-h-screen flex flex-col bg-gray-50/30"
        style={{ marginRight: isCollapsed ? '80px' : '260px' }}
      >
        {/* Navbar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b h-24 px-12 flex items-center justify-between">
          <div className="relative w-[500px] max-w-lg group">
            <div className={cn(
              "absolute inset-0 bg-primary/10 blur-2xl transition-all duration-500 opacity-0",
              searchFocused && "opacity-30"
            )} />
            <div className="relative">
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="البحث السريع عن مريض (الاسم، الهاتف، رقم الملف)..." 
                className="w-full bg-white border-2 border-gray-100 rounded-[1.5rem] py-4 pr-14 pl-6 text-base font-bold text-gray-900 focus:border-primary outline-none transition-all shadow-sm"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              />
              
              <AnimatePresence>
                {searchFocused && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white border shadow-2xl rounded-[2rem] overflow-hidden p-3 z-50"
                  >
                    <div className="p-3">
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-3 mb-4 italic">نتائج البحث المقترحة</h4>
                       <div className="space-y-2">
                          {searchResults.map(res => (
                            <Link key={res.id} href={`/app/patients/${res.id}/record`} className="block">
                               <button className="w-full text-right p-4 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-between group text-right">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-white border rounded-xl flex items-center justify-center text-primary font-black shadow-sm group-hover:scale-110 transition-all">
                                        {res.id}
                                     </div>
                                     <div className="text-right">
                                        <p className="font-black text-gray-900 tracking-tighter italic">{res.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{res.file} • {res.phone}</p>
                                     </div>
                                  </div>
                                  <ChevronLeft className="w-5 h-5 text-gray-200 group-hover:text-primary" />
                               </button>
                            </Link>
                          ))}
                       </div>
                    </div>
                    <div className="p-4 border-t bg-gray-50 text-center">
                       <button className="text-primary font-black text-xs uppercase tracking-widest italic hover:underline">
                          + إضافة مريض جديد في النظام
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col text-right">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Live Connection</span>
               <span className="text-xs font-bold text-gray-900 tracking-tighter">Medical API: Connected</span>
            </div>
            <div className="w-px h-10 bg-gray-100" />
            <button className="p-3.5 bg-white border-2 border-gray-100 hover:border-primary rounded-2xl transition-all relative group shadow-sm">
              <div className="absolute top-3 right-3 w-3 h-3 bg-rose-500 rounded-full border-4 border-white animate-pulse shadow-lg shadow-rose-500/30"></div>
              <Settings2 className="w-6 h-6 text-gray-600 group-hover:text-primary transition-all" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-12 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
