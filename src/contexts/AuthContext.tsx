import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  OperationType,
  handleFirestoreError,
} from '../firebase';
import { PickupBooking } from '../types';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  campusId: string;
  role: 'student';
  dropCredits: number;
  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}

export interface CloudThriftOrder {
  id: string;
  userId: string;
  campusId: string;
  hostelDorm: string;
  buyerName: string;
  phone: string;
  paymentType: 'upi' | 'drop_tokens' | 'cod';
  totalAmount: number;
  totalSavings: number;
  itemCount: number;
  itemTitles: string[];
  status: 'confirmed' | 'packed' | 'delivered' | 'cancelled';
  createdAtLabel?: string;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  authReady: boolean;
  cloudBookings: PickupBooking[];
  cloudOrders: CloudThriftOrder[];
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName: string,
    campusId: string
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  refreshUser: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateCampusPreference: (campusId: string, displayName?: string) => Promise<void>;
  saveBookingToCloud: (booking: PickupBooking) => Promise<boolean>;
  saveOrderToCloud: (order: Omit<CloudThriftOrder, 'userId'>) => Promise<boolean>;
  cancelBookingInCloud: (bookingId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

function sanitizeId(value: string, fallback: string, maxLen = 64): string {
  const cleaned = value.trim().replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, maxLen);
  if (!cleaned || !SAFE_ID_REGEX.test(cleaned)) {
    return fallback;
  }
  return cleaned;
}

function clampString(value: string, maxLen: number, fallback = ''): string {
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, maxLen);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRevision, setUserRevision] = useState<number>(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [cloudBookings, setCloudBookings] = useState<PickupBooking[]>([]);
  const [cloudOrders, setCloudOrders] = useState<CloudThriftOrder[]>([]);
  const [fatalError, setFatalError] = useState<Error | null>(null);

  if (fatalError) {
    throw fatalError;
  }

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setProfile(null);
        setCloudBookings([]);
        setCloudOrders([]);
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Sync UserProfile & Attach Firestore Listeners only when authReady && user && user.emailVerified
  useEffect(() => {
    if (!authReady || !user) return;

    if (!user.emailVerified) {
      setProfile({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'Student'),
        campusId: 'du-north',
        role: 'student',
        dropCredits: 0,
      });
      return;
    }

    const currentUid = user.uid;
    const userDocRef = doc(db, 'users', currentUid);
    let isMounted = true;

    async function ensureUserProfile() {
      if (!auth.currentUser) return;
      try {
        const snap = await getDoc(userDocRef);
        if (!snap.exists() && isMounted && auth.currentUser) {
          const safeDisplayName = clampString(
            auth.currentUser.displayName ||
              (auth.currentUser.email ? auth.currentUser.email.split('@')[0] : 'Campus Student'),
            80,
            'Campus Student'
          );
          const safeEmail = clampString(
            auth.currentUser.email || 'student@revoguelabs.in',
            160
          );
          await setDoc(userDocRef, {
            uid: sanitizeId(auth.currentUser.uid, auth.currentUser.uid, 128),
            email: safeEmail,
            displayName: safeDisplayName,
            campusId: 'du-north',
            role: 'student',
            dropCredits: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        if (!auth.currentUser || !isMounted) return;
        try {
          handleFirestoreError(err, OperationType.WRITE, `users/${currentUid}`);
        } catch (wrappedErr) {
          if (isMounted) {
            setFatalError(wrappedErr instanceof Error ? wrappedErr : new Error(String(wrappedErr)));
          }
        }
      }
    }

    ensureUserProfile();

    const unsubProfile = onSnapshot(
      userDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setProfile(snapshot.data() as UserProfile);
        }
      },
      (err) => {
        if (!auth.currentUser || !isMounted) return;
        try {
          handleFirestoreError(err, OperationType.GET, `users/${currentUid}`);
        } catch (wrappedErr) {
          if (isMounted) {
            setFatalError(wrappedErr instanceof Error ? wrappedErr : new Error(String(wrappedErr)));
          }
        }
      }
    );

    const bookingsQuery = query(
      collection(db, 'pickupBookings'),
      where('userId', '==', user.uid)
    );
    const unsubBookings = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const list: PickupBooking[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id,
            campusId: data.campusId,
            campusName: data.campusName,
            hostelDorm: data.hostelDorm,
            contactName: data.contactName,
            phone: data.phone,
            upiId: data.upiId,
            bagSize: data.bagSize,
            estimatedItems: data.estimatedItems,
            estimatedPayout: data.estimatedPayout,
            payoutMethod: data.payoutMethod,
            slotDate: data.slotDate,
            slotTime: data.slotTime,
            status: data.status,
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate().toLocaleString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Just now',
          };
        });
        setCloudBookings(list);
      },
      (err) => {
        if (!auth.currentUser || !isMounted) return;
        try {
          handleFirestoreError(err, OperationType.LIST, 'pickupBookings');
        } catch (wrappedErr) {
          if (isMounted) {
            setFatalError(wrappedErr instanceof Error ? wrappedErr : new Error(String(wrappedErr)));
          }
        }
      }
    );

    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid)
    );
    const unsubOrders = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const list: CloudThriftOrder[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id,
            userId: data.userId,
            campusId: data.campusId,
            hostelDorm: data.hostelDorm,
            buyerName: data.buyerName,
            phone: data.phone,
            paymentType: data.paymentType,
            totalAmount: data.totalAmount,
            totalSavings: data.totalSavings,
            itemCount: data.itemCount,
            itemTitles: data.itemTitles || [],
            status: data.status,
            createdAtLabel:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate().toLocaleString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Just now',
          };
        });
        setCloudOrders(list);
      },
      (err) => {
        if (!auth.currentUser || !isMounted) return;
        try {
          handleFirestoreError(err, OperationType.LIST, 'orders');
        } catch (wrappedErr) {
          if (isMounted) {
            setFatalError(wrappedErr instanceof Error ? wrappedErr : new Error(String(wrappedErr)));
          }
        }
      }
    );

    return () => {
      isMounted = false;
      unsubProfile();
      unsubBookings();
      unsubOrders();
    };
  }, [authReady, user, user?.emailVerified, userRevision]);

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName: string,
    campusId: string
  ) => {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const cleanName = clampString(displayName, 80, 'Campus Student');
    await updateProfile(credential.user, { displayName: cleanName });
    try {
      await sendEmailVerification(credential.user);
    } catch {
      // Verification email rate-limit or delivery issue shouldn't block account creation
    }
    setUser(credential.user);
    setUserRevision((r) => r + 1);
    setProfile({
      uid: credential.user.uid,
      email: email.trim(),
      displayName: cleanName,
      campusId: sanitizeId(campusId, 'du-north', 64),
      role: 'student',
      dropCredits: 0,
    });
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const resendVerification = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const refreshUser = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    await auth.currentUser.reload();
    await auth.currentUser.getIdToken(true);
    setUser(auth.currentUser);
    setUserRevision((r) => r + 1);
    return auth.currentUser.emailVerified;
  };

  const logout = async () => {
    setFatalError(null);
    await signOut(auth);
  };

  const updateCampusPreference = async (campusId: string, displayName?: string) => {
    if (!user || !user.emailVerified) return;
    const path = `users/${user.uid}`;
    const safeCampus = sanitizeId(campusId, 'du-north', 64);
    const safeName = clampString(
      displayName || profile?.displayName || user.displayName || 'Student',
      80,
      'Student'
    );
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        campusId: safeCampus,
        displayName: safeName,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const saveBookingToCloud = async (booking: PickupBooking): Promise<boolean> => {
    if (!user || !user.emailVerified) return false;
    const bookingId = sanitizeId(booking.id, `RV-PKP-${Date.now()}`, 64);
    const path = `pickupBookings/${bookingId}`;
    const payload: Record<string, unknown> = {
      id: bookingId,
      userId: sanitizeId(user.uid, user.uid, 128),
      campusId: sanitizeId(booking.campusId, 'du-north', 64),
      campusName: clampString(booking.campusName, 120, 'Delhi NCR Campus'),
      hostelDorm: clampString(booking.hostelDorm, 120, 'Hostel Desk'),
      contactName: clampString(booking.contactName, 80, 'Student'),
      phone: clampString(booking.phone, 24, '+91 90000 00000'),
      bagSize: booking.bagSize,
      estimatedItems: Math.min(100, Math.max(1, Math.round(booking.estimatedItems))),
      estimatedPayout: Math.min(100000, Math.max(0, Math.round(booking.estimatedPayout))),
      payoutMethod: booking.payoutMethod,
      slotDate: clampString(booking.slotDate, 60, 'Tomorrow'),
      slotTime: clampString(booking.slotTime, 80, '5:30 PM - 7:00 PM'),
      status: 'scheduled',
      createdAt: serverTimestamp(),
    };
    if (booking.upiId && booking.upiId.trim()) {
      payload.upiId = clampString(booking.upiId, 80);
    }
    try {
      await setDoc(doc(db, 'pickupBookings', bookingId), payload);
      return true;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const saveOrderToCloud = async (
    order: Omit<CloudThriftOrder, 'userId'>
  ): Promise<boolean> => {
    if (!user || !user.emailVerified) return false;
    const orderId = sanitizeId(order.id, `RV-ORD-${Date.now()}`, 64);
    const path = `orders/${orderId}`;
    const boundedTitles = order.itemTitles
      .slice(0, 20)
      .map((t) => clampString(t, 160, 'Curated Thrift Garment'));
    if (boundedTitles.length === 0) {
      boundedTitles.push('Curated Thrift Garment');
    }

    const payload = {
      id: orderId,
      userId: sanitizeId(user.uid, user.uid, 128),
      campusId: sanitizeId(order.campusId, 'du-north', 64),
      hostelDorm: clampString(order.hostelDorm, 120, 'Hostel Desk'),
      buyerName: clampString(order.buyerName, 80, 'Student'),
      phone: clampString(order.phone, 24, '+91 90000 00000'),
      paymentType: order.paymentType,
      totalAmount: Math.min(100000, Math.max(0, Math.round(order.totalAmount))),
      totalSavings: Math.min(200000, Math.max(0, Math.round(order.totalSavings))),
      itemCount: Math.min(20, Math.max(1, Math.round(order.itemCount))),
      itemTitles: boundedTitles,
      status: 'confirmed',
      createdAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'orders', orderId), payload);
      return true;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const cancelBookingInCloud = async (bookingId: string) => {
    if (!user || !user.emailVerified) return;
    const safeId = sanitizeId(bookingId, bookingId, 64);
    const path = `pickupBookings/${safeId}`;
    try {
      await updateDoc(doc(db, 'pickupBookings', safeId), {
        status: 'cancelled',
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        authReady,
        cloudBookings,
        cloudOrders,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        resetPassword,
        resendVerification,
        refreshUser,
        logout,
        updateCampusPreference,
        saveBookingToCloud,
        saveOrderToCloud,
        cancelBookingInCloud,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
