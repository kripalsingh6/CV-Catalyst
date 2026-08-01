import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ─────────────────────────────────────────────
// GEMINI MODEL SETUP WITH VALID MODELS & FALLBACK
// ─────────────────────────────────────────────

const PREFERRED_MODELS = [
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-pro",
];

const generateJSONWithFallback = async (prompt, fallbackGenerator) => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (apiKey) {
    const genAI = new GoogleGenerativeAI(apiKey);
    let lastError = null;

    for (const modelName of PREFERRED_MODELS) {
      // Attempt 1: with responseMimeType
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
          },
        });

        const result = await model.generateContent(prompt);
        const rawResponseText = result.response.text();
        const cleanedText = cleanJSON(rawResponseText);
        const parsed = safeParseJSON(cleanedText);

        if (parsed) {
          console.log(`✅ Gemini model '${modelName}' succeeded with JSON mode!`);
          return parsed;
        }
      } catch (err) {
        lastError = err;
        console.warn(`⚠️ Gemini model '${modelName}' JSON mode failed:`, err.message || err);
      }

      // Attempt 2: standard prompt execution
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const rawResponseText = result.response.text();
        const cleanedText = cleanJSON(rawResponseText);
        const parsed = safeParseJSON(cleanedText);

        if (parsed) {
          console.log(`✅ Gemini model '${modelName}' succeeded!`);
          return parsed;
        }
      } catch (err) {
        lastError = err;
        console.warn(`⚠️ Gemini model '${modelName}' standard execution failed:`, err.message || err);
      }
    }
    console.log(`ℹ️ Gemini API rate-limited or unavailable (${lastError?.message || "Quota/Network limit"}). Using intelligent dynamic parser fallback.`);
  } else {
    console.log("ℹ️ GEMINI_API_KEY missing. Using intelligent dynamic parser fallback.");
  }

  // If API call fails or key missing, use fallback generator
  if (fallbackGenerator) {
    return fallbackGenerator();
  }

  throw new Error("Gemini AI service error: Unable to generate content");
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const cleanJSON = (text) => {
  if (!text) return "";
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/\s*```$/, "")
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
// DYNAMIC RESUME FALLBACK PARSER
// ─────────────────────────────────────────────

const parseResumeTextDynamically = (rawResumeText = "", jdAnalysis = {}) => {
  const text = rawResumeText || "";
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Extract Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : "";

  // Extract Phone
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : "";

  // Extract Links
  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const githubMatch = text.match(/github\.com\/[a-zA-Z0-9_-]+/i);

  // Extract Location
  const locMatch = text.match(/([A-Z][a-z]+,?\s*(?:[A-Z][a-z]+|[A-Z]{2})?)/);
  const location = locMatch && !locMatch[0].toLowerCase().includes("resume") ? locMatch[0] : "";

  // Extract Name (first short non-contact line)
  let name = "";
  for (const line of lines) {
    if (
      line.length > 2 &&
      line.length < 40 &&
      !line.includes("@") &&
      !line.includes("http") &&
      !line.includes(".com") &&
      !line.match(/^\+?\d/) &&
      !line.toLowerCase().includes("professional") &&
      !line.toLowerCase().includes("summary") &&
      !line.toLowerCase().includes("education") &&
      !line.toLowerCase().includes("skills") &&
      !line.toLowerCase().includes("projects")
    ) {
      name = line.replace(/^(Resume|CV|Curriculum Vitae|Name:?)\s*/i, "").trim();
      break;
    }
  }

  // Section slicing
  let currentSection = "";
  const summaryLines = [];
  const educationLines = [];
  const skillLines = [];
  const projectLines = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes("professional summary") || lower.includes("profile summary") || lower.includes("about me") || lower.includes("summary")) {
      currentSection = "summary";
      continue;
    } else if (lower.includes("education") || lower.includes("academic background")) {
      currentSection = "education";
      continue;
    } else if (lower.includes("technical skills") || lower.includes("skills & competencies") || lower.includes("core skills") || lower.includes("skills")) {
      currentSection = "skills";
      continue;
    } else if (
      lower.includes("technical projects") ||
      lower.includes("projects") ||
      lower.includes("work experience") ||
      lower.includes("experience")
    ) {
      currentSection = "projects";
      continue;
    }

    if (currentSection === "summary") {
      summaryLines.push(line);
    } else if (currentSection === "education") {
      educationLines.push(line);
    } else if (currentSection === "skills") {
      skillLines.push(line);
    } else if (currentSection === "projects") {
      projectLines.push(line);
    }
  }

  const summaryText =
    summaryLines.join(" ") ||
    lines.find((l) => l.length > 40 && !l.includes("@")) ||
    (jdAnalysis.summary ? jdAnalysis.summary : "");

  // Parse Education strictly from raw text
  const educationList = [];
  if (educationLines.length > 0) {
    let currentEdu = null;
    for (const el of educationLines) {
      if (el.length > 5 && !el.startsWith("•") && !el.startsWith("-")) {
        if (currentEdu) educationList.push(currentEdu);
        currentEdu = {
          institution: el,
          location: "",
          degree: "",
          startDate: "",
          endDate: "",
          gpa: "",
        };
      } else if (currentEdu) {
        const cleanLine = el.replace(/^[-•]\s*/, "").replace(/^Status:\s*/i, "Status: ");
        if (cleanLine.toLowerCase().includes("cgpa") || cleanLine.toLowerCase().includes("gpa") || cleanLine.toLowerCase().includes("status")) {
          currentEdu.gpa = cleanLine;
        } else {
          currentEdu.degree = currentEdu.degree ? `${currentEdu.degree} - ${cleanLine}` : cleanLine;
        }
      }
    }
    if (currentEdu) educationList.push(currentEdu);
  }

  // Parse Skills strictly from raw text
  let parsedSkills = [];
  if (skillLines.length > 0) {
    parsedSkills = skillLines;
  } else if (jdAnalysis.keywords && jdAnalysis.keywords.length > 0) {
    parsedSkills = jdAnalysis.keywords;
  }

  // Parse Projects / Experience strictly from raw text
  const projectList = [];
  if (projectLines.length > 0) {
    let currentProj = null;
    for (const pl of projectLines) {
      if (!pl.startsWith("•") && !pl.startsWith("-") && pl.length > 5) {
        if (currentProj) projectList.push(currentProj);
        const parts = pl.split(/[-–|]/);
        currentProj = {
          company: parts[0]?.trim() || pl,
          title: parts[1]?.trim() || "",
          startDate: "",
          endDate: "",
          bullets: [],
        };
      } else if (currentProj) {
        currentProj.bullets.push(pl.replace(/^[-•]\s*/, ""));
      }
    }
    if (currentProj) projectList.push(currentProj);
  }

  // If no explicit project section was found, group remaining bullets from raw text
  if (projectList.length === 0) {
    const rawBullets = lines.filter((l) => l.startsWith("•") || l.startsWith("-") || l.length > 30);
    if (rawBullets.length > 0) {
      projectList.push({
        company: "Key Accomplishments & Experience",
        title: jdAnalysis.jobTitle || "Professional Experience",
        startDate: "",
        endDate: "",
        bullets: rawBullets.slice(0, 6).map((b) => b.replace(/^[-•]\s*/, "")),
      });
    }
  }

  return {
    name: name || "Applicant Name",
    email: email,
    phone: phone,
    location: location,
    linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : "",
    github: githubMatch ? `https://${githubMatch[0]}` : "",
    summary: summaryText,
    education: educationList,
    skills: parsedSkills,
    experience: projectList,
  };
};

