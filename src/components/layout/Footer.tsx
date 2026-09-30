import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Headphones, 
  Zap, 
  Mail, 
  MessageCircle, 
  ExternalLink,
  Clock,
  FileText,
  HelpCircle
} from 'lucide-react';
import { useStoreSettings } from '../../context/StoreContext';
import { LegalModal, LegalTabType } from '../public/LegalModal';

interface FooterProps {
  onOpenAdmin?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onNavigateSection }) => {
  const { storeProfile, setIsLoginModalOpen } = useStoreSettings();
  const cleanWa = storeProfile.supportWhatsapp.replace(/[^0-9]/g, '');
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [selectedLegalTab, setSelectedLegalTab] = useState<LegalTabType>('terms');

  const handleOpenLegal = (tab: LegalTabType) => {
    setSelectedLegalTab(tab);
    setLegalModalOpen(true);
  };

  const scrollTo = (id: string) => {
    if (onNavigateSection) {
      onNavigateSection(id);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer id="kontak" className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Pengiriman Instan</p>
                <p className="text-xs text-slate-400">File langsung terkirim via Web, WA & Email</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">QRIS & VA Resmi</p>
                <p className="text-xs text-slate-400">Verifikasi instan terenkripsi 24 jam</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Tautan Akses Privat</p>
                <p className="text-xs text-slate-400">Download berkecepatan tinggi & token aman</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Dukungan Siaga</p>
                <p className="text-xs text-slate-400">Bantuan responsif via WhatsApp</p>
              </div>
            </div>
          </div>

          {/* 4-Columns Footer Navigation */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 border-b border-slate-800">
            {/* Column 1: Company Profile */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <img
                  src={storeProfile.logoUrl}
                  alt={storeProfile.businessName}
                  className="w-9 h-9 rounded-xl object-cover bg-white p-0.5 border border-slate-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/default_store_logo.webp';
                  }}
                />
                <span className="font-extrabold text-base text-white tracking-tight uppercase">
                  {storeProfile.businessName}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Platform kurasi aset dan template digital profesional untuk arsitektur, konstruksi, dan bisnis. Membantu mempercepat pengerjaan proyek dengan file kerja standar siap pakai.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sistem Otomatisasi 24 Jam Nonstop</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
                Navigasi Cepat
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button 
                    onClick={() => scrollTo('beranda')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Beranda
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollTo('katalog-section')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Katalog Produk
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollTo('cara-belanja')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Cara Belanja
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollTo('tentang')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Tentang Kami
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollTo('faq')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Pertanyaan Umum (FAQ)
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal & Policies */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
                Dokumen & Kebijakan
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenLegal('terms')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Ketentuan Layanan
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenLegal('privacy')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Kebijakan Privasi
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenLegal('license')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Ketentuan Lisensi Digital
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenLegal('refund')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Kebijakan Pengembalian Dana
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Support */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
                Hubungi Kami
              </h4>
              <ul className="space-y-3 text-xs text-slate-400">
                <li>
                  <a
                    href={`https://wa.me/${cleanWa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>WhatsApp: {storeProfile.supportWhatsapp}</span>
                  </a>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>support@ruangproyek.com</span>
                </li>
                <li className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                  Layanan bantuan aktif setiap hari kerja untuk konfirmasi pesanan dan kendala teknis pengunduhan.
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright and subtle Admin Portal link */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>
              &copy; {new Date().getFullYear()} {storeProfile.businessName}. Hak Cipta Dilindungi.
            </p>

            <div className="flex items-center gap-4">
              {/* Subtle Admin Link as requested */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenAdmin) {
                    onOpenAdmin();
                  } else {
                    setIsLoginModalOpen(true);
                  }
                }}
                className="text-slate-600 hover:text-slate-400 text-[11px] transition-colors cursor-pointer"
                title="Portal Masuk Pengelola"
              >
                Akses Admin
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Legal & Policies Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        initialTab={selectedLegalTab}
        onClose={() => setLegalModalOpen(false)}
      />
    </>
  );
};
