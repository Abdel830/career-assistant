import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Session ID management (no auth, uses localStorage UUID)
export function getSessionId() {
  let sessionId = localStorage.getItem('career_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('career_session_id', sessionId);
  }
  return sessionId;
}

// === Analysis API ===

export async function analyzeCV(formData) {
  formData.append('sessionId', getSessionId());
  const response = await api.post('/analysis/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000, // 2 min timeout for AI processing
  });
  return response.data;
}

export async function getAnalysis(id) {
  const response = await api.get(`/analysis/${id}`);
  return response.data;
}

export async function getHistory() {
  const sessionId = getSessionId();
  const response = await api.get(`/analysis/history/${sessionId}`);
  return response.data;
}

export async function generateCoverLetter(analysisId) {
  const response = await api.post(`/analysis/${analysisId}/cover-letter`, {}, {
    timeout: 120000,
  });
  return response.data;
}

// === Interview API ===

export async function startInterview(analysisId) {
  const response = await api.post('/interview/start', {
    analysisId,
    sessionId: getSessionId(),
  }, { timeout: 60000 });
  return response.data;
}

export async function sendInterviewMessage(interviewId, message) {
  const response = await api.post(`/interview/${interviewId}/message`, { message }, {
    timeout: 60000,
  });
  return response.data;
}

export async function getInterview(interviewId) {
  const response = await api.get(`/interview/${interviewId}`);
  return response.data;
}

export default api;
