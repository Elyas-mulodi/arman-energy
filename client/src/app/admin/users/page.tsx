'use client';

import { useEffect, useState } from 'react';
import { Users as UsersIcon, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { User } from '@/types/user';
import { getAllUsersAdmin, toggleUserStatusAdmin } from '@/lib/users';
import { getErrorMessage } from '@/store/useAuthStore';
import UserRoleBadge from '@/components/admin/UserRoleBadge';
import ToggleSwitch from '@/components/admin/ToggleSwitch';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    getAllUsersAdmin()
      .then(setUsers)
      .catch(() => toast.error('خطا در دریافت کاربران'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleToggle = async (user: User) => {
    setTogglingId(user._id);
    try {
      const { isActive } = await toggleUserStatusAdmin(user._id);
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, isActive } : u)));
      toast.success(isActive ? 'کاربر فعال شد' : 'کاربر غیرفعال شد');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setTogglingId(null);
    }
  };

  // فیلتر جستجو کاملاً سمت کلاینت انجام میشه چون تعداد کاربران معمولاً برای یه فروشگاه متوسط زیاد نیست
  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search)
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-ink-900">کاربران</h1>

        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو نام یا شماره موبایل..."
            className="w-full rounded-md border border-ink-800/15 bg-white py-2 pr-9 pl-3 text-sm outline-none focus:border-brand-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-800/10 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <UsersIcon className="mb-3 h-8 w-8 text-ink-800/20" />
            <p className="text-sm text-ink-800/40">کاربری یافت نشد</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-800/10 bg-ink-100/50 text-right text-xs text-ink-800/50">
                <th className="px-4 py-3 font-bold">نام</th>
                <th className="px-4 py-3 font-bold">موبایل</th>
                <th className="px-4 py-3 font-bold">نقش</th>
                <th className="px-4 py-3 font-bold">تاریخ عضویت</th>
                <th className="px-4 py-3 font-bold">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-ink-800/5 last:border-0">
                  <td className="px-4 py-3 font-bold text-ink-900">{user.fullName}</td>
                  <td className="px-4 py-3 text-ink-800/60" dir="ltr">
                    {user.phone}
                  </td>
                  <td className="px-4 py-3">
                    <UserRoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3 text-ink-800/50">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ToggleSwitch
                        checked={user.isActive}
                        onChange={() => handleToggle(user)}
                        disabled={togglingId === user._id || user.role === 'admin'}
                      />
                      {togglingId === user._id && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-500" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}