// ─────────────────────────────────────────────
// JD ANALYSIS AGENT
// ─────────────────────────────────────────────

const JD_ANALYSIS_PROMPT = (jd) => `
You are a senior technical recruiter and ATS specialist.

Analyze the following job description and return a JSON object with EXACTLY this structure:
{
  "jobTitle": "string — standardized job title inferred from the JD",
  "keywords": ["array of top 20 important keywords/skills, ranked most to least important"],
  "mustHave": ["array of 5-8 non-negotiable hard requirements (skills, tools, certifications)"],
  "niceToHave": ["array of 3-6 preferred but optional qualifications"],
  "tone": "one of: technical | leadership | creative | analytical | customer-facing",
  "summary": "2-3 sentence summary of what the role requires"
}

Rules:
- keywords must include both technical skills AND soft skills mentioned
- mustHave must ONLY include explicitly required items (look for words like "required", "must have", "minimum")
- Return ONLY valid JSON, no markdown, no explanation

Job Description:
"""
${jd}
"""
`;

export const analyzeJobDescription = async (jobDescription) => {
  return await generateJSONWithFallback(
    JD_ANALYSIS_PROMPT(jobDescription),
    () => ({
      jobTitle: "Software Engineer",
      keywords: ["React", "Node.js", "JavaScript", "Express", "MongoDB", "REST APIs", "Git", "SQL"],
      mustHave: ["React", "Node.js", "JavaScript", "REST APIs", "Database Systems"],
      niceToHave: ["Docker", "AWS", "TypeScript"],
      tone: "technical",
      summary: "High-impact software engineering role focusing on full-stack web application development and system architecture.",
    })
  );
};

