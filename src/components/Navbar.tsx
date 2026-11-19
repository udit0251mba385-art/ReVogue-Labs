import React, { useState } from 'react';
import { ShoppingBag, Menu, X, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export type NavTab = 'home' | 'seller' | 'buyer' | 'admin' | 'appraisal' | 'account';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  cartCount: number;
  openCart: () => void;
  openAuthModal: () => void;
  onLogoutSuccess: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  openAuthModal,
  onLogoutSuccess,
}) => {
  const { user, profile, authReady, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    if (activeTab === 'account') {
      setActiveTab('home');
    }
    onLogoutSuccess();
  };

  const shortUserLabel =
    profile?.displayName?.split(' ')[0] ||
    user?.displayName?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'Account';

  return (
    <header className="sticky top-0 z-40 bg-[#F7F5EE]/95 backdrop-blur-md border-b border-[#1E3F20]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-xl font-bold tracking-tight text-[#1E3F20] font-display whitespace-nowrap shrink-0 flex items-center gap-2 text-left cursor-pointer"
        >
          <span>ReVogue Labs</span>
        </button>

        {/* Zone 2: Concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#1E2922]">
          <button
            onClick={() => handleNavClick('buyer')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'buyer'
                ? 'text-[#1E3F20] font-semibold border-b-2 border-[#1E3F20]'
                : 'text-[#1E2922]/75 hover:text-[#1E3F20]'
            }`}
          >
            48h Flash Drop
          </button>
          <button
            onClick={() => handleNavClick('seller')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'seller'
                ? 'text-[#1E3F20] font-semibold border-b-2 border-[#1E3F20]'
                : 'text-[#1E2922]/75 hover:text-[#1E3F20]'
            }`}
          >
            Liquidate Closet
          </button>
          <button
            onClick={() => handleNavClick('appraisal')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'appraisal'
                ? 'text-[#1E3F20] font-semibold border-b-2 border-[#1E3F20]'
                : 'text-[#1E2922]/75 hover:text-[#1E3F20]'
            }`}
          >
            AI Appraisal
          </button>
          <button
            onClick={() => handleNavClick('admin')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'admin'
                ? 'text-[#1E3F20] font-semibold border-b-2 border-[#1E3F20]'
                : 'text-[#1E2922]/75 hover:text-[#1E3F20]'
            }`}
          >
            Venture Economics
          </button>
        </nav>

        {/* Zone 3: Auth & Bag Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {authReady && (
            user ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('account')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'account'
                      ? 'bg-[#1E3F20]/10 border-[#1E3F20] text-[#1E3F20]'
                      : 'bg-white border-[#1E3F20]/20 text-[#142B15] hover:border-[#1E3F20]'
                  }`}
                  title={user.email || 'My Account'}
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#1E3F20]" />
                  <span className="max-w-[100px] truncate">{shortUserLabel}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#5A564A] hover:text-[#FF5E36] bg-white border border-[#1E3F20]/15 hover:border-[#FF5E36]/40 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  aria-label="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1E3F20] bg-white border border-[#1E3F20]/25 hover:border-[#1E3F20] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )
          )}

          <button
            onClick={openCart}
            aria-label="View Shopping Bag"
            className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#F7F5EE] bg-[#1E3F20] hover:bg-[#142B15] rounded-md transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Drop Bag</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#C2F04E] text-[#142B15] text-[11px] font-mono font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1E3F20] hover:bg-[#ECE8DC] rounded-md transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer / dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1E3F20]/10 bg-[#FAF9F4] px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-[#ECE8DC] text-[#1E3F20]"
          >
            Overview
          </button>
          <button
            onClick={() => handleNavClick('buyer')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-[#ECE8DC] text-[#1E3F20]"
          >
            48h Curated Flash Drop
          </button>
          <button
            onClick={() => handleNavClick('seller')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-[#ECE8DC] text-[#1E3F20]"
          >
            Liquidate Closet (60s Pickup)
          </button>
          <button
            onClick={() => handleNavClick('appraisal')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-[#ECE8DC] text-[#1E3F20]"
          >
            AI Garment Appraisal Engine
          </button>
          <button
            onClick={() => handleNavClick('admin')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-[#ECE8DC] text-[#1E3F20]"
          >
            Venture Economics & Ops
          </button>

          <div className="pt-2 mt-2 border-t border-[#1E3F20]/10 space-y-2">
            {user ? (
              <>
                <button
                  onClick={() => handleNavClick('account')}
                  className="w-full text-left px-3 py-2 text-sm font-semibold rounded-md bg-white border border-[#1E3F20]/15 text-[#1E3F20] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    <span>My Account ({shortUserLabel})</span>
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm font-semibold rounded-md text-[#FF5E36] hover:bg-[#FF5E36]/10 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full px-3 py-2.5 text-sm font-semibold rounded-md bg-[#1E3F20] text-[#F7F5EE] flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
