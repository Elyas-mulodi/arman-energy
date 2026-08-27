export interface DashboardOverview {
  today: {
    orders: number;
  };
  month: {
    orders: number;
    revenue: number;
  };
  overall: {
    totalPaidOrders: number;
    totalRevenue: number;
    totalUsers: number;
    totalProducts: number;
  };
  pendingOrdersCount: number;
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
  _id: string; // تاریخ به فرمت YYYY-MM-DD
  revenue: number;
  orders: number;
}