import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Helper to safely extract and parse JSON from AI response
 */
function safeParseJSON(rawText) {
  if (!rawText) throw new Error('Empty response from AI model');
  const text = rawText.trim();
  // Strip markdown code fences if present
  let cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  // If there's extra text around JSON, extract substring from first '{' to last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse JSON from AI response:', text);
    throw new Error('AI returned an invalid JSON response structure.');
  }
}

/**
 * Analyze a CV against a job offer using Gemini AI
 */
export async function analyzeCV({ cvBuffer, cvPath, skills, diplomas, jobDescription }) {
  let pdfParts = [];
  if (cvBuffer && Buffer.isBuffer(cvBuffer)) {
    pdfParts.push({ inlineData: { data: cvBuffer.toString('base64'), mimeType: 'application/pdf' } });
  } else if (cvPath && fs.existsSync(cvPath)) {
    const pdfData = fs.readFileSync(cvPath).toString('base64');
    pdfParts.push({ inlineData: { data: pdfData, mimeType: 'application/pdf' } });
  }

  const prompt = `You are an expert career advisor and HR consultant. Analyze the candidate's CV against the job description provided.

USER'S ADDITIONAL INFO:
- Skills: ${skills}
- Diplomas/Education: ${diplomas}

JOB DESCRIPTION:
${jobDescription}

Respond ONLY with a valid JSON object with this exact structure:
{
  "compatibilityScore": <number 0-100>,
  "jobTitle": "<extracted job title>",
  "company": "<extracted company name or 'Not specified'>",
  "missingSkills": ["<skill1>", "<skill2>", ...],
  "cvWeaknesses": ["<weakness1>", "<weakness2>", ...],
  "recommendations": ["<recommendation1>", "<recommendation2>", ...],
  "interviewQuestions": [
    {"question": "<question>", "category": "<Technical|Behavioral|Situational>", "tip": "<brief tip to answer>"}
  ],
  "strengths": ["<strength1>", "<strength2>", ...],
  "summary": "<2-3 sentence overall assessment>"
}

Be thorough, specific, and actionable. Provide at least 5 items for each array field and 8-10 interview questions.`;

  const result = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: [
      {
        role: 'user',
        parts: [
          ...pdfParts,
          { text: prompt },
        ],
      },
    ],
    config: {
      responseMimeType: 'application/json',
    },
  });

  return safeParseJSON(result.text);
}

/**
 * Generate a personalized cover letter
 */
export async function generateCoverLetter({ cvPath, skills, diplomas, jobDescription, analysisResult }) {
  let pdfParts = [];
  if (cvPath && fs.existsSync(cvPath)) {
    const pdfData = fs.readFileSync(cvPath).toString('base64');
    pdfParts.push({ inlineData: { data: pdfData, mimeType: 'application/pdf' } });
  }

  const prompt = `You are an expert career advisor. Based on the candidate's CV and the job description, write a professional, personalized cover letter.

USER'S INFO:
- Skills: ${skills}
- Diplomas: ${diplomas}

JOB DESCRIPTION:
${jobDescription}

ANALYSIS SUMMARY:
- Compatibility Score: ${analysisResult?.compatibilityScore || 'N/A'}%
- Strengths: ${JSON.stringify(analysisResult?.strengths || [])}

Write a compelling cover letter in English that:
1. Addresses the specific job requirements
2. Highlights the candidate's relevant strengths
3. Addresses potential gaps constructively
4. Is professional yet personable
5. Is between 300-450 words

Respond ONLY with the cover letter text (no JSON, no markdown formatting, no code blocks). Use proper paragraph formatting.`;

  const result = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: [
      {
        role: 'user',
        parts: [
          ...pdfParts,
          { text: prompt },
        ],
      },
    ],
  });

  return result.text.trim();
}

/**
 * Generate interview response (chat mode)
 */
export async function generateInterviewMessage({ jobDescription, analysisResult, messages, isStart }) {
  let prompt;

  if (isStart) {
    prompt = `You are a professional recruiter conducting a job interview. The candidate is applying for this position:

JOB DESCRIPTION:
${jobDescription}

CANDIDATE ANALYSIS:
- Compatibility: ${analysisResult?.compatibilityScore || 'N/A'}%
- Strengths: ${JSON.stringify(analysisResult?.strengths || [])}
- Weaknesses: ${JSON.stringify(analysisResult?.cvWeaknesses || [])}

Start the interview with a warm greeting and your first question. Be professional but friendly.
Respond ONLY with a JSON object:
{
  "message": "<your greeting and first question>",
  "questionNumber": 1,
  "totalQuestions": 8,
  "category": "Introduction"
}`;
  } else {
    const chatHistory = messages.map(m => `${m.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${m.content}`).join('\n');
    const questionNum = messages.filter(m => m.role === 'interviewer').length + 1;

    prompt = `You are a professional recruiter conducting a job interview for this position:

JOB DESCRIPTION:
${jobDescription}

INTERVIEW SO FAR:
${chatHistory}

${questionNum <= 8 ? `Ask the next question (question ${questionNum} of 8). Vary between Technical, Behavioral, and Situational questions. Also provide brief feedback on the candidate's previous answer.` : `The interview is over. Provide a comprehensive final evaluation of the candidate.`}

Respond ONLY with a JSON object:
${questionNum <= 8 ? `{
  "message": "<brief feedback on last answer + next question>",
  "questionNumber": ${questionNum},
  "totalQuestions": 8,
  "category": "<Technical|Behavioral|Situational>",
  "feedbackOnLastAnswer": "<specific feedback on candidate's previous response>"
}` : `{
  "message": "<final thank you message>",
  "questionNumber": ${questionNum},
  "totalQuestions": 8,
  "category": "Final Evaluation",
  "isComplete": true,
  "finalFeedback": {
    "overallScore": <number 0-100>,
    "strengths": ["<strength1>", "<strength2>", ...],
    "improvements": ["<improvement1>", "<improvement2>", ...],
    "recommendation": "<hire/consider/not recommended>",
    "summary": "<2-3 sentence overall assessment>"
  }
}`}`;
  }

  const result = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: 'application/json',
    },
  });

  return safeParseJSON(result.text);
}
