'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore, getErrorMessage } from '@/store/useAuthStore';
import { ShippingAddress, CreateOrderResponse } from '@/types/order';
import ShippingAddressForm from '@/components/checkout/ShippingAddressForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import EmptyState from '@/components/ui/EmptyState';

const emptyAddress: ShippingAddress = {
  fullName: '',
  phone: '',
  province: '',
  city: '',
  fullAddress: '',
  postalCode: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthInitialized = useAuthStore((state) => state.isInitialized);

  const { items, subtotal, itemCount, fetchCart, isLoading: isCartLoading } = useCartStore();

  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthInitialized && !user) {
      toast.error('برای تکمیل خرید ابتدا وارد شوید');
      router.push('/login');
    }
  }, [isAuthInitialized, user, router]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName,
        phone: prev.phone || user.phone,
      }));
    }
  }, [user]);

  const handleSubmit = async () => {
    if (
      !address.fullName ||
      !address.phone ||
      !address.province ||
      !address.city ||
      !address.fullAddress ||
      address.postalCode.length !== 10
    ) {
    toast.error('لطفا تمام فیلدها را به‌درستی پر کنید (کد پستی باید ۱۰ رقم باشد)');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await api.post<CreateOrderResponse>('/orders', {
        shippingAddress: address,
      });

      window.location.href = data.paymentUrl;
    } catch (error) {
      toast.error(getErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  if (!isAuthInitialized || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      </div>
    );
  }

  if (isCartLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_380px]">
          <div className="h-96 animate-pulse rounded-xl bg-ink-800/5" />
          <div className="h-64 animate-pulse rounded-xl bg-ink-800/5" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20">
        <EmptyState
          icon={ShoppingBag}
          title="سبد خرید شما خالی است"
          description="ابتدا محصولی به سبد خرید اضافه کنید"
        />
      </div>
    );
  }

  const hasUnavailableItems = items.some((item) => !item.available);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-black text-ink-900">تکمیل خرید</h1>

      {hasUnavailableItems && (
        <div className="mb-6 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
          برخی از محصولات سبد خرید شما دیگر موجود نیستند. لطفا قبل از ادامه، سبد خرید را اصلاح
          کنید.
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_380px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border border-ink-800/10 bg-white p-6"
        >
          <ShippingAddressForm address={address} onChange={setAddress} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <OrderSummary items={items} subtotal={subtotal} />

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || hasUnavailableItems}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-brand-500 py-3 text-sm font-bold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            پرداخت و ثبت سفارش
          </button>

          <p className="mt-3 text-center text-xs text-ink-800/40">
            پرداخت شما از طریق درگاه امن زرین‌پال انجام می‌شود
          </p>
        </motion.div>
      </div>
    </div>
  );
}