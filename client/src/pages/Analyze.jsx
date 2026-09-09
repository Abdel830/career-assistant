import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, X, Sparkles, GraduationCap, Wrench, Briefcase, ArrowRight, AlertCircle, FileSpreadsheet, Globe } from 'lucide-react';
import { analyzeCV } from '../services/api';
import { useLanguage } from '../LanguageContext';
import LoadingOverlay from '../components/LoadingOverlay';

export default function Analyze() {
  const navigate = useNavigate();
  const { language: currentLang, t, languages } = useLanguage();
  const fileInputRef = useRef(null);
  const jobPdfInputRef = useRef(null);

  const [targetLang, setTargetLang] = useState(currentLang);
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
      setError(t('uploadCvSub'));
    }
  }, [t]);

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
      setError(t('uploadCvSub'));
    }
  }, [t]);

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

    if (!cvFile) return setError(t('uploadCvTitle'));
    
    if (jobMode === 'text' && !jobDescription.trim()) {
      return setError(t('jobDescriptionPlaceholder'));
    }
    if (jobMode === 'pdf' && !jobPdfFile) {
      return setError(t('dragDropJobPdf'));
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('cv', cvFile);
      formData.append('skills', skills);
      formData.append('diplomas', diplomas);
      formData.append('language', targetLang);

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
    return <LoadingOverlay message={t('analyzingOverlayTitle')} submessage={t('analyzingOverlaySub')} />;
  }

  return (
    <div className="bg-gradient-mesh min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-3">
            {t('analyzePageTitle')}<span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">{t('applicationHighlight')}</span>
          </h1>
          <p className="text-text-muted max-w-lg mx-auto">
            {t('analyzePageDesc')}
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

          {/* AI Language Selection Card */}
          <div className="glass rounded-2xl p-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text">{t('targetLanguageLabel')}</h2>
                <p className="text-sm text-text-muted">{t('targetLanguageDesc')}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {Object.entries(languages).map(([code, lang]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setTargetLang(code)}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-2 transition-all font-medium text-sm ${
                    targetLang === code
                      ? 'bg-primary/15 border-primary/40 text-primary-light shadow-lg shadow-primary/10'
                      : 'bg-surface-elevated border-border text-text-muted hover:text-text hover:bg-surface'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CV Upload */}
          <div className="glass rounded-2xl p-6 animate-fade-in-up stagger-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text">{t('uploadCvTitle')}</h2>
                <p className="text-sm text-text-muted">{t('uploadCvSub')}</p>
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
                  <div className="text-left rtl:text-right">
                    <p className="font-medium text-text">{cvFile.name}</p>
                    <p className="text-sm text-text-muted">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setCvFile(null); }}
                    className="ml-4 rtl:mr-4 rtl:ml-0 p-1 rounded-lg hover:bg-surface-elevated text-text-muted hover:text-danger transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-text-dim mx-auto mb-3" />
                  <p className="text-text-muted mb-1">{t('dragDropCv')}</p>
                  <p className="text-sm text-text-dim">{t('clickToBrowse')}</p>
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
                  <h2 className="text-lg font-bold text-text">{t('skillsTitle')}</h2>
                  <p className="text-sm text-text-muted">{t('skillsSub')}</p>
                </div>
              </div>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder={t('skillsPlaceholder')}
                className="w-full h-32 bg-surface-elevated border border-border rounded-xl p-4 text-text placeholder-text-dim resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            <div className="glass rounded-2xl p-6 animate-fade-in-up stagger-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-warm flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text">{t('educationTitle')}</h2>
                  <p className="text-sm text-text-muted">{t('educationSub')}</p>
                </div>
              </div>
              <textarea
                value={diplomas}
                onChange={(e) => setDiplomas(e.target.value)}
                placeholder={t('educationPlaceholder')}
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
                  <h2 className="text-lg font-bold text-text">{t('jobOfferTitle')}</h2>
                  <p className="text-sm text-text-muted">{t('jobOfferSub')}</p>
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
                  {t('uploadPdfMode')}
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
                  {t('pasteTextMode')}
                </button>
              </div>
            </div>

            {/* Text Mode */}
            {jobMode === 'text' ? (
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder={t('jobDescriptionPlaceholder')}
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
                    <div className="text-left rtl:text-right">
                      <p className="font-medium text-text">{jobPdfFile.name}</p>
                      <p className="text-sm text-text-muted">{(jobPdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setJobPdfFile(null); }}
                      className="ml-4 rtl:mr-4 rtl:ml-0 p-1 rounded-lg hover:bg-surface-elevated text-text-muted hover:text-danger transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-text-dim mx-auto mb-3" />
                    <p className="text-text-muted mb-1">{t('dragDropJobPdf')}</p>
                    <p className="text-sm text-text-dim">{t('clickToBrowse')}</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center animate-fade-in-up stagger-5">
            <button type="submit" className="btn-primary text-lg px-10 py-4 flex items-center gap-3 group">
              <Sparkles className="w-5 h-5 relative z-10" />
              <span>{t('analyzeWithAi')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform relative z-10" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
