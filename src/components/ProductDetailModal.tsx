import React from 'react';
import { ThriftProduct } from '../types';
import { GarmentVisual } from './GarmentVisual';
import { 
  X, 
  ShieldCheck, 
  Flame, 
  MapPin, 
  ShoppingBag, 
  CheckCircle2, 
  Sparkles, 
  Tag, 
  Truck
} from 'lucide-react';

interface ProductDetailModalProps {
  product: ThriftProduct | null;
  onClose: () => void;
  onAddToCart: (product: ThriftProduct) => void;
  isInCart: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isInCart,
}) => {
  if (!product) return null;

  const savingsPercent = Math.round(
    ((product.originalPrice - product.thriftPrice) / product.originalPrice) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-3xl bg-[#FAF9F4] border border-[#1E3F20]/20 rounded-lg shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3F20]/10 bg-white">
          <div className="flex items-center gap-2 text-xs font-mono text-[#1E3F20]">
            <ShieldCheck className="w-4 h-4 text-[#1E3F20]" />
            <span className="font-semibold uppercase tracking-wider">AI Verified & Steam-Sanitized</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#5A564A] hover:text-[#1E3F20] hover:bg-[#ECE8DC] rounded-md transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Split */}
        <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Garment Visual Showcase */}
          <div className="md:col-span-6 space-y-4">
            <div className="rounded-lg border border-[#1E3F20]/15 overflow-hidden shadow-xs">
              <GarmentVisual product={product} className="h-72 w-full" showBadges={false} />
            </div>

            {/* Sanitization Guarantee Badge Box */}
            <div className="bg-white border border-[#1E3F20]/15 rounded p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#1E3F20]">
                <Flame className="w-4 h-4 text-[#FF5E36]" />
                <span>4-Stage Sanitization Protocol</span>
              </div>
              <p className="text-[#5A564A] leading-relaxed">
                Treated with 120°C high-pressure hospital steam vapor. Deodorized, lint-rolled, and vacuum-sealed at our Delhi NCR facility.
              </p>
              <div className="text-[11px] font-mono text-[#8C8675] pt-1 border-t border-[#ECE8DC] flex justify-between">
                <span>Batch: {product.sanitizationBatch}</span>
                <span>Cell 04 Verified</span>
              </div>
            </div>
          </div>

          {/* Right: Garment Attributes, AI Report & Add To Bag */}
          <div className="md:col-span-6 space-y-5">
            <div>
              {/* Clean unboxed metadata */}
              <div className="text-xs font-mono uppercase tracking-wider text-[#1E3F20] font-semibold flex items-center gap-2">
                <span>{product.brand}</span>
                <span className="text-[#8C8675]">·</span>
                <span>Size {product.size}</span>
                <span className="text-[#8C8675]">·</span>
                <span>{product.condition} Condition</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#142B15] mt-1">
                {product.title}
              </h2>

              <div className="flex items-center gap-2 text-xs font-mono text-[#5A564A] mt-2">
                <MapPin className="w-3.5 h-3.5 text-[#1E3F20]" />
                <span>Liquidated from: {product.campusOrigin}</span>
              </div>
            </div>

            {/* Pricing Comparison */}
            <div className="bg-white border border-[#1E3F20]/15 rounded p-4 flex items-baseline justify-between">
              <div>
                <span className="text-xs font-mono text-[#8C8675] block">Curated Drop Price</span>
                <span className="text-2xl font-bold font-mono text-[#1E3F20] tabular-nums">
                  ₹{product.thriftPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-[#8C8675] block">Retail Price</span>
                <span className="text-sm font-mono text-[#5A564A] line-through tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-mono text-[#1E3F20] font-semibold block">
                  Save {savingsPercent}%
                </span>
              </div>
            </div>

            {/* AI Inspection Scores */}
            <div className="bg-[#FAF9F4] border border-[#1E3F20]/15 rounded p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-[#142B15] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1E3F20]" />
                  <span>AI Computer-Vision Verification</span>
                </span>
                <span className="text-[#1E3F20] font-bold">{product.aiVerificationScore}% Score</span>
              </div>

              <div className="space-y-1.5 text-xs text-[#5A564A]">
                <div className="flex justify-between">
                  <span>Material Composition:</span>
                  <span className="font-medium text-[#142B15]">{product.material}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seam Integrity:</span>
                  <span className="font-medium text-[#1E3F20]">100% Intact</span>
                </div>
                <div className="flex justify-between">
                  <span>Authenticity Stamp:</span>
                  <span className="font-medium text-[#1E3F20]">Original Brand Tag Verified</span>
                </div>
              </div>
            </div>

            {/* Campus Delivery Promise */}
            <div className="flex items-center gap-2.5 text-xs text-[#5A564A]">
              <Truck className="w-4 h-4 text-[#1E3F20] shrink-0" />
              <span>
                Free doorstep delivery to any Delhi NCR / Sonipat university hostel room within 24h.
              </span>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                onClick={() => onAddToCart(product)}
                disabled={isInCart}
                className={`w-full py-3.5 text-sm font-semibold rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  isInCart
                    ? 'bg-[#2A562D] text-white cursor-default'
                    : 'bg-[#1E3F20] hover:bg-[#142B15] text-[#F7F5EE]'
                }`}
              >
                {isInCart ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#C2F04E]" />
                    <span>Item Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag · ₹{product.thriftPrice}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
