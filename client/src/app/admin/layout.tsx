import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-100">
      <AdminSidebar />
      <div className="mr-64">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}