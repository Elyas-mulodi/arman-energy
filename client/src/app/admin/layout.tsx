import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-100/40">
      <AdminSidebar />

      <div className="lg:mr-64">
        <AdminHeader />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}