import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Menu, 
  X, 
  Home, 
  ShoppingBag, 
  HelpCircle, 
  Info, 
  PhoneCall, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useStoreSettings } from '../../context/StoreContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenLookup?: () => void;
  cartCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenLookup }) => {
  const { storeProfile } = useStoreSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (sectionId === 'beranda') {
      if (currentView !== 'storefront') {
        onNavigate('storefront');
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (currentView !== 'storefront') {
      onNavigate('storefront');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navMenuItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'katalog', label: 'Katalog' },
    { id: 'cara-belanja', label: 'Cara Belanja' },
    { id: 'tentang', label: 'Tentang' },
    { id: 'faq', label: 'FAQ' },
    { id: 'kontak', label: 'Kontak' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 1. Left: Logo + Business Name */}
          <div 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none" 
            onClick={() => scrollToSection('beranda')}
          >
            <img
              src={storeProfile.logoUrl}
              alt={storeProfile.businessName}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover bg-white p-0.5 border border-slate-200 shadow-sm shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/default_store_logo.webp';
              }}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 block leading-tight uppercase">
                  {storeProfile.businessName}
                </span>
                <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Official
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block leading-none">
                Digital Engineering & Product Studio
              </span>
            </div>
          </div>

          {/* 2. Center: Public Menu (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* 3. Right: Single Clean "Cek Order" CTA + Mobile Hamburger */}
          <div className="flex items-center gap-2">
            {onOpenLookup && (
              <button
                onClick={onOpenLookup}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                title="Lacak pesanan dan unduh file Anda kembali"
              >
                <Search className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cek Order</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-5 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {navMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>{item.label}</span>
            </button>
          ))}

          {onOpenLookup && (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLookup();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-emerald-600" />
                <span>Lacak Pesanan (Cek Order)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
