import { Link } from 'react-router-dom';
import {
  Sparkles, FileSearch, Target, Brain, MessageSquare,
  FileText, ArrowRight, Zap, Shield, TrendingUp, Upload,
  ClipboardList, Rocket, CheckCircle2, Star, ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Target,
      title: t('tabOverview'),
      description: 'Get a precise match percentage between your profile and the job requirements.',
      color: 'from-primary to-secondary',
    },
    {
      icon: Brain,
      title: t('tabSkills'),
      description: 'Discover exactly which skills you need to develop to land the job.',
      color: 'from-secondary to-accent',
    },
    {
      icon: FileSearch,
      title: t('tabWeaknesses'),
      description: 'Identify and fix the weak points holding your resume back.',
      color: 'from-accent to-accent-warm',
    },
    {
      icon: TrendingUp,
      title: t('tabRecommendations'),
      description: 'Receive actionable tips to strengthen your application.',
      color: 'from-accent-warm to-primary',
    },
    {
      icon: FileText,
      title: t('coverLetterTitle'),
      description: 'AI-crafted, personalized cover letters tailored to each position.',
      color: 'from-primary to-accent',
    },
    {
      icon: MessageSquare,
      title: t('mockInterviewBtn'),
      description: 'Practice with an AI recruiter and get real-time feedback.',
      color: 'from-secondary to-primary',
    },
  ];

  const steps = [
    { icon: Upload, title: t('step1Title'), desc: t('step1Desc') },
    { icon: ClipboardList, title: t('step2Title'), desc: t('step2Desc') },
    { icon: Rocket, title: t('step3Title'), desc: t('step3Desc') },
  ];

  const stats = [
    { value: '100%', label: t('freeToUse') },
    { value: 'AI', label: t('poweredAnalysis') },
    { value: '< 1min', label: t('instantResults') },
  ];

  return (
    <div className="bg-gradient-mesh min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[80px] pointer-events-none" aria-hidden="true" />
        <div className="absolute top-48 left-1/4 w-[260px] h-[260px] rounded-full bg-secondary/10 blur-[60px] pointer-events-none" aria-hidden="true" />
        <div className="absolute top-64 right-1/4 w-[220px] h-[220px] rounded-full bg-accent/10 blur-[60px] pointer-events-none" aria-hidden="true" />

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-text-muted mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>{t('heroBadge')}</span>
            <Zap className="w-4 h-4 text-accent" />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up stagger-1 tracking-tight">
            <span className="text-text">{t('heroTitlePrefix')}</span>
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {t('heroTitleSuffix')}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up stagger-2">
            {t('heroDesc')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
            <Link to="/analyze" className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group">
              <span>{t('startFreeAnalysis')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform relative z-10" />
            </Link>
            <Link to="/dashboard" className="btn-secondary text-lg px-8 py-4 flex items-center gap-2">
              <span>{t('viewDashboard')}</span>
            </Link>
          </div>

          {/* Trust markers */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-sm text-text-dim animate-fade-in-up stagger-3">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success" />
              {t('noSignUpRequired')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success" />
              {t('securePrivate')}
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-accent-warm" />
              {t('lovedBySeekers')}
            </span>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in-up stagger-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center sm:border-l rtl:sm:border-r rtl:sm:border-l-0 first:sm:border-l-0 sm:first:border-l-0 sm:border-border space-y-1 py-2">
                <div className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-text-muted font-medium uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-3">{t('howItWorks')}</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4 tracking-tight">
              {t('threeStepsTitle')}<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{t('threeStepsHighlight')}</span>
            </h2>
            <p className="text-text-muted max-w-lg mx-auto">{t('threeStepsDesc')}</p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-6">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px bg-gradient-to-r from-primary/40 via-secondary/40 to-accent/40" />
            {steps.map((step, i) => (
              <div key={step.title} className={`relative text-center glass rounded-2xl p-8 hover:-translate-y-1.5 hover:border-primary/50 transition-all duration-300 group animate-fade-in-up stagger-${i + 1}`}>
                <div className="relative inline-flex mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[var(--shadow-glow-sm)] group-hover:shadow-[var(--shadow-glow)] transition-shadow">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 rtl:right-auto rtl:-left-2 w-7 h-7 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-3">{t('featuresSection')}</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4 tracking-tight">
              {t('everythingYouNeed')}<span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">{t('needHighlight')}</span>
            </h2>
            <p className="text-text-muted max-w-lg mx-auto">{t('featuresDesc')}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`glass rounded-2xl p-6 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group animate-fade-in-up stagger-${i + 1}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:shadow-[var(--shadow-glow-sm)] transition-shadow`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-text-dim opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all -translate-y-1 group-hover:translate-y-0 rtl:rotate-90" />
                </div>
                <h3 className="text-lg font-bold text-text mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative glass rounded-3xl p-12 sm:p-16 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary/15 rounded-full blur-[60px] pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-24 -left-20 w-56 h-56 bg-secondary/15 rounded-full blur-[60px] pointer-events-none" aria-hidden="true" />
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-36 h-36 bg-accent/10 rounded-full blur-[50px] pointer-events-none" aria-hidden="true" />
            <div className="relative">
              <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary items-center justify-center mb-6 shadow-[var(--shadow-glow)] animate-float">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4 tracking-tight">{t('readyToLand')}</h2>
              <p className="text-text-muted mb-8 max-w-md mx-auto">
                {t('readyDesc')}
              </p>
              <Link to="/analyze" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2 group">
                <span>{t('analyzeCvNow')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform relative z-10" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-text-muted">CareerAI</span>
          </div>
          <p className="text-sm text-text-dim">
            Powered by Google Gemini AI • Free & Open
          </p>
        </div>
      </footer>
    </div>
  );
}