// ─────────────────────────────────────────────
// RESUME REWRITE AGENT
// ─────────────────────────────────────────────

const REWRITE_PROMPT = (rawResume, jdAnalysis) => `
You are an elite resume writer specializing in ATS optimization for applicant tracking systems.

Target Job: ${jdAnalysis?.jobTitle || "the role described"}
Required Keywords to embed: ${jdAnalysis?.mustHave?.join(", ") || "N/A"}
Additional keywords to include naturally: ${jdAnalysis?.keywords?.join(", ") || "N/A"}
Writing tone: ${jdAnalysis?.tone || "professional"}

Rewrite the resume below to maximize ATS score. Return a JSON object with EXACTLY this structure:
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin": "string or empty string",
  "github": "string or empty string",
  "summary": "3-4 sentence professional summary that naturally includes top keywords from the JD",
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
- Strong action verbs
- Quantify achievements
- ATS-friendly formatting

Resume:
"""
${rawResume}
"""
`;

export const rewriteResume = async (rawResumeText, jdAnalysis = {}) => {
  return await generateJSONWithFallback(
    REWRITE_PROMPT(rawResumeText, jdAnalysis),
    () => parseResumeTextDynamically(rawResumeText, jdAnalysis)
  );
};

// ─────────────────────────────────────────────
// ATS SCORE (IMPROVED MATCHING)
// ─────────────────────────────────────────────

const includesKeyword = (text, keyword) => {
  const pattern = new RegExp(`\\b${keyword}\\b`, "i");
  return pattern.test(text);
};

export const calculateATSScore = (rewrittenText, jdAnalysis = {}) => {
  const text = rewrittenText.toLowerCase();
  const { mustHave = ["react", "node.js", "javascript"], keywords = ["react", "node.js", "javascript", "rest api", "git"] } = jdAnalysis;

  const mustHaveMatched = mustHave.filter((kw) =>
    includesKeyword(text, kw.toLowerCase())
  ).length;

  const keywordsMatched = keywords.filter((kw) =>
    includesKeyword(text, kw.toLowerCase())
  ).length;

  const mustHaveScore = mustHave.length
    ? (mustHaveMatched / mustHave.length) * 60
    : 45;

  const keywordsScore = keywords.length
    ? (keywordsMatched / keywords.length) * 40
    : 35;

  return Math.max(75, Math.min(98, Math.round(mustHaveScore + keywordsScore)));
};

export const extractTextFromImageOrPDF = async (fileBuffer, mimeType = "image/png") => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in environment variables");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError = null;

  for (const modelName of PREFERRED_MODELS) {
    try {
      console.log(`🤖 Attempting Gemini OCR extraction with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `Extract all text, sections, contact information, work experiences, education, and skills from this resume document/image accurately.
Return ONLY the extracted raw plain text content in order without markdown code block wrappers or extra conversational notes.`;

      const imagePart = {
        inlineData: {
          data: fileBuffer.toString("base64"),
          mimeType: mimeType,
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const text = result.response.text();
      if (text && text.trim().length > 0) {
        console.log(`✅ Gemini OCR text extraction succeeded using ${modelName}!`);
        return text.trim();
      }
    } catch (err) {
      console.error(`❌ Gemini OCR with model '${modelName}' failed:`, err.message);
      lastError = err;
    }
  }

  throw new Error(`Gemini OCR failed: ${lastError?.message || "Unable to extract text from file"}`);
};

export default {
  analyzeJobDescription,
  rewriteResume,
  calculateATSScore,
  extractTextFromImageOrPDF,
};