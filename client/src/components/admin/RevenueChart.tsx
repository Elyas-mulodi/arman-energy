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
import { formatPrice, formatCompactPrice } from '@/lib/utils';

interface ChartPoint extends RevenueChartPoint {
  label: string;
  fullLabel: string;
}

// _id یک تاریخ تقویمی است (YYYY-MM-DD)؛ با UTC فرمت می‌شود تا تایم‌زون مرورگر روزش را جابه‌جا نکند
const formatDay = (id: string, options: Intl.DateTimeFormatOptions) =>
  new Date(`${id}T12:00:00Z`).toLocaleDateString('fa-IR', { ...options, timeZone: 'UTC' });

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: ChartPoint }[] }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-lg border border-ink-800/10 bg-white px-3 py-2 text-xs shadow-lg" dir="rtl">
      <p className="mb-1 font-bold text-ink-900">{point.fullLabel}</p>
      <p className="text-brand-600">{formatPrice(point.revenue)}</p>
      <p className="text-ink-800/50">{point.orders.toLocaleString('fa-IR')} سفارش</p>
    </div>
  );
}

export default function RevenueChart({ data }: { data: RevenueChartPoint[] }) {
  const hasRevenue = data.some((point) => point.revenue > 0);

  if (!hasRevenue) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-ink-800/40">
        در این بازه هنوز فروشی ثبت نشده است
      </div>
    );
  }

  const chartData: ChartPoint[] = data.map((point) => ({
    ...point,
    label: formatDay(point._id, { month: 'short', day: 'numeric' }),
    fullLabel: formatDay(point._id, { weekday: 'long', month: 'long', day: 'numeric' }),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
          minTickGap={16}
        />
        <YAxis
          width={78}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          domain={[0, 'auto']}
          tickFormatter={(value: number) => formatCompactPrice(value)}
        />
        <Tooltip content={<ChartTooltip />} />
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