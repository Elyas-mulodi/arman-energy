'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { RevenueChartPoint } from '@/types/dashboard';
import { formatPrice } from '@/lib/utils';

export default function RevenueChart({ data }: { data: RevenueChartPoint[] }) {
  const formattedData = data.map((point) => ({
    ...point,
    label: new Date(point._id).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' }),
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-ink-800/40">
        داده‌ای برای نمایش وجود ندارد
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={formattedData} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
          minTickGap={28}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          width={38}
          tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
        />
        <Tooltip
          formatter={(value: number) => [formatPrice(value), 'درآمد']}
          contentStyle={{
            direction: 'rtl',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#0284c7"
          strokeWidth={2}
          fill="url(#revenueGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}