import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, X, Sparkles, GraduationCap, Wrench, Briefcase, ArrowRight, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { analyzeCV } from '../services/api';
import LoadingOverlay from '../components/LoadingOverlay';

export default function Analyze() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const jobPdfInputRef = useRef(null);

  const [cvFile, setCvFile] = useState(null);
  const [skills, setSkills] = useState('');
  const [diplomas, setDiplomas] = useState('');
  
  // Job Offer state
  const [jobMode, setJobMode] = useState('pdf'); // 'pdf' | 'text' (default 'pdf')
  const [jobDescription, setJobDescription] = useState('');
  const [jobPdfFile, setJobPdfFile] = useState(null);

  const [cvDragOver, setCvDragOver] = useState(false);
  const [jobPdfDragOver, setJobPdfDragOver] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // CV PDF Drop
  const handleCvDrop = useCallback((e) => {
    e.preventDefault();
    setCvDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
      setError('');
    } else {
      setError('Please upload your CV in PDF format');
    }
  }, []);

  const handleCvSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
      setError('');
    }
  };

  // Job PDF Drop
  const handleJobPdfDrop = useCallback((e) => {
    e.preventDefault();
    setJobPdfDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setJobPdfFile(file);
      setError('');
    } else {
      setError('Please upload the job offer in PDF format');
    }
  }, []);

  const handleJobPdfSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setJobPdfFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!cvFile) return setError('Please upload your CV (PDF)');
    
    if (jobMode === 'text' && !jobDescription.trim()) {
      return setError('Please paste the job description text or switch to PDF upload');
    }
    if (jobMode === 'pdf' && !jobPdfFile) {
      return setError('Please upload the Job Offer PDF file or switch to text mode');
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('cv', cvFile);
      formData.append('skills', skills);
      formData.append('diplomas', diplomas);

      if (jobMode === 'text') {
        formData.append('jobDescription', jobDescription);
      } else if (jobPdfFile) {
        formData.append('jobPdf', jobPdfFile);
      }

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
            Upload your CV, add your details, and provide the job offer (text or PDF) for an AI-powered analysis
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
                <p className="text-sm text-text-muted">PDF format, max 4.5MB</p>
              </div>
            </div>

            <div
              className={`drop-zone rounded-xl p-8 text-center cursor-pointer transition-all ${cvDragOver ? 'dragover' : ''} ${cvFile ? 'has-file' : ''}`}
              onDrop={handleCvDrop}
              onDragOver={(e) => { e.preventDefault(); setCvDragOver(true); }}
              onDragLeave={() => setCvDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleCvSelect}
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

          {/* Job Description / Job PDF */}
          <div className="glass rounded-2xl p-6 animate-fade-in-up stagger-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-warm to-primary flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text">Job Offer</h2>
                  <p className="text-sm text-text-muted">Provide the job details for comparison</p>
                </div>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center p-1 rounded-xl bg-surface-elevated border border-border">
                <button
                  type="button"
                  onClick={() => setJobMode('pdf')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    jobMode === 'pdf'
                      ? 'bg-primary/20 text-primary-light border border-primary/30'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload PDF
                </button>
                <button
                  type="button"
                  onClick={() => setJobMode('text')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    jobMode === 'text'
                      ? 'bg-primary/20 text-primary-light border border-primary/30'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Paste Text
                </button>
              </div>
            </div>

            {/* Text Mode */}
            {jobMode === 'text' ? (
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here... Include requirements, responsibilities, qualifications, etc."
                className="w-full h-48 bg-surface-elevated border border-border rounded-xl p-4 text-text placeholder-text-dim resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            ) : (
              /* PDF Mode */
              <div
                className={`drop-zone rounded-xl p-8 text-center cursor-pointer transition-all ${jobPdfDragOver ? 'dragover' : ''} ${jobPdfFile ? 'has-file' : ''}`}
                onDrop={handleJobPdfDrop}
                onDragOver={(e) => { e.preventDefault(); setJobPdfDragOver(true); }}
                onDragLeave={() => setJobPdfDragOver(false)}
                onClick={() => jobPdfInputRef.current?.click()}
              >
                <input
                  ref={jobPdfInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleJobPdfSelect}
                  className="hidden"
                />
                {jobPdfFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileSpreadsheet className="w-8 h-8 text-secondary-light" />
                    <div className="text-left">
                      <p className="font-medium text-text">{jobPdfFile.name}</p>
                      <p className="text-sm text-text-muted">{(jobPdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setJobPdfFile(null); }}
                      className="ml-4 p-1 rounded-lg hover:bg-surface-elevated text-text-muted hover:text-danger transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-text-dim mx-auto mb-3" />
                    <p className="text-text-muted mb-1">Drag & drop the Job Offer PDF here</p>
                    <p className="text-sm text-text-dim">or click to browse files</p>
                  </>
                )}
              </div>
            )}
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
