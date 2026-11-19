import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Droplets, Recycle, IndianRupee, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { UnitEconomics } from '../types';

interface HeroSectionProps {
  metrics: UnitEconomics;
  onNavigateSeller: () => void;
  onNavigateBuyer: () => void;
  onNavigateAppraisal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  metrics,
  onNavigateSeller,
  onNavigateBuyer,
  onNavigateAppraisal,
}) => {
  // Live dynamic counter ticker combined with real session updates
  const [tickerOffset, setTickerOffset] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerOffset((prev) => prev + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const liveGarments = metrics.kgCarbonDiverted + tickerOffset;
  const liveWater = metrics.litersWaterSaved + tickerOffset * 240;
  const liveCash = metrics.totalCashDisbursed + tickerOffset * 35;

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-20 border-b border-[#1E3F20]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Value Proposition & Dual CTA */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quiet, unboxed kicker label */}
            <div className="text-xs font-mono uppercase tracking-widest text-[#1E3F20] flex items-center gap-2">
              <span>Campus Circular Economy</span>
              <span className="text-[#8C8675]">/</span>
              <span>Delhi NCR & Sonipat Hubs</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-[#142B15] leading-[1.12] text-balance">
              Zero-effort wardrobe liquidation. Curated campus thrift.
            </h1>

            <p className="text-base sm:text-lg text-[#302E28]/85 max-w-2xl leading-relaxed">
              We turn overflowing hostel closets into instant UPI cash. No photography, zero DM bargaining,
              and hospital-grade steam sanitized drops for student shoppers across Delhi NCR.
            </p>

            {/* Dual Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onNavigateSeller}
                className="px-6 py-3.5 text-sm font-semibold text-[#F7F5EE] bg-[#1E3F20] hover:bg-[#142B15] rounded-md transition-all shadow-xs flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Liquidate Closet in 60s</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onNavigateBuyer}
                className="px-6 py-3.5 text-sm font-semibold text-[#1E3F20] bg-white border border-[#1E3F20]/25 hover:border-[#1E3F20] hover:bg-[#FAF9F4] rounded-md transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Shop Campus Thrift Drop</span>
                <span className="w-2 h-2 rounded-full bg-[#FF5E36]" />
              </button>

              <button
                onClick={onNavigateAppraisal}
                className="px-4 py-3.5 text-xs font-mono font-medium text-[#1E3F20] hover:underline flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Test AI Appraiser</span>
                <Sparkles className="w-3.5 h-3.5 text-[#1E3F20]" />
              </button>
            </div>

            {/* Quiet Campus Adjacency Trust Markers */}
            <div className="pt-4 border-t border-[#1E3F20]/10 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono text-[#5A564A]">
              <span>Active at 8 Campuses</span>
              <span>·</span>
              <span>DU North & South</span>
              <span>·</span>
              <span>Ashoka & Jindal Sonipat</span>
              <span>·</span>
              <span>Bennett & Sharda GNoida</span>
            </div>
          </div>

          {/* Right Column: Visual Architecture / Interactive Flow Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#FAF9F4] border border-[#1E3F20]/15 rounded-lg p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E3F20]/10">
                <span className="text-xs font-mono uppercase tracking-wider text-[#1E3F20] font-semibold">
                  How ReVogue Works
                </span>
                <span className="text-xs font-mono text-[#8C8675]">Batch Model · 0% Effort</span>
              </div>

              {/* 3-Step Flow Diagram */}
              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded bg-[#1E3F20] text-[#F7F5EE] text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    01
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#142B15]">Fill a Bag at Your Dorm</h2>
                    <p className="text-xs text-[#5A564A] mt-0.5 leading-relaxed">
                      Hand over 3 to 15+ garments to your campus ambassador. No photographing or listing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded bg-[#1E3F20] text-[#F7F5EE] text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    02
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#142B15]">AI Appraisal & 120°C Steam</h2>
                    <p className="text-xs text-[#5A564A] mt-0.5 leading-relaxed">
                      Garments scanned for seam integrity, graded, and treated with medical-grade hospital steam.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded bg-[#1E3F20] text-[#F7F5EE] text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    03
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#142B15]">Instant UPI Cash or 1.2x Tokens</h2>
                    <p className="text-xs text-[#5A564A] mt-0.5 leading-relaxed">
                      Upfront payment straight to PhonePe/GPay, or get 20% bonus store credits for weekly thrift drops.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quality Guarantee Callout */}
              <div className="bg-[#1E3F20]/5 rounded p-3.5 flex items-center gap-3 text-xs text-[#1E3F20]">
                <ShieldCheck className="w-5 h-5 shrink-0 text-[#1E3F20]" />
                <span className="font-medium">
                  100% Quality-Inspected: Verified Zara, H&M, Levi’s, and Uniqlo inventory.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Impact Ticker Strip (Clean 4-column metrics baseline) */}
        <div className="mt-12 pt-8 border-t border-[#1E3F20]/15">
          <div className="text-xs font-mono uppercase tracking-widest text-[#8C8675] mb-4">
            Venture Quest Real-Time Impact Ledger
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-[#5A564A]">
                <Recycle className="w-4 h-4 text-[#1E3F20]" />
                <span>Garments Diverted</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#142B15] tabular-nums">
                {liveGarments.toLocaleString('en-IN')} pcs
              </div>
              <p className="text-[11px] text-[#8C8675]">Kept out of Delhi NCR landfills</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-[#5A564A]">
                <Droplets className="w-4 h-4 text-[#1E3F20]" />
                <span>Water Conserved</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#142B15] tabular-nums">
                {(liveWater / 1000000).toFixed(2)}M L
              </div>
              <p className="text-[11px] text-[#8C8675]">Equivalent to 15 Olympic pools</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-[#5A564A]">
                <IndianRupee className="w-4 h-4 text-[#1E3F20]" />
                <span>Cash Returned to Students</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#142B15] tabular-nums">
                ₹{(liveCash / 100000).toFixed(2)} Lakhs
              </div>
              <p className="text-[11px] text-[#8C8675]">Directly disbursed via UPI</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-[#5A564A]">
                <Clock className="w-4 h-4 text-[#1E3F20]" />
                <span>Avg. Liquidation Time</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#142B15] tabular-nums">
                60 Seconds
              </div>
              <p className="text-[11px] text-[#8C8675]">Zero photography or messaging</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
