import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ShoppingBag, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  ExternalLink,
  MessageSquare,
  ArrowUpRight,
  X,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Customer, Order } from '../../types/schema';
import { formatRupiah, formatDate, formatDateTime } from '../../lib/formatters';
import { api } from '../../lib/api';

interface AdminCustomersProps {
  onViewOrder?: (orderId: string) => void;
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({ onViewOrder }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected customer for order detail modal
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [custList, orderList] = await Promise.all([
        api.getCustomers(),
        api.getOrders()
      ]);
      setCustomers(custList);
      setOrders(orderList);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) ||
           c.email.toLowerCase().includes(q) ||
           c.phone.includes(q) ||
           (c.company && c.company.toLowerCase().includes(q));
  });

  // Filter orders for the selected customer
  const customerOrders = selectedCustomer ? orders.filter(o => 
    o.customerId === selectedCustomer.id ||
    (o.customerEmail && o.customerEmail.toLowerCase() === selectedCustomer.email.toLowerCase()) ||
    (o.customerPhone && o.customerPhone.replace(/[^0-9]/g, '') === selectedCustomer.phone.replace(/[^0-9]/g, ''))
  ) : [];

  const handleCopyOrderId = (orderNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrderId(orderNumber);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleSelectOrder = (orderId: string) => {
    if (onViewOrder) {
      setSelectedCustomer(null);
      onViewOrder(orderId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pelanggan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar pembeli terdaftar, riwayat transaksi, dan kontak WhatsApp.
          </p>
        </div>
      </div>

      {/* Search box */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, email, nomor WA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400 hidden sm:inline-block">
          Total: {customers.length} Customer
        </span>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-6">Pelanggan</th>
                <th className="py-3 px-6">Kontak WhatsApp & Email</th>
                <th className="py-3 px-6">Perusahaan</th>
                <th className="py-3 px-6">Total Pesanan</th>
                <th className="py-3 px-6">Total Belanja (LTV)</th>
                <th className="py-3 px-6">Order Terakhir</th>
                <th className="py-3 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-6">
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(cust)}
                      className="flex items-center gap-3 text-left group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs group-hover:ring-2 group-hover:ring-blue-400">
                        {cust.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-xs block group-hover:text-blue-600 transition-colors">
                          {cust.name}
                        </span>
                        <span className="text-[10px] text-blue-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          Klik untuk lihat riwayat order →
                        </span>
                      </div>
                    </button>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="text-slate-800 font-medium block">{cust.phone}</span>
                    <span className="text-[11px] text-slate-400 block">{cust.email}</span>
                  </td>
                  <td className="py-3.5 px-6 font-medium text-slate-600">
                    {cust.company || '-'}
                  </td>
                  <td className="py-3.5 px-6">
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(cust)}
                      className="px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                      title="Klik untuk melihat detail orderan customer"
                    >
                      <span>{cust.totalOrders} Order</span>
                      <ChevronRight className="w-3 h-3 text-blue-500" />
                    </button>
                  </td>
                  <td className="py-3.5 px-6 font-black text-slate-900">
                    {formatRupiah(cust.totalSpent)}
                  </td>
                  <td className="py-3.5 px-6 text-slate-500">
                    {formatDate(cust.lastOrderAt)}
                  </td>
                  <td className="py-3.5 px-6 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(cust)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      <span>Detail Orderan</span>
                    </button>
                    <a
                      href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(cust.name)},%20terima%20kasih%20telah%20berbelanja%20di%20Ruang%20Proyek`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WA</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CUSTOMER ORDER DETAIL MODAL                              */}
      {/* ======================================================== */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 font-black flex items-center justify-center text-sm border border-blue-100">
                  {selectedCustomer.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                    Detail Orderan Customer: {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{selectedCustomer.email}</span>
                    <span>•</span>
                    <span>{selectedCustomer.phone}</span>
                    <span>•</span>
                    <strong className="text-slate-700 font-bold">LTV: {formatRupiah(selectedCustomer.totalSpent)}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Customer Order List */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Riwayat Transaksi ({customerOrders.length} Order)
                </span>
                <span className="text-[11px] text-slate-400">
                  *Klik nomor Order ID (warna biru) untuk melihat detail lengkap
                </span>
              </div>

              {customerOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-slate-100">
                  Belum ada riwayat pesanan yang tercatat untuk customer ini.
                </div>
              ) : (
                <div className="space-y-3">
                  {customerOrders.map((ord) => {
                    const isPaid = ord.paymentStatus === 'PAID';
                    return (
                      <div 
                        key={ord.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-3 group"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200/80">
                          <div className="flex items-center gap-2">
                            {/* CLICKABLE BLUE ORDER ID */}
                            <button
                              type="button"
                              onClick={() => handleSelectOrder(ord.id)}
                              className="text-blue-600 hover:text-blue-800 hover:underline font-mono font-bold text-sm cursor-pointer inline-flex items-center gap-1.5"
                              title="Klik untuk membuka Detail Pesanan"
                            >
                              <span>#{ord.orderNumber}</span>
                              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                            </button>

                            {/* Copy button */}
                            <button
                              type="button"
                              onClick={(e) => handleCopyOrderId(ord.orderNumber, e)}
                              className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                              title="Salin Order ID"
                            >
                              {copiedOrderId === ord.orderNumber ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            {copiedOrderId === ord.orderNumber && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                Tersalin!
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${
                                isPaid
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.paymentStatus === 'WAITING_PAYMENT'
                                  ? 'bg-amber-100 text-amber-800'
                                  : ord.paymentStatus === 'REFUNDED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-slate-200 text-slate-800'
                              }`}
                            >
                              {ord.paymentStatus}
                            </span>
                            <span className="font-extrabold text-slate-900 text-sm">
                              {formatRupiah(ord.totalAmount)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items & Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="font-semibold text-slate-800">
                              {ord.items[0]?.productName}
                              {ord.items.length > 1 && (
                                <span className="text-[11px] text-blue-600 font-bold ml-1.5">
                                  +{ord.items.length - 1} item lainnya
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Metode: <span className="text-slate-600 font-medium">{ord.paymentMethod}</span> • Tanggal: {formatDateTime(ord.createdAt)}
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            type="button"
                            onClick={() => handleSelectOrder(ord.id)}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1 shrink-0"
                          >
                            <span>Buka Detail Orderan</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <a
                href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(selectedCustomer.name)},%20terima%20kasih%20telah%20berbelanja%20di%20Ruang%20Proyek`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Hubungi via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
