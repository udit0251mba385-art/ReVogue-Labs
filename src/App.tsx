/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  INITIAL_PRODUCTS, 
  UNIT_ECONOMICS_METRICS, 
  CAMPUS_ROUTE_PLANS 
} from './data/mockData';
import { ThriftProduct, CartItem, PickupBooking, UnitEconomics, RoutePlan } from './types';
import { Navbar, NavTab } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SellerFlow } from './components/SellerFlow';
import { BuyerFlow } from './components/BuyerFlow';
import { AppraisalEngine } from './components/AppraisalEngine';
import { AdminDashboard } from './components/AdminDashboard';
import { AccountView } from './components/AccountView';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [products, setProducts] = useState<ThriftProduct[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<UnitEconomics>(UNIT_ECONOMICS_METRICS);
  const [routePlans] = useState<RoutePlan[]>(CAMPUS_ROUTE_PLANS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Helper
  const triggerToast = (title: string, description: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      description,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Handlers
  const handleAddToCart = (product: ThriftProduct) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) return prev;
      return [...prev, { product, quantity: 1 }];
    });
    triggerToast(
      'Added to Campus Drop Bag',
      `${product.brand} - ${product.title} reserved for 30 minutes.`
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOrderSuccess = (orderId: string, total: number) => {
    // Update venture metrics
    setMetrics((prev) => ({
      ...prev,
      monthlyRevenueCurrent: prev.monthlyRevenueCurrent + total,
      litersWaterSaved: prev.litersWaterSaved + 2700 * cartItems.length,
      kgCarbonDiverted: prev.kgCarbonDiverted + cartItems.length,
    }));

    // Remove purchased products from live drop
    const purchasedIds = cartItems.map((c) => c.product.id);
    setProducts((prev) => prev.filter((p) => !purchasedIds.includes(p.id)));

    triggerToast(
      'Order Confirmed!',
      `Order #${orderId} booked for campus hostel delivery tomorrow.`
    );
  };

  // Seller Booking Handler
  const handleBookingConfirmed = (booking: PickupBooking) => {
    setMetrics((prev) => ({
      ...prev,
      totalBagsLiquidated: prev.totalBagsLiquidated + 1,
      totalCashDisbursed: prev.totalCashDisbursed + booking.estimatedPayout,
      kgCarbonDiverted: prev.kgCarbonDiverted + booking.estimatedItems,
    }));

    triggerToast(
      'Campus Bag Pickup Scheduled',
      `Booking #${booking.id} assigned to campus ambassador at ${booking.campusName}.`
    );
  };

  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartItemIds = cartItems.map((c) => c.product.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5EE] text-[#1A241C] font-sans antialiased">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        openCart={() => setIsCartOpen(true)}
        openAuthModal={() => setIsAuthModalOpen(true)}
        onLogoutSuccess={() =>
          triggerToast('Logged Out', 'You have signed out of your ReVogue Labs account.')
        }
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <HeroSection
              metrics={metrics}
              onNavigateSeller={() => setActiveTab('seller')}
              onNavigateBuyer={() => setActiveTab('buyer')}
              onNavigateAppraisal={() => setActiveTab('appraisal')}
            />

            {/* Featured Live Drops Preview Section on Home */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-[#1E3F20]/10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-[#1E3F20] font-semibold">
                    Current 48-Hour Drop
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#142B15] mt-1">
                    Featured Campus Curation
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5A564A] mt-1">
                    High-demand pieces collected and sanitized across Delhi NCR hostels this week.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('buyer')}
                  className="px-4 py-2 text-xs font-mono font-semibold text-[#1E3F20] bg-white border border-[#1E3F20]/20 hover:border-[#1E3F20] rounded self-start sm:self-auto cursor-pointer"
                >
                  View Full 48h Drop ({products.length} items) →
                </button>
              </div>

              {/* Mini Drop Grid */}
              <BuyerFlow
                products={products.slice(0, 4)}
                cartItemIds={cartItemIds}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        )}

        {activeTab === 'seller' && (
          <SellerFlow
            onBookingConfirmed={handleBookingConfirmed}
            onOpenAppraisal={() => setActiveTab('appraisal')}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'buyer' && (
          <BuyerFlow
            products={products}
            cartItemIds={cartItemIds}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeTab === 'appraisal' && (
          <AppraisalEngine
            onLiquidatePreset={() => {
              setActiveTab('seller');
            }}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            metrics={metrics}
            routePlans={routePlans}
          />
        )}

        {activeTab === 'account' && (
          <AccountView
            onNavigateSeller={() => setActiveTab('seller')}
            onNavigateBuyer={() => setActiveTab('buyer')}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onToast={triggerToast}
          />
        )}
      </main>

      {/* Cart / Campus Bag Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderSuccess={handleOrderSuccess}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Authentication Modal (Email + Google) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(msg) => triggerToast('Welcome to ReVogue Labs', msg)}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Quiet Editorial Footer */}
      <Footer onNavigateTab={setActiveTab} />
    </div>
  );
}
