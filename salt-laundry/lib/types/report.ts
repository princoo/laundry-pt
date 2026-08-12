import type { ServiceType } from "@prisma/client";

export interface ReportServiceStat {
  count: number; // items sold under this service
  revenue: number; // line base (quantity × unitPrice), excludes express and VAT
}

export interface ReportItemStat {
  name: string;
  quantity: number;
  revenue: number;
}

export interface ReportDayRevenue {
  date: string;
  total: number;
}

export interface ReportRoomStat {
  room: string;
  total: number;
}

export interface ReportSummary {
  grossRevenue: number;
  vatRevenue: number;
  totalRevenue: number;
  requestCount: number;
  avgOrderValue: number;
}

export interface Report {
  period: { from: string; to: string };
  summary: ReportSummary;
  byServiceType: Record<ServiceType, ReportServiceStat>;
  serviceRevenue: number; // sum of the buckets above- the donut's denominator
  expressCount: number;
  expressRevenue: number;
  topItems: ReportItemStat[];
  revenueByDay: ReportDayRevenue[];
  topRooms: ReportRoomStat[];
}
