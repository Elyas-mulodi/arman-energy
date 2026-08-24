'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '@/lib/axios';
import { Order } from '@/types/order';

interface UseOrderResult {
  order: Order | null;
  status: 'loading' | 'success' | 'error';
}

export function useOrder(orderNumber: string | null): UseOrderResult {
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<UseOrderResult['status']>('loading');

  useEffect(() => {
    if (!orderNumber) {
      setStatus('error');
      return;
    }

    const controller = new AbortController();

    const fetchOrder = async () => {
      setStatus('loading');
      try {
        const { data } = await api.get<Order>(`/orders/${orderNumber}`, {
          signal: controller.signal,
        });
        setOrder(data);
        setStatus('success');
      } catch (error) {
        if (axios.isCancel(error)) return;
        setStatus('error');
      }
    };

    fetchOrder();
    return () => controller.abort();
  }, [orderNumber]);

  return { order, status };
}