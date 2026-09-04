import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, FileSearch, Clock, Target, ChevronRight,
  Sparkles, Loader2, Inbox
} from 'lucide-react';
import { getHistory } from '../services/api';

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getHistory();
        setAnalyses(data);
      } catch {
        // No history yet, that's fine
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    if (score >= 40) return 'text-accent-warm';
    return 'text-danger';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-success/15';
    if (score >= 60) return 'bg-warning/15';
    if (score >= 40) return 'bg-accent-warm/15';
    return 'bg-danger/15';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-mesh min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-text flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-primary" />
              Dashboard
            </h1>
            <p className="text-text-muted mt-1">Your analysis history</p>
          </div>
          <Link to="/analyze" className="btn-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4 relative z-10" />
            <span>New Analysis</span>
          </Link>
        </div>

        {analyses.length === 0 ? (
          /* Empty State */
          <div className="glass rounded-2xl p-16 text-center animate-fade-in-up">
            <Inbox className="w-16 h-16 text-text-dim mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-text mb-3">No analyses yet</h2>
            <p className="text-text-muted mb-8 max-w-md mx-auto">
              Start by uploading your CV and a job description to get AI-powered insights about your application.
            </p>
            <Link to="/analyze" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 group">
              <Sparkles className="w-5 h-5 relative z-10" />
              <span>Start Your First Analysis</span>
            </Link>
          </div>
        ) : (
          /* Analysis List */
          <div className="space-y-4">
            {analyses.map((analysis, i) => (
              <Link
                key={analysis.id}
                to={`/results/${analysis.id}`}
                className={`glass rounded-2xl p-5 flex items-center gap-5 hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 group animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
              >
                {/* Score Badge */}
                <div className={`w-16 h-16 rounded-xl ${getScoreBg(analysis.compatibilityScore)} flex items-center justify-center shrink-0`}>
                  <span className={`text-2xl font-bold ${getScoreColor(analysis.compatibilityScore)}`}>
                    {analysis.compatibilityScore}%
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-text group-hover:text-primary-light transition-colors truncate">
                    {analysis.jobTitle || 'Untitled Analysis'}
                  </h3>
                  <div className="flex items-center gap-4 mt-1">
                    {analysis.company && (
                      <span className="text-sm text-text-muted flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" />
                        {analysis.company}
                      </span>
                    )}
                    <span className="text-sm text-text-dim flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(analysis.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-text-dim group-hover:text-primary-light group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
