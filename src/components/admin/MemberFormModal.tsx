import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Key, 
  Check, 
  Info, 
  ExternalLink,
  LayoutDashboard,
  FileSpreadsheet,
  PackagePlus,
  ShoppingBag,
  CreditCard,
  Users,
  BarChart,
  Boxes,
  Receipt,
  LineChart,
  Globe,
  Bell,
  Crosshair,
  MessageSquare,
  Wallet
} from 'lucide-react';
import { TeamMember, MemberPermissions } from '../../types/schema';

interface MemberFormModalProps {
  isOpen: boolean;
  member?: TeamMember | null;
  onClose: () => void;
  onSave: (data: Partial<TeamMember>) => Promise<void>;
}

export const defaultMemberPermissions: MemberPermissions = {
  dashboard: { lihatDashboard: true },
  laporanPenjualan: { lihatReport: true },
  tambahProduk: {
    semuaProduk: false,
    buatProduk: true,
    lihatProduk: true,
    editProduk: true,
    hapusProduk: true
  },
  semuaOrder: {
    lihatOrder: true,
    scopeOrder: 'ASSIGNED_ORDER',
    inputOrder: true,
    shipmentsPengiriman: false,
    hapusOrder: true,
    editOrder: {
      nama: true,
      assignee: true,
      nomorTelepon: true,
      alamat: false,
      produkKuantitas: true,
      payment: true
    },
    updateOrderStatus: {
      pending: true,
      refund: true,
      process: true,
      complete: true,
      cancel: true
    },
    updateOrderPaymentStatus: {
      terbayar: true,
      belumDiBayar: true
    }
  },
  landingPage: { aturAksesLandingPage: true },
  pembayaran: {
    lihatPembayaran: true,
    updatePembayaran: true,
    hapusPembayaran: true,
    halamanPembayaran: true
  },
  teamMember: {
    tambahTeamMember: false,
    lihatTeamMember: false,
    updateTeamMember: false,
    hapusTeamMember: false
  },
  productReports: { lihatTeamReport: true },
  stok: { lihatInventarisStok: true },
  transaction: { lihatTransaksi: true },
  statistik: {
    lihatStatistik: true,
    lihatTotalOrder: true,
    lihatTotalTerbayar: true,
    lihatRasioTerbayar: true,
    lihatOrderBelumDibayar: true,
    lihatCOGS: true,
    lihatRevenueBelumDibayar: true,
    lihatBumpOrder: true,
    lihatBumpRevenue: true,
    lihatDiscountClaim: true,
    lihatShippingCost: true,
    lihatGrosRevenue: true,
    lihatNetRevenue: true,
    lihatGrossProfit: true,
    lihatNetProfit: true,
    lihatPengeluaran: false,
    lihatKuantitasTerjual: false
  },
  customDomain: {
    tambahDomain: false,
    lihatDomain: false,
    editDomain: false,
    hapusDomain: false
  },
  notifikasi: {
    lihatNotifikasi: true,
    buatAkunEmail: true
  },
  tracking: {
    lihatTracking: true,
    tambahTracking: true,
    hapusTracking: true
  },
  followUpManual: {
    lihatFollowUp: true,
    buatTemplate: true,
    editTemplate: true
  },
  balance: {
    lihatBalance: false,
    tambahBalance: false,
    withDrawBalance: false,
    lihatRiwayatBalance: false
  }
};

