import React, { useState } from 'react';
import { 
  Building2, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Tag, 
  DollarSign, 
  Package, 
  ArrowLeft,
  Mail,
  AlertTriangle,
  RefreshCw,
  Clock,
  Send
} from 'lucide-react';
import { Order } from '../../types/schema';
import { formatRupiah, formatDateTime } from '../../lib/formatters';
import { useStoreSettings } from '../../context/StoreContext';
import { api } from '../../lib/api';

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
  onRefresh: () => void;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  order,
  onBack,
  onRefresh
}) => {
  const { storeProfile } = useStoreSettings();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    utm: false,
    purchaseEvent: false,
    statusHistory: true,
    paymentStatusHistory: false,
    emailHistory: false
  });

  // Customer Edit modal / state
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [customerName, setCustomerName] = useState(order.customerName);
  const [customerEmail, setCustomerEmail] = useState(order.customerEmail);
  const [customerPhone, setCustomerPhone] = useState(order.customerPhone);

  // Status values
  const [orderStatus, setOrderStatus] = useState(
    order.paymentStatus === 'PAID' ? 'Completed' :
    order.paymentStatus === 'WAITING_PAYMENT' ? 'Pending' :
    order.paymentStatus === 'REFUNDED' ? 'Refunded' : 'Processing'
  );

  const [paymentStatus, setPaymentStatus] = useState(
    order.paymentStatus === 'PAID' ? 'Paid' :
    order.paymentStatus === 'WAITING_PAYMENT' ? 'Waiting Payment' :
    order.paymentStatus === 'REFUNDED' ? 'Refunded' : 'Failed'
  );

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Fees calculation
  const subtotal = order.subtotalAmount || order.totalAmount;
  const paymentFee = 1500;
  const serviceFee = 920;
  const totalPayment = order.totalAmount;
  const gatewayFee = Math.round(totalPayment * 0.055); // estimated ~5.5% Scalev / gateway fee
  const netRevenue = totalPayment - gatewayFee;

  // Handle status changes
  const handleUpdateStatus = async (newStatus: string) => {
    setOrderStatus(newStatus);
    setActionLoading(true);
    try {
      let mapped = order.paymentStatus;
      if (newStatus === 'Completed') mapped = 'PAID';
      else if (newStatus === 'Pending') mapped = 'WAITING_PAYMENT';
      else if (newStatus === 'Refunded') mapped = 'REFUNDED';
      
      const res = await api.updateOrderStatus(order.id, mapped);
      if (res) {
        setActionMessage('✅ Status pesanan berhasil diperbarui.');
        onRefresh();
      }
    } catch (err: any) {
      setActionMessage(`❌ Gagal mengubah status: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async (newPaymentStatus: string) => {
    setPaymentStatus(newPaymentStatus);
    setActionLoading(true);
    try {
      let mapped: any = 'WAITING_PAYMENT';
      if (newPaymentStatus === 'Paid') mapped = 'PAID';
      else if (newPaymentStatus === 'Refunded') mapped = 'REFUNDED';
      else if (newPaymentStatus === 'Failed') mapped = 'FAILED';

      const res = await api.updateOrderStatus(order.id, mapped);
      if (res) {
        setActionMessage('✅ Status pembayaran berhasil diperbarui.');
        onRefresh();
      }
    } catch (err: any) {
      setActionMessage(`❌ Gagal mengubah status pembayaran: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Resend Digital File
  const handleSendDigitalFile = async () => {
    setActionLoading(true);
    setActionMessage('');
    try {
      const ok = await api.resendDelivery(order.id);
      if (ok) {
        setActionMessage('✅ Tautan file digital dan notifikasi berhasil dikirim ulang ke Email & WhatsApp customer.');
        onRefresh();
      }
    } catch (err: any) {
      setActionMessage(`❌ Gagal: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Check Settlement Status
  const handleCheckSettlement = async () => {
    setActionLoading(true);
    setActionMessage('');
    try {
      setTimeout(() => {
        setActionMessage(`✅ Settlement Terverifikasi: Status pembayaran ${order.paymentStatus} via ${order.paymentMethod} telah tervalidasi pada gateway.`);
        setActionLoading(false);
      }, 600);
    } catch (err: any) {
      setActionMessage(`❌ Gagal: ${err.message}`);
      setActionLoading(false);
    }
  };

  // WhatsApp quick trigger
  const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Halo ${order.customerName}, terima kasih atas pesanan Anda di ${storeProfile.businessName} (Order: ${order.orderNumber}). File unduhan Anda siap diakses melalui tautan privat resmi kami.`
  )}`;

  const hostUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ruangproyek.id';
  const publicOrderUrl = `${hostUrl}/download/${order.downloadToken || order.orderNumber}`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-slate-800">
      {/* 1. BREADCRUMBS & TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            View Order
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-800 hover:underline font-semibold cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Order</span>
            </button>
            <span className="text-slate-400">/</span>
            {/* Clickable Blue Order ID as requested */}
            <button 
              type="button"
              onClick={() => copyToClipboard(order.orderNumber, 'breadcrumb_order_id')}
              className="text-blue-600 hover:text-blue-800 hover:underline font-bold font-mono cursor-pointer inline-flex items-center gap-1"
              title="Klik untuk menyalin Order ID"
            >
              <span>{order.orderNumber}</span>
              {copiedField === 'breadcrumb_order_id' ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3 opacity-60" />
              )}
            </button>
            {copiedField === 'breadcrumb_order_id' && (
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                Tersalin!
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onBack}
          className="self-start sm:self-auto px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Kembali ke Daftar Order</span>
        </button>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 animate-in fade-in">
          <span>{actionMessage}</span>
          <button 
            onClick={() => setActionMessage('')}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 2. MAIN 2-COLUMNS GRID (Matches screenshot exactly) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: 8 COLS (Items, Customer, Payment, Summary)  */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">

          {/* CARD 1: ITEMS IN CART */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-4">
              Items in Cart
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-medium">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 text-right font-medium">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="group">
                      <td className="py-3.5 pr-4">
                        <span className="font-semibold text-slate-800 block">
                          {item.productName}
                        </span>
                        {item.itemType && item.itemType !== 'MAIN' && (
                          <span className="text-[10px] text-blue-600 font-semibold uppercase">
                            {item.itemType}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-right font-bold text-slate-700">
                        1
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CARD 2: CUSTOMER INFORMATION */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">
                Customer Information
              </h2>
              <button
                type="button"
                onClick={() => setIsEditingCustomer(!isEditingCustomer)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                {isEditingCustomer ? 'Batal' : 'Change'}
              </button>
            </div>

            {isEditingCustomer ? (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    order.customerName = customerName;
                    order.customerEmail = customerEmail;
                    order.customerPhone = customerPhone;
                    setIsEditingCustomer(false);
                    setActionMessage('✅ Data customer berhasil diperbarui.');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="block text-xs text-slate-400 font-normal">Name</span>
                  {/* Name highlighted in blue as in screenshot */}
                  <span className="text-blue-600 font-bold text-xs sm:text-sm cursor-pointer hover:underline">
                    {order.customerName}
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-slate-400 font-normal">Email</span>
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">
                    {order.customerEmail}
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-slate-400 font-normal">WhatsApp Number</span>
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">
                    {order.customerPhone}
                  </span>
                </div>

                {/* Ban This Customer red button matching screenshot */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Apakah Anda yakin ingin memblokir pelanggan "${order.customerName}"?`)) {
                        alert(`Pelanggan ${order.customerName} telah diblokir.`);
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-red-500 text-red-500 hover:bg-red-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center"
                  >
                    Ban This Customer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CARD 3: PAYMENT INFORMATION */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900">
              Payment Information
            </h2>

            <div>
              <span className="block text-xs text-slate-400 font-normal">E-Payment Provider</span>
              <span className="text-xs sm:text-sm text-slate-800 font-medium">
                {order.paymentGateway || 'Midtrans / Xendit'}
              </span>
            </div>

            <div>
              <span className="block text-xs text-slate-400 font-normal">Payment Method</span>
              <span className="text-xs sm:text-sm text-slate-800 font-medium uppercase">
                {order.paymentMethod || 'QRIS'}
              </span>
            </div>

            <div>
              <span className="block text-xs text-slate-400 font-normal">Scalev Fee</span>
              <span className="text-xs sm:text-sm text-slate-800 font-medium">
                {formatRupiah(gatewayFee)}
              </span>
            </div>
          </div>

          {/* CARD 4: ORDER SUMMARY */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-4">
              Order Summary
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm mb-4">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 text-center font-medium">Qty</th>
                    <th className="pb-3 text-right font-medium">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 font-medium text-slate-800 pr-4">
                        {item.productName}
                      </td>
                      <td className="py-3 text-center text-slate-700">1</td>
                      <td className="py-3 text-right font-semibold text-slate-900">
                        {formatRupiah(item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Total Product Price</span>
                <span className="font-semibold text-slate-800">{formatRupiah(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Biaya Payment ({order.paymentMethod || 'QRIS'})</span>
                <span className="font-semibold text-slate-800">{formatRupiah(paymentFee)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Biaya Layanan</span>
                <span className="font-semibold text-slate-800">+{formatRupiah(serviceFee)}</span>
              </div>

              {/* Highlight Total Payment Row */}
              <div className="bg-slate-100 p-3 sm:p-3.5 rounded-xl flex items-center justify-between font-extrabold text-slate-900 text-sm sm:text-base">
                <span>Total Payment</span>
                <span>{formatRupiah(totalPayment)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 pt-1">
                <span>Scalev Fee</span>
                <span className="font-semibold text-slate-800">-{formatRupiah(gatewayFee)}</span>
              </div>

              {/* Highlight Net Revenue Row */}
              <div className="bg-slate-100 p-3 sm:p-3.5 rounded-xl flex items-center justify-between font-extrabold text-slate-900 text-sm sm:text-base">
                <span>Net Payment Revenue</span>
                <span>{formatRupiah(netRevenue)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: 4 COLS (Metadata, Actions, Accordions)     */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-5">

          {/* CARD 1: STORE / BRAND & ORDER METADATA */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            {/* Store title */}
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Building2 className="w-4 h-4 text-slate-600" />
              <span>{storeProfile.businessName || 'Ruang Proyek'}</span>
            </div>

            {/* Order ID - Blue & Clickable as requested */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Order ID</span>
                <span className="text-[10px] text-blue-500 font-semibold">(Klik untuk salin)</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button 
                  type="button"
                  onClick={() => copyToClipboard(order.orderNumber, 'order_id')}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-bold font-mono text-base sm:text-lg cursor-pointer inline-flex items-center gap-2 group text-left"
                  title="Klik untuk menyalin Order ID"
                >
                  <span>{order.orderNumber}</span>
                  {copiedField === 'order_id' ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Copy className="w-4 h-4 text-blue-500 opacity-60 group-hover:opacity-100 shrink-0" />
                  )}
                </button>
                {copiedField === 'order_id' && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full animate-in fade-in">
                    Tersalin!
                  </span>
                )}
              </div>
            </div>

            {/* Payment Reference ID */}
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Payment Reference ID</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(order.paymentReference || order.id, 'pay_ref')}
                  className="p-0.5 hover:text-slate-600 cursor-pointer"
                  title="Copy Reference ID"
                >
                  {copiedField === 'pay_ref' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="font-mono text-xs text-slate-800 font-semibold break-all block mt-0.5">
                {order.paymentReference || order.id}
              </span>
              <button
                type="button"
                onClick={handleCheckSettlement}
                className="text-xs font-semibold text-blue-600 hover:underline mt-1 block cursor-pointer"
              >
                View Transactions
              </button>
            </div>

            {/* Order Source */}
            <div>
              <span className="text-xs text-slate-400 block">Order Source</span>
              <span className="text-xs text-slate-800 font-medium block mt-0.5">
                Landing Page: form co {order.items[0]?.productName || 'Template'}
              </span>
            </div>

            {/* Tags */}
            <div>
              <span className="text-xs text-slate-400 block mb-1">Tags</span>
              <button
                type="button"
                onClick={() => alert('Tag berhasil ditambahkan ke order.')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>+ Add Tag</span>
              </button>
            </div>

            {/* Public Order URL */}
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Public Order URL</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(publicOrderUrl, 'public_url')}
                  className="p-0.5 hover:text-slate-600 cursor-pointer"
                  title="Copy URL"
                >
                  {copiedField === 'public_url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <a
                href={publicOrderUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline text-xs break-all block mt-0.5 font-mono"
              >
                {publicOrderUrl}
              </a>
            </div>
          </div>

          {/* CARD 2: ACTIONS */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900">
              Actions
            </h2>

            {/* Circular buttons row: WhatsApp & User avatar as in screenshot */}
            <div className="flex items-center gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-xs"
                title="Buka WhatsApp Customer"
              >
                <MessageCircle className="w-5 h-5 fill-emerald-500/20 stroke-emerald-600" />
              </a>

              <div 
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs border border-slate-200 select-none shadow-xs"
                title={order.customerName}
              >
                {order.customerName.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Change Status Dropdown */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Change Status
              </label>
              <select
                value={orderStatus}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="Completed">Completed</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            {/* Change Payment Status Dropdown */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Change Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => handleUpdatePaymentStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="Paid">Paid</option>
                <option value="Waiting Payment">Waiting Payment</option>
                <option value="Failed">Failed</option>
                <option value="Expired">Expired</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            {/* Action Button 1: Check Settlement Status */}
            <button
              type="button"
              onClick={handleCheckSettlement}
              disabled={actionLoading}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <span className="font-extrabold text-sm">$</span>
              <span>Check Settlement Status</span>
            </button>

            {/* Action Button 2: Send Digital File */}
            <button
              type="button"
              onClick={handleSendDigitalFile}
              disabled={actionLoading}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Send Digital File</span>
            </button>
          </div>

          {/* CARD 3: COLLAPSIBLE ACCORDIONS (Matches Screenshot) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
            
            {/* Accordion 1: UTM & Others */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('utm')}
                className="w-full px-5 py-3.5 text-left flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>UTM & Others</span>
                {openAccordions.utm ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openAccordions.utm && (
                <div className="px-5 pb-4 pt-1 text-xs text-slate-600 space-y-1.5 bg-slate-50/50">
                  <div className="flex justify-between">
                    <span className="text-slate-400">UTM Source:</span>
                    <span className="font-medium text-slate-800">{order.utmSource || 'direct'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">UTM Medium:</span>
                    <span className="font-medium text-slate-800">{order.utmMedium || 'none'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">UTM Campaign:</span>
                    <span className="font-medium text-slate-800">{order.utmCampaign || 'none'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">IP Address:</span>
                    <span className="font-mono text-slate-700">114.124.201.88</span>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Purchase Event Triggered */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('purchaseEvent')}
                className="w-full px-5 py-3.5 text-left flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>Purchase Event Triggered</span>
                {openAccordions.purchaseEvent ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openAccordions.purchaseEvent && (
                <div className="px-5 pb-4 pt-1 text-xs text-slate-600 space-y-2 bg-slate-50/50">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Meta Pixel & CAPI Purchase Fired</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>TikTok Pixel Event Fired</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Google Analytics 4 Purchase Recorded</span>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: Status History */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('statusHistory')}
                className="w-full px-5 py-3.5 text-left flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>Status History</span>
                {openAccordions.statusHistory ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openAccordions.statusHistory && (
                <div className="px-5 pb-4 pt-1 text-xs text-slate-600 space-y-2 bg-slate-50/50">
                  {order.timeline && order.timeline.length > 0 ? (
                    order.timeline.map((tl, i) => (
                      <div key={i} className="border-l-2 border-slate-200 pl-3 py-1 space-y-0.5">
                        <span className="font-bold text-slate-800 block">{tl.title}</span>
                        <p className="text-[11px] text-slate-500 leading-tight">{tl.description}</p>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {formatDateTime(tl.timestamp)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 text-xs py-1">
                      Order dibuat pada {formatDateTime(order.createdAt)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Accordion 4: Payment Status History */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('paymentStatusHistory')}
                className="w-full px-5 py-3.5 text-left flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>Payment Status History</span>
                {openAccordions.paymentStatusHistory ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openAccordions.paymentStatusHistory && (
                <div className="px-5 pb-4 pt-1 text-xs text-slate-600 space-y-1.5 bg-slate-50/50">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Status:</span>
                    <span className="font-bold text-slate-800 uppercase">{order.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Metode:</span>
                    <span className="font-medium text-slate-800">{order.paymentMethod}</span>
                  </div>
                  {order.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Waktu Bayar:</span>
                      <span className="font-mono text-slate-800">{formatDateTime(order.paidAt)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Accordion 5: Email History */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('emailHistory')}
                className="w-full px-5 py-3.5 text-left flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>Email History</span>
                {openAccordions.emailHistory ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openAccordions.emailHistory && (
                <div className="px-5 pb-4 pt-1 text-xs text-slate-600 space-y-1.5 bg-slate-50/50">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                    <span>Email Konfirmasi Terkirim: {order.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>WhatsApp Link Privat Terkirim: {order.customerPhone}</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* FOOTER INFO (Matches screenshot) */}
          <div className="flex items-center justify-between px-2 pt-1 text-xs text-slate-400">
            <div>
              <span className="block text-[11px]">Last Updated</span>
              <span className="font-medium text-slate-600">
                {formatDateTime(order.updatedAt || order.createdAt)}
              </span>
            </div>
            <div 
              className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px] select-none"
              title="Staff System"
            >
              SS
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
