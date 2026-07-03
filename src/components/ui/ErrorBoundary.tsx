"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 rounded-xl border border-red-100 bg-red-50 flex flex-col items-center justify-center text-center min-h-[300px]">
          <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-red-900 mb-2">Đã có lỗi xảy ra</h2>
          <p className="text-sm text-red-700 max-w-md mb-6">
            Thành phần này không thể hiển thị do lỗi kỹ thuật. Vui lòng thử lại sau.
          </p>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white text-red-700 font-medium text-sm rounded-lg hover:bg-red-50 border border-red-200 transition-colors shadow-sm"
            onClick={() => this.setState({ hasError: false })}
          >
            <RefreshCcw className="h-4 w-4" /> Thử lại
          </button>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-8 p-4 bg-white/50 border border-red-100 rounded-lg text-left max-w-full overflow-auto text-xs text-red-900/80 font-mono w-full">
              {this.state.error.toString()}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
