import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled UI Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-8 max-w-md w-full text-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-danger/15 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-8 h-8 text-danger" />
            </div>
            <h2 className="text-2xl font-bold text-text mb-2">Something went wrong</h2>
            <p className="text-text-muted text-sm mb-6">
              An unexpected error occurred in the application. Please try refreshing the page.
            </p>
            <button
              onClick={this.handleReload}
              className="btn-primary inline-flex items-center gap-2 px-6 py-3"
            >
              <RefreshCw className="w-4 h-4 relative z-10" />
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
