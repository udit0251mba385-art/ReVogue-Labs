import React, { useState } from 'react';
import { CartItem } from '../types';
import { CAMPUS_LOCATIONS } from '../data/mockData';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Truck,
  LogIn
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderSuccess: (orderId: string, total: number) => void;
  onOpenAuthModal?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearCart,
  onOrderSuccess,
  onOpenAuthModal,
}) => {
  const { user, profile, saveOrderToCloud } = useAuth();
  const [selectedCampusId, setSelectedCampusId] = useState<string>(
    profile?.campusId || CAMPUS_LOCATIONS[0].id
  );
  const [hostelDorm, setHostelDorm] = useState<string>('Miranda House Hostel, Room 102');
  const [buyerName, setBuyerName] = useState<string>(
    profile?.displayName || user?.displayName || 'Ananya Sharma'
  );
  const [phone, setPhone] = useState<string>('+91 98110 54321');
  const [paymentType, setPaymentType] = useState<'upi' | 'drop_tokens' | 'cod'>('upi');
  const [isOrdered, setIsOrdered] = useState<boolean>(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, curr) => acc + curr.product.thriftPrice * curr.quantity, 0);
  const totalOriginal = items.reduce((acc, curr) => acc + curr.product.originalPrice * curr.quantity, 0);
  const totalSavings = totalOriginal - subtotal;
  const deliveryFee = 0; // Free campus ambassador batch route
  const total = subtotal + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `RV-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    if (user && user.emailVerified) {
      await saveOrderToCloud({
        id: orderId,
        campusId: selectedCampusId,
        hostelDorm,
        buyerName,
        phone,
        paymentType,
        totalAmount: total,
        totalSavings,
        itemCount: items.length,
        itemTitles: items.map((i) => `${i.product.brand} ${i.product.title}`),
        status: 'confirmed',
      });
    }
    setCompletedOrderId(orderId);
    setIsOrdered(true);
    onOrderSuccess(orderId, total);
  };

  const handleFinish = () => {
    setIsOrdered(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-[#FAF9F4] h-full shadow-2xl flex flex-col border-l border-[#1E3F20]/20 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 px-6 border-b border-[#1E3F20]/10 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#1E3F20]" />
            <h2 className="text-base font-bold text-[#142B15]">
              Campus Drop Bag ({items.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5A564A] hover:text-[#1E3F20] hover:bg-[#ECE8DC] rounded transition-colors cursor-pointer"
            aria-label="Close Bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Completed Order View */}
        {isOrdered ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#1E3F20]/10 text-[#1E3F20] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-[#1E3F20]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[#1E3F20] font-semibold">
                Order Confirmed
              </span>
              <h3 className="text-xl font-bold text-[#142B15]">
                Order #{completedOrderId}
              </h3>
              <p className="text-xs text-[#5A564A] max-w-xs mx-auto leading-relaxed">
                Your sanitized thrift garments are being packed into a compostable bag.
                Campus ambassador will deliver to {hostelDorm} tomorrow.
              </p>
            </div>

            <div className="w-full bg-white border border-[#1E3F20]/15 rounded p-4 text-xs font-mono text-left space-y-2">
              <div className="flex justify-between text-[#8C8675]">
                <span>ITEMS COUNT</span>
                <span className="text-[#142B15]">{items.length} pieces</span>
              </div>
              <div className="flex justify-between text-[#8C8675]">
                <span>TOTAL PAID</span>
                <span className="text-[#1E3F20] font-bold">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#8C8675]">
                <span>TOTAL SAVED</span>
                <span className="text-[#1E3F20] font-bold">₹{totalSavings.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#8C8675]">
                <span>STEAM SANITIZATION</span>
                <span className="text-[#142B15]">120°C Certified</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 bg-[#1E3F20] text-[#F7F5EE] hover:bg-[#142B15] font-semibold text-xs font-mono rounded cursor-pointer transition-colors"
            >
              Continue Exploring Campus Drops
            </button>
          </div>
        ) : items.length === 0 ? (
          /* Empty Bag State */
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-[#8C8675]/40" />
            <h3 className="text-base font-bold text-[#142B15]">Your Bag is Empty</h3>
            <p className="text-xs text-[#5A564A] max-w-xs">
              Explore the 48h flash drop to find curated Zara, H&M, and Savana pieces from campus closets.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2.5 text-xs font-semibold bg-[#1E3F20] text-[#F7F5EE] rounded hover:bg-[#142B15] cursor-pointer"
            >
              Shop Curated Drop
            </button>
          </div>
        ) : (
          /* Active Bag with Items & Checkout Form */
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-white border border-[#1E3F20]/15 rounded p-3 flex items-start gap-3 shadow-2xs"
                >
                  <div className="w-14 h-16 bg-[#ECE8DC] rounded flex items-center justify-center font-mono text-[10px] text-[#1E3F20] font-bold shrink-0">
                    {product.brand}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#142B15] truncate">
                      {product.title}
                    </h4>
                    <div className="text-[11px] font-mono text-[#8C8675] mt-0.5">
                      Size {product.size} · {product.condition}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold font-mono text-[#1E3F20] tabular-nums">
                        ₹{product.thriftPrice.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="text-[11px] text-[#FF5E36] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Delivery Destination Form */}
              <form id="checkout-form" onSubmit={handleCheckout} className="mt-4 pt-4 border-t border-[#1E3F20]/10 space-y-3">
                <div className="text-xs font-mono uppercase text-[#1E3F20] font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Campus Doorstep Drop Location</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#5A564A] block">Campus Hub</label>
                  <select
                    value={selectedCampusId}
                    onChange={(e) => setSelectedCampusId(e.target.value)}
                    className="w-full bg-white border border-[#1E3F20]/20 rounded px-2.5 py-1.5 text-xs text-[#142B15] focus:outline-hidden"
                  >
                    {CAMPUS_LOCATIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#5A564A] block">Hostel / Dorm Details</label>
                  <input
                    type="text"
                    value={hostelDorm}
                    onChange={(e) => setHostelDorm(e.target.value)}
                    placeholder="Hostel Block, Room No"
                    required
                    className="w-full bg-white border border-[#1E3F20]/20 rounded px-2.5 py-1.5 text-xs text-[#142B15] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#5A564A] block">Student Name</label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      required
                      className="w-full bg-white border border-[#1E3F20]/20 rounded px-2.5 py-1.5 text-xs text-[#142B15] focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#5A564A] block">WhatsApp / Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-white border border-[#1E3F20]/20 rounded px-2.5 py-1.5 text-xs text-[#142B15] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Payment Option */}
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-mono text-[#5A564A] block">Payment Method</label>
                  <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => setPaymentType('upi')}
                      className={`p-2 rounded border text-center transition-colors cursor-pointer ${
                        paymentType === 'upi'
                          ? 'border-[#1E3F20] bg-white font-bold text-[#1E3F20]'
                          : 'border-[#1E3F20]/15 bg-white/60 text-[#5A564A]'
                      }`}
                    >
                      Instant UPI
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentType('drop_tokens')}
                      className={`p-2 rounded border text-center transition-colors cursor-pointer ${
                        paymentType === 'drop_tokens'
                          ? 'border-[#1E3F20] bg-white font-bold text-[#1E3F20]'
                          : 'border-[#1E3F20]/15 bg-white/60 text-[#5A564A]'
                      }`}
                    >
                      Drop Tokens
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentType('cod')}
                      className={`p-2 rounded border text-center transition-colors cursor-pointer ${
                        paymentType === 'cod'
                          ? 'border-[#1E3F20] bg-white font-bold text-[#1E3F20]'
                          : 'border-[#1E3F20]/15 bg-white/60 text-[#5A564A]'
                      }`}
                    >
                      Cash on Dorm
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Price Breakdown & Checkout Action Footer */}
            <div className="p-4 bg-white border-t border-[#1E3F20]/15 space-y-3">
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-[#8C8675]">
                  <span>GARMENTS SUBTOTAL</span>
                  <span className="text-[#142B15] tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#8C8675]">
                  <span>CAMPUS BATCH AMBASSADOR DROP</span>
                  <span className="text-[#1E3F20] font-bold">FREE (₹0)</span>
                </div>
                <div className="flex justify-between text-[#8C8675]">
                  <span>SAVINGS VS RETAIL</span>
                  <span className="text-[#1E3F20] font-bold tabular-nums">
                    -₹{totalSavings.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#ECE8DC] text-sm font-bold text-[#142B15]">
                  <span>TOTAL DUE</span>
                  <span className="text-base text-[#1E3F20] tabular-nums">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="w-full py-3.5 bg-[#1E3F20] hover:bg-[#142B15] text-[#F7F5EE] text-sm font-semibold rounded shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Confirm Campus Order · ₹{total}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {!user && onOpenAuthModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuthModal();
                  }}
                  className="w-full py-2 text-[11px] font-mono text-[#1E3F20] hover:underline flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Sign in with Email to save order history</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
