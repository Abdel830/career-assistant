import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';
import { generateInterviewMessage } from '../services/gemini.service.js';

/**
 * POST /api/interview/start
 * Start a new interview session
 */
export async function startInterview(req, res) {
  try {
    const { analysisId, sessionId } = req.body;

    // Get analysis data
    const [rows] = await pool.query('SELECT * FROM analyses WHERE id = ?', [analysisId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    const analysis = rows[0];
    const interviewId = uuidv4();

    // Generate first interview message
    const aiResponse = await generateInterviewMessage({
      jobDescription: analysis.job_description,
      analysisResult: {
        compatibilityScore: analysis.compatibility_score,
        strengths: [],
        cvWeaknesses: JSON.parse(analysis.weaknesses || '[]'),
      },
      messages: [],
      isStart: true,
    });

    const messages = [
      {
        role: 'interviewer',
        content: aiResponse.message,
        category: aiResponse.category,
        timestamp: new Date().toISOString(),
      },
    ];

    // Save interview
    await pool.query(
      'INSERT INTO interviews (id, analysis_id, session_id, messages, status) VALUES (?, ?, ?, ?, ?)',
      [interviewId, analysisId, sessionId || uuidv4(), JSON.stringify(messages), 'active']
    );

    res.json({
      interviewId,
      message: aiResponse.message,
      questionNumber: aiResponse.questionNumber,
      totalQuestions: aiResponse.totalQuestions,
      category: aiResponse.category,
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ error: 'Failed to start interview' });
  }
}

/**
 * POST /api/interview/:id/message
 * Send a message in an interview
 */
export async function sendMessage(req, res) {
  try {
    const { message } = req.body;
    const interviewId = req.params.id;

    // Get interview data
    const [interviewRows] = await pool.query('SELECT * FROM interviews WHERE id = ?', [interviewId]);
    if (interviewRows.length === 0) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    const interview = interviewRows[0];
    const messages = JSON.parse(interview.messages || '[]');

    // Add candidate message
    messages.push({
      role: 'candidate',
      content: message,
      timestamp: new Date().toISOString(),
    });

    // Get analysis data for context
    const [analysisRows] = await pool.query('SELECT * FROM analyses WHERE id = ?', [interview.analysis_id]);
    const analysis = analysisRows[0];

    // Generate AI response
    const aiResponse = await generateInterviewMessage({
      jobDescription: analysis.job_description,
      analysisResult: {
        compatibilityScore: analysis.compatibility_score,
        strengths: [],
        cvWeaknesses: JSON.parse(analysis.weaknesses || '[]'),
      },
      messages,
      isStart: false,
    });

    // Add interviewer message
    messages.push({
      role: 'interviewer',
      content: aiResponse.message,
      category: aiResponse.category,
      feedbackOnLastAnswer: aiResponse.feedbackOnLastAnswer,
      timestamp: new Date().toISOString(),
    });

    // Update interview
    const status = aiResponse.isComplete ? 'completed' : 'active';
    const feedback = aiResponse.finalFeedback ? JSON.stringify(aiResponse.finalFeedback) : null;

    await pool.query(
      'UPDATE interviews SET messages = ?, status = ?, feedback = ? WHERE id = ?',
      [JSON.stringify(messages), status, feedback, interviewId]
    );

    res.json({
      message: aiResponse.message,
      questionNumber: aiResponse.questionNumber,
      totalQuestions: aiResponse.totalQuestions,
      category: aiResponse.category,
      feedbackOnLastAnswer: aiResponse.feedbackOnLastAnswer,
      isComplete: aiResponse.isComplete || false,
      finalFeedback: aiResponse.finalFeedback || null,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
}

/**
 * GET /api/interview/:id
 * Get interview data
 */
export async function getInterview(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM interviews WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    const interview = rows[0];
    res.json({
      id: interview.id,
      analysisId: interview.analysis_id,
      messages: JSON.parse(interview.messages || '[]'),
      feedback: interview.feedback ? JSON.parse(interview.feedback) : null,
      status: interview.status,
      createdAt: interview.created_at,
    });
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({ error: 'Failed to retrieve interview' });
  }
}
