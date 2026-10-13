import { OrderStatus } from '@/types/order';

export interface DashboardOverview {
  today: { orders: number; revenue: number };
  month: { orders: number; revenue: number };
  overall: {
    totalPaidOrders: number;
    totalRevenue: number;
    totalUsers: number;
    totalProducts: number;
  };
  pendingOrdersCount: number;
  statusBreakdown: Record<OrderStatus, number>;
  lowStockProducts: {
    _id: string;
    name: string;
    lowVariants: { label: string; stock: number }[];
  }[];
}

export interface BestSeller {
  _id: string;
  name: string;
  totalSold: number;
  totalRevenue: number;
}

export interface RevenueChartPoint {
  _id: string; // YYYY-MM-DD
  revenue: number;
  orders: number;
}