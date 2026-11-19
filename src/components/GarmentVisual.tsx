import React from 'react';
import { ThriftProduct } from '../types';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface GarmentVisualProps {
  product: ThriftProduct;
  className?: string;
  showBadges?: boolean;
}

export const GarmentVisual: React.FC<GarmentVisualProps> = ({
  product,
  className = '',
  showBadges = true,
}) => {
  const { brand, styleType, colorPalette } = product;

  // Render authentic garment vectors based on styleType
  const renderGarmentSvg = () => {
    switch (styleType) {
      case 'oversized_jacket':
        return (
          <svg viewBox="0 0 400 360" className="w-full h-full drop-shadow-md select-none">
            <defs>
              <linearGradient id={`grad-jacket-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colorPalette.primary} />
                <stop offset="100%" stopColor={colorPalette.secondary} />
              </linearGradient>
              <pattern id={`weave-${product.id}`} width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M0 4 L8 4 M4 0 L4 8" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
              </pattern>
            </defs>

            {/* Shoulders and Sleeves */}
            <path
              d="M 120 70 L 40 135 L 75 220 L 115 175 L 115 310 L 285 310 L 285 175 L 325 220 L 360 135 L 280 70 Z"
              fill={`url(#grad-jacket-${product.id})`}
            />
            {/* Fabric texture overlay */}
            <path
              d="M 120 70 L 40 135 L 75 220 L 115 175 L 115 310 L 285 310 L 285 175 L 325 220 L 360 135 L 280 70 Z"
              fill={`url(#weave-${product.id})`}
            />

            {/* Collar */}
            <path d="M 140 65 Q 200 110 260 65 L 280 70 Q 200 120 120 70 Z" fill={colorPalette.secondary} />
            <path d="M 160 65 Q 200 95 240 65" stroke={colorPalette.accent} strokeWidth="2.5" fill="none" />

            {/* Center Zipper track */}
            <line x1="200" y1="105" x2="200" y2="310" stroke="rgba(240, 240, 240, 0.7)" strokeWidth="3.5" strokeDasharray="3 2" />
            <rect x="196" y="115" width="8" height="14" rx="2" fill="#E2E8F0" />

            {/* Front Chest Pockets */}
            <rect x="135" y="145" width="46" height="52" rx="4" fill="rgba(0,0,0,0.18)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
            <path d="M 135 145 L 158 160 L 181 145" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

            <rect x="219" y="145" width="46" height="52" rx="4" fill="rgba(0,0,0,0.18)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
            <path d="M 219 145 L 242 160 L 265 145" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

            {/* Ribbed Hem & Cuffs */}
            <rect x="115" y="296" width="170" height="14" rx="2" fill={colorPalette.secondary} />
            <line x1="115" y1="303" x2="285" y2="303" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="4 2" />

            {/* Left & Right Cuffs */}
            <rect x="44" y="200" width="34" height="12" rx="2" transform="rotate(32 61 206)" fill={colorPalette.secondary} />
            <rect x="322" y="200" width="34" height="12" rx="2" transform="rotate(-32 339 206)" fill={colorPalette.secondary} />

            {/* Interior Brand Label */}
            <rect x="180" y="80" width="40" height="18" rx="2" fill="#F7F5EE" stroke="#333" strokeWidth="0.8" />
            <text x="200" y="92" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#1A241C" letterSpacing="0.5">
              {brand.toUpperCase()}
            </text>
          </svg>
        );

      case 'knit_sweater':
        return (
          <svg viewBox="0 0 400 360" className="w-full h-full drop-shadow-md select-none">
            <defs>
              <linearGradient id={`grad-knit-${product.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colorPalette.primary} />
                <stop offset="100%" stopColor={colorPalette.secondary} />
              </linearGradient>
            </defs>

            {/* Sweater Body and Sleeves */}
            <path
              d="M 130 75 L 50 145 L 85 240 L 122 185 L 122 315 L 278 315 L 278 185 L 315 240 L 350 145 L 270 75 Z"
              fill={`url(#grad-knit-${product.id})`}
            />

            {/* Chunky Cable Knit Vertical Braids */}
            <g stroke="rgba(0,0,0,0.12)" strokeWidth="3" fill="none" strokeLinecap="round">
              <path d="M 155 105 Q 163 130 155 155 Q 147 180 155 205 Q 163 230 155 255 Q 147 280 155 305" />
              <path d="M 200 105 Q 208 130 200 155 Q 192 180 200 205 Q 208 230 200 255 Q 192 280 200 305" />
              <path d="M 245 105 Q 253 130 245 155 Q 237 180 245 205 Q 253 230 245 255 Q 237 280 245 305" />
            </g>

            {/* Ribbed Crewneck Collar */}
            <path d="M 150 72 Q 200 96 250 72 Q 200 60 150 72 Z" fill={colorPalette.secondary} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
            <path d="M 155 74 Q 200 90 245 74" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="3 2" fill="none" />

            {/* Bottom Hem & Cuffs */}
            <rect x="122" y="302" width="156" height="13" rx="2" fill={colorPalette.secondary} />
            <line x1="122" y1="308" x2="278" y2="308" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" strokeDasharray="4 2" />

            {/* Cuffs */}
            <rect x="58" y="218" width="30" height="14" rx="2" transform="rotate(35 73 225)" fill={colorPalette.secondary} />
            <rect x="312" y="218" width="30" height="14" rx="2" transform="rotate(-35 327 225)" fill={colorPalette.secondary} />

            {/* Brand Neck Label */}
            <rect x="184" y="60" width="32" height="14" rx="1.5" fill="#FAF9F4" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
            <text x="200" y="70" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#302E28">
              {brand}
            </text>
          </svg>
        );

      case 'vintage_denim':
        return (
          <svg viewBox="0 0 400 360" className="w-full h-full drop-shadow-md select-none">
            <defs>
              <linearGradient id={`grad-denim-${product.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colorPalette.primary} />
                <stop offset="60%" stopColor={colorPalette.accent} />
                <stop offset="100%" stopColor={colorPalette.secondary} />
              </linearGradient>
            </defs>

            {/* Waistband */}
            <rect x="128" y="45" width="144" height="24" rx="3" fill={colorPalette.secondary} />
            <rect x="195" y="52" width="10" height="10" rx="5" fill="#D4AF37" stroke="#7E5F1E" strokeWidth="1" /> {/* Brass Button */}

            {/* Belt Loops */}
            <rect x="142" y="44" width="6" height="26" fill={colorPalette.primary} stroke="#B87333" strokeWidth="0.8" />
            <rect x="175" y="44" width="6" height="26" fill={colorPalette.primary} stroke="#B87333" strokeWidth="0.8" />
            <rect x="219" y="44" width="6" height="26" fill={colorPalette.primary} stroke="#B87333" strokeWidth="0.8" />
            <rect x="252" y="44" width="6" height="26" fill={colorPalette.primary} stroke="#B87333" strokeWidth="0.8" />

            {/* Legs and Crotch */}
            <path
              d="M 128 69 L 115 320 L 180 320 L 196 155 L 204 155 L 220 320 L 285 320 L 272 69 Z"
              fill={`url(#grad-denim-${product.id})`}
            />

            {/* Curved Front Scoop Pockets */}
            <path d="M 132 69 Q 155 80 150 115" stroke="#D4AF37" strokeWidth="2" strokeDasharray="3 1.5" fill="none" />
            <path d="M 268 69 Q 245 80 250 115" stroke="#D4AF37" strokeWidth="2" strokeDasharray="3 1.5" fill="none" />
            {/* Coin Pocket */}
            <rect x="238" y="82" width="18" height="14" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="2 1.5" />
            <circle cx="237" cy="82" r="2.5" fill="#B87333" />

            {/* Fly Inseam Stitching */}
            <path d="M 200 69 L 200 135 Q 200 148 194 155" stroke="#D4AF37" strokeWidth="2" strokeDasharray="4 2" fill="none" />

            {/* Whisker fading lines */}
            <path d="M 150 125 Q 185 140 196 150" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 250 125 Q 215 140 204 150" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Raw Hem Cuffs */}
            <line x1="115" y1="316" x2="180" y2="316" stroke="#D4AF37" strokeWidth="2" strokeDasharray="3 1" />
            <line x1="220" y1="316" x2="285" y2="316" stroke="#D4AF37" strokeWidth="2" strokeDasharray="3 1" />

            {/* Leather back patch label hint */}
            <rect x="240" y="46" width="28" height="16" rx="2" fill="#8B4513" stroke="#5C2E0B" strokeWidth="0.8" />
            <text x="254" y="57" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#F7F5EE">
              {brand}
            </text>
          </svg>
        );

      case 'utility_cargo':
        return (
          <svg viewBox="0 0 400 360" className="w-full h-full drop-shadow-md select-none">
            <defs>
              <linearGradient id={`grad-cargo-${product.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colorPalette.primary} />
                <stop offset="100%" stopColor={colorPalette.secondary} />
              </linearGradient>
            </defs>

            {/* Elasticated Drawstring Waistband */}
            <rect x="130" y="46" width="140" height="26" rx="4" fill={colorPalette.secondary} />
            <path d="M 130 59 L 270 59" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M 195 62 L 190 85 M 205 62 L 210 85" stroke="#C2F04E" strokeWidth="2" strokeLinecap="round" />

            {/* Wide Baggier Leg Silhouette */}
            <path
              d="M 130 72 L 105 320 L 180 320 L 196 150 L 204 150 L 220 320 L 295 320 L 270 72 Z"
              fill={`url(#grad-cargo-${product.id})`}
            />

            {/* Bellows Cargo Side Pockets */}
            <rect x="94" y="145" width="38" height="58" rx="4" fill={colorPalette.secondary} stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
            <path d="M 94 145 L 113 158 L 132 145" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <line x1="113" y1="158" x2="113" y2="185" stroke="#C2F04E" strokeWidth="2" /> {/* Webbing strap */}

            <rect x="268" y="145" width="38" height="58" rx="4" fill={colorPalette.secondary} stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
            <path d="M 268 145 L 287 158 L 306 145" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <line x1="287" y1="158" x2="287" y2="185" stroke="#C2F04E" strokeWidth="2" />

            {/* Knee Articulation Darts */}
            <line x1="118" y1="230" x2="168" y2="230" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" />
            <line x1="232" y1="230" x2="282" y2="230" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" />

            {/* Ankle Bungee Cuffs */}
            <rect x="105" y="312" width="75" height="10" rx="3" fill={colorPalette.secondary} />
            <circle cx="102" cy="317" r="4" fill="#C2F04E" />
            <rect x="220" y="312" width="75" height="10" rx="3" fill={colorPalette.secondary} />
            <circle cx="298" cy="317" r="4" fill="#C2F04E" />
          </svg>
        );

      case 'streetwear_hoodie':
        return (
          <svg viewBox="0 0 400 360" className="w-full h-full drop-shadow-md select-none">
            <defs>
              <linearGradient id={`grad-hoodie-${product.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colorPalette.primary} />
                <stop offset="100%" stopColor={colorPalette.secondary} />
              </linearGradient>
            </defs>

            {/* Oversized Boxy Body and Sleeves */}
            <path
              d="M 125 75 L 42 140 L 78 238 L 118 185 L 118 315 L 282 315 L 282 185 L 322 238 L 358 140 L 275 75 Z"
              fill={`url(#grad-hoodie-${product.id})`}
            />

            {/* Big Relaxed Hood Layer */}
            <path
              d="M 145 75 Q 120 40 160 25 Q 200 15 240 25 Q 280 40 255 75 Q 200 110 145 75 Z"
              fill={colorPalette.secondary}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="1.5"
            />
            <path d="M 168 55 Q 200 70 232 55" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />

            {/* Kangaroo Pouch Pocket */}
            <path
              d="M 145 200 L 255 200 L 265 275 L 135 275 Z"
              fill="rgba(0,0,0,0.15)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1.2"
            />
            <path d="M 145 200 L 135 275 M 255 200 L 265 275" stroke="rgba(255,255,255,0.2)" strokeWidth="1.8" />

            {/* Heavy Ribbed Hem & Cuffs */}
            <rect x="118" y="300" width="164" height="15" rx="3" fill={colorPalette.secondary} />
            <line x1="118" y1="307" x2="282" y2="307" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="4 2" />

            {/* Cuffs */}
            <rect x="52" y="215" width="32" height="15" rx="2" transform="rotate(35 68 222)" fill={colorPalette.secondary} />
            <rect x="316" y="215" width="32" height="15" rx="2" transform="rotate(-35 332 222)" fill={colorPalette.secondary} />
          </svg>
        );

      case 'pleated_skirt':
      default:
        return (
          <svg viewBox="0 0 400 360" className="w-full h-full drop-shadow-md select-none">
            <defs>
              <linearGradient id={`grad-skirt-${product.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colorPalette.primary} />
                <stop offset="100%" stopColor={colorPalette.secondary} />
              </linearGradient>
            </defs>

            {/* Waistband */}
            <rect x="140" y="65" width="120" height="22" rx="3" fill={colorPalette.secondary} />

            {/* Flared Knife Pleated Skirt */}
            <path
              d="M 140 87 L 90 290 L 310 290 L 260 87 Z"
              fill={`url(#grad-skirt-${product.id})`}
            />

            {/* Pleat Crease Lines */}
            <g stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeLinecap="round">
              <line x1="155" y1="87" x2="115" y2="290" />
              <line x1="170" y1="87" x2="140" y2="290" />
              <line x1="185" y1="87" x2="165" y2="290" />
              <line x1="200" y1="87" x2="200" y2="290" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
              <line x1="215" y1="87" x2="235" y2="290" />
              <line x1="230" y1="87" x2="260" y2="290" />
              <line x1="245" y1="87" x2="285" y2="290" />
            </g>

            {/* Hem Line */}
            <line x1="90" y1="284" x2="310" y2="284" stroke={colorPalette.accent} strokeWidth="2.5" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FAF8F2] to-[#ECE7D7] ${className}`}
      style={{ minHeight: '260px' }}
    >
      {/* Subtle Studio Pedestal Backdrop Grid */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(30, 63, 32, 0.08) 0%, transparent 65%)',
        }}
      />

      {/* Campus Origin Watermark / Coordinates */}
      <div className="absolute top-3 left-3 text-[11px] font-mono text-[#8C8675] tracking-tight pointer-events-none select-none">
        {product.campusOrigin}
      </div>

      {/* SVG Garment Illustration */}
      <div className="relative z-10 w-full max-w-[280px] p-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        {renderGarmentSvg()}
      </div>

      {/* Zero-Pill Badges: Clean unboxed metadata indicators */}
      {showBadges && (
        <div className="absolute bottom-2.5 right-3 z-20 flex items-center gap-1.5 text-[11px] font-mono text-[#1E3F20] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs border border-[#1E3F20]/15">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1E3F20]" />
          <span>AI {product.aiVerificationScore}%</span>
          <span className="text-[#8C8675]">·</span>
          <span>120°C Steam</span>
        </div>
      )}

      {/* Top Right Urgent/Rare text */}
      {product.condition === 'Mint' && (
        <div className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-wider text-[#1E3F20] font-semibold">
          Mint Condition
        </div>
      )}
    </div>
  );
};
