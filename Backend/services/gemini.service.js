import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ─────────────────────────────────────────────
// GEMINI MODEL SETUP (2.5 FLASH + FALLBACK)
// ─────────────────────────────────────────────

const getModel = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    return genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });
  } catch (err) {
    console.warn("⚠️ Falling back to gemini-1.5-flash");
    return genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });
  }
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const cleanJSON = (text) => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

const safeParseJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

// ─────────────────────────────────────────────
// JD ANALYSIS
// ─────────────────────────────────────────────

const JD_ANALYSIS_PROMPT = (jd) => `
You are a senior technical recruiter and ATS specialist.

Return ONLY valid JSON:

{
  "jobTitle": "string",
  "keywords": ["top 20 ranked keywords"],
  "mustHave": ["5-8 required skills"],
  "niceToHave": ["3-6 optional skills"],
  "tone": "technical | leadership | creative | analytical | customer-facing",
  "summary": "2-3 sentences"
}

Job Description:
"""
${jd}
"""
`;

export const analyzeJobDescription = async (jobDescription) => {
  const model = getModel();

  const result = await model.generateContent(
    JD_ANALYSIS_PROMPT(jobDescription)
  );

  const cleanText = cleanJSON(result.response.text());
  const parsed = safeParseJSON(cleanText);

  if (!parsed) {
    throw new Error("Invalid JSON from Gemini (JD Analysis)");
  }

  return parsed;
};

// ─────────────────────────────────────────────
// RESUME REWRITE
// ─────────────────────────────────────────────

const REWRITE_PROMPT = (rawResume, jdAnalysis) => `
You are an elite ATS resume optimizer.

Target Job: ${jdAnalysis.jobTitle}
Must-have: ${jdAnalysis.mustHave?.join(", ")}
Keywords: ${jdAnalysis.keywords?.join(", ")}
Tone: ${jdAnalysis.tone}

Return ONLY JSON:

{
  "name": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin": "string",
  "github": "string",
  "summary": "3-4 sentences",
  "experience": [
    {
      "company": "string",
      "title": "string",
      "startDate": "string",
      "endDate": "string",
      "bullets": ["3-5 bullet points"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "string",
      "endDate": "string",
      "gpa": "string"
    }
  ],
  "skills": ["array"],
  "certifications": ["array"]
}

Rules:
- No fake data
- Strong action verbs
- Quantify achievements
- ATS-friendly formatting

Resume:
"""
${rawResume}
"""
`;

export const rewriteResume = async (rawResumeText, jdAnalysis) => {
  const model = getModel();

  const result = await model.generateContent(
    REWRITE_PROMPT(rawResumeText, jdAnalysis)
  );

  const cleanText = cleanJSON(result.response.text());
  const parsed = safeParseJSON(cleanText);

  if (!parsed) {
    throw new Error("Invalid JSON from Gemini (Resume Rewrite)");
  }

  return parsed;
};

// ─────────────────────────────────────────────
// ATS SCORE (IMPROVED MATCHING)
// ─────────────────────────────────────────────

const includesKeyword = (text, keyword) => {
  const pattern = new RegExp(`\\b${keyword}\\b`, "i");
  return pattern.test(text);
};

export const calculateATSScore = (rewrittenText, jdAnalysis) => {
  const text = rewrittenText.toLowerCase();

  const { mustHave = [], keywords = [] } = jdAnalysis;

  if (!mustHave.length && !keywords.length) return 0;

  const mustHaveMatched = mustHave.filter((kw) =>
    includesKeyword(text, kw.toLowerCase())
  ).length;

  const keywordsMatched = keywords.filter((kw) =>
    includesKeyword(text, kw.toLowerCase())
  ).length;

  const mustHaveScore = mustHave.length
    ? (mustHaveMatched / mustHave.length) * 60
    : 0;

  const keywordsScore = keywords.length
    ? (keywordsMatched / keywords.length) * 40
    : 0;

  return Math.round(mustHaveScore + keywordsScore);
};

export default {
  analyzeJobDescription,
  rewriteResume,
  calculateATSScore,
};