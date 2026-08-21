'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTab';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import AddressForm from '@/components/profile/AddressForm';
import PasswordChangeForm from '@/components/profile/PasswordChangeForm';
import OrderHistoryList from '@/components/profile/OrderHistoryList';

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'info';

  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace('/login?redirect=/profile');
    }
  }, [isInitialized, user, router]);

  if (!isInitialized || !user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="h-40 animate-pulse rounded-md bg-ink-100" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <ProfileHeader user={user} />

      <div className="mt-8 rounded-md border border-ink-800/10 bg-white">
        <ProfileTabs active={activeTab} />

        <div className="p-6">
          {activeTab === 'info' && <PersonalInfoForm user={user} />}
          {activeTab === 'orders' && <OrderHistoryList />}
          {activeTab === 'address' && <AddressForm address={user.address} />}
          {activeTab === 'password' && <PasswordChangeForm />}
        </div>
      </div>
    </div>
  );
}