import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Mail, 
  Phone, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  Download, 
  Key, 
  ExternalLink,
  MessageSquare,
  FileText,
  DollarSign,
  X,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/schema';
import { formatRupiah, formatDateTime, formatTime } from '../../lib/formatters';
import { api } from '../../lib/api';
import { OrderDetailView } from './OrderDetailView';

interface AdminOrdersProps {
  initialSelectedOrderId?: string;
  onViewProduct?: (slug: string) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ initialSelectedOrderId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const metrics = await api.getAdminMetrics();
      if (metrics?.recentOrders) {
        setOrders(metrics.recentOrders);
        if (initialSelectedOrderId) {
          const target = metrics.recentOrders.find((o: Order) => o.id === initialSelectedOrderId);
          if (target) {
            setSelectedOrder(target);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [initialSelectedOrderId]);

  // Handle open order detail
  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.paymentStatus === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      o.items.some(item => item.productName.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  // If an order is selected, show the full dedicated OrderDetailView matching screenshot
  if (selectedOrder) {
    return (
      <OrderDetailView
        order={selectedOrder}
        onBack={() => {
          setSelectedOrder(null);
          fetchOrders();
        }}
        onRefresh={() => {
          fetchOrders();
          api.getOrder(selectedOrder.id).then((updated) => {
            if (updated) setSelectedOrder(updated);
          });
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Order
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar transaksi masuk, status pembayaran, dan link akses digital.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 shadow-sm flex items-center gap-1.5 text-xs font-bold transition-all w-fit cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari order #, nama, email, WA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 text-xs font-semibold">
          {[
            { id: 'ALL', label: 'Semua Status' },
            { id: 'PAID', label: 'PAID (Lunas)' },
            { id: 'WAITING_PAYMENT', label: 'Menunggu Bayar' },
            { id: 'REFUNDED', label: 'Refund' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Produk & Item</th>
                <th className="py-3 px-6">Total Tagihan</th>
                <th className="py-3 px-6">Metode</th>
                <th className="py-3 px-6">Status Bayar</th>
                <th className="py-3 px-6">Status Delivery</th>
                <th className="py-3 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada pesanan yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold">
                      {/* Clickable Blue Order ID as requested */}
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(ord)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-bold font-mono text-xs cursor-pointer block text-left"
                        title="Klik untuk melihat Detail Pesanan"
                      >
                        {ord.orderNumber}
                      </button>
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {formatDateTime(ord.createdAt)}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                      <span className="text-[11px] text-slate-500 block">{ord.customerEmail}</span>
                      <span className="text-[10px] text-slate-400 block">{ord.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="font-semibold text-slate-800 line-clamp-1">
                        {ord.items[0]?.productName}
                      </span>
                      {ord.items.length > 1 && (
                        <span className="text-[10px] text-blue-600 font-bold">
                          +{ord.items.length - 1} item tambahan (Order Bump/Upsell)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      {formatRupiah(ord.totalAmount)}
                    </td>
                    <td className="py-3.5 px-6 font-medium">
                      {ord.paymentMethod}
                    </td>
                    <td className="py-3.5 px-6">
                      {ord.paymentStatus === 'PAID' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                          PAID
                        </span>
                      ) : ord.paymentStatus === 'WAITING_PAYMENT' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                          WAITING
                        </span>
                      ) : ord.paymentStatus === 'REFUNDED' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-800">
                          REFUNDED
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-700">
                          {ord.paymentStatus}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6">
                      {ord.deliveryStatus === 'DELIVERED' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Terkirim
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                          <Clock className="w-3.5 h-3.5" /> Menunggu
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => handleOpenDetail(ord)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-lg transition-all cursor-pointer"
                      >
                        Detail & Timeline
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
