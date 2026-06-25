"use client";

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads', href: '/dashboard/leads', icon: Users },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  if (!isClient) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-indigo-600" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Admin</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all'
                )}
              >
                <item.icon className={cn(isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300', 'flex-shrink-0 -ml-1 mr-3 h-5 w-5')} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="font-bold tracking-tight text-gray-900 dark:text-white">Admin</span>
          </div>
          <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
