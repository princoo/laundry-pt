import type { ServiceType } from '@prisma/client'

export interface ReportServiceStat {
  count: number
  revenue: number
}

export interface ReportItemStat {
  name: string
  quantity: number
  revenue: number
}

export interface ReportDayRevenue {
  date: string
  total: number
}

export interface ReportRoomStat {
  room: string
  total: number
}

export interface ReportSummary {
  grossRevenue: number
  vatRevenue: number
  totalRevenue: number
  requestCount: number
  avgOrderValue: number
}

export interface Report {
  period: { from: string; to: string }
  summary: ReportSummary
  byServiceType: Record<ServiceType, ReportServiceStat>
  expressCount: number
  expressRevenue: number
  topItems: ReportItemStat[]
  revenueByDay: ReportDayRevenue[]
  topRooms: ReportRoomStat[]
}
