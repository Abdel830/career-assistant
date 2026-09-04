import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MessageSquare, Send, ArrowLeft, Loader2, User, Bot,
  Trophy, Target, TrendingUp, AlertTriangle, CheckCircle
} from 'lucide-react';
import { getAnalysis, startInterview, sendInterviewMessage } from '../services/api';

export default function Interview() {
  const { id: analysisId } = useParams();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [interviewId, setInterviewId] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 8 });
  const [isComplete, setIsComplete] = useState(false);
  const [finalFeedback, setFinalFeedback] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function init() {
      try {
        const result = await startInterview(analysisId);
        setInterviewId(result.interviewId);
        setMessages([{
          role: 'interviewer',
          content: result.message,
          category: result.category,
        }]);
        setProgress({ current: result.questionNumber, total: result.totalQuestions });
      } catch {
        setError('Failed to start interview. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [analysisId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending || isComplete) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'candidate', content: userMessage }]);
    setSending(true);

    try {
      const result = await sendInterviewMessage(interviewId, userMessage);
      setMessages(prev => [...prev, {
        role: 'interviewer',
        content: result.message,
        category: result.category,
        feedbackOnLastAnswer: result.feedbackOnLastAnswer,
      }]);
      setProgress({ current: result.questionNumber, total: result.totalQuestions });

      if (result.isComplete) {
        setIsComplete(true);
        setFinalFeedback(result.finalFeedback);
      }
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh">
        <div className="glass rounded-2xl p-10 text-center animate-fade-in-up">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-border" />
            <div className="absolute inset-0 rounded-full border-4 border-secondary border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-secondary-light" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-text mb-2">Preparing Your Interview</h3>
          <p className="text-text-muted text-sm">The AI recruiter is reviewing your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-mesh min-h-screen pt-20 flex flex-col">
      {/* Header */}
      <div className="glass-strong border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={`/results/${analysisId}`} className="p-2 rounded-lg hover:bg-surface-elevated text-text-muted hover:text-text transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text">AI Recruiter</h2>
                <p className="text-xs text-text-muted">
                  {isComplete ? 'Interview Complete' : 'Mock Interview Session'}
                </p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5">
              {Array.from({ length: progress.total }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i < progress.current
                      ? 'bg-primary scale-110'
                      : 'bg-border'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-text-muted">
              {progress.current}/{progress.total}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 animate-fade-in-up ${msg.role === 'candidate' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                msg.role === 'interviewer'
                  ? 'bg-gradient-to-br from-secondary to-primary'
                  : 'bg-gradient-to-br from-accent to-accent-warm'
              }`}>
                {msg.role === 'interviewer'
                  ? <Bot className="w-4 h-4 text-white" />
                  : <User className="w-4 h-4 text-white" />
                }
              </div>

              {/* Bubble */}
              <div className={`max-w-[75%] ${
                msg.role === 'interviewer' ? 'chat-bubble-interviewer' : 'chat-bubble-candidate'
              } px-5 py-3.5`}>
                {msg.category && msg.role === 'interviewer' && (
                  <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-secondary/15 text-secondary-light mb-2">
                    {msg.category}
                  </span>
                )}
                {msg.feedbackOnLastAnswer && (
                  <div className="mb-3 pb-3 border-b border-border">
                    <p className="text-sm text-accent-warm italic">{msg.feedbackOnLastAnswer}</p>
                  </div>
                )}
                <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {sending && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="chat-bubble-interviewer px-5 py-4">
                <div className="flex gap-1.5">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          )}

          {/* Final Feedback */}
          {isComplete && finalFeedback && (
            <div className="glass rounded-2xl p-6 mt-8 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-8 h-8 text-accent-warm" />
                <div>
                  <h3 className="text-xl font-bold text-text">Interview Complete!</h3>
                  <p className="text-sm text-text-muted">Here's your performance review</p>
                </div>
              </div>

              {/* Score */}
              <div className="flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
                    {finalFeedback.overallScore}%
                  </div>
                  <p className="text-text-muted mt-1">Overall Performance</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    finalFeedback.recommendation === 'hire'
                      ? 'bg-success/15 text-success'
                      : finalFeedback.recommendation === 'consider'
                      ? 'bg-warning/15 text-warning'
                      : 'bg-danger/15 text-danger'
                  }`}>
                    {finalFeedback.recommendation === 'hire' ? '✅ Recommended to Hire' :
                     finalFeedback.recommendation === 'consider' ? '🤔 Worth Considering' :
                     '⚠️ Needs Improvement'}
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-xl bg-success/5 border border-success/15">
                  <h4 className="font-bold text-text flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {finalFeedback.strengths?.map((s, i) => (
                      <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                        <span className="text-success mt-1">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="p-4 rounded-xl bg-warning/5 border border-warning/15">
                  <h4 className="font-bold text-text flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-warning" />
                    Areas to Improve
                  </h4>
                  <ul className="space-y-2">
                    {finalFeedback.improvements?.map((s, i) => (
                      <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                        <span className="text-warning mt-1">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {finalFeedback.summary && (
                <p className="text-text-muted text-sm mt-4 p-4 rounded-xl bg-surface-elevated border border-border">
                  {finalFeedback.summary}
                </p>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {!isComplete && (
        <div className="glass-strong border-t border-border px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer..."
              rows={1}
              className="flex-1 bg-surface-elevated border border-border rounded-xl px-4 py-3 text-text placeholder-text-dim resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all max-h-32"
              style={{ minHeight: '48px' }}
              disabled={sending}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="btn-primary p-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin relative z-10" />
              ) : (
                <Send className="w-5 h-5 relative z-10" />
              )}
            </button>
          </div>
          <p className="text-center text-xs text-text-dim mt-2">Press Enter to send • Shift+Enter for new line</p>
        </div>
      )}

      {/* Return button when done */}
      {isComplete && (
        <div className="px-4 py-4 text-center">
          <Link to={`/results/${analysisId}`} className="btn-primary inline-flex items-center gap-2">
            <span>Back to Results</span>
          </Link>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
}