export const MemberFormModal: React.FC<MemberFormModalProps> = ({
  isOpen,
  member,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'Admin' | 'Super Admin' | 'Staff' | 'CS' | 'Finance'>('Admin');
  const [permissions, setPermissions] = useState<MemberPermissions>(defaultMemberPermissions);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  useEffect(() => {
    if (member) {
      setName(member.name);
      setEmail(member.email);
      setPhone(member.phone);
      setRole(member.role);
      setPermissions(member.permissions || defaultMemberPermissions);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setRole('Admin');
      setPermissions(defaultMemberPermissions);
    }
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Nama lengkap dan email wajib diisi!');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        permissions,
        status: member?.status || 'ACTIVE'
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan data member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom checkbox renderer matching the screenshot exactly
  const renderCheckbox = (
    label: string,
    checked: boolean,
    onChange: (val: boolean) => void,
    className = ''
  ) => {
    return (
      <label className={`inline-flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm text-slate-700 hover:text-slate-900 ${className}`}>
        <div
          onClick={(e) => {
            e.preventDefault();
            onChange(!checked);
          }}
          className={`w-4 h-4 rounded flex items-center justify-center transition-all border ${
            checked
              ? 'bg-[#2552df] border-[#2552df] text-white'
              : 'bg-white border-slate-300 hover:border-slate-400'
          }`}
        >
          {checked && <Check className="w-3 h-3 stroke-[3]" />}
        </div>
        <span className="leading-tight">{label}</span>
      </label>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {member ? 'Edit Member' : 'Tambah Member'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-6 flex-1 text-slate-800 text-xs sm:text-sm">
          {/* ======================================================== */}
          {/* SECTION 1: MEMBER PROFILE                                */}
          {/* ======================================================== */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Member Profile
            </h3>

            {/* Row 1: Nama, E-mail, Nomor Telepon */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Rizky"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@gmail.com"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
                />
              </div>
            </div>

            {/* Row 2: Role & Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 cursor-pointer"
                >
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="CS">Customer Service (CS)</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                {!showPasswordChange ? (
                  <button
                    type="button"
                    onClick={() => setShowPasswordChange(true)}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#2552df] text-[#2552df] hover:bg-blue-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center"
                  >
                    Change Password
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Masukkan password baru..."
                      value={passwordValue}
                      onChange={(e) => setPasswordValue(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordChange(false)}
                      className="px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 rounded-xl font-bold cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* ======================================================== */}
          {/* SECTION 2: PERMISSION                                    */}
          {/* ======================================================== */}
          <div className="space-y-6">
            <h3 className="font-bold text-slate-900 text-sm">
              Permission
            </h3>

            {/* 1. Dashboard */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
              <div className="pl-6">
                {renderCheckbox(
                  'Lihat Dashboard',
                  permissions.dashboard.lihatDashboard,
                  (val) => setPermissions({ ...permissions, dashboard: { lihatDashboard: val } })
                )}
              </div>
            </div>

            {/* 2. Laporan Penjualan */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Laporan Penjualan</span>
              </div>
              <div className="pl-6">
                {renderCheckbox(
                  'Lihat Report',
                  permissions.laporanPenjualan.lihatReport,
                  (val) => setPermissions({ ...permissions, laporanPenjualan: { lihatReport: val } })
                )}
              </div>
            </div>

            {/* 3. Tambah Produk */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <PackagePlus className="w-4 h-4" />
                <span>Tambah Produk</span>
              </div>
              <div className="pl-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
                {renderCheckbox(
                  'Semua Produk',
                  permissions.tambahProduk.semuaProduk,
                  (val) => setPermissions({ ...permissions, tambahProduk: { ...permissions.tambahProduk, semuaProduk: val } })
                )}
                {renderCheckbox(
                  'Buat Produk',
                  permissions.tambahProduk.buatProduk,
                  (val) => setPermissions({ ...permissions, tambahProduk: { ...permissions.tambahProduk, buatProduk: val } })
                )}
                {renderCheckbox(
                  'Lihat Produk',
                  permissions.tambahProduk.lihatProduk,
                  (val) => setPermissions({ ...permissions, tambahProduk: { ...permissions.tambahProduk, lihatProduk: val } })
                )}
                {renderCheckbox(
                  'Edit Produk',
                  permissions.tambahProduk.editProduk,
                  (val) => setPermissions({ ...permissions, tambahProduk: { ...permissions.tambahProduk, editProduk: val } })
                )}
                {renderCheckbox(
                  'Hapus Produk',
                  permissions.tambahProduk.hapusProduk,
                  (val) => setPermissions({ ...permissions, tambahProduk: { ...permissions.tambahProduk, hapusProduk: val } })
                )}
              </div>
            </div>

            {/* 4. Semua Order */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <ShoppingBag className="w-4 h-4" />
                <span>Semua Order</span>
              </div>

              <div className="pl-6 space-y-4">
                {/* Order Main Options */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                  <div>
                    {renderCheckbox(
                      'Lihat Order',
                      permissions.semuaOrder.lihatOrder,
                      (val) => setPermissions({ ...permissions, semuaOrder: { ...permissions.semuaOrder, lihatOrder: val } })
                    )}

                    {/* Radio Sub-options */}
                    <div className="mt-2.5 pl-6 space-y-2 text-xs">
                      {[
                        { id: 'SEMUA', label: 'Lihat Semua Order' },
                        { id: 'ASSIGNED_ORDER', label: 'Hanya Order yang Diassign' },
                        { id: 'ASSIGNED_PRODUCT', label: 'Hanya Produk yang Diassign' }
                      ].map((item) => (
                        <label key={item.id} className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                          <input
                            type="radio"
                            name="scopeOrder"
                            checked={permissions.semuaOrder.scopeOrder === item.id}
                            onChange={() => setPermissions({
                              ...permissions,
                              semuaOrder: { ...permissions.semuaOrder, scopeOrder: item.id as any }
                            })}
                            className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    {renderCheckbox(
                      'Input Order',
                      permissions.semuaOrder.inputOrder,
                      (val) => setPermissions({ ...permissions, semuaOrder: { ...permissions.semuaOrder, inputOrder: val } })
                    )}
                  </div>

                  <div>
                    {renderCheckbox(
                      'Shipments/Pengiriman',
                      permissions.semuaOrder.shipmentsPengiriman,
                      (val) => setPermissions({ ...permissions, semuaOrder: { ...permissions.semuaOrder, shipmentsPengiriman: val } })
                    )}
                  </div>

                  <div>
                    {renderCheckbox(
                      'Hapus Order',
                      permissions.semuaOrder.hapusOrder,
                      (val) => setPermissions({ ...permissions, semuaOrder: { ...permissions.semuaOrder, hapusOrder: val } })
                    )}
                  </div>
                </div>

                {/* Sub-groups: Edit Order, Update Order Status, Update Order Payment Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
                  {/* Edit Order */}
                  <div className="space-y-2">
                    {renderCheckbox(
                      'Edit Order',
                      true,
                      () => {},
                      'font-bold'
                    )}
                    <div className="pl-6 grid grid-cols-2 gap-2 text-xs">
                      {renderCheckbox(
                        'Nama',
                        permissions.semuaOrder.editOrder.nama,
                        (v) => setPermissions({ ...permissions, semuaOrder: { ...permissions.semuaOrder, editOrder: { ...permissions.semuaOrder.editOrder, nama: v } } })
                      )}
                      {renderCheckbox(
                        'Assignee',
                        permissions.semuaOrder.editOrder.assignee,
                        (v) => setPermissions({ ...permissions, semuaOrder: { ...permissions.semuaOrder, editOrder: { ...permissions.semuaOrder.editOrder, assignee: v } } })
                      )}
                      {renderCheckbox(
                        'Nomor Telepon',
                        permissions.semuaOrder.editOrder.nomorTelepon,
                        (v) => setPermissions({ ...permissions, semuaOrder: { ...permissions.semuaOrder, editOrder: { ...permissions.semuaOrder.editOrder, nomorTelepon: v } } })
                      )}
                      {renderCheckbox(
                        'Alamat',
                        permissions.semuaOrder.editOrder.alamat,
                        (v) => setPermissions({ ...permissions, semuaOrder: { ...permissions.semuaOrder, editOrder: { ...permissions.semuaOrder.editOrder, alamat: v } } })
                      )}
                      {renderCheckbox(
                        'Produk & Kuantitas',
                        permissions.semuaOrder.editOrder.produkKuantitas,
                        (v) => setPermissions({ ...permissions, semuaOrder: { ...permissions.semuaOrder, editOrder: { ...permissions.semuaOrder.editOrder, produkKuantitas: v } } })
                      )}
                      {renderCheckbox(
                        'Payment',
                        permissions.semuaOrder.editOrder.payment,
                        (v) => setPermissions({ ...permissions, semuaOrder: { ...permissions.semuaOrder, editOrder: { ...permissions.semuaOrder.editOrder, payment: v } } })
                      )}
                    </div>
                  </div>

                  {/* Update Order Status */}
                  <div className="space-y-2">
                    {renderCheckbox(
                      'Update Order Status',
                      true,
                      () => {},
                      'font-bold'
                    )}
                    <div className="pl-6 grid grid-cols-2 gap-2 text-xs">
                      {renderCheckbox(
                        'Pending',
                        permissions.semuaOrder.updateOrderStatus.pending,
                        (v) => setPermissions({ ...permissions, semuaOrder: { ...permissions.semuaOrder, updateOrderStatus: { ...permissions.semuaOrder.updateOrderStatus, pending: v } } })
                      )}
                      {renderCheckbox(
                        'Refund',
                        permissions.semuaOrder.updateOrderStatus.refund,
                        (v) => setPermissions({ ...permissions, semuaOrder: { ...permissions.semuaOrder, updateOrderStatus: { ...permissions.semuaOrder.updateOrderStatus, refund: v } } })
                      )}
                      {renderCheckbox(
                        'Process',
                        permissions.semuaOrder.updateOrderStatus.process,
                        (v) => setPermissions({ ...permissions, semuaOrder: { ...permissions.semuaOrder, updateOrderStatus: { ...permissions.semuaOrder.updateOrderStatus, process: v } } })
                      )}
                      {renderCheckbox(
                        'Complete',
                        permissions.semuaOrder.updateOrderStatus.complete,
                        (v) => setPermissions({ ...permissions, semuaOrder: { ...permissions.semuaOrder, updateOrderStatus: { ...permissions.semuaOrder.updateOrderStatus, complete: v } } })
                      )}
                      {renderCheckbox(
                        'Cancel',
                        permissions.semuaOrder.updateOrderStatus.cancel,
                        (v) => setPermissions({ ...permissions, semuaOrder: { ...permissions.semuaOrder, updateOrderStatus: { ...permissions.semuaOrder.updateOrderStatus, cancel: v } } })
                      )}
                    </div>
                  </div>

                  {/* Update Order Payment Status */}
                  <div className="space-y-2">
                    {renderCheckbox(
                      'Update Order Payment Status',
                      true,
                      () => {},
                      'font-bold'
                    )}
                    <div className="pl-6 space-y-2 text-xs">
                      {renderCheckbox(
                        'Terbayar',
                        permissions.semuaOrder.updateOrderPaymentStatus.terbayar,
                        (v) => setPermissions({ ...permissions, semuaOrder: { ...permissions.semuaOrder, updateOrderPaymentStatus: { ...permissions.semuaOrder.updateOrderPaymentStatus, terbayar: v } } })
                      )}
                      {renderCheckbox(
                        'Belum Di Bayar',
                        permissions.semuaOrder.updateOrderPaymentStatus.belumDiBayar,
                        (v) => setPermissions({ ...permissions, semuaOrder: { ...permissions.semuaOrder, updateOrderPaymentStatus: { ...permissions.semuaOrder.updateOrderPaymentStatus, belumDiBayar: v } } })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Landing Page */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs">
                <Globe className="w-4 h-4" />
                <span>Landing Page</span>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="pl-6">
                <button
                  type="button"
                  onClick={() => alert('Akses Landing Page telah disinkronkan dengan hak akses member.')}
                  className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Atur Akses Landing Page</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>

            {/* 6. Pembayaran */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <CreditCard className="w-4 h-4" />
                <span>Pembayaran</span>
              </div>
              <div className="pl-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {renderCheckbox(
                  'Lihat Pembayaran',
                  permissions.pembayaran.lihatPembayaran,
                  (v) => setPermissions({ ...permissions, pembayaran: { ...permissions.pembayaran, lihatPembayaran: v } })
                )}
                {renderCheckbox(
                  'Update Pembayaran',
                  permissions.pembayaran.updatePembayaran,
                  (v) => setPermissions({ ...permissions, pembayaran: { ...permissions.pembayaran, updatePembayaran: v } })
                )}
                {renderCheckbox(
                  'Hapus Pembayaran',
                  permissions.pembayaran.hapusPembayaran,
                  (v) => setPermissions({ ...permissions, pembayaran: { ...permissions.pembayaran, hapusPembayaran: v } })
                )}
                {renderCheckbox(
                  'Halaman Pembayaran',
                  permissions.pembayaran.halamanPembayaran,
                  (v) => setPermissions({ ...permissions, pembayaran: { ...permissions.pembayaran, halamanPembayaran: v } })
                )}
              </div>
            </div>

            {/* 7. Team Member */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <Users className="w-4 h-4" />
                <span>Team Member</span>
              </div>
              <div className="pl-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {renderCheckbox(
                  'Tambah Team Member',
                  permissions.teamMember.tambahTeamMember,
                  (v) => setPermissions({ ...permissions, teamMember: { ...permissions.teamMember, tambahTeamMember: v } })
                )}
                {renderCheckbox(
                  'Lihat Team Member',
                  permissions.teamMember.lihatTeamMember,
                  (v) => setPermissions({ ...permissions, teamMember: { ...permissions.teamMember, lihatTeamMember: v } })
                )}
                {renderCheckbox(
                  'Update Team Member',
                  permissions.teamMember.updateTeamMember,
                  (v) => setPermissions({ ...permissions, teamMember: { ...permissions.teamMember, updateTeamMember: v } })
                )}
                {renderCheckbox(
                  'Hapus Team Member',
                  permissions.teamMember.hapusTeamMember,
                  (v) => setPermissions({ ...permissions, teamMember: { ...permissions.teamMember, hapusTeamMember: v } })
                )}
              </div>
            </div>

            {/* 8. Product Reports */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <BarChart className="w-4 h-4" />
                <span>Product Reports</span>
              </div>
              <div className="pl-6">
                {renderCheckbox(
                  'Lihat Team Report',
                  permissions.productReports.lihatTeamReport,
                  (v) => setPermissions({ ...permissions, productReports: { lihatTeamReport: v } })
                )}
              </div>
            </div>

            {/* 9. Stok */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <Boxes className="w-4 h-4" />
                <span>Stok</span>
              </div>
              <div className="pl-6">
                {renderCheckbox(
                  'Lihat Inventaris Stok',
                  permissions.stok.lihatInventarisStok,
                  (v) => setPermissions({ ...permissions, stok: { lihatInventarisStok: v } })
                )}
              </div>
            </div>

            {/* 10. Transaction */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <Receipt className="w-4 h-4" />
                <span>Transaction</span>
              </div>
              <div className="pl-6">
                {renderCheckbox(
                  'Lihat Transaksi',
                  permissions.transaction.lihatTransaksi,
                  (v) => setPermissions({ ...permissions, transaction: { lihatTransaksi: v } })
                )}
              </div>
            </div>

            {/* 11. Statistik (4 Columns Layout exactly like screenshot) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <LineChart className="w-4 h-4" />
                <span>Statistik</span>
              </div>
              <div className="pl-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2.5 gap-x-4">
                {/* Column 1 */}
                <div className="space-y-2">
                  {renderCheckbox('Lihat Statistik', permissions.statistik.lihatStatistik, (v) => setPermissions({ ...permissions, statistik: { ...permissions.statistik, lihatStatistik: v } }))}
                  {renderCheckbox('Lihat Order Belum Dibayar', permissions.statistik.lihatOrderBelumDibayar, (v) => setPermissions({ ...permissions, statistik: { ...permissions.statistik, lihatOrderBelumDibayar: v } }))}
                  {renderCheckbox('Lihat Bump Revenue', permissions.statistik.lihatBumpRevenue, (v) => setPermissions({ ...permissions, statistik: { ...permissions.statistik, lihatBumpRevenue: v } }))}
                  {renderCheckbox('Lihat Net Revenue', permissions.statistik.lihatNetRevenue, (v) => setPermissions({ ...permissions, statistik: { ...permissions.statistik, lihatNetRevenue: v } }))}
                  {renderCheckbox('Lihat Kuantitas Terjual', permissions.statistik.lihatKuantitasTerjual, (v) => setPermissions({ ...permissions, statistik: { ...permissions.statistik, lihatKuantitasTerjual: v } }))}
                </div>

                {/* Column 2 */}
                <div className="space-y-2">
                  {renderCheckbox('Lihat Total Order', permissions.statistik.lihatTotalOrder, (v) => setPermissions({ ...permissions, statistik: { ...permissions.statistik, lihatTotalOrder: v } }))}
                  {renderCheckbox('Lihat COGS', permissions.statistik.lihatCOGS, (v) => setPermissions({ ...permissions, statistik: { ...permissions.statistik, lihatCOGS: v } }))}
                  {renderCheckbox('Lihat Discount Claim', permissions.statistik.lihatDiscountClaim, (v) => setPermissions({ ...permissions, statistik: { ...permissions.statistik, lihatDiscountClaim: v } }))}
                  {renderCheckbox('Lihat Gross Profit', permissions.statistik.lihatGrossProfit, (v) => setPermissions({ ...permissions, statistik: { ...permissions.statistik, lihatGrossProfit: v } }))}
                </div>

                {/* Column 3 */}
                <div className="space-y-2">
                  {renderCheckbox('Lihat Total Terbayar', permissions.statistik.lihatTotalTerbayar, (v) => setPermissions({ ...permissions, statistik: { ...permissions.statistik, lihatTotalTerbayar: v } }))}
                  {renderCheckbox('Lihat Revenue Belum Dibayar', permissions.statistik.lihatRevenueBelumDibayar, (v) => setPermissions({ ...permissions, statistik: { ...permissions.statistik, lihatRevenueBelumDibayar: v } }))}
                  {renderCheckbox('Lihat Shipping Cost', permissions.statistik.lihatShippingCost, (v) => setPermissions({ ...permissions, statistik: { ...permissions.statistik, lihatShippingCost: v } }))}
                  {renderCheckbox('Lihat Net Profit', permissions.statistik.lihatNetProfit, (v) => setPermissions({ ...permissions, statistik: { ...permissions.statistik, lihatNetProfit: v } }))}
                </div>

                {/* Column 4 */}
                <div className="space-y-2">
                  {renderCheckbox('Lihat Rasio Terbayar', permissions.statistik.lihatRasioTerbayar, (v) => setPermissions({ ...permissions, statistik: { ...permissions.statistik, lihatRasioTerbayar: v } }))}
                  {renderCheckbox('Lihat Bump Order', permissions.statistik.lihatBumpOrder, (v) => setPermissions({ ...permissions, statistik: { ...permissions.statistik, lihatBumpOrder: v } }))}
                  {renderCheckbox('Lihat Gros Revenue', permissions.statistik.lihatGrosRevenue, (v) => setPermissions({ ...permissions, statistik: { ...permissions.statistik, lihatGrosRevenue: v } }))}
                  {renderCheckbox('Lihat Pengeluaran', permissions.statistik.lihatPengeluaran, (v) => setPermissions({ ...permissions, statistik: { ...permissions.statistik, lihatPengeluaran: v } }))}
                </div>
              </div>
            </div>

            {/* 12. Custom Domain */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <Globe className="w-4 h-4" />
                <span>Custom Domain</span>
              </div>
              <div className="pl-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {renderCheckbox('Tambah Domain', permissions.customDomain.tambahDomain, (v) => setPermissions({ ...permissions, customDomain: { ...permissions.customDomain, tambahDomain: v } }))}
                {renderCheckbox('Lihat Domain', permissions.customDomain.lihatDomain, (v) => setPermissions({ ...permissions, customDomain: { ...permissions.customDomain, lihatDomain: v } }))}
                {renderCheckbox('Edit Domain', permissions.customDomain.editDomain, (v) => setPermissions({ ...permissions, customDomain: { ...permissions.customDomain, editDomain: v } }))}
                {renderCheckbox('Hapus Domain', permissions.customDomain.hapusDomain, (v) => setPermissions({ ...permissions, customDomain: { ...permissions.customDomain, hapusDomain: v } }))}
              </div>
            </div>

            {/* 13. Notifikasi */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <Bell className="w-4 h-4" />
                <span>Notifikasi</span>
              </div>
              <div className="pl-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
                {renderCheckbox('Lihat Notifikasi', permissions.notifikasi.lihatNotifikasi, (v) => setPermissions({ ...permissions, notifikasi: { ...permissions.notifikasi, lihatNotifikasi: v } }))}
                {renderCheckbox('Buat Akun Email', permissions.notifikasi.buatAkunEmail, (v) => setPermissions({ ...permissions, notifikasi: { ...permissions.notifikasi, buatAkunEmail: v } }))}
              </div>
            </div>

            {/* 14. Tracking */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <Crosshair className="w-4 h-4" />
                <span>Tracking</span>
              </div>
              <div className="pl-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
                {renderCheckbox('Lihat Tracking', permissions.tracking.lihatTracking, (v) => setPermissions({ ...permissions, tracking: { ...permissions.tracking, lihatTracking: v } }))}
                {renderCheckbox('Tambah Tracking', permissions.tracking.tambahTracking, (v) => setPermissions({ ...permissions, tracking: { ...permissions.tracking, tambahTracking: v } }))}
                {renderCheckbox('Hapus Tracking', permissions.tracking.hapusTracking, (v) => setPermissions({ ...permissions, tracking: { ...permissions.tracking, hapusTracking: v } }))}
              </div>
            </div>

            {/* 15. Follow Up Manual */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <MessageSquare className="w-4 h-4" />
                <span>Follow Up Manual</span>
              </div>
              <div className="pl-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
                {renderCheckbox('Lihat Follow Up', permissions.followUpManual.lihatFollowUp, (v) => setPermissions({ ...permissions, followUpManual: { ...permissions.followUpManual, lihatFollowUp: v } }))}
                {renderCheckbox('Buat Template', permissions.followUpManual.buatTemplate, (v) => setPermissions({ ...permissions, followUpManual: { ...permissions.followUpManual, buatTemplate: v } }))}
                {renderCheckbox('Edit Template', permissions.followUpManual.editTemplate, (v) => setPermissions({ ...permissions, followUpManual: { ...permissions.followUpManual, editTemplate: v } }))}
              </div>
            </div>

            {/* 16. Balance */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <Wallet className="w-4 h-4" />
                <span>Balance</span>
              </div>
              <div className="pl-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {renderCheckbox('Lihat Balance', permissions.balance.lihatBalance, (v) => setPermissions({ ...permissions, balance: { ...permissions.balance, lihatBalance: v } }))}
                {renderCheckbox('Tambah Balance', permissions.balance.tambahBalance, (v) => setPermissions({ ...permissions, balance: { ...permissions.balance, tambahBalance: v } }))}
                {renderCheckbox('WithDraw Balance', permissions.balance.withDrawBalance, (v) => setPermissions({ ...permissions, balance: { ...permissions.balance, withDrawBalance: v } }))}
                {renderCheckbox('Lihat Riwayat Balance', permissions.balance.lihatRiwayatBalance, (v) => setPermissions({ ...permissions, balance: { ...permissions.balance, lihatRiwayatBalance: v } }))}
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-white sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-blue-600 text-blue-700 hover:bg-blue-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Batalkan
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 rounded-xl bg-[#2552df] hover:bg-[#1c43b8] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
