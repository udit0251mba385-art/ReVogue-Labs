import React, { useState, useEffect } from 'react';
import { ThriftProduct } from '../types';
import { GarmentVisual } from './GarmentVisual';
import { ProductDetailModal } from './ProductDetailModal';
import { 
  Clock, 
  Filter, 
  Search, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  SlidersHorizontal,
  Flame,
  ArrowUpDown
} from 'lucide-react';

interface BuyerFlowProps {
  products: ThriftProduct[];
  cartItemIds: string[];
  onAddToCart: (product: ThriftProduct) => void;
  previewMode?: boolean;
}

export const BuyerFlow: React.FC<BuyerFlowProps> = ({
  products,
  cartItemIds,
  onAddToCart,
  previewMode = false,
}) => {
  // Flash drop countdown timer (e.g., 18 hours, 34 mins, 42 seconds remaining)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 18,
    minutes: 34,
    seconds: 42,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 48, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [under650Only, setUnder650Only] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc'>('featured');

  // Selected Product for Detail Modal
  const [selectedProduct, setSelectedProduct] = useState<ThriftProduct | null>(null);

  // Available Filter Options
  const categories = ['All', 'Outerwear', 'Tops & Knitwear', 'Bottoms & Denim', 'Co-ords'];
  const brands = ['All', 'Zara', 'H&M', 'Savana', 'Uniqlo', "Levi's", 'Urbanic', 'Bershka', 'Mango'];
  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL'];
  const conditions = ['All', 'Mint', 'Excellent', 'Good'];

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchOrigin = p.campusOrigin.toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchOrigin) return false;
    }
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;
    if (selectedSize !== 'All' && p.size !== selectedSize) return false;
    if (selectedCondition !== 'All' && p.condition !== selectedCondition) return false;
    if (under650Only && p.thriftPrice > 650) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.thriftPrice - b.thriftPrice;
    if (sortBy === 'price_desc') return b.thriftPrice - a.thriftPrice;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className={previewMode ? '' : 'py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
      {!previewMode && (
        <>
          {/* 48-Hour Drop Banner Header */}
      <div className="mb-8 p-6 sm:p-8 bg-[#1E3F20] text-[#F7F5EE] rounded-lg shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-widest text-[#C2F04E] flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-[#C2F04E]" />
            <span>Drop #42 · Live Campus Curated Drop</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            The 48-Hour Flash Thrift Drop
          </h2>
          <p className="text-xs sm:text-sm text-[#ECE8DC] max-w-xl leading-relaxed">
            Every piece is collected from Delhi NCR campus closets, appraised by computer-vision,
            and steam-sanitized at 120°C before drop release. Unclaimed items rotate in 48 hours.
          </p>
        </div>

        {/* Urgency Countdown Box */}
        <div className="bg-[#142B15] border border-[#C2F04E]/30 rounded-lg p-4 sm:p-5 shrink-0 space-y-2 text-center md:text-right">
          <div className="text-[11px] font-mono text-[#ECE8DC] flex items-center justify-center md:justify-end gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#C2F04E]" />
            <span>DROP CLOSES IN</span>
          </div>
          <div className="flex items-center justify-center md:justify-end gap-2 font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
            <span className="bg-black/40 px-2 py-1 rounded">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span className="text-[#C2F04E]">:</span>
            <span className="bg-black/40 px-2 py-1 rounded">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span className="text-[#C2F04E]">:</span>
            <span className="bg-black/40 px-2 py-1 rounded text-[#C2F04E]">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
          <div className="text-[10px] font-mono text-[#8C8675] text-center md:text-right">
            Next drop: Thursday 18:00
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8C8675] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Zara jacket, Levi's denim, hoodies..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#1E3F20]/20 rounded text-sm text-[#142B15] placeholder:text-[#8C8675] focus:outline-hidden focus:border-[#1E3F20]"
            />
          </div>

          {/* Quick Segmented Controls: Price < ₹650 Toggle & Sort */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setUnder650Only(!under650Only)}
              className={`px-3.5 py-2 text-xs font-mono rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                under650Only
                  ? 'bg-[#1E3F20] text-[#F7F5EE] font-semibold'
                  : 'bg-white border border-[#1E3F20]/20 text-[#142B15] hover:border-[#1E3F20]'
              }`}
            >
              <span>Under ₹650 Steals</span>
              {under650Only && <Check className="w-3.5 h-3.5 text-[#C2F04E]" />}
            </button>

            <div className="flex items-center gap-1.5 bg-white border border-[#1E3F20]/20 rounded px-2.5 py-1.5 text-xs font-mono">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8C8675]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'featured' | 'price_asc' | 'price_desc')}
                className="bg-transparent text-[#142B15] focus:outline-hidden text-xs cursor-pointer"
              >
                <option value="featured">Featured Drops</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Segmented Controls: Category, Brand, Size, Condition */}
        <div className="bg-[#FAF9F4] border border-[#1E3F20]/15 rounded-lg p-4 space-y-3.5">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-mono text-[#8C8675] uppercase whitespace-nowrap shrink-0 pr-1">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1E3F20] text-[#F7F5EE]'
                    : 'bg-white border border-[#1E3F20]/15 text-[#5A564A] hover:text-[#142B15]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Brand Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-mono text-[#8C8675] uppercase whitespace-nowrap shrink-0 pr-1">
              Brand:
            </span>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  selectedBrand === b
                    ? 'bg-[#1E3F20] text-[#F7F5EE]'
                    : 'bg-white border border-[#1E3F20]/15 text-[#5A564A] hover:text-[#142B15]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Size & Condition Row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 border-t border-[#1E3F20]/10 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[#8C8675] text-[11px] uppercase">Size:</span>
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-7 h-7 rounded text-[11px] font-bold flex items-center justify-center transition-colors cursor-pointer ${
                    selectedSize === s
                      ? 'bg-[#1E3F20] text-[#F7F5EE]'
                      : 'bg-white border border-[#1E3F20]/15 text-[#5A564A] hover:text-[#142B15]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#8C8675] text-[11px] uppercase">Condition:</span>
              {conditions.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCondition(c)}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                    selectedCondition === c
                      ? 'bg-[#1E3F20] text-[#F7F5EE] font-semibold'
                      : 'bg-white border border-[#1E3F20]/15 text-[#5A564A] hover:text-[#142B15]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Clear All Filters */}
            {(selectedCategory !== 'All' || selectedBrand !== 'All' || selectedSize !== 'All' || selectedCondition !== 'All' || under650Only || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedBrand('All');
                  setSelectedSize('All');
                  setSelectedCondition('All');
                  setUnder650Only(false);
                  setSearchQuery('');
                }}
                className="text-[11px] text-[#FF5E36] underline hover:text-[#142B15] cursor-pointer ml-auto"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      </div>
        </>
      )}

      {/* Thrift Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-[#FAF9F4] border border-[#1E3F20]/15 rounded-lg space-y-3">
          <p className="text-base font-semibold text-[#142B15]">No garments found matching filters</p>
          <p className="text-xs text-[#5A564A] max-w-sm mx-auto">
            Try adjusting your brand, size, or price filter. Campus closets are updated every 48 hours.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedBrand('All');
              setSelectedSize('All');
              setSelectedCondition('All');
              setUnder650Only(false);
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-mono bg-[#1E3F20] text-[#F7F5EE] rounded cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isItemInCart = cartItemIds.includes(product.id);
            const savingsPercent = Math.round(
              ((product.originalPrice - product.thriftPrice) / product.originalPrice) * 100
            );

            return (
              <div
                key={product.id}
                className="group bg-white border border-[#1E3F20]/15 rounded-lg overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                {/* Product Visual Area */}
                <div className="relative">
                  <GarmentVisual product={product} className="h-64 w-full" />

                  {/* Savings Kicker Tag */}
                  <div className="absolute top-2.5 left-2.5 z-20 bg-[#1E3F20] text-[#F7F5EE] text-[10px] font-mono px-2 py-0.5 rounded font-semibold">
                    -{savingsPercent}% OFF
                  </div>

                  {/* Quick View Button overlay on hover */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <span className="bg-white/95 text-[#142B15] text-xs font-medium px-3.5 py-1.5 rounded shadow-sm">
                      Inspect Garment
                    </span>
                  </div>
                </div>

                {/* Metadata & Title (Zero-Pill discipline: unboxed clean text) */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono text-[#8C8675]">
                      <span className="font-semibold text-[#1E3F20] uppercase">{product.brand}</span>
                      <span>
                        Size {product.size} · {product.condition}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#142B15] line-clamp-1 group-hover:text-[#1E3F20] transition-colors">
                      {product.title}
                    </h3>

                    <div className="text-[11px] font-mono text-[#5A564A] truncate">
                      {product.campusOrigin}
                    </div>
                  </div>

                  {/* Price & Add to Cart button */}
                  <div className="pt-2 border-t border-[#1E3F20]/10 flex items-center justify-between">
                    <div>
                      <div className="text-base font-bold font-mono text-[#1E3F20] tabular-nums">
                        ₹{product.thriftPrice.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] font-mono text-[#8C8675] line-through tabular-nums">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      disabled={isItemInCart}
                      className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isItemInCart
                          ? 'bg-[#2A562D] text-white cursor-default'
                          : 'bg-[#1E3F20] hover:bg-[#142B15] text-[#F7F5EE]'
                      }`}
                    >
                      {isItemInCart ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#C2F04E]" />
                          <span>In Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
          isInCart={cartItemIds.includes(selectedProduct.id)}
        />
      )}
    </div>
  );
};
