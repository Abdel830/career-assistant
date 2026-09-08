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
  const cvFile = req.files?.cv?.[0] || req.file;
  const jobPdfFile = req.files?.jobPdf?.[0];
  const cvPath = cvFile?.path;
  const jobPdfPath = jobPdfFile?.path;

  try {
    const { skills, diplomas, jobDescription, sessionId } = req.body;

    if (!cvFile) {
      return res.status(400).json({ error: 'CV file (PDF) is required' });
    }
    if (!jobDescription?.trim() && !jobPdfFile) {
      return res.status(400).json({ error: 'Please provide job offer text or upload a Job Offer PDF' });
    }

    const analysisId = uuidv4();

    // Call Gemini for analysis
    const result = await analyzeCV({
      cvBuffer: cvFile.buffer,
      cvPath,
      jobPdfBuffer: jobPdfFile?.buffer,
      jobPdfPath,
      skills: skills || '',
      diplomas: diplomas || '',
      jobDescription: jobDescription || '',
    });

    const storedJobDescription = jobDescription?.trim()
      ? jobDescription
      : `Job Offer: ${result.jobTitle || 'Position'} ${result.company ? 'at ' + result.company : ''} (Uploaded as PDF)`;

    // Save to database
    await pool.query(
      `INSERT INTO analyses (id, session_id, job_title, company, compatibility_score, missing_skills, weaknesses, recommendations, interview_questions, learning_roadmap, cv_filename, skills, diplomas, job_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        analysisId,
        sessionId || uuidv4(),
        result.jobTitle || '',
        result.company || '',
        result.compatibilityScore,
        JSON.stringify(result.missingSkills || []),
        JSON.stringify(result.cvWeaknesses || []),
        JSON.stringify(result.recommendations || []),
        JSON.stringify(result.interviewQuestions || []),
        JSON.stringify(result.learningRoadmap || []),
        cvFile.originalname || cvFile.filename || 'cv.pdf',
        skills || '',
        diplomas || '',
        storedJobDescription,
      ]
    );

    res.json({
      id: analysisId,
      ...result,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze CV. Please try again.' });
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

function parseJSONField(val) {
  if (!val) return [];
  if (typeof val === 'object') return val;
  try {
    return typeof val === 'string' ? JSON.parse(val) : val;
  } catch (e) {
    return [];
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
      missingSkills: parseJSONField(analysis.missing_skills),
      cvWeaknesses: parseJSONField(analysis.weaknesses),
      recommendations: parseJSONField(analysis.recommendations),
      interviewQuestions: parseJSONField(analysis.interview_questions),
      learningRoadmap: parseJSONField(analysis.learning_roadmap),
      coverLetter: analysis.cover_letter,
      strengths: [],
      summary: '',
      createdAt: analysis.created_at,
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve analysis' });
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
