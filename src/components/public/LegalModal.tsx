import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Scale, HelpCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useStoreSettings } from '../../context/StoreContext';

export type LegalTabType = 'terms' | 'privacy' | 'license' | 'refund';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: LegalTabType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'terms',
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<LegalTabType>(initialTab);
  const { storeProfile } = useStoreSettings();

  // Keep active tab in sync if initialTab changes when opening
  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'terms', label: 'Ketentuan Layanan', icon: FileText },
    { id: 'privacy', label: 'Kebijakan Privasi', icon: ShieldCheck },
    { id: 'license', label: 'Lisensi Digital', icon: Scale },
    { id: 'refund', label: 'Kebijakan Refund', icon: HelpCircle }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[88vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-none">
                Dokumen Legal & Kebijakan
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {storeProfile.businessName} &bull; Standar Transaksi Produk Digital Aman
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 px-6 gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as LegalTabType)}
                className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body / Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-[60vh]">
          {/* TAB 1: KETENTUAN LAYANAN */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs">
                <span className="font-bold">Pemberitahuan:</span> Dengan melakukan transaksi di platform {storeProfile.businessName}, Anda dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan layanan berikut.
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">1. Ruang Lingkup Layanan</h4>
                <p>
                  {storeProfile.businessName} menyediakan produk digital siap pakai mencakup template gambar kerja arsitektur (AutoCAD DWG), 3D modeling (SketchUp SKP), formulir kalkulasi Master RAB (Excel XLSX/XLSM), dan aset pendukung proyek konstruksi.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">2. Alur Transaksi & Pengiriman</h4>
                <p>
                  Seluruh pesanan diproses secara otomatis setelah konfirmasi pembayaran QRIS, Virtual Account, atau E-Wallet valid diterima gateway. Tautan unduhan instan langsung diberikan pada layar konfirmasi dan cadangan link dikirimkan melalui WhatsApp/Email pembeli.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">3. Kewajiban Pengguna</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Memberikan alamat email dan nomor WhatsApp yang aktif dan valid saat checkout.</li>
                  <li>Tidak menyebarluaskan, mendistribusikan ulang (re-distribute), atau menjual kembali file mentah ke pihak lain atau forum publik secara gratis/komersial.</li>
                  <li>Menjaga kerahasiaan tautan unduhan privat yang telah diberikan.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">4. Penafian Tanggung Jawab Teknis</h4>
                <p>
                  Template perhitungan dan gambar kerja adalah alat bantu profesional. Pengguna tetap bertanggung jawab penuh atas penyesuaian struktural, kondisi tanah lokal, dan standar izin bangunan (PBG/IMB) di lokasi proyek riil masing-masing.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: KEBIJAKAN PRIVASI */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
                <span className="font-bold">Komitmen Keamanan Data:</span> Kami menghargai privasi Anda dan tidak akan pernah menjual atau membagikan data kontak Anda kepada pihak manapun.
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">1. Data yang Kami Kumpulkan</h4>
                <p>
                  Saat Anda melakukan pemesanan, kami mengumpulkan data dasar yang diperlukan untuk pemenuhan pesanan:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Nama lengkap (untuk lisensi kepemilikan file).</li>
                  <li>Alamat email (untuk pengiriman bukti transaksi dan link backup unduhan).</li>
                  <li>Nomor WhatsApp (untuk pengiriman instan notifikasi link download via bot/sistem).</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">2. Penggunaan Data</h4>
                <p>
                  Data Anda semata-mata digunakan untuk:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Verifikasi transaksi pembayaran melalui payment gateway resmi.</li>
                  <li>Pembuatan token otorisasi download privat yang terlindungi enkripsi.</li>
                  <li>Layanan bantuan teknis dan customer support bilamana Anda mengalami kendala pengunduhan.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">3. Keamanan Transaksi</h4>
                <p>
                  Kami tidak menyimpan nomor kartu kredit atau PIN Anda. Semua pemrosesan pembayaran dilakukan melalui payment gateway berlisensi Bank Indonesia dengan standar enkripsi 256-bit SSL/TLS.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: LISENSI DIGITAL */}
          {activeTab === 'license' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Lisensi Komersial Standar:</strong> File dapat Anda gunakan untuk proyek pekerjaan nyata tanpa batas jumlah proyek, namun file mentah dilarang dijual kembali.
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">Apa yang DIIZINKAN (Allowed):</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50/60 p-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Menggunakan template untuk proyek pribadi, rumah sendiri, atau properti keluarga.</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50/60 p-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Menggunakan template untuk proyek berbayar klien, owner proyek, tender, atau portofolio biro.</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50/60 p-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Memodifikasi rumus Excel, menambah sheet, mengubah layer CAD, atau mengedit tekstur SketchUp.</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">Apa yang DILARANG (Prohibited):</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-800 bg-rose-50/60 p-2 rounded-lg">
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Menjual kembali (resell) file asli ataupun modifikasi sebagian dalam bentuk template produk digital di marketplace.</span>
                  </div>
                  <div className="flex items-center gap-2 text-rose-800 bg-rose-50/60 p-2 rounded-lg">
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Membagikan link download kepada publik, grup Telegram/WhatsApp publik, atau forum gratisan.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: KEBIJAKAN REFUND */}
          {activeTab === 'refund' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-800 text-xs">
                <strong>Kebijakan Pengembalian Dana untuk Produk Digital:</strong> Mengingat sifat produk digital yang langsung dapat diunduh dan disimpan secara permanen di perangkat Anda setelah pembayaran terverifikasi.
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">1. Kondisi yang Memenuhi Syarat Refund</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>File unduhan rusak (corrupted) atau tautan unduhan tidak dapat diakses sama sekali, dan tim support kami tidak mampu memberikan tautan pengganti dalam waktu 1x24 jam kerja.</li>
                  <li>Terjadi pemotongan pembayaran ganda (double charge) untuk nomor pesanan yang sama akibat gangguan jaringan gateway. Kelebihan bayar akan dikembalikan 100%.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">2. Kondisi yang Tidak Memenuhi Syarat Refund</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Kesalahan memilih produk setelah file berhasil diunduh.</li>
                  <li>Komputer/laptop pembeli tidak memiliki aplikasi yang sesuai (misal: membuka file DWG tanpa software AutoCAD/DWG viewer). Spesifikasi software pendukung sudah tertera jelas di halaman masing-masing produk.</li>
                  <li>Perubahan kebutuhan proyek pribadi setelah pembelian selesai.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">3. Cara Mengajukan Bantuan atau Pengembalian</h4>
                <p>
                  Silakan hubungi customer service kami melalui WhatsApp: <span className="font-bold text-emerald-600">{storeProfile.supportWhatsapp}</span> dengan menyertakan Nomor Order (contoh: <code>ORD-...</code>) dan tangkapan layar kendala.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Terakhir diperbarui: September 2026
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
