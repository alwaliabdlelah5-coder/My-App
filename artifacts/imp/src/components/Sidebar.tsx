import React, { useState } from 'react';
import { Link } from 'wouter';
import { useLocation } from 'wouter';
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
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth, Role, ROLE_LABELS } from '@/contexts/AuthContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: Role[];
}

const ALL_ROLES: Role[] = ['admin', 'doctor', 'nurse', 'lab_tech', 'receptionist', 'pharmacist'];

const navItems: NavItem[] = [
  { name: 'لوحة القيادة', href: '/', icon: LayoutDashboard, roles: ALL_ROLES },
  { name: 'المرضى', href: '/patients', icon: Users, roles: ['admin', 'doctor', 'nurse', 'receptionist', 'lab_tech'] },
  { name: 'المواعيد', href: '/appointments', icon: Calendar, roles: ['admin', 'doctor', 'receptionist'] },
  { name: 'العيادات', href: '/clinic', icon: Stethoscope, roles: ['admin', 'doctor', 'nurse'] },
  { name: 'المختبر', href: '/lab', icon: FlaskConical, roles: ['admin', 'doctor', 'lab_tech'] },
  { name: 'القائمة الحية', href: '/queue', icon: ClipboardList, roles: ALL_ROLES },
  { name: 'الصيدلية', href: '/pharmacy', icon: Tablets, roles: ['admin', 'pharmacist', 'doctor'] },
  { name: 'المخزون العام', href: '/inventory', icon: Package, roles: ['admin', 'pharmacist'] },
  { name: 'المالية', href: '/finance', icon: CreditCard, roles: ['admin'] },
  { name: 'الموارد البشرية', href: '/hr', icon: Users, roles: ['admin'] },
  { name: 'المستخدمين', href: '/users', icon: UserCircle, roles: ['admin'] },
  { name: 'التقارير', href: '/reports', icon: Activity, roles: ['admin', 'doctor'] },
  { name: 'الإعدادات', href: '/settings', icon: Settings, roles: ALL_ROLES },
];

const ROLE_COLORS: Record<Role, string> = {
  admin: 'bg-purple-100 text-purple-700',
  doctor: 'bg-blue-100 text-blue-700',
  nurse: 'bg-green-100 text-green-700',
  lab_tech: 'bg-amber-100 text-amber-700',
  receptionist: 'bg-cyan-100 text-cyan-700',
  pharmacist: 'bg-rose-100 text-rose-700',
};

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [pathname] = useLocation();
  const { user, logout } = useAuth();

  const userRole = user?.role ?? 'receptionist';
  const visibleNav = navItems.filter(item => item.roles.includes(userRole));

  const displayName = user?.displayName ?? user?.email ?? 'مستخدم';
  const initials = displayName.split(' ').map((w: string) => w[0]).slice(0, 2).join('');

  const searchResults = [
    { id: 1, name: 'سناء علي عبد الله', file: 'P-1001', phone: '777123456' },
    { id: 2, name: 'محمد حسن صالح', file: 'P-1002', phone: '770987654' },
  ];

  const handleLogout = async () => {
    await logout();
  };

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
                IMP <span className="text-gray-300 font-normal">v2.0</span>
              </motion.span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-100 shadow-sm"
            >
              <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </motion.div>
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
            {visibleNav.map((item) => {
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
              className="flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100"
            >
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0",
                ROLE_COLORS[userRole]
              )}>
                {initials || <Users className="w-5 h-5" />}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-black text-gray-900 truncate max-w-[120px] tracking-tight">{displayName}</span>
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider italic px-1.5 py-0.5 rounded-full w-fit mt-0.5", ROLE_COLORS[userRole])}>
                    {ROLE_LABELS[userRole]}
                  </span>
                </div>
              )}
            </Link>
            <button
              onClick={handleLogout}
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
                          <Link key={res.id} href={`/patients/${res.id}`}>
                            <button className="w-full text-right p-4 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-between group">
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
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">المستخدم الحالي</span>
              <span className={cn("text-xs font-black tracking-tighter px-2 py-0.5 rounded-full w-fit mt-0.5", ROLE_COLORS[userRole])}>
                {ROLE_LABELS[userRole]}
              </span>
            </div>
            <div className="w-px h-10 bg-gray-100" />
            <Link href="/settings">
              <button className="p-3.5 bg-white border-2 border-gray-100 hover:border-primary rounded-2xl transition-all relative group shadow-sm">
                <Settings2 className="w-6 h-6 text-gray-600 group-hover:text-primary transition-all" />
              </button>
            </Link>
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
