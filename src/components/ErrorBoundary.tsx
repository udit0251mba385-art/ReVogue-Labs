import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'An unexpected application error occurred.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F5EE] text-[#1A241C] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-[#1E3F20]/20 rounded-lg p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-[#FF5E36]">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h2 className="text-base font-bold text-[#142B15]">Something went wrong</h2>
            </div>
            <p className="text-xs text-[#5A564A] leading-relaxed break-words font-mono bg-[#FAF9F4] p-3 rounded border border-[#1E3F20]/10">
              {this.state.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2.5 bg-[#1E3F20] hover:bg-[#142B15] text-[#F7F5EE] text-xs font-mono font-semibold rounded flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
