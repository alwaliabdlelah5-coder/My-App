'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Activity, LayoutDashboard, Database, Smartphone, Laptop } from 'lucide-react';

export default function AuthPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Activity className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Visual Side */}
      <div className="hidden md:flex bg-gray-900 border-l border-white/5 relative overflow-hidden flex-col justify-between p-16">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
             <div className="p-4 bg-primary/20 backdrop-blur-xl rounded-3xl border border-primary/30">
               <Activity className="w-10 h-10 text-primary" />
             </div>
             <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase font-mono">
               IMP SYSTEM
             </h1>
          </div>
          <p className="text-white/40 font-bold italic uppercase text-[10px] tracking-[0.2em] mt-2">
            Integrated Medical Platform • Next-Gen Infrastructure
          </p>
        </div>

        <div className="relative z-10 space-y-12">
           <AuthFeature 
             icon={LayoutDashboard} 
             title="Cross-Platform Ready" 
             desc="Run seamlessly on Web, Android, and Windows with a single codebase." 
           />
           <AuthFeature 
             icon={Database} 
             title="Cloud-Native Architecture" 
             desc="Elastic scaling with automated Firebase and Supabase integration." 
           />
           <div className="flex items-center gap-6 pt-10 border-t border-white/10">
              <PlatformIcon icon={Smartphone} />
              <PlatformIcon icon={Laptop} />
              <PlatformIcon icon={Activity} />
           </div>
        </div>

        {/* Ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50 blur-[100px]" />
      </div>

      {/* Login Side */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full space-y-10">
          <div className="md:hidden flex items-center gap-3 mb-12">
             <Activity className="w-8 h-8 text-primary" />
             <h1 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase">IMP</h1>
          </div>

          <div>
             <h2 className="text-5xl font-black text-gray-900 italic tracking-tighter uppercase mb-4">
               Sign In
             </h2>
             <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest leading-loose">
               Access the medical command center. Your platform is automatically provisioned for Android, Web, and Windows.
             </p>
          </div>

          <div className="space-y-6">
             <button 
              onClick={signInWithGoogle}
              className="w-full h-16 bg-gray-900 text-white rounded-3xl font-black italic tracking-tighter uppercase text-sm flex items-center justify-center gap-4 hover:bg-primary transition-all shadow-2xl shadow-gray-900/10 active:scale-95 group"
             >
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                Continue with Google
             </button>
             
             <div className="flex items-center gap-4 py-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Provisioned Access Only</span>
                <div className="flex-1 h-px bg-gray-100" />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-gray-50 rounded-[2rem] border border-transparent hover:border-primary/20 transition-all cursor-not-allowed group opacity-50">
                   <p className="text-[10px] font-black text-primary uppercase italic tracking-widest mb-2">Android</p>
                   <p className="text-xs font-bold text-gray-500">App Store ready</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-[2rem] border border-transparent hover:border-primary/20 transition-all cursor-not-allowed group opacity-50">
                   <p className="text-[10px] font-black text-primary uppercase italic tracking-widest mb-2">Windows</p>
                   <p className="text-xs font-bold text-gray-500">Desktop installer</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthFeature({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex gap-6 max-w-sm group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-primary group-hover:border-primary group-hover:scale-110 shrink-0">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="text-white font-black italic tracking-tighter uppercase">{title}</h3>
        <p className="text-white/30 text-sm font-medium mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function PlatformIcon({ icon: Icon }: { icon: any }) {
  return (
    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 transition-all hover:text-white hover:bg-white/10">
      <Icon className="w-5 h-5" />
    </div>
  );
}
