import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Download, Copy, Check, ArrowLeft, Loader2, RefreshCw, Edit3 } from 'lucide-react';
import { getAnalysis, generateCoverLetter } from '../services/api';

export default function CoverLetter() {
  const { id } = useParams();
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAnalysis(id);
        setAnalysis(data);
        if (data.coverLetter) {
          setCoverLetter(data.coverLetter);
          setLoading(false);
        } else {
          // Auto-generate if not yet generated
          await handleGenerate();
        }
      } catch {
        setError('Failed to load analysis');
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const result = await generateCoverLetter(id);
      setCoverLetter(result.coverLetter);
    } catch {
      setError('Failed to generate cover letter. Please try again.');
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${analysis?.jobTitle || 'job'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || generating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh">
        <div className="glass rounded-2xl p-10 text-center animate-fade-in-up">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-border" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary-light" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-text mb-2">Crafting Your Cover Letter</h3>
          <p className="text-text-muted text-sm">AI is writing a personalized letter for you...</p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-mesh min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link to={`/results/${id}`} className="inline-flex items-center gap-2 text-text-muted hover:text-text mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Results</span>
        </Link>

        {/* Header */}
        <div className="glass rounded-2xl p-6 mb-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text">Cover Letter</h1>
                <p className="text-sm text-text-muted">{analysis?.jobTitle} {analysis?.company ? `at ${analysis.company}` : ''}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(!editing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  editing ? 'bg-primary/15 text-primary-light border border-primary/30' : 'btn-secondary'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                {editing ? 'Preview' : 'Edit'}
              </button>
              <button onClick={handleGenerate} className="btn-secondary flex items-center gap-2 text-sm" disabled={generating}>
                <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
              <button onClick={handleCopy} className="btn-secondary flex items-center gap-2 text-sm">
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={handleDownload} className="btn-primary flex items-center gap-2 text-sm">
                <Download className="w-4 h-4 relative z-10" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm mb-6">
            {error}
          </div>
        )}

        {/* Letter Content */}
        <div className="glass rounded-2xl p-8 animate-fade-in-up stagger-1">
          {editing ? (
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full min-h-[500px] bg-transparent text-text leading-relaxed resize-none focus:outline-none font-[inherit] text-base"
            />
          ) : (
            <div className="max-w-none">
              {coverLetter.split('\n').map((paragraph, i) => (
                <p key={i} className="text-text leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
