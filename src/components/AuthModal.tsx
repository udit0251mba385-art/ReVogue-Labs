import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CAMPUS_LOCATIONS } from '../data/mockData';
import { FIREBASE_PROJECT_ID } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (message: string) => void;
}

type AuthMode = 'signin' | 'signup' | 'reset';

interface AuthErrorInfo {
  message: string;
  consoleUrl?: string;
  consoleLabel?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } = useAuth();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [campusId, setCampusId] = useState(CAMPUS_LOCATIONS[0].id);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<AuthErrorInfo | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const mapAuthError = (err: unknown): AuthErrorInfo => {
    const code =
      typeof err === 'object' && err !== null && 'code' in err
        ? String((err as { code?: string }).code)
        : '';

    switch (code) {
      case 'auth/operation-not-allowed':
        return {
          message: `Email/Password sign-in is disabled in Firebase Console for "${FIREBASE_PROJECT_ID}". Enable the Email/Password provider in Firebase Console, or use Continue with Google below.`,
          consoleUrl: `https://console.firebase.google.com/project/${FIREBASE_PROJECT_ID}/authentication/providers`,
          consoleLabel: 'Open Firebase Sign-in Providers',
        };
      case 'auth/unauthorized-domain':
        return {
          message: `Domain "${window.location.hostname}" must be added to Authorized Domains in Firebase Authentication settings.`,
          consoleUrl: `https://console.firebase.google.com/project/${FIREBASE_PROJECT_ID}/authentication/settings`,
          consoleLabel: 'Open Firebase Auth Settings',
        };
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return {
          message: 'Invalid email or password. Double-check your credentials or reset your password.',
        };
      case 'auth/email-already-in-use':
        return {
          message: 'An account with this email already exists. Switch to Email Sign In to access your account.',
        };
      case 'auth/weak-password':
        return {
          message: 'Password must be at least 6 characters long.',
        };
      case 'auth/invalid-email':
        return {
          message: 'Please enter a valid university or personal email address.',
        };
      case 'auth/too-many-requests':
        return {
          message: 'Too many attempts. Please wait a few moments before trying again.',
        };
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        return {
          message: 'Google sign-in popup was closed before completing. Try again or use Email Sign In.',
        };
      case 'auth/popup-blocked':
        return {
          message: 'Your browser blocked the sign-in popup. Allow popups for this site or sign in with Email below.',
        };
      case 'auth/network-request-failed':
        return {
          message: 'Network error while connecting to Firebase Authentication. Check your connection and retry.',
        };
      default:
        return {
          message:
            err instanceof Error
              ? err.message
              : 'Unable to complete authentication. Please try again.',
        };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorInfo(null);
    setInfoMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
        onAuthSuccess(`Signed in as ${email.trim()}`);
        onClose();
      } else if (mode === 'signup') {
        if (!displayName.trim()) {
          setErrorInfo({ message: 'Please enter your name to create an account.' });
          setIsLoading(false);
          return;
        }
        await signUpWithEmail(email, password, displayName, campusId);
        onAuthSuccess(`Account created! Check ${email.trim()} for a verification link.`);
        onClose();
      } else {
        await resetPassword(email);
        setInfoMsg(`Password reset email sent to ${email.trim()}. Check your inbox.`);
      }
    } catch (err) {
      setErrorInfo(mapAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorInfo(null);
    setInfoMsg(null);
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onAuthSuccess('Signed in with Google');
      onClose();
    } catch (err) {
      setErrorInfo(mapAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrorInfo(null);
    setInfoMsg(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FAF9F4] border border-[#1E3F20]/20 rounded-lg shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-[#1E3F20]/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#1E3F20] font-semibold block">
              ReVogue Campus Access
            </span>
            <h2 className="text-lg font-bold text-[#142B15] font-display">
              {mode === 'signin'
                ? 'Sign In to Your Closet'
                : mode === 'signup'
                ? 'Create Student Account'
                : 'Reset Your Password'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#5A564A] hover:text-[#1E3F20] hover:bg-[#ECE8DC] rounded transition-colors cursor-pointer"
            aria-label="Close sign in dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Segmented Mode Switcher */}
          {mode !== 'reset' && (
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#ECE8DC] rounded-md text-xs font-mono">
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className={`py-2 rounded font-semibold transition-colors cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white text-[#142B15] shadow-2xs'
                    : 'text-[#5A564A] hover:text-[#142B15]'
                }`}
              >
                Email Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`py-2 rounded font-semibold transition-colors cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-[#142B15] shadow-2xs'
                    : 'text-[#5A564A] hover:text-[#142B15]'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Error & Info Alerts */}
          {errorInfo && (
            <div className="p-3 rounded bg-[#FF5E36]/10 border border-[#FF5E36]/30 text-xs text-[#9E2A0E] space-y-2 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#FF5E36]" />
                <span>{errorInfo.message}</span>
              </div>
              {errorInfo.consoleUrl && (
                <a
                  href={errorInfo.consoleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono font-semibold text-[#1E3F20] bg-white border border-[#1E3F20]/25 px-2.5 py-1 rounded hover:border-[#1E3F20]"
                >
                  <span>{errorInfo.consoleLabel}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {infoMsg && (
            <div className="p-3 rounded bg-[#1E3F20]/10 border border-[#1E3F20]/25 text-xs text-[#1E3F20] flex items-start gap-2.5 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#1E3F20]" />
              <span>{infoMsg}</span>
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#5A564A] block">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[#8C8675] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Ishaan Grover"
                      required
                      maxLength={80}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#1E3F20]/20 rounded text-sm text-[#142B15] focus:outline-hidden focus:border-[#1E3F20]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#5A564A] block">
                    Campus Hub
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#8C8675] absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={campusId}
                      onChange={(e) => setCampusId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#1E3F20]/20 rounded text-sm text-[#142B15] focus:outline-hidden focus:border-[#1E3F20]"
                    >
                      {CAMPUS_LOCATIONS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#5A564A] block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C8675] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu.in"
                  required
                  maxLength={160}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#1E3F20]/20 rounded text-sm text-[#142B15] focus:outline-hidden focus:border-[#1E3F20]"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#5A564A] block">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => switchMode('reset')}
                      className="text-[11px] font-mono text-[#1E3F20] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C8675] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#1E3F20]/20 rounded text-sm text-[#142B15] focus:outline-hidden focus:border-[#1E3F20]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8675] hover:text-[#1E3F20] cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#1E3F20] hover:bg-[#142B15] disabled:opacity-60 text-[#F7F5EE] text-sm font-semibold rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>
                {isLoading
                  ? 'Please wait...'
                  : mode === 'signin'
                  ? 'Sign In with Email'
                  : mode === 'signup'
                  ? 'Create Student Account'
                  : 'Send Password Reset Email'}
              </span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {mode === 'reset' && (
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className="w-full text-center text-xs font-mono text-[#1E3F20] hover:underline cursor-pointer"
            >
              Back to Email Sign In
            </button>
          )}

          {/* Divider */}
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-[#1E3F20]/15" />
            <span className="shrink mx-3 text-[11px] font-mono uppercase text-[#8C8675]">
              Or continue with
            </span>
            <div className="flex-grow border-t border-[#1E3F20]/15" />
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 bg-white hover:bg-[#FAF9F4] border border-[#1E3F20]/25 text-[#142B15] text-sm font-medium rounded transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};
