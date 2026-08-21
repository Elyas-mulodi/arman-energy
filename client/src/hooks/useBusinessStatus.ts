'use client';

import { useState, useEffect } from 'react';

interface BusinessStatus {
  isOpen: boolean;
  label: string;
}

const OPEN_HOUR = 9;
const CLOSE_HOUR = 20;

export function useBusinessStatus(): BusinessStatus {
  const [status, setStatus] = useState<BusinessStatus>({ isOpen: false, label: '...' });

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const hour = now.getHours();
      const isOpen = hour >= OPEN_HOUR && hour < CLOSE_HOUR;

      setStatus({
        isOpen,
        label: isOpen ? 'هم‌اکنون پاسخگو هستیم' : 'خارج از ساعات کاری',
      });
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60_000); 

    return () => clearInterval(interval);
  }, []);

  return status;
}