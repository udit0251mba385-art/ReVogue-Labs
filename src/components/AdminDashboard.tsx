import React, { useState } from 'react';
import { UnitEconomics, RoutePlan, RouteStop, ThriftProduct } from '../types';
import { 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ShieldCheck
} from 'lucide-react';

export interface StagingItem {
  id: string;
  title: string;
  brand: ThriftProduct['brand'];
  category: ThriftProduct['category'];
  origin: string;
  donorPayout: number;
  suggestedDropPrice: number;
  originalPrice: number;
  seamScore: number;
  styleType: ThriftProduct['styleType'];
  status: 'pending' | 'approved';
}

interface AdminDashboardProps {
  metrics: UnitEconomics;
  routePlans: RoutePlan[];
  onApproveDropItem?: (item: StagingItem) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  metrics,
  routePlans: initialRoutePlans,
  onApproveDropItem,
}) => {
  const [routePlans, setRoutePlans] = useState<RoutePlan[]>(initialRoutePlans);
  const [selectedRouteId, setSelectedRouteId] = useState<string>(initialRoutePlans[0].id);

  // Staging queue items waiting for final quality approval before flash drop
  const [stagingQueue, setStagingQueue] = useState<StagingItem[]>([
    {
      id: 'stg-01',
      title: 'Uniqlo Oxford Relaxed Button-Down',
      brand: 'Uniqlo',
      category: 'Tops & Knitwear',
      origin: 'Ashoka RH-3',
      donorPayout: 380,
      suggestedDropPrice: 620,
      originalPrice: 2490,
      seamScore: 98,
      styleType: 'oversized_jacket',
      status: 'pending',
    },
    {
      id: 'stg-02',
      title: 'Zara Faux Leather Cropped Biker',
      brand: 'Zara',
      category: 'Outerwear',
      origin: 'Miranda House DU',
      donorPayout: 750,
      suggestedDropPrice: 1190,
      originalPrice: 5490,
      seamScore: 94,
      styleType: 'oversized_jacket',
      status: 'pending',
    },
    {
      id: 'stg-03',
      title: 'H&M Organic Cotton Oversized Tee',
      brand: 'H&M',
      category: 'Tops & Knitwear',
      origin: 'Bennett Block B',
      donorPayout: 210,
      suggestedDropPrice: 420,
      originalPrice: 1499,
      seamScore: 99,
      styleType: 'streetwear_hoodie',
      status: 'pending',
    },
  ]);

  const activeRoute = routePlans.find((r) => r.id === selectedRouteId) || routePlans[0];

  // Toggle stop status in route planner
  const handleToggleStopStatus = (routeId: string, stopId: string) => {
    setRoutePlans((prev) =>
      prev.map((r) => {
        if (r.id !== routeId) return r;
        return {
          ...r,
          stops: r.stops.map((s) => {
            if (s.id !== stopId) return s;
            const nextStatus: RouteStop['status'] =
              s.status === 'pending'
                ? 'in_progress'
                : s.status === 'in_progress'
                ? 'completed'
                : 'pending';
            return { ...s, status: nextStatus };
          }),
        };
      })
    );
  };

  const handleApproveStaging = (id: string) => {
    const target = stagingQueue.find((item) => item.id === id);
    if (!target || target.status === 'approved') return;

    setStagingQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
    if (onApproveDropItem) {
      onApproveDropItem(target);
    }
  };

  const revenueProgress = Math.round((metrics.monthlyRevenueCurrent / metrics.monthlyRevenueTarget) * 100);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#1E3F20] font-semibold">
            Venture Quest Business Plan Operations
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#142B15] mt-1">
            ReVogue Unit Economics & Ops Dashboard
          </h2>
          <p className="text-sm text-[#5A564A] mt-1 max-w-2xl">
            Live telemetry tracking campus batch pickups, hyper-local logistics cost per bag,
            contribution margins, and 48-hour sell-through velocity across Delhi NCR universities.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono bg-white border border-[#1E3F20]/20 rounded px-3 py-1.5 text-[#1E3F20]">
          <span className="w-2 h-2 rounded-full bg-[#1E3F20]" />
          <span>Active Batch Window: Delhi Cluster Alpha</span>
        </div>
      </div>

      {/* 4 Core Venture Economics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Monthly Revenue Target */}
        <div className="bg-white border border-[#1E3F20]/15 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8C8675]">
            <span>MONTHLY REVENUE</span>
            <span className="text-[#1E3F20] font-bold">{revenueProgress}% OF GOAL</span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#142B15] tabular-nums">
              ₹{(metrics.monthlyRevenueCurrent / 100000).toFixed(2)}L
            </div>
            <div className="text-xs font-mono text-[#5A564A] mt-0.5">
              Target: ₹{(metrics.monthlyRevenueTarget / 100000).toFixed(2)}L (Venture Quest)
            </div>
          </div>
          <div className="w-full bg-[#ECE8DC] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#1E3F20] h-full rounded-full transition-all"
              style={{ width: `${revenueProgress}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Contribution Margin */}
        <div className="bg-white border border-[#1E3F20]/15 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8C8675]">
            <span>CONTRIBUTION MARGIN</span>
            <span className="text-[#1E3F20] font-bold">PROFITABLE</span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#1E3F20] tabular-nums">
              ₹{metrics.contributionMarginCurrent}/sale
            </div>
            <div className="text-xs font-mono text-[#5A564A] mt-0.5">
              Target: ₹{metrics.contributionMarginTarget}/sale (+₹15 beat)
            </div>
          </div>
          <p className="text-[11px] text-[#8C8675]">
            Driven by zero warehousing & direct campus batch sorting.
          </p>
        </div>

        {/* KPI 3: Pickup Cost per Bag */}
        <div className="bg-white border border-[#1E3F20]/15 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8C8675]">
            <span>PICKUP COST / BAG</span>
            <span className="text-[#1E3F20] font-bold">-21.6% UNDER CAP</span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#142B15] tabular-nums">
              ₹{metrics.pickupCostCurrent}
            </div>
            <div className="text-xs font-mono text-[#5A564A] mt-0.5">
              Target Cap: &lt; ₹{metrics.pickupCostTarget} per bag
            </div>
          </div>
          <p className="text-[11px] text-[#8C8675]">
            Achieved through campus ambassador batch clusters.
          </p>
        </div>

        {/* KPI 4: 48h Sell-Through Velocity */}
        <div className="bg-white border border-[#1E3F20]/15 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8C8675]">
            <span>48H SELL-THROUGH</span>
            <span className="text-[#FF5E36] font-bold">HIGH VELOCITY</span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#142B15] tabular-nums">
              {metrics.sellThroughCurrent}%
            </div>
            <div className="text-xs font-mono text-[#5A564A] mt-0.5">
              Target: {metrics.sellThroughTarget}% liquidation rate
            </div>
          </div>
          <p className="text-[11px] text-[#8C8675]">
            Average drop item claimed in under 19 hours.
          </p>
        </div>
      </div>

      {/* Ambassador Batch Collection Route Planner */}
      <div className="bg-[#FAF9F4] border border-[#1E3F20]/15 rounded-lg p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E3F20]/10">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#1E3F20] font-semibold">
              Hyper-Local Logistics Engine
            </div>
            <h3 className="text-xl font-bold text-[#142B15] mt-0.5">
              Ambassador Batch Collection Route Planner
            </h3>
          </div>

          {/* Route Zone Selector */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {routePlans.map((route) => (
              <button
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedRouteId === route.id
                    ? 'bg-[#1E3F20] text-[#F7F5EE] font-bold shadow-xs'
                    : 'bg-white border border-[#1E3F20]/20 text-[#5A564A] hover:text-[#142B15]'
                }`}
              >
                {route.zone}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Route Summary Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded border border-[#1E3F20]/10 text-xs font-mono">
          <div>
            <span className="text-[#8C8675] block">SCHEDULED BATCH</span>
            <span className="font-bold text-[#142B15]">{activeRoute.date}</span>
          </div>
          <div>
            <span className="text-[#8C8675] block">TOTAL CONSOLIDATED BAGS</span>
            <span className="font-bold text-[#1E3F20]">{activeRoute.totalBags} bags</span>
          </div>
          <div>
            <span className="text-[#8C8675] block">EST. DISBURSAL TOTAL</span>
            <span className="font-bold text-[#142B15]">₹{activeRoute.totalEstPayout.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-[#8C8675] block">CONSOLIDATION COST / BAG</span>
            <span className="font-bold text-[#1E3F20]">₹{activeRoute.estimatedCostPerBag} (Target &lt; ₹120)</span>
          </div>
        </div>

        {/* Stops Table / List */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-[#8C8675] uppercase">
            Scheduled Stops ({activeRoute.stops.length}) · Click status to advance
          </div>

          <div className="space-y-2.5">
            {activeRoute.stops.map((stop) => (
              <div
                key={stop.id}
                className="bg-white border border-[#1E3F20]/15 rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[#1E3F20]/10 text-[#1E3F20] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#142B15]">{stop.campus}</h4>
                    <p className="text-xs text-[#5A564A]">{stop.hostelName}</p>
                    <div className="text-[11px] font-mono text-[#8C8675] mt-1 flex items-center gap-3">
                      <span>Ambassador: {stop.ambassador}</span>
                      <span>·</span>
                      <span>Window: {stop.scheduledTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-5 pt-2 md:pt-0 border-t md:border-t-0 border-[#ECE8DC]">
                  <div className="text-left md:text-right text-xs font-mono">
                    <div className="font-bold text-[#142B15]">{stop.bagsCount} Bags</div>
                    <div className="text-[#1E3F20]">₹{stop.payoutTotal.toLocaleString('en-IN')} Payout</div>
                  </div>

                  <button
                    onClick={() => handleToggleStopStatus(activeRoute.id, stop.id)}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                      stop.status === 'completed'
                        ? 'bg-[#1E3F20] text-[#F7F5EE]'
                        : stop.status === 'in_progress'
                        ? 'bg-[#FF5E36] text-white'
                        : 'bg-[#ECE8DC] text-[#5A564A] hover:bg-[#DFDAC9]'
                    }`}
                  >
                    {stop.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-[#C2F04E]" />}
                    {stop.status === 'in_progress' && <Clock className="w-3.5 h-3.5 animate-pulse" />}
                    <span>{stop.status.replace('_', ' ').toUpperCase()}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live AI Appraisal & Quality Approval Staging Queue */}
      <div className="bg-white border border-[#1E3F20]/15 rounded-lg p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E3F20]/10">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#1E3F20] font-semibold">
              Quality Assurance Staging
            </div>
            <h3 className="text-xl font-bold text-[#142B15]">
              AI Quality Inspection Staging Queue
            </h3>
          </div>
          <span className="text-xs font-mono text-[#8C8675]">
            Collected Garments Awaiting 48h Drop Publication
          </span>
        </div>

        <div className="space-y-3">
          {stagingQueue.map((item) => (
            <div
              key={item.id}
              className="bg-[#FAF9F4] border border-[#1E3F20]/10 rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-mono text-[#1E3F20] font-semibold flex items-center gap-2">
                  <span>{item.brand}</span>
                  <span className="text-[#8C8675]">·</span>
                  <span>From: {item.origin}</span>
                </div>
                <h4 className="text-sm font-bold text-[#142B15]">{item.title}</h4>
                <div className="text-xs font-mono text-[#5A564A] flex items-center gap-3">
                  <span>Donor Payout: ₹{item.donorPayout}</span>
                  <span>·</span>
                  <span>Drop Price: ₹{item.suggestedDropPrice}</span>
                  <span>·</span>
                  <span className="text-[#1E3F20]">Seam Integrity: {item.seamScore}%</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                {item.status === 'approved' ? (
                  <span className="text-xs font-mono font-bold text-[#1E3F20] bg-white border border-[#1E3F20]/20 px-3 py-1.5 rounded flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Published to Drop</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleApproveStaging(item.id)}
                    className="px-4 py-2 bg-[#1E3F20] hover:bg-[#142B15] text-[#F7F5EE] text-xs font-mono font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C2F04E]" />
                    <span>Approve & Steam Treat</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
