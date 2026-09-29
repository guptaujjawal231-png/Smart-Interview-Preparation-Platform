import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Button from './Button';
import Card from './Card';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled UI Exception caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center space-y-5 border-slate-200 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-extrabold text-slate-900">
                Application Error
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                An unexpected interface issue occurred. Your saved progress, mock interview history, and account settings remain secure.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-100 rounded-lg text-left text-[11px] font-mono text-slate-700 overflow-x-auto max-h-24">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={RotateCcw}
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto"
              >
                Reload Page
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={Home}
                onClick={this.handleReset}
                className="w-full sm:w-auto"
              >
                Go to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
