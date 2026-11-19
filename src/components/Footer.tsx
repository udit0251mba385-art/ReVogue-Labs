import React from 'react';
import { NavTab } from './Navbar';

interface FooterProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="border-t border-[#1E3F20]/15 bg-[#FAF9F4] text-[#302E28] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-3">
          <div className="text-lg font-bold font-display text-[#1E3F20]">
            ReVogue Labs
          </div>
          <p className="text-xs text-[#5A564A] max-w-sm leading-relaxed">
            Tech-enabled circular fashion platform for Indian universities. Zero-effort doorstep batch collection, AI garment appraisal, and curated 48-hour flash thrift drops.
          </p>
          <div className="text-[11px] font-mono text-[#8C8675] pt-2">
            Active across Delhi University North/South, Sonipat Highway & Greater Noida Knowledge Park.
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="text-xs font-mono uppercase tracking-wider text-[#142B15] font-semibold">
            Marketplace
          </div>
          <ul className="space-y-2 text-xs text-[#5A564A]">
            <li>
              <button
                onClick={() => onNavigateTab('buyer')}
                className="hover:text-[#1E3F20] transition-colors cursor-pointer"
              >
                48h Flash Thrift Drops
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('seller')}
                className="hover:text-[#1E3F20] transition-colors cursor-pointer"
              >
                Doorstep Wardrobe Liquidation
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('appraisal')}
                className="hover:text-[#1E3F20] transition-colors cursor-pointer"
              >
                AI Garment Inspection Engine
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <div className="text-xs font-mono uppercase tracking-wider text-[#142B15] font-semibold">
            Venture
          </div>
          <ul className="space-y-2 text-xs text-[#5A564A]">
            <li>
              <button
                onClick={() => onNavigateTab('admin')}
                className="hover:text-[#1E3F20] transition-colors cursor-pointer"
              >
                Unit Economics & Operations
              </button>
            </li>
            <li>
              <span className="text-[#8C8675]">Ambassador Program (42 active reps)</span>
            </li>
            <li>
              <span className="text-[#8C8675]">Hospital-Grade Steam Sanitization</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-[#1E3F20]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8C8675]">
        <div>© 2026 ReVogue Labs Inc. Venture Quest Circular Economy.</div>
        <div>Built for Campus Sustainability · Zero Landfill Initiative</div>
      </div>
    </footer>
  );
};
