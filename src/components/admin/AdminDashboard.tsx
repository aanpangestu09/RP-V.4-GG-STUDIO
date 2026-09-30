import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  RefreshCw, 
  ChevronRight,
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { api } from '../../lib/api';
import { formatRupiah, formatDateTime } from '../../lib/formatters';
import { Order } from '../../types/schema';
import { useStoreSettings } from '../../context/StoreContext';
import { DashboardPeriod } from '../../lib/dashboardMetrics';
import { DualMonthRangePicker, DateRangeValue } from '../common/DualMonthRangePicker';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  onViewOrder: (orderId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onViewOrder
}) => {
  const { sourceMode } = useStoreSettings();
  const [period, setPeriod] = useState<DashboardPeriod>('7_days');
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dual Month Range Date Picker State (Matching user screenshot)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangeValue>({
    startDate: new Date(2026, 8, 1),
    endDate: new Date(2026, 8, 30),
    presetId: 'this_month',
    label: '1 Sep 2026 - 30 Sep 2026'
  });

  const handleRangeChange = (newVal: DateRangeValue) => {
    setDateRange(newVal);
    if (newVal.presetId === 'today') setPeriod('today');
    else if (newVal.presetId === 'last_1_week' || newVal.presetId === 'this_week') setPeriod('7_days');
    else if (newVal.presetId === 'this_month') setPeriod('this_month');
    else if (newVal.presetId === 'last_1_month' || newVal.presetId === 'last_2_weeks') setPeriod('30_days');
    else setPeriod('this_month');
  };

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminMetrics({ period, sourceMode });
      setMetrics(data);
    } catch (err) {
      console.error('Failed to fetch admin metrics', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [period, sourceMode]);

  if (isLoading && !metrics) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-xs font-semibold text-slate-500">Memuat data dashboard ({sourceMode === 'live' ? 'Mode Live' : 'Mode Test'})...</span>
      </div>
    );
  }

  // Single Source of Truth Metrics values
  const pendapatanLunas = metrics?.pendapatanLunas ?? metrics?.totalRevenue ?? 0;
  const orderLunasCount = metrics?.orderLunasCount ?? metrics?.paidOrdersCount ?? 0;

  const allOrdersRevenue = metrics?.allOrdersRevenue ?? 0;
  const allOrdersCount = metrics?.allOrdersCount ?? 0;

  const waitingRevenue = metrics?.waitingRevenue ?? 0;
  const waitingOrdersCount = metrics?.waitingCount ?? metrics?.waitingOrdersCount ?? 0;

  const lunasRevenue = pendapatanLunas;
  const lunasCount = orderLunasCount;

  const gagalRevenue = metrics?.gagalRevenue ?? metrics?.failedRevenue ?? 0;
  const gagalCount = metrics?.gagalCount ?? metrics?.failedOrdersCount ?? 0;

  const kadaluarsaRevenue = metrics?.kadaluarsaRevenue ?? metrics?.expiredRevenue ?? 0;
  const kadaluarsaCount = metrics?.kadaluarsaCount ?? metrics?.expiredOrdersCount ?? 0;

  const netProfit = metrics?.netProfit ?? 0;
  const hpp = metrics?.hpp ?? 0;

  const konversi = metrics?.konversiPercent ?? metrics?.conversionRate ?? 0;
  const aov = metrics?.aov ?? metrics?.averageOrderValue ?? 0;

  const revenueBump = metrics?.revenueBump ?? 0;
  const upsell = 0;

  const totalDiskon = metrics?.totalDiskon ?? 0;

  // Dual-Axis Chart Math
  const dailyTrend: any[] = metrics?.dailyTrend || [];
  const maxOrdersVal = Math.max(4, ...dailyTrend.map(d => d.orders || 0));
  // Round order ceiling to clean interval of 4
  const chartMaxOrders = Math.ceil(maxOrdersVal / 4) * 4;

  const maxRevVal = Math.max(100000, ...dailyTrend.map(d => d.rev || 0));
  // Round revenue ceiling to clean interval
  const chartMaxRev = Math.ceil(maxRevVal / 400000) * 400000 || 400000;

  const formatK = (val: number) => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1).replace('.0', '') + 'jt';
    }
    return Math.round(val / 1000) + 'k';
  };

  const periodOptions: { id: DashboardPeriod; label: string }[] = [
    { id: 'today', label: 'Hari ini' },
    { id: '7_days', label: '7 hari' },
    { id: '30_days', label: '30 hari' },
    { id: 'this_month', label: 'Bulan ini' }
  ];

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-10">
      {/* ======================================================== */}
      {/* 1. DASHBOARD TITLE & MODE BADGE                          */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
            sourceMode === 'test'
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
          }`}>
            {sourceMode === 'test' ? '⚡ Mode Test' : '🟢 Mode Live'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Period Buttons */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            {periodOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => setPeriod(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  period === opt.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchMetrics}
            className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-colors border border-slate-200/60 bg-white cursor-pointer"
            title="Segarkan Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TOP SECTION: 2 CARDS (LEFT) & CHART (RIGHT)           */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT COLUMN: DATE PICKER + PENDAPATAN (LUNAS) & ORDER LUNAS */}
        <div className="lg:col-span-3 flex flex-col gap-4 justify-between">
          {/* Custom Dual-Month Range Date Picker (Positioned on the left directly above Pendapatan column) */}
          <div className="relative">
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isDatePickerOpen
                  ? 'bg-sky-50 border-sky-400 text-sky-700 ring-2 ring-sky-400/20'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="truncate">{dateRange.label || '1 Sep 2026 - 30 Sep 2026'}</span>
              </div>
              <span className="text-[10px] text-sky-600 bg-sky-100/70 px-2 py-0.5 rounded-md font-semibold shrink-0">
                Pilih
              </span>
            </button>

            {/* Dual Month Range Date Picker Popover */}
            {isDatePickerOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDatePickerOpen(false)} 
                />
                <div className="absolute left-0 top-full mt-2 z-50">
                  <DualMonthRangePicker
                    value={dateRange}
                    onChange={(newVal) => {
                      handleRangeChange(newVal);
                      setIsDatePickerOpen(false);
                    }}
                    onClose={() => setIsDatePickerOpen(false)}
                  />
                </div>
              </>
            )}
          </div>

          {/* Card 1: PENDAPATAN (LUNAS) (Green) */}
          <div className="bg-[#00875a] text-white rounded-2xl p-6 shadow-sm flex flex-col justify-center flex-1 min-h-[140px]">
            <span className="text-xs font-semibold text-white/90 uppercase tracking-wider block">
              PENDAPATAN (LUNAS)
            </span>
            <span className="text-3xl font-extrabold text-white block mt-2.5 tracking-tight">
              {formatRupiah(pendapatanLunas)}
            </span>
          </div>

          {/* Card 2: ORDER LUNAS (Orange/Amber) */}
          <div className="bg-[#e67e00] text-white rounded-2xl p-6 shadow-sm flex flex-col justify-center flex-1 min-h-[140px]">
            <span className="text-xs font-semibold text-white/90 uppercase tracking-wider block">
              ORDER LUNAS
            </span>
            <span className="text-3xl font-extrabold text-white block mt-2.5 tracking-tight">
              {orderLunasCount}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: TREN ORDER & PENDAPATAN HARIAN CHART */}
        <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          {/* Chart Header & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Tren Order & Pendapatan Harian
              </h3>
              <p className="text-xs text-slate-400">
                Batang = Jumlah order per hari, Titik = Pendapatan lunas per hari
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9]" />
                <span className="text-slate-500">Order</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e67e00]" />
                <span className="text-slate-500">Revenue</span>
              </div>
            </div>
          </div>

          {/* Dual Axis Chart Area */}
          <div className="relative pt-2 pb-2">
            <div className="relative h-56 flex items-stretch">
              {/* Left Y-Axis (Order Count) */}
              <div className="w-8 flex flex-col justify-between text-[11px] text-slate-400 font-mono pr-1 select-none text-right">
                <span>{chartMaxOrders}</span>
                <span>{Math.round(chartMaxOrders * 0.75)}</span>
                <span>{Math.round(chartMaxOrders * 0.5)}</span>
                <span>{Math.round(chartMaxOrders * 0.25)}</span>
                <span>0</span>
              </div>

              {/* Main Chart Canvas with Gridlines & Dynamic Bars / Dots */}
              <div className="flex-1 relative flex flex-col justify-between border-l border-b border-slate-300">
                {/* Horizontal Gridlines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="w-full border-b border-dashed border-slate-100" />
                  <div className="w-full border-b border-dashed border-slate-100" />
                  <div className="w-full border-b border-dashed border-slate-100" />
                  <div className="w-full border-b border-dashed border-slate-100" />
                  <div className="w-full" />
                </div>

                {/* Bars & Revenue Indicators Container */}
                <div className="absolute inset-0 flex items-stretch px-2 sm:px-4">
                  {dailyTrend.map((point: any, idx: number) => {
                    const orderHeightPct = Math.min(100, Math.round((point.orders / chartMaxOrders) * 100));
                    const revBottomPct = Math.min(95, Math.max(3, Math.round((point.rev / chartMaxRev) * 100)));

                    return (
                      <div
                        key={point.date || idx}
                        className="flex-1 flex flex-col items-center justify-end relative group cursor-pointer h-full"
                      >
                        {/* Hover Tooltip */}
                        <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-semibold py-1.5 px-3 rounded-xl shadow-xl pointer-events-none whitespace-nowrap z-30">
                          <div className="font-bold text-slate-300 border-b border-slate-800 pb-0.5 mb-1">{point.label}</div>
                          <div>Order: <strong>{point.orders} Order</strong></div>
                          <div>Pendapatan: <strong>{formatRupiah(point.rev)}</strong></div>
                          {point.paidCount > 0 && <div className="text-emerald-400 text-[10px]">({point.paidCount} Lunas)</div>}
                        </div>

                        {/* Orange Dot Marker for Revenue */}
                        {point.rev > 0 && (
                          <div 
                            className="absolute w-3 h-3 rounded-full bg-[#e67e00] border-2 border-white ring-1 ring-[#e67e00] shadow-xs z-20 transition-all duration-300"
                            style={{ bottom: `calc(${revBottomPct}% - 6px)` }}
                            title={`Revenue: ${formatRupiah(point.rev)}`}
                          />
                        )}

                        {/* Cyan Bar for Order Count */}
                        <div 
                          className="w-4 sm:w-6 bg-[#0ea5e9] rounded-t-xs transition-all duration-300 group-hover:bg-[#0284c7]"
                          style={{ height: point.orders > 0 ? `${Math.max(6, orderHeightPct)}%` : '2px' }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Y-Axis (Revenue) */}
              <div className="w-12 flex flex-col justify-between text-[11px] text-slate-400 font-mono pl-2 border-l border-slate-300 select-none">
                <span>{formatK(chartMaxRev)}</span>
                <span>{formatK(chartMaxRev * 0.75)}</span>
                <span>{formatK(chartMaxRev * 0.5)}</span>
                <span>{formatK(chartMaxRev * 0.25)}</span>
                <span>0k</span>
              </div>
            </div>

            {/* X-Axis Date Labels matching days */}
            <div className="flex pl-8 pr-12 text-[10px] sm:text-xs text-slate-500 font-medium mt-2">
              {dailyTrend.map((point: any, idx: number) => {
                // If many items, only show every Nth label on small screens
                const isDense = dailyTrend.length > 10;
                const shouldHide = isDense && (idx % Math.ceil(dailyTrend.length / 7) !== 0 && idx !== dailyTrend.length - 1);

                return (
                  <div key={point.date || idx} className="flex-1 text-center truncate">
                    <span className={shouldHide ? 'hidden sm:inline' : 'inline'}>
                      {point.label.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. RINGKASAN STATUS ORDER                                */}
      {/* ======================================================== */}
      <div className="pt-2">
        <h2 className="text-base font-bold text-slate-900 mb-3.5">
          Ringkasan Status Order
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Semua Order */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#0f172a] text-white text-xs font-semibold">
                Semua Order
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-3 tracking-tight">
                {formatRupiah(allOrdersRevenue)}
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {allOrdersCount} order
            </div>
          </div>

          {/* Card 2: Menunggu */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-semibold">
                Menunggu
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-3 tracking-tight">
                {formatRupiah(waitingRevenue)}
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {waitingOrdersCount} order
            </div>
          </div>

          {/* Card 3: Lunas */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-semibold">
                Lunas
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-3 tracking-tight">
                {formatRupiah(lunasRevenue)}
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {lunasCount} order
            </div>
          </div>

          {/* Card 4: Gagal */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-red-100/90 text-red-700 text-xs font-semibold">
                Gagal
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-3 tracking-tight">
                {formatRupiah(gagalRevenue)}
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {gagalCount} order
            </div>
          </div>

          {/* Card 5: Kadaluarsa */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                Kadaluarsa
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-3 tracking-tight">
                {formatRupiah(kadaluarsaRevenue)}
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {kadaluarsaCount} order
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. BOTTOM 4 KPI METRICS CARDS                            */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: NET PROFIT */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mt-3">
              NET PROFIT
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {formatRupiah(netProfit)}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            HPP {formatRupiah(hpp)}
          </div>
        </div>

        {/* Card 2: KONVERSI */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              %
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mt-3">
              KONVERSI
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {konversi}%
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            AOV {formatRupiah(aov)}
          </div>
        </div>

        {/* Card 3: REVENUE BUMP */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mt-3">
              REVENUE BUMP
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {formatRupiah(revenueBump)}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Upsell Rp {upsell}
          </div>
        </div>

        {/* Card 4: TOTAL DISKON */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mt-3">
              TOTAL DISKON
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {formatRupiah(totalDiskon)}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            dari kupon
          </div>
        </div>
      </div>
    </div>
  );
};
