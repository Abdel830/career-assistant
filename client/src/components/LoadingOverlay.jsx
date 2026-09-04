import { Loader2 } from 'lucide-react';

export default function LoadingOverlay({ message = 'Analyzing your CV...', submessage = 'This may take up to a minute' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-sm">
      <div className="glass rounded-2xl p-10 max-w-md w-full mx-4 text-center animate-fade-in-up">
        {/* Animated loader */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-border" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <div className="absolute inset-3 rounded-full border-4 border-secondary border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary-light animate-pulse" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-text mb-2">{message}</h3>
        <p className="text-text-muted text-sm">{submessage}</p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  );
}
