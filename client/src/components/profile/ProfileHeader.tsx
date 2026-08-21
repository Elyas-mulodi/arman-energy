import { User } from '@/types/user';
import Rivet from '@/components/ui/Rivet';
import LogoutButton from './LogoutButton';

function refCode(id: string) {
  return `USR-${id.slice(-6).toUpperCase()}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function ProfileHeader({ user }: { user: User }) {
  const initial = user.fullName.trim().charAt(0);

  return (
    <div className="relative overflow-hidden rounded-md border border-ink-800/15 bg-ink-900 p-6 sm:p-8">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-ink-100) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink-100) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute right-3 top-3"><Rivet /></div>
      <div className="absolute left-3 top-3"><Rivet /></div>
      <div className="absolute bottom-3 right-3"><Rivet /></div>
      <div className="absolute bottom-3 left-3"><Rivet /></div>

      {/* دکمه خروج */}
      <div className="relative mb-5 flex justify-end sm:mb-0 sm:absolute sm:left-6 sm:top-6 sm:mb-0">
        <LogoutButton />
      </div>

      <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-right">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-brand-500/30 bg-brand-500/10 text-3xl font-black text-brand-500">
          {initial}
        </div>

        <div className="flex-1">
          <div className="mb-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h1 className="text-xl font-black text-ink-100">{user.fullName}</h1>
            {user.role === 'admin' && (
              <span className="rounded bg-brand-500/15 px-2 py-0.5 text-[10px] font-bold text-brand-500">
                ادمین
              </span>
            )}
          </div>
          <p className="mb-4 font-mono text-sm text-ink-100/50" dir="ltr">
            {user.phone}
          </p>

          <div className="flex flex-wrap justify-center gap-4 border-t border-ink-800 pt-4 sm:justify-start">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink-100/40">کد کاربری</p>
              <p className="mt-1 font-mono text-xs font-bold text-ink-100" dir="ltr">
                {refCode(user._id)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink-100/40">عضویت از</p>
              <p className="mt-1 text-xs font-bold text-ink-100">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}