import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, X, Sparkles, GraduationCap, Wrench, Briefcase, ArrowRight, AlertCircle } from 'lucide-react';
import { analyzeCV } from '../services/api';
import LoadingOverlay from '../components/LoadingOverlay';

export default function Analyze() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [cvFile, setCvFile] = useState(null);
  const [skills, setSkills] = useState('');
  const [diplomas, setDiplomas] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!cvFile) return setError('Please upload your CV (PDF)');
    if (!jobDescription.trim()) return setError('Please paste the job description');

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('cv', cvFile);
      formData.append('skills', skills);
      formData.append('diplomas', diplomas);
      formData.append('jobDescription', jobDescription);

      const result = await analyzeCV(formData);
      navigate(`/results/${result.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingOverlay message="Analyzing your profile..." submessage="Our AI is comparing your CV with the job offer" />;
  }

  return (
    <div className="bg-gradient-mesh min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-3">
            Analyze Your <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">Application</span>
          </h1>
          <p className="text-text-muted max-w-lg mx-auto">
            Upload your CV, add your details, and paste the job offer to get an AI-powered analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error message */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* CV Upload */}
          <div className="glass rounded-2xl p-6 animate-fade-in-up stagger-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text">Upload Your CV</h2>
                <p className="text-sm text-text-muted">PDF format, max 10MB</p>
              </div>
            </div>

            <div
              className={`drop-zone rounded-xl p-8 text-center cursor-pointer transition-all ${dragOver ? 'dragover' : ''} ${cvFile ? 'has-file' : ''}`}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              {cvFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-success" />
                  <div className="text-left">
                    <p className="font-medium text-text">{cvFile.name}</p>
                    <p className="text-sm text-text-muted">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setCvFile(null); }}
                    className="ml-4 p-1 rounded-lg hover:bg-surface-elevated text-text-muted hover:text-danger transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-text-dim mx-auto mb-3" />
                  <p className="text-text-muted mb-1">Drag & drop your CV here</p>
                  <p className="text-sm text-text-dim">or click to browse files</p>
                </>
              )}
            </div>
          </div>

          {/* Skills & Diplomas */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6 animate-fade-in-up stagger-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text">Skills</h2>
                  <p className="text-sm text-text-muted">Your technical & soft skills</p>
                </div>
              </div>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. React, Node.js, Python, Team leadership, Agile..."
                className="w-full h-32 bg-surface-elevated border border-border rounded-xl p-4 text-text placeholder-text-dim resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            <div className="glass rounded-2xl p-6 animate-fade-in-up stagger-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-warm flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text">Education</h2>
                  <p className="text-sm text-text-muted">Your degrees & certifications</p>
                </div>
              </div>
              <textarea
                value={diplomas}
                onChange={(e) => setDiplomas(e.target.value)}
                placeholder="e.g. BSc Computer Science, AWS Certified, Google Analytics..."
                className="w-full h-32 bg-surface-elevated border border-border rounded-xl p-4 text-text placeholder-text-dim resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="glass rounded-2xl p-6 animate-fade-in-up stagger-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-warm to-primary flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text">Job Description</h2>
                <p className="text-sm text-text-muted">Paste the full job offer text</p>
              </div>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here... Include requirements, responsibilities, qualifications, etc."
              className="w-full h-48 bg-surface-elevated border border-border rounded-xl p-4 text-text placeholder-text-dim resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center animate-fade-in-up stagger-5">
            <button type="submit" className="btn-primary text-lg px-10 py-4 flex items-center gap-3 group">
              <Sparkles className="w-5 h-5 relative z-10" />
              <span>Analyze with AI</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
