import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CAMPUS_LOCATIONS } from '../data/mockData';
import {
  LogOut,
  Mail,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Package,
  ShoppingBag,
  Building2,
  Coins,
  CheckCircle2,
} from 'lucide-react';

interface AccountViewProps {
  onNavigateSeller: () => void;
  onNavigateBuyer: () => void;
  onOpenAuthModal: () => void;
  onToast: (title: string, description: string) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  onNavigateSeller,
  onNavigateBuyer,
  onOpenAuthModal,
  onToast,
}) => {
  const {
    user,
    profile,
    cloudBookings,
    cloudOrders,
    logout,
    resendVerification,
    refreshUser,
    updateCampusPreference,
    cancelBookingInCloud,
  } = useAuth();

  const [selectedCampus, setSelectedCampus] = useState(
    profile?.campusId || CAMPUS_LOCATIONS[0].id
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSavingCampus, setIsSavingCampus] = useState(false);

  if (!user) {
    return (
      <div className="py-16 max-w-2xl mx-auto px-4 text-center space-y-5">
        <div className="bg-[#FAF9F4] border border-[#1E3F20]/15 rounded-lg p-8 space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-[#1E3F20] font-semibold">
            Student Closet Account
          </div>
          <h2 className="text-2xl font-bold text-[#142B15]">
            Sign in to view your pickups & thrift orders
          </h2>
          <p className="text-sm text-[#5A564A] max-w-md mx-auto">
            Access your scheduled doorstep bag pickups, track 48-hour drop orders, and manage your
            campus hub preferences using Email or Google Sign-In.
          </p>
          <button
            onClick={onOpenAuthModal}
            className="px-6 py-3 bg-[#1E3F20] hover:bg-[#142B15] text-[#F7F5EE] text-sm font-semibold rounded transition-colors cursor-pointer"
          >
            Sign In / Create Account
          </button>
        </div>
      </div>
    );
  }

  const handleRefreshVerification = async () => {
    setIsRefreshing(true);
    try {
      const verified = await refreshUser();
      if (verified) {
        onToast('Email Verified', 'Your account is now verified and synced with ReVogue Cloud.');
      } else {
        onToast(
          'Still Pending Verification',
          'Please click the verification link in your email inbox first.'
        );
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      await resendVerification();
      onToast('Verification Email Sent', `Check ${user.email} for your confirmation link.`);
    } catch {
      onToast('Wait a Moment', 'A verification email was recently sent. Please check your inbox.');
    }
  };

  const handleSaveCampus = async () => {
    setIsSavingCampus(true);
    try {
      await updateCampusPreference(selectedCampus);
      onToast('Campus Updated', 'Your default hostel pickup hub has been saved.');
    } finally {
      setIsSavingCampus(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onToast('Signed Out', 'You have securely logged out of ReVogue Labs.');
  };

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#1E3F20] font-semibold">
            Authenticated Student Account
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#142B15] mt-1">
            {profile?.displayName || user.displayName || 'Campus Student'}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#5A564A] mt-1">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#1E3F20]" />
              <span>{user.email}</span>
            </span>
            <span>·</span>
            {user.emailVerified ? (
              <span className="text-[#1E3F20] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Account</span>
              </span>
            ) : (
              <span className="text-[#FF5E36] font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Email Verification Pending</span>
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="self-start sm:self-auto px-4 py-2.5 text-xs font-mono font-semibold text-[#142B15] bg-white border border-[#1E3F20]/25 hover:border-[#FF5E36] hover:text-[#FF5E36] rounded transition-colors flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Email Verification Banner (if signed up via email & unverified) */}
      {!user.emailVerified && (
        <div className="bg-white border border-[#FF5E36]/40 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#142B15] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FF5E36]" />
              <span>Verify your email to enable cloud pickup & order sync</span>
            </h3>
            <p className="text-xs text-[#5A564A]">
              We sent a verification link to <span className="font-mono">{user.email}</span>. Once
              verified, your bookings and orders automatically sync to your account.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleResendEmail}
              className="px-3.5 py-2 text-xs font-mono bg-[#FAF9F4] border border-[#1E3F20]/20 hover:border-[#1E3F20] text-[#142B15] rounded cursor-pointer"
            >
              Resend Email
            </button>
            <button
              onClick={handleRefreshVerification}
              disabled={isRefreshing}
              className="px-3.5 py-2 text-xs font-mono bg-[#1E3F20] text-[#F7F5EE] hover:bg-[#142B15] rounded flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>I&apos;ve Verified</span>
            </button>
          </div>
        </div>
      )}

      {/* Profile Overview & Campus Hub Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FAF9F4] border border-[#1E3F20]/15 rounded-lg p-5 space-y-2">
          <div className="text-xs font-mono text-[#8C8675] flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-[#1E3F20]" />
            <span>REVOGUE DROP CREDITS</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#1E3F20] tabular-nums">
            ₹{(profile?.dropCredits ?? 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-[#5A564A]">
            Earn +20% bonus tokens when liquidating closets for Drop Credits.
          </p>
        </div>

        <div className="md:col-span-2 bg-[#FAF9F4] border border-[#1E3F20]/15 rounded-lg p-5 space-y-3">
          <div className="text-xs font-mono text-[#8C8675] flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#1E3F20]" />
            <span>PRIMARY CAMPUS HUB</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="flex-1 bg-white border border-[#1E3F20]/20 rounded px-3 py-2 text-sm text-[#142B15] focus:outline-hidden focus:border-[#1E3F20]"
            >
              {CAMPUS_LOCATIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.cluster})
                </option>
              ))}
            </select>
            <button
              onClick={handleSaveCampus}
              disabled={!user.emailVerified || isSavingCampus}
              className="px-4 py-2 bg-[#1E3F20] hover:bg-[#142B15] disabled:opacity-50 text-[#F7F5EE] text-xs font-mono font-semibold rounded transition-colors cursor-pointer whitespace-nowrap"
            >
              {isSavingCampus ? 'Saving...' : 'Save Hub'}
            </button>
          </div>
        </div>
      </div>

      {/* Scheduled Bag Pickups */}
      <div className="bg-white border border-[#1E3F20]/15 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E3F20]/10">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#1E3F20]" />
            <h3 className="text-base font-bold text-[#142B15]">
              My Scheduled Closet Pickups ({cloudBookings.length})
            </h3>
          </div>
          <button
            onClick={onNavigateSeller}
            className="text-xs font-mono text-[#1E3F20] hover:underline cursor-pointer"
          >
            + Schedule New Bag
          </button>
        </div>

        {cloudBookings.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#5A564A] space-y-2">
            <p>No doorstep pickups synced to your account yet.</p>
            <button
              onClick={onNavigateSeller}
              className="px-4 py-2 bg-[#1E3F20] text-[#F7F5EE] font-mono rounded cursor-pointer"
            >
              Liquidate Closet in 60s
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {cloudBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-[#FAF9F4] border border-[#1E3F20]/10 rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-xs font-mono text-[#1E3F20] font-semibold flex items-center gap-2">
                    <span>#{booking.id}</span>
                    <span>·</span>
                    <span className="uppercase">{booking.bagSize} Bag ({booking.estimatedItems} pcs)</span>
                  </div>
                  <div className="text-sm font-bold text-[#142B15]">{booking.campusName}</div>
                  <div className="text-xs text-[#5A564A]">
                    {booking.hostelDorm} · {booking.slotDate} ({booking.slotTime})
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right font-mono">
                    <div className="text-sm font-bold text-[#1E3F20]">
                      ₹{booking.estimatedPayout.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] uppercase text-[#8C8675]">
                      {booking.status}
                    </div>
                  </div>

                  {booking.status === 'scheduled' && (
                    <button
                      onClick={() => cancelBookingInCloud(booking.id)}
                      className="px-3 py-1.5 text-[11px] font-mono text-[#FF5E36] border border-[#FF5E36]/30 hover:bg-[#FF5E36]/10 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Campus Thrift Orders */}
      <div className="bg-white border border-[#1E3F20]/15 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E3F20]/10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#1E3F20]" />
            <h3 className="text-base font-bold text-[#142B15]">
              My 48h Flash Drop Orders ({cloudOrders.length})
            </h3>
          </div>
          <button
            onClick={onNavigateBuyer}
            className="text-xs font-mono text-[#1E3F20] hover:underline cursor-pointer"
          >
            Browse Drop →
          </button>
        </div>

        {cloudOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#5A564A] space-y-2">
            <p>You haven&apos;t placed any campus thrift orders yet.</p>
            <button
              onClick={onNavigateBuyer}
              className="px-4 py-2 bg-[#1E3F20] text-[#F7F5EE] font-mono rounded cursor-pointer"
            >
              Shop 48h Flash Drop
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {cloudOrders.map((order) => (
              <div
                key={order.id}
                className="bg-[#FAF9F4] border border-[#1E3F20]/10 rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-xs font-mono text-[#1E3F20] font-semibold flex items-center gap-2">
                    <span>#{order.id}</span>
                    <span>·</span>
                    <span>{order.itemCount} items</span>
                    <span>·</span>
                    <span className="uppercase">{order.paymentType}</span>
                  </div>
                  <div className="text-sm font-bold text-[#142B15]">
                    {order.itemTitles.join(', ')}
                  </div>
                  <div className="text-xs text-[#5A564A]">
                    Delivery: {order.hostelDorm} · {order.createdAtLabel || 'Confirmed'}
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono shrink-0">
                  <div className="text-sm font-bold text-[#142B15]">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-[#1E3F20] flex items-center sm:justify-end gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="uppercase">{order.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
