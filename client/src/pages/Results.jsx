import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Target, AlertTriangle, TrendingUp, HelpCircle, FileText,
  MessageSquare, ChevronRight, CheckCircle, XCircle, Lightbulb, ArrowLeft, Loader2
} from 'lucide-react';
import { getAnalysis } from '../services/api';
import ScoreCircle from '../components/ScoreCircle';

export default function Results() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getAnalysis(id);
        setData(result);
      } catch (err) {
        setError('Failed to load analysis results');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <XCircle className="w-12 h-12 text-danger mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text mb-2">Error</h2>
          <p className="text-text-muted mb-6">{error || 'Analysis not found'}</p>
          <Link to="/analyze" className="btn-primary"><span>Try Again</span></Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'skills', label: 'Missing Skills', icon: AlertTriangle },
    { id: 'weaknesses', label: 'Weaknesses', icon: XCircle },
    { id: 'recommendations', label: 'Tips', icon: Lightbulb },
    { id: 'questions', label: 'Interview Q&A', icon: HelpCircle },
  ];

  return (
    <div className="bg-gradient-mesh min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <Link to="/analyze" className="inline-flex items-center gap-2 text-text-muted hover:text-text mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">New Analysis</span>
        </Link>

        {/* Header with Score */}
        <div className="glass rounded-2xl p-8 mb-6 animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ScoreCircle score={data.compatibilityScore} />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">
                {data.jobTitle || 'Job Analysis'}
              </h1>
              {data.company && (
                <p className="text-text-muted mb-4">{data.company}</p>
              )}
              <p className="text-text-muted text-sm leading-relaxed max-w-xl">
                {data.summary || `Your profile has a ${data.compatibilityScore}% compatibility with this position.`}
              </p>
              <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                <Link to={`/cover-letter/${id}`} className="btn-primary text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 relative z-10" />
                  <span>Generate Cover Letter</span>
                </Link>
                <Link to={`/interview/${id}`} className="btn-secondary text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Mock Interview</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary/15 text-primary-light border border-primary/30'
                  : 'text-text-muted hover:text-text hover:bg-surface-elevated border border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'overview' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={AlertTriangle}
                label="Missing Skills"
                value={data.missingSkills?.length || 0}
                color="warning"
              />
              <StatCard
                icon={XCircle}
                label="CV Weaknesses"
                value={data.cvWeaknesses?.length || 0}
                color="danger"
              />
              <StatCard
                icon={TrendingUp}
                label="Recommendations"
                value={data.recommendations?.length || 0}
                color="accent"
              />
              <StatCard
                icon={HelpCircle}
                label="Interview Questions"
                value={data.interviewQuestions?.length || 0}
                color="secondary"
              />

              {data.strengths?.length > 0 && (
                <div className="sm:col-span-2 lg:col-span-4 glass rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    Your Strengths
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {data.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-success/5 border border-success/15">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                        <span className="text-sm text-text">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Missing Skills
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {data.missingSkills?.map((skill, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-warning/5 border border-warning/15 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="w-8 h-8 rounded-lg bg-warning/15 flex items-center justify-center shrink-0">
                      <XCircle className="w-4 h-4 text-warning" />
                    </div>
                    <span className="text-text font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'weaknesses' && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-danger" />
                CV Weaknesses
              </h3>
              <div className="space-y-3">
                {data.cvWeaknesses?.map((w, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-danger/5 border border-danger/15 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="w-8 h-8 rounded-lg bg-danger/15 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-danger font-bold text-sm">{i + 1}</span>
                    </div>
                    <span className="text-text">{w}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-accent" />
                Recommendations
              </h3>
              <div className="space-y-3">
                {data.recommendations?.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-accent/5 border border-accent/15 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                      <TrendingUp className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-text">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-secondary" />
                Probable Interview Questions
              </h3>
              <div className="space-y-4">
                {data.interviewQuestions?.map((q, i) => {
                  const question = typeof q === 'string' ? { question: q, category: 'General', tip: '' } : q;
                  return (
                    <div key={i} className="p-4 rounded-xl bg-surface-elevated border border-border animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-secondary font-bold text-sm">Q{i + 1}</span>
                        </div>
                        <div className="flex-1">
                          <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-secondary/15 text-secondary-light mb-2">
                            {question.category}
                          </span>
                          <p className="text-text font-medium">{question.question}</p>
                          {question.tip && (
                            <p className="text-text-muted text-sm mt-2 flex items-start gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 mt-0.5 text-accent shrink-0" />
                              {question.tip}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    warning: 'from-warning/20 to-warning/5 border-warning/20 text-warning',
    danger: 'from-danger/20 to-danger/5 border-danger/20 text-danger',
    accent: 'from-accent/20 to-accent/5 border-accent/20 text-accent',
    secondary: 'from-secondary/20 to-secondary/5 border-secondary/20 text-secondary',
  };

  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br ${colors[color]} border`}>
      <Icon className="w-6 h-6 mb-3" />
      <div className="text-3xl font-bold text-text mb-1">{value}</div>
      <div className="text-sm text-text-muted">{label}</div>
    </div>
  );
}
