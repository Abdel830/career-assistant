import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';
import { analyzeCV, generateCoverLetter } from '../services/gemini.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * POST /api/analysis/analyze
 * Analyze CV against job description
 */
export async function analyze(req, res) {
  const cvFile = req.file;
  const cvPath = cvFile?.path;

  try {
    const { skills, diplomas, jobDescription, sessionId } = req.body;

    if (!cvFile) {
      return res.status(400).json({ error: 'CV file (PDF) is required' });
    }
    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    const analysisId = uuidv4();

    // Call Gemini for analysis
    const result = await analyzeCV({
      cvPath,
      skills: skills || '',
      diplomas: diplomas || '',
      jobDescription,
    });

    // Save to database
    await pool.query(
      `INSERT INTO analyses (id, session_id, job_title, company, compatibility_score, missing_skills, weaknesses, recommendations, interview_questions, cv_filename, skills, diplomas, job_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        analysisId,
        sessionId || uuidv4(),
        result.jobTitle || '',
        result.company || '',
        result.compatibilityScore,
        JSON.stringify(result.missingSkills),
        JSON.stringify(result.cvWeaknesses),
        JSON.stringify(result.recommendations),
        JSON.stringify(result.interviewQuestions),
        cvFile.filename,
        skills || '',
        diplomas || '',
        jobDescription,
      ]
    );

    res.json({
      id: analysisId,
      ...result,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze CV. Please try again.' });
  } finally {
    // Clean up temporary uploaded file from disk after processing
    if (cvPath && fs.existsSync(cvPath)) {
      try {
        fs.unlinkSync(cvPath);
      } catch (e) {
        console.warn('Failed to delete temp CV file:', e.message);
      }
    }
  }
}

/**
 * GET /api/analysis/:id
 * Get analysis result by ID
 */
export async function getAnalysis(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM analyses WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    const analysis = rows[0];
    res.json({
      id: analysis.id,
      jobTitle: analysis.job_title,
      company: analysis.company,
      compatibilityScore: analysis.compatibility_score,
      missingSkills: JSON.parse(analysis.missing_skills || '[]'),
      cvWeaknesses: JSON.parse(analysis.weaknesses || '[]'),
      recommendations: JSON.parse(analysis.recommendations || '[]'),
      interviewQuestions: JSON.parse(analysis.interview_questions || '[]'),
      coverLetter: analysis.cover_letter,
      strengths: [],
      summary: '',
      createdAt: analysis.created_at,
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: 'Failed to retrieve analysis' });
  }
}

/**
 * GET /api/analysis/history/:sessionId
 * Get all analyses for a session
 */
export async function getHistory(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, job_title, company, compatibility_score, created_at FROM analyses WHERE session_id = ? ORDER BY created_at DESC',
      [req.params.sessionId]
    );

    res.json(
      rows.map((r) => ({
        id: r.id,
        jobTitle: r.job_title,
        company: r.company,
        compatibilityScore: r.compatibility_score,
        createdAt: r.created_at,
      }))
    );
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
}

/**
 * POST /api/analysis/:id/cover-letter
 * Generate cover letter for an analysis
 */
export async function createCoverLetter(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM analyses WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    const analysis = rows[0];
    const cvPath = path.join(__dirname, '..', 'uploads', analysis.cv_filename);

    const coverLetter = await generateCoverLetter({
      cvPath,
      skills: analysis.skills,
      diplomas: analysis.diplomas,
      jobDescription: analysis.job_description,
      analysisResult: {
        compatibilityScore: analysis.compatibility_score,
        strengths: [],
      },
    });

    // Save cover letter
    await pool.query('UPDATE analyses SET cover_letter = ? WHERE id = ?', [coverLetter, req.params.id]);

    res.json({ coverLetter });
  } catch (error) {
    console.error('Cover letter error:', error);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
}
