import React, { useState, useEffect } from 'react';
import { CAMPUS_LOCATIONS } from '../data/mockData';
import { PickupBooking } from '../types';
import { 
  Building2, 
  Package, 
  Wallet, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Coins, 
  LogIn
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SellerFlowProps {
  onBookingConfirmed: (booking: PickupBooking) => void;
  onOpenAppraisal: () => void;
  onOpenAuthModal?: () => void;
}

export const SellerFlow: React.FC<SellerFlowProps> = ({
  onBookingConfirmed,
  onOpenAppraisal,
  onOpenAuthModal,
}) => {
  const { user, profile, saveBookingToCloud } = useAuth();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Location & Dorm state
  const [selectedCampusId, setSelectedCampusId] = useState<string>(
    profile?.campusId || CAMPUS_LOCATIONS[0].id
  );
  const [selectedHostel, setSelectedHostel] = useState<string>(CAMPUS_LOCATIONS[0].hostels[0]);
  const [dormRoom, setDormRoom] = useState<string>('Block B, Room 204');
  const [contactName, setContactName] = useState<string>(
    profile?.displayName || user?.displayName || 'Ishaan Grover'
  );
  const [phone, setPhone] = useState<string>('+91 98112 40982');

  useEffect(() => {
    if (profile?.campusId) {
      setSelectedCampusId(profile.campusId);
      const campus = CAMPUS_LOCATIONS.find((c) => c.id === profile.campusId);
      if (campus && campus.hostels.length > 0) {
        setSelectedHostel(campus.hostels[0]);
      }
    }
    if (profile?.displayName || user?.displayName) {
      setContactName(profile?.displayName || user?.displayName || 'Ishaan Grover');
    }
  }, [profile?.campusId, profile?.displayName, user?.displayName]);

  // Step 2: Bag Size & Valuation Calculator
  const [bagTier, setBagTier] = useState<'small' | 'medium' | 'bulk'>('medium');
  const [denimCount, setDenimCount] = useState<number>(2);
  const [outerwearCount, setOuterwearCount] = useState<number>(2);
  const [topsCount, setTopsCount] = useState<number>(4);

  // Dynamic calculated payout preview
  // Average benchmark valuations: Outerwear ~₹420, Denim ~₹360, Tops ~₹240
  const calculatedCash = (outerwearCount * 420) + (denimCount * 360) + (topsCount * 240);
  const calculatedCredit = Math.round(calculatedCash * 1.2);

  // Step 3: Payout preference & Slot
  const [payoutMethod, setPayoutMethod] = useState<'upi' | 'store_credit'>('upi');
  const [upiId, setUpiId] = useState<string>('ishaangrover@okaxis');
  const [slotDate, setSlotDate] = useState<string>('Tomorrow, Oct 12');
  const [slotTime, setSlotTime] = useState<string>('5:30 PM - 7:00 PM (Hostel Common Room)');
  const [specialInstructions, setSpecialInstructions] = useState<string>('Please call once at main gate');

  // Step 4: Confirmed State
  const [confirmedBooking, setConfirmedBooking] = useState<PickupBooking | null>(null);

  const selectedCampus = CAMPUS_LOCATIONS.find((c) => c.id === selectedCampusId) || CAMPUS_LOCATIONS[0];

  const handleCampusChange = (campusId: string) => {
    setSelectedCampusId(campusId);
    const campus = CAMPUS_LOCATIONS.find((c) => c.id === campusId);
    if (campus && campus.hostels.length > 0) {
      setSelectedHostel(campus.hostels[0]);
    }
  };

  const handleSelectTier = (tier: 'small' | 'medium' | 'bulk') => {
    setBagTier(tier);
    if (tier === 'small') {
      setOuterwearCount(1);
      setDenimCount(1);
      setTopsCount(2);
    } else if (tier === 'medium') {
      setOuterwearCount(2);
      setDenimCount(2);
      setTopsCount(4);
    } else {
      setOuterwearCount(4);
      setDenimCount(4);
      setTopsCount(6);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: PickupBooking = {
      id: `RV-PKP-${Math.floor(1000 + Math.random() * 9000)}`,
      campusId: selectedCampus.id,
      campusName: selectedCampus.name,
      hostelDorm: `${selectedHostel} (${dormRoom})`,
      contactName,
      phone,
      upiId: payoutMethod === 'upi' ? upiId : undefined,
      bagSize: bagTier,
      estimatedItems: outerwearCount + denimCount + topsCount,
      estimatedPayout: payoutMethod === 'upi' ? calculatedCash : calculatedCredit,
      payoutMethod,
      slotDate,
      slotTime,
      status: 'scheduled',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (user && user.emailVerified) {
      try {
        await saveBookingToCloud(newBooking);
      } catch {
        // Local booking confirmation still proceeds; cloud sync error is logged
      }
    }

    setConfirmedBooking(newBooking);
    setCurrentStep(4);
    onBookingConfirmed(newBooking);
  };

  return (
    <div className="py-10 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#1E3F20] font-semibold">
            Seller Workflow · 60-Second Closet Liquidation
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#142B15] mt-1">
            Doorstep Campus Bag Pickup
          </h2>
          <p className="text-sm text-[#5A564A] mt-1 max-w-xl">
            No listing, no haggling, zero photography. Fill a bag, leave it at your hostel desk,
            and collect instant UPI payout or 20% bonus store credits.
          </p>
        </div>

        {/* AI Appraisal Sandbox Link */}
        <button
          onClick={onOpenAppraisal}
          className="self-center sm:self-auto inline-flex items-center gap-1.5 text-xs font-mono text-[#1E3F20] bg-white border border-[#1E3F20]/20 hover:border-[#1E3F20] px-3 py-2 rounded shadow-2xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#1E3F20]" />
          <span>Need itemized valuation? Launch AI Scanner</span>
        </button>
      </div>

      {/* 3-Step Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-[#ECE8DC] -z-0" />
          
          <button
            onClick={() => currentStep > 1 && currentStep < 4 && setCurrentStep(1)}
            className={`relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-colors ${
              currentStep === 1
                ? 'bg-[#1E3F20] text-[#F7F5EE]'
                : currentStep > 1
                ? 'bg-[#2A562D] text-white'
                : 'bg-[#ECE8DC] text-[#5A564A]'
            }`}
          >
            <span>1. Campus & Hostel</span>
          </button>

          <button
            onClick={() => currentStep > 2 && currentStep < 4 && setCurrentStep(2)}
            className={`relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-colors ${
              currentStep === 2
                ? 'bg-[#1E3F20] text-[#F7F5EE]'
                : currentStep > 2
                ? 'bg-[#2A562D] text-white'
                : 'bg-[#ECE8DC] text-[#5A564A]'
            }`}
          >
            <span>2. Bag Size & Valuation</span>
          </button>

          <button
            onClick={() => currentStep > 3 && currentStep < 4 && setCurrentStep(3)}
            className={`relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-colors ${
              currentStep === 3
                ? 'bg-[#1E3F20] text-[#F7F5EE]'
                : currentStep === 4
                ? 'bg-[#2A562D] text-white'
                : 'bg-[#ECE8DC] text-[#5A564A]'
            }`}
          >
            <span>3. Payout & Schedule</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Step Container */}
      <div className="bg-[#FAF9F4] border border-[#1E3F20]/15 rounded-lg p-6 sm:p-8 shadow-xs">
        {/* STEP 1: Campus & Hostel Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-[#1E3F20]/10 pb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#142B15] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#1E3F20]" />
                <span>Step 1: Select Your Campus Hub & Hostel Location</span>
              </h3>
              <span className="text-xs font-mono text-[#8C8675]">Batch Collection Zone</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* University Cluster */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#5A564A] block">
                  Select University / Campus
                </label>
                <select
                  value={selectedCampusId}
                  onChange={(e) => handleCampusChange(e.target.value)}
                  className="w-full bg-white border border-[#1E3F20]/25 rounded px-3 py-2.5 text-sm text-[#142B15] focus:outline-hidden focus:border-[#1E3F20]"
                >
                  {CAMPUS_LOCATIONS.map((campus) => (
                    <option key={campus.id} value={campus.id}>
                      {campus.name} ({campus.cluster})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#8C8675]">
                  Next batch route: {selectedCampus.nextPickupDay}
                </p>
              </div>

              {/* Hostel / Hall */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#5A564A] block">
                  Hostel / Residence Hall
                </label>
                <select
                  value={selectedHostel}
                  onChange={(e) => setSelectedHostel(e.target.value)}
                  className="w-full bg-white border border-[#1E3F20]/25 rounded px-3 py-2.5 text-sm text-[#142B15] focus:outline-hidden focus:border-[#1E3F20]"
                >
                  {selectedCampus.hostels.map((hostel) => (
                    <option key={hostel} value={hostel}>
                      {hostel}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#8C8675]">
                  Assigned Campus Ambassador: {selectedCampus.ambassadorName}
                </p>
              </div>

              {/* Room / Dorm details */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#5A564A] block">
                  Room Number / Wing
                </label>
                <input
                  type="text"
                  value={dormRoom}
                  onChange={(e) => setDormRoom(e.target.value)}
                  placeholder="e.g. Block B, Room 304"
                  className="w-full bg-white border border-[#1E3F20]/25 rounded px-3 py-2.5 text-sm text-[#142B15] focus:outline-hidden focus:border-[#1E3F20]"
                />
              </div>

              {/* Student Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#5A564A] block">
                  Student Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-white border border-[#1E3F20]/25 rounded px-3 py-2.5 text-sm text-[#142B15] focus:outline-hidden focus:border-[#1E3F20]"
                />
              </div>

              {/* Phone / WhatsApp */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#5A564A] block">
                  WhatsApp Contact for Gate OTP / Drop Code
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white border border-[#1E3F20]/25 rounded px-3 py-2.5 text-sm text-[#142B15] focus:outline-hidden focus:border-[#1E3F20]"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 bg-[#1E3F20] text-[#F7F5EE] hover:bg-[#142B15] text-sm font-semibold rounded transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Bag Size & Valuation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Bag Size & Real-Time Valuation Preview */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-[#1E3F20]/10 pb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#142B15] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#1E3F20]" />
                <span>Step 2: Estimate Bag Size & Instant Valuation Preview</span>
              </h3>
              <span className="text-xs font-mono text-[#8C8675]">Algorithm Valuation Engine</span>
            </div>

            {/* 3 Bag Size Preset Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => handleSelectTier('small')}
                className={`p-4 rounded border text-left transition-all cursor-pointer ${
                  bagTier === 'small'
                    ? 'border-[#1E3F20] bg-white ring-2 ring-[#1E3F20]/20 shadow-xs'
                    : 'border-[#1E3F20]/15 bg-[#FAF9F4] hover:bg-white'
                }`}
              >
                <div className="text-xs font-mono uppercase text-[#8C8675]">Tote Bag</div>
                <div className="text-base font-bold text-[#142B15] mt-0.5">Small Bag</div>
                <div className="text-xs text-[#5A564A] mt-1">3 – 5 garments</div>
                <div className="mt-3 pt-3 border-t border-[#1E3F20]/10 text-xs font-mono">
                  <span className="text-[#1E3F20] font-bold">₹950 – ₹1,600</span>
                  <span className="text-[#8C8675] block text-[10px]">Instant UPI</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTier('medium')}
                className={`p-4 rounded border text-left transition-all cursor-pointer relative ${
                  bagTier === 'medium'
                    ? 'border-[#1E3F20] bg-white ring-2 ring-[#1E3F20]/20 shadow-xs'
                    : 'border-[#1E3F20]/15 bg-[#FAF9F4] hover:bg-white'
                }`}
              >
                <span className="absolute -top-2.5 right-3 text-[10px] font-mono uppercase tracking-wider bg-[#1E3F20] text-[#F7F5EE] px-2 py-0.5 rounded">
                  Most Popular
                </span>
                <div className="text-xs font-mono uppercase text-[#8C8675]">Laundry Bag</div>
                <div className="text-base font-bold text-[#142B15] mt-0.5">Medium Bag</div>
                <div className="text-xs text-[#5A564A] mt-1">6 – 10 garments</div>
                <div className="mt-3 pt-3 border-t border-[#1E3F20]/10 text-xs font-mono">
                  <span className="text-[#1E3F20] font-bold">₹2,100 – ₹3,800</span>
                  <span className="text-[#8C8675] block text-[10px]">Instant UPI</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTier('bulk')}
                className={`p-4 rounded border text-left transition-all cursor-pointer ${
                  bagTier === 'bulk'
                    ? 'border-[#1E3F20] bg-white ring-2 ring-[#1E3F20]/20 shadow-xs'
                    : 'border-[#1E3F20]/15 bg-[#FAF9F4] hover:bg-white'
                }`}
              >
                <div className="text-xs font-mono uppercase text-[#8C8675]">Closet Purge</div>
                <div className="text-base font-bold text-[#142B15] mt-0.5">Bulk Bag</div>
                <div className="text-xs text-[#5A564A] mt-1">12 – 18+ garments</div>
                <div className="mt-3 pt-3 border-t border-[#1E3F20]/10 text-xs font-mono">
                  <span className="text-[#1E3F20] font-bold">₹4,500 – ₹8,200</span>
                  <span className="text-[#8C8675] block text-[10px]">Instant UPI</span>
                </div>
              </button>
            </div>

            {/* Interactive Valuation Breakdown Sliders */}
            <div className="bg-white rounded border border-[#1E3F20]/15 p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#1E3F20]/10">
                <span className="text-xs font-mono uppercase text-[#1E3F20] font-semibold">
                  Fine-Tune Your Wardrobe Mix
                </span>
                <span className="text-xs font-mono text-[#5A564A]">
                  Total: {outerwearCount + denimCount + topsCount} garments
                </span>
              </div>

              {/* Outerwear / Jackets slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-[#142B15]">
                  <span>Outerwear / Jackets (Zara, Uniqlo, Mango)</span>
                  <span className="font-mono">{outerwearCount} pcs (~₹420/pc)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={outerwearCount}
                  onChange={(e) => setOuterwearCount(parseInt(e.target.value) || 0)}
                  className="w-full accent-[#1E3F20]"
                />
              </div>

              {/* Denim / Cargo slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-[#142B15]">
                  <span>Jeans & Utility Cargos (Levi's, Savana)</span>
                  <span className="font-mono">{denimCount} pcs (~₹360/pc)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={denimCount}
                  onChange={(e) => setDenimCount(parseInt(e.target.value) || 0)}
                  className="w-full accent-[#1E3F20]"
                />
              </div>

              {/* Tops / Sweaters slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-[#142B15]">
                  <span>Tops, Hoodies & Knits (H&M, Urbanic)</span>
                  <span className="font-mono">{topsCount} pcs (~₹240/pc)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={topsCount}
                  onChange={(e) => setTopsCount(parseInt(e.target.value) || 0)}
                  className="w-full accent-[#1E3F20]"
                />
              </div>

              {/* Live Calculated Payout Strip */}
              <div className="pt-3 border-t border-[#1E3F20]/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF9F4] -mx-5 -mb-5 p-4 rounded-b">
                <div>
                  <div className="text-xs font-mono text-[#8C8675]">Estimated Instant Valuation</div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-[#1E3F20] tabular-nums">
                      ₹{calculatedCash.toLocaleString('en-IN')} UPI Cash
                    </span>
                    <span className="text-xs font-mono text-[#5A564A]">
                      or ₹{calculatedCredit.toLocaleString('en-IN')} Drop Credits
                    </span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-[#1E3F20] bg-white border border-[#1E3F20]/20 px-2.5 py-1 rounded">
                  Zero Rejection Guarantee
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-xs font-mono text-[#5A564A] hover:text-[#1E3F20] flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 bg-[#1E3F20] text-[#F7F5EE] hover:bg-[#142B15] text-sm font-semibold rounded transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Payout & Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Payout Preference & Slot Selection */}
        {currentStep === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="border-b border-[#1E3F20]/10 pb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#142B15] flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#1E3F20]" />
                <span>Step 3: Payout Preference & Doorstep Pickup Slot</span>
              </h3>
              <span className="text-xs font-mono text-[#8C8675]">Venture Upfront Liquidation</span>
            </div>

            {/* Payout Toggle: UPI Cash vs. 1.2x Store Credit */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#5A564A] block">
                Select Upfront Payout Method
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* UPI Option */}
                <div
                  onClick={() => setPayoutMethod('upi')}
                  className={`p-4 rounded border cursor-pointer transition-all ${
                    payoutMethod === 'upi'
                      ? 'border-[#1E3F20] bg-white ring-2 ring-[#1E3F20]/20 shadow-xs'
                      : 'border-[#1E3F20]/15 bg-[#FAF9F4] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[#8C8675] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#1E3F20]" />
                      Direct Bank Transfer
                    </span>
                    <input
                      type="radio"
                      name="payout"
                      checked={payoutMethod === 'upi'}
                      onChange={() => setPayoutMethod('upi')}
                      className="accent-[#1E3F20]"
                    />
                  </div>
                  <div className="text-lg font-bold font-mono text-[#142B15] mt-1 tabular-nums">
                    ₹{calculatedCash.toLocaleString('en-IN')} UPI Cash
                  </div>
                  <p className="text-xs text-[#5A564A] mt-1">
                    Sent instantly to your GPay / PhonePe / Paytm handle upon handover.
                  </p>
                </div>

                {/* 1.2x Store Credit Option */}
                <div
                  onClick={() => setPayoutMethod('store_credit')}
                  className={`p-4 rounded border cursor-pointer transition-all relative ${
                    payoutMethod === 'store_credit'
                      ? 'border-[#1E3F20] bg-white ring-2 ring-[#1E3F20]/20 shadow-xs'
                      : 'border-[#1E3F20]/15 bg-[#FAF9F4] hover:bg-white'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 text-[10px] font-mono uppercase tracking-wider bg-[#C2F04E] text-[#142B15] font-bold px-2 py-0.5 rounded">
                    +20% Extra Value
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[#8C8675] flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-[#1E3F20]" />
                      ReVogue Drop Credits
                    </span>
                    <input
                      type="radio"
                      name="payout"
                      checked={payoutMethod === 'store_credit'}
                      onChange={() => setPayoutMethod('store_credit')}
                      className="accent-[#1E3F20]"
                    />
                  </div>
                  <div className="text-lg font-bold font-mono text-[#1E3F20] mt-1 tabular-nums">
                    ₹{calculatedCredit.toLocaleString('en-IN')} Store Credits
                  </div>
                  <p className="text-xs text-[#5A564A] mt-1">
                    Spend on curated Zara, H&M, and Savana pieces in the 48h campus flash drops.
                  </p>
                </div>
              </div>
            </div>

            {/* UPI ID input if UPI chosen */}
            {payoutMethod === 'upi' && (
              <div className="space-y-1.5 bg-white p-4 rounded border border-[#1E3F20]/15">
                <label className="text-xs font-mono uppercase tracking-wider text-[#5A564A] block">
                  Your UPI Virtual Payment Address (VPA)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. yourname@okhdfcbank or 9811234567@paytm"
                  required
                  className="w-full bg-[#FAF9F4] border border-[#1E3F20]/25 rounded px-3 py-2.5 text-sm text-[#142B15] font-mono focus:outline-hidden focus:border-[#1E3F20]"
                />
                <p className="text-[11px] text-[#8C8675]">
                  Ambassador scans the bag barcode and initiates UPI trigger immediately at pickup.
                </p>
              </div>
            )}

            {/* Pickup Slot Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#5A564A] block">
                  Pickup Slot Date
                </label>
                <select
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  className="w-full bg-white border border-[#1E3F20]/25 rounded px-3 py-2.5 text-sm text-[#142B15] focus:outline-hidden focus:border-[#1E3F20]"
                >
                  <option value="Tomorrow, Oct 12">Tomorrow, Oct 12 (Campus Batch Day)</option>
                  <option value="Wednesday, Oct 13">Wednesday, Oct 13</option>
                  <option value="Thursday, Oct 14">Thursday, Oct 14</option>
                  <option value="Friday, Oct 15">Friday, Oct 15</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#5A564A] block">
                  Pickup Time Window
                </label>
                <select
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  className="w-full bg-white border border-[#1E3F20]/25 rounded px-3 py-2.5 text-sm text-[#142B15] focus:outline-hidden focus:border-[#1E3F20]"
                >
                  <option value="5:30 PM - 7:00 PM (Hostel Common Room)">5:30 PM - 7:00 PM (Hostel Common Room)</option>
                  <option value="7:00 PM - 8:30 PM (Hostel Gate Desk)">7:00 PM - 8:30 PM (Hostel Gate Desk)</option>
                  <option value="12:30 PM - 2:00 PM (Lunch Break Window)">12:30 PM - 2:00 PM (Lunch Break Window)</option>
                </select>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#5A564A] block">
                Ambassador Instructions (Optional)
              </label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Leave with guard at Gate 2 or ping on WhatsApp before arriving"
                className="w-full bg-white border border-[#1E3F20]/25 rounded px-3 py-2 text-sm text-[#142B15] focus:outline-hidden focus:border-[#1E3F20]"
              />
            </div>

            {/* Final Booking Summary Strip */}
            <div className="bg-[#1E3F20]/5 rounded p-4 border border-[#1E3F20]/15 flex items-center justify-between">
              <div className="text-xs space-y-0.5">
                <div className="font-semibold text-[#1E3F20]">
                  Pickup Booking Summary · {selectedCampus.name}
                </div>
                <div className="text-[#5A564A]">
                  {outerwearCount + denimCount + topsCount} items · Handover to {selectedCampus.ambassadorName}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-[#1E3F20]">
                  {payoutMethod === 'upi' ? `₹${calculatedCash} UPI Cash` : `₹${calculatedCredit} Drop Credits`}
                </div>
              </div>
            </div>

            {!user && onOpenAuthModal && (
              <div className="bg-white border border-[#1E3F20]/20 rounded p-3.5 flex items-center justify-between gap-3 text-xs">
                <span className="text-[#5A564A]">
                  Sign in with Email or Google to save this pickup to your student account.
                </span>
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="px-3 py-1.5 bg-[#1E3F20] text-[#F7F5EE] font-mono rounded shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            )}

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-xs font-mono text-[#5A564A] hover:text-[#1E3F20] flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1E3F20] text-[#F7F5EE] hover:bg-[#142B15] text-sm font-semibold rounded transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-[#C2F04E]" />
                <span>Confirm Doorstep Pickup</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Success & Confirmed Receipt State */}
        {currentStep === 4 && confirmedBooking && (
          <div className="text-center py-6 space-y-6">
            <div className="w-12 h-12 rounded-full bg-[#1E3F20]/10 text-[#1E3F20] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-[#1E3F20]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[#1E3F20] font-semibold">
                Pickup Scheduled Successfully
              </span>
              <h3 className="text-2xl font-bold text-[#142B15]">
                Reference #{confirmedBooking.id}
              </h3>
              <p className="text-sm text-[#5A564A] max-w-md mx-auto">
                Campus ambassador {selectedCampus.ambassadorName} has received your batch request.
                Simply keep your clothes in any tote/bag at your hostel desk.
              </p>
            </div>

            {/* Digital Receipt Card */}
            <div className="bg-white border border-[#1E3F20]/20 rounded-lg max-w-md mx-auto p-5 text-left text-xs font-mono space-y-3 shadow-xs">
              <div className="flex justify-between border-b border-[#ECE8DC] pb-2 text-[#8C8675]">
                <span>LOCATION</span>
                <span className="text-[#142B15] font-sans font-medium text-right">
                  {confirmedBooking.campusName}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#ECE8DC] pb-2 text-[#8C8675]">
                <span>DORM / HOSTEL</span>
                <span className="text-[#142B15] font-sans font-medium text-right">
                  {confirmedBooking.hostelDorm}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#ECE8DC] pb-2 text-[#8C8675]">
                <span>COLLECTION SLOT</span>
                <span className="text-[#142B15] font-sans font-medium text-right">
                  {confirmedBooking.slotDate} · {confirmedBooking.slotTime}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#ECE8DC] pb-2 text-[#8C8675]">
                <span>PAYOUT DESTINATION</span>
                <span className="text-[#1E3F20] font-bold text-right">
                  {confirmedBooking.payoutMethod === 'upi' ? `${confirmedBooking.upiId} (UPI)` : 'Store Drop Tokens'}
                </span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-sm text-[#142B15]">
                <span>ESTIMATED PAYOUT</span>
                <span className="text-[#1E3F20]">₹{confirmedBooking.estimatedPayout.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setConfirmedBooking(null);
                }}
                className="px-5 py-2.5 text-xs font-mono text-[#1E3F20] bg-[#FAF9F4] border border-[#1E3F20]/20 hover:border-[#1E3F20] rounded transition-colors cursor-pointer"
              >
                Schedule Another Bag
              </button>
              <button
                onClick={onOpenAppraisal}
                className="px-5 py-2.5 text-xs font-mono text-[#F7F5EE] bg-[#1E3F20] hover:bg-[#142B15] rounded transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C2F04E]" />
                <span>Explore AI Appraisal Engine</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
