import React, { useState } from 'react';
import { 
  FolderDown, 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Zap, 
  CreditCard,
  Scale,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Building2,
  TrendingUp,
  Palette,
  Compass,
  HelpCircle,
  Info,
  Clock,
  Check,
  FileCheck2,
  Sparkles,
  Download
} from 'lucide-react';
import { Product } from '../../types/schema';
import { formatRupiah } from '../../lib/formatters';

interface StorefrontProps {
  products: Product[];
  onSelectProduct: (slug: string) => void;
  onDirectCheckout: (slug: string) => void;
}

export const Storefront: React.FC<StorefrontProps> = ({
  products,
  onSelectProduct,
  onDirectCheckout
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const categories = [
    { id: 'ALL', label: 'Semua Produk', icon: Compass },
    { id: 'cat_architecture', label: 'Arsitektur & Konstruksi', icon: Building2 },
    { id: 'cat_finance', label: 'Bisnis & Finansial', icon: TrendingUp },
    { id: 'cat_design', label: 'Desain & UI/UX', icon: Palette }
  ];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'ALL' || p.categoryId === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // FAQ Items
  const faqList = [
    {
      q: 'Metode pembayaran apa saja yang didukung?',
      a: 'Kami mendukung pembayaran otomatis 24 jam melalui QRIS (dapat dipindai dengan GoPay, OVO, DANA, ShopeePay, LinkAja, BCA Mobile, dan seluruh aplikasi m-banking) serta Virtual Account Bank resmi (BCA, Mandiri, BNI, BRI, Permata).'
    },
    {
      q: 'Bagaimana cara saya menerima file setelah menyelesaikan pembayaran?',
      a: 'Pengiriman berlangsung otomatis 100% detik itu juga. Setelah pembayaran terverifikasi oleh gateway, layar browser Anda akan langsung menampilkan portal unduhan dengan token aman. Selain itu, salinan link download otomatis dikirimkan ke Email dan WhatsApp yang Anda cantumkan.'
    },
    {
      q: 'Apakah file mentah bisa diedit dan disesuaikan?',
      a: 'Ya, seluruh template dan aset kami sediakan dalam format sumber mentah (AutoCAD DWG, SketchUp SKP, Excel XLSX/XLSM, Figma/UI) yang terbuka penuh tanpa password rahasia. Anda bebas mengedit rumus, mengubah layer, dimensi, maupun material sesuai standar proyek Anda.'
    },
    {
      q: 'Bagaimana ketentuan lisensi untuk proyek berbayar klien?',
      a: 'Setiap pembelian mencakup Lisensi Komersial Standar. Anda bebas menggunakan file untuk proyek pribadi maupun pekerjaan berbayar untuk klien tanpa batasan jumlah proyek. Anda hanya dilarang mendistribusikan ulang atau menjual kembali (reselling) file mentah template tersebut.'
    },
    {
      q: 'Apakah ada kebijakan pengembalian dana (refund)?',
      a: 'Karena produk digital langsung terkirim dan dapat diunduh, pengembalian dana berlaku jika file terbukti rusak/corrupt atau tautan tidak dapat diakses dan tim bantuan kami tidak berhasil memberikan file pengganti dalam waktu 1x24 jam kerja.'
    },
    {
      q: 'Ke mana saya bisa meminta bantuan jika mengalami kendala teknis?',
      a: 'Tim bantuan kami siaga melalui WhatsApp resmi yang tercantum di situs ini. Anda juga dapat menggunakan fitur Cek Order di pojok kanan atas untuk mengecek status transaksi atau mengunduh ulang file Anda kapan pun dibutuhkan.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* ======================================================== */}
      {/* 1. HERO SECTION (Clean, Trustworthy, Semi-Company Profile)*/}
      {/* ======================================================== */}
      <section id="beranda" className="relative overflow-hidden bg-slate-900 text-white pt-16 pb-20 lg:pt-20 lg:pb-24 border-b border-slate-800">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Factual, Verified Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-emerald-400 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Produk Digital untuk Arsitektur, Konstruksi & Bisnis</span>
          </div>

          {/* Headline (Max 2 lines on desktop, clean typography) */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight max-w-3xl mx-auto">
            Template & Aset Digital Profesional untuk Proyek Anda
          </h1>

          {/* Subtitle (1-2 clear, informative sentences) */}
          <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Kumpulan dokumen kerja teruji, gambar AutoCAD standar, kalkulasi Master RAB Excel, dan aset desain siap pakai untuk menghemat waktu kerja tanpa mengurangi ketelitian teknis.
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <button
              onClick={() => scrollToSection('katalog-section')}
              className="w-full sm:w-auto px-6 py-3 bg-[#00875a] hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lihat Katalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('cara-belanja')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer text-center"
            >
              Cara Belanja
            </button>
          </div>

          {/* 3 Core Value Points in a Clean, Compact Row */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center justify-center gap-2.5 p-2 rounded-xl bg-slate-800/40 border border-slate-800">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Otomatis via Email & WA</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 p-2 rounded-xl bg-slate-800/40 border border-slate-800">
              <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>QRIS & Virtual Account</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 p-2 rounded-xl bg-slate-800/40 border border-slate-800">
              <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Lisensi Komersial Proyek</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. KATALOG SECTION & FILTER BAR (Clean One-Row Layout)    */}
      {/* ======================================================== */}
      <section id="katalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Katalog Produk Digital
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pilih paket template siap pakai dengan pengiriman otomatis dan garansi file utuh.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Menampilkan <span className="font-bold text-slate-900">{filteredProducts.length}</span> dari {products.length} produk
          </div>
        </div>

        {/* Filter Categories and Search Input in ONE Neat Row on Desktop */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200/90 mb-8 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Categories Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama produk, format file..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Products Grid: 3 columns desktop, 2 columns tablet, 1 column mobile */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Produk Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Tidak ada produk yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#00875a] text-white hover:bg-emerald-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Reset Filter & Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const discountPercent = Math.round(
                ((product.regularPrice - product.discountPrice) / product.regularPrice) * 100
              );

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
                >
                  {/* Thumbnail Image: Uniform Aspect Ratio */}
                  <div 
                    onClick={() => onSelectProduct(product.slug)}
                    className="relative aspect-[16/10] overflow-hidden bg-slate-100 cursor-pointer"
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    {discountPercent > 0 && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                        HEMAT {discountPercent}%
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-1 rounded-md flex items-center gap-1">
                      <FolderDown className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{product.files?.length || 1} File Siap Pakai</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Category tag */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                        <span className="font-bold text-emerald-700 uppercase tracking-wider text-[11px]">
                          {product.categoryName || 'Template Digital'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {product.sku || 'DIGITAL'}
                        </span>
                      </div>

                      {/* Product Name (Fixed max 2 lines for uniform card heights) */}
                      <h3
                        onClick={() => onSelectProduct(product.slug)}
                        className="font-bold text-base text-slate-900 leading-snug line-clamp-2 min-h-[2.75rem] hover:text-emerald-700 cursor-pointer transition-colors"
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      {/* Short Description */}
                      <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {product.shortDescription}
                      </p>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-end justify-between gap-3">
                      <div>
                        <span className="text-xs text-slate-400 line-through block">
                          {formatRupiah(product.regularPrice)}
                        </span>
                        <span className="text-lg font-black text-slate-900 block leading-tight">
                          {formatRupiah(product.discountPrice)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectProduct(product.slug)}
                          className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/90 rounded-xl transition-colors cursor-pointer"
                        >
                          Detail
                        </button>
                        <button
                          type="button"
                          onClick={() => onDirectCheckout(product.slug)}
                          className="px-4 py-2 text-xs font-bold text-white bg-[#00875a] hover:bg-emerald-700 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Beli</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 3. CARA BELANJA (3-4 Clear Steps with Icons)             */}
      {/* ======================================================== */}
      <section id="cara-belanja" className="bg-white py-16 lg:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Alur Pembelian Praktis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Cara Belanja di Ruang Proyek
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Proses transaksi instan tanpa perlu menunggu konfirmasi manual admin. File langsung di tangan Anda dalam 4 langkah mudah:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-extrabold mb-4 shadow-xs">
                  01
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1.5">
                  Pilih Produk
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pilih template AutoCAD, SketchUp, atau Master RAB Excel yang sesuai dengan kebutuhan perencanaan proyek Anda.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Akses katalog 24 jam
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#00875a] text-white flex items-center justify-center text-sm font-extrabold mb-4 shadow-xs">
                  02
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1.5">
                  Pembayaran Instan
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gunakan QRIS (GoPay, OVO, DANA, m-Banking) atau Virtual Account. Pembayaran otomatis diverifikasi dalam hitungan detik.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Bebas biaya tersembunyi
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-extrabold mb-4 shadow-xs">
                  03
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1.5">
                  Terima File Otomatis
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Setelah lunas, layar langsung membuka link download. Cadangan tautan privat juga langsung dikirimkan ke Email dan WhatsApp Anda.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Enkripsi token aman
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-extrabold mb-4 shadow-xs">
                  04
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1.5">
                  Download & Pakai
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unduh paket file mentah berkecepatan tinggi. Bebas Anda edit dan aplikasikan langsung pada proyek nyata Anda.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Lisensi komersial seumur hidup
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. KENAPA RUANG PROYEK (Keunggulan Singkat & Teruji)      */}
      {/* ======================================================== */}
      <section id="kenapa-kami" className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Kenapa Memilih Ruang Proyek?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Kami memprioritaskan kualitas file, kemudahan modifikasi, dan kejelasan lisensi untuk kenyamanan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Standar Praktisi Riil
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Template disusun mengikuti standar gambar teknik arsitektur dan analisa harga satuan (AHSP) yang lazim digunakan di proyek lapangan.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                100% Full Editable
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                File disediakan dalam format asli (.DWG, .SKP, .XLSX) tanpa proteksi sel berlebih, siap dimodifikasi dan disesuaikan dengan kebutuhan Anda.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Bebas Royalti Proyek
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sekali beli, bebas dipakai berkali-kali untuk portofolio, tender, maupun proyek berbayar klien tanpa biaya tambahan.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Bantuan WhatsApp Responsif
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Jika ada kendala tautan unduhan atau membuka file, tim customer care kami siap membantu via WhatsApp resmi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. TENTANG KAMI (Company Profile Singkat)                 */}
      {/* ======================================================== */}
      <section id="tentang" className="py-16 lg:py-20 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
            {/* Visual Icon / Logo Placeholder */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg">
              <Building2 className="w-12 h-12" />
            </div>

            {/* Content Profile */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold border border-slate-700 mb-3">
                <Info className="w-3.5 h-3.5" />
                <span>Profil Studio</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Tentang Ruang Proyek
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Ruang Proyek adalah inisiatif kurasi aset dan template digital yang dibangun untuk mendukung efisiensi kerja arsitek, konsultan perencana, kontraktor, estimator, dan pemilik usaha di Indonesia. Kami menghadirkan kumpulan dokumen kerja standar, gambar teknik teruji, serta formulir kalkulasi otomatis yang telah dipraktekkan di lapangan, sehingga Anda dapat menyelesaikan proyek dengan cepat tanpa mengorbankan kualitas perencanaan.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Pengiriman Sistem Otomatis
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Terenkripsi & Terverifikasi
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. FAQ (Accordion 6 Pertanyaan Umum)                     */}
      {/* ======================================================== */}
      <section id="faq" className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-bold mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Pertanyaan Umum</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Kerap Ditanyakan (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Jawaban ringkas seputar pembayaran, pengiriman file, lisensi, dan dukungan pelanggan.
            </p>
          </div>

          <div className="space-y-3">
            {faqList.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5 text-emerald-600" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. TESTIMONI (Simulasi Berlabel Jelas CONTOH)            */}
      {/* ======================================================== */}
      <section id="testimoni" className="py-16 lg:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold mb-3">
              <span>[CONTOH TESTIMONI - SIMULASI TAMPILAN]</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pengalaman Pengguna
            </h2>
            <p className="text-xs text-slate-500 mt-2 max-w-xl mx-auto">
              <em>Catatan Transparansi: Bagian ini merupakan simulasi tata letak visual ulasan produk. Ulasan riil pelanggan akan diperbarui secara berkala.</em>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-[10px] font-bold text-slate-500 ml-1.5">[Contoh]</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  &ldquo;Template RAB Excel sangat membantu mempercepat estimasi biaya proyek ruko klien saya. Rumus-rumusnya rapi dan mudah disesuaikan.&rdquo;
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs">
                  AP
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Arsitek Mandiri [Contoh]</p>
                  <p className="text-[10px] text-slate-500">Pengguna Master RAB</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-[10px] font-bold text-slate-500 ml-1.5">[Contoh]</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  &ldquo;File AutoCAD DWG lengkap dengan layer dan detail pondasi. Langsung terkirim ke WhatsApp setelah scan QRIS, prosesnya sangat cepat.&rdquo;
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs">
                  DA
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Drafter & Pelaksana [Contoh]</p>
                  <p className="text-[10px] text-slate-500">Pengguna Paket Gambar Kerja</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-[10px] font-bold text-slate-500 ml-1.5">[Contoh]</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  &ldquo;Aset SketchUp membantu presentasi konsep ke owner jauh lebih menarik. Tautan unduhan privat tersimpan rapi di histori email.&rdquo;
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs">
                  IK
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Konsultan Desain [Contoh]</p>
                  <p className="text-[10px] text-slate-500">Pengguna 3D SketchUp Model</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
