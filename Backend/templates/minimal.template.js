import {
  formatSkillsCategories,
  sanitizeResumeData,
  normalizeProjectForRender,
  DEFAULT_PROJECTS,
} from "../utils/sanitize-resume.js";

export const minimalTemplate = (rawInput = {}) => {
  const data = sanitizeResumeData(rawInput);
  const {
    name = "Kripal Singh Thakur",
    email = "thakurkripalsingh6@gmail.com",
    phone = "+91 8770534091",
    location = "Bhopal, Madhya Pradesh",
    linkedin = "linkedin.com/in/kripal-singh",
    github = "github.com/kripal-singh",
    leetcode = "",
    geeksforgeeks = "",
    portfolio = "",
    summary = "",
    education = [],
    skills = [],
    experience = [],
    achievements = [],
  } = data;

  const links = [
    linkedin ? `<a href="${linkedin.startsWith("http") ? linkedin : "https://" + linkedin}">LinkedIn</a>` : "",
    github ? `<a href="${github.startsWith("http") ? github : "https://" + github}">GitHub</a>` : "",
    leetcode ? `<a href="${leetcode.startsWith("http") ? leetcode : "https://" + leetcode}">LeetCode</a>` : "",
    geeksforgeeks ? `<a href="${geeksforgeeks.startsWith("http") ? geeksforgeeks : "https://" + geeksforgeeks}">GeeksforGeeks</a>` : "",
    portfolio ? `<a href="${portfolio.startsWith("http") ? portfolio : "https://" + portfolio}">Portfolio</a>` : "",
  ].filter(Boolean).join(" &bull; ");

  const contactLine = [location, phone, email].filter(Boolean).join(" &bull; ");

  /* ── PROJECTS / EXPERIENCE ── */
  const rawExperience = experience && experience.length > 0 ? experience : DEFAULT_PROJECTS;
  const projectsToDisplay = rawExperience.length > 4 ? rawExperience.slice(0, 4) : rawExperience;
  const count = projectsToDisplay.length;

  let projectFontSize = "9.5px";
  let projectLineHeight = "1.38";
  let projectMarginBottom = "7px";
  let maxPoints = 4;

  if (count === 3) {
    projectFontSize = "9px";
    projectLineHeight = "1.34";
    projectMarginBottom = "5px";
    maxPoints = 4;
  } else if (count >= 4) {
    projectFontSize = "8.5px";
    projectLineHeight = "1.28";
    projectMarginBottom = "4px";
    maxPoints = 3;
  } else {
    projectFontSize = "9.5px";
    projectLineHeight = "1.38";
    projectMarginBottom = "7px";
    maxPoints = 4;
  }

  const expItems = projectsToDisplay.map((exp) => {
    const { titleStr, bodyText } = normalizeProjectForRender(exp, maxPoints);

    return `
      <li style="margin-bottom: ${projectMarginBottom}; font-size: ${projectFontSize}; line-height: ${projectLineHeight}; color: #374151; text-align: justify; list-style-type: disc;">
        <strong style="color: #111827; font-weight: 700;">${titleStr}</strong>${bodyText ? `, ${bodyText}` : ""}
      </li>
    `;
  }).join("");

  const expHtml = expItems
    ? `<ul style="margin: 2px 0 6px 16px; padding: 0; list-style-type: disc;">${expItems}</ul>`
    : "";

  /* ── EDUCATION ── */
  const eduHtml = (education || []).map((edu) => {
    const inst = edu.institution || "";
    const degreeText = edu.degree || edu.field ? `${edu.degree || ""}${edu.field ? " – " + edu.field : ""}` : "";
    const dateStr = (edu.startDate || "") + (edu.endDate ? " – " + edu.endDate : "");
    const gpa = (edu.gpa || "").trim();

    return `
      <div style="margin-bottom: 6px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 10px;">
          <strong style="color: #111827; font-weight: 700;">${inst}</strong>
          <span style="font-size: 9px; color: #6b7280;">${edu.location || ""}</span>
        </div>
        ${degreeText ? `
          <div style="display: flex; justify-content: space-between; align-items: baseline; font-style: italic; font-size: 9.5px; color: #4b5563; margin-top: 1px;">
            <span>${degreeText}</span>
            <span style="white-space: nowrap; margin-left: 8px;">${dateStr}</span>
          </div>` : ""}
        ${gpa ? `<div style="font-size: 9px; color: #4b5563; margin-top: 1px;">• ${gpa.startsWith("•") ? gpa.replace(/^•\s*/, "") : gpa}</div>` : ""}
      </div>
    `;
  }).join("");

  /* ── SKILLS ── */
  const parsedCategories = formatSkillsCategories(skills);
  const skillsHtml = parsedCategories.map((cat) => `
    <div style="margin-bottom: 2.5px; font-size: 9.5px; line-height: 1.35;">
      <b style="color: #000000; font-weight: 700;">${cat.name}:</b>
      <span style="color: #1f2937;">${cat.items.join(", ")}</span>
    </div>
  `).join("");

  /* ── ACHIEVEMENTS ── */
  const achievementsHtml = (achievements || []).map((ach) => {
    const text = typeof ach === "string" ? ach : ach.text || "";
    const colonIdx = text.indexOf(":");
    if (colonIdx > 0 && colonIdx < 45) {
      const label = text.substring(0, colonIdx).trim();
      const rest = text.substring(colonIdx + 1).trim();
      return `<div style="margin-bottom: 3.5px; font-size: 9.5px; line-height: 1.35; color: #1f2937; text-align: justify;"><b style="color: #000000; font-weight: 700;">${label}:</b> ${rest}</div>`;
    }
    return `<div style="margin-bottom: 3.5px; font-size: 9.5px; line-height: 1.35; color: #1f2937; text-align: justify;">${text}</div>`;
  }).join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <style>
        @page {
          size: A4;
          margin: 0.32in 0.4in;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Arial, sans-serif;
          font-size: 10px;
          line-height: 1.4;
          color: #1f2937;
          background: #ffffff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        h1 {
          font-size: 21px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.4px;
          margin-bottom: 3px;
        }
        .header-meta {
          font-size: 9px;
          color: #4b5563;
          margin-bottom: 2px;
        }
        .header-links {
          font-size: 9px;
          color: #2563eb;
          margin-bottom: 10px;
          padding-bottom: 6px;
          border-bottom: 1.5px solid #e2e8f0;
        }
        .header-links a {
          color: #2563eb;
          text-decoration: none;
        }
        .header-links a:hover {
          text-decoration: underline;
        }
        .section-title {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #000000;
          border-bottom: 1px solid #cbd5e1;
          padding-bottom: 2px;
          margin-top: 8px;
          margin-bottom: 4px;
        }
        .section-title:first-of-type {
          margin-top: 6px;
        }
        p.summary-text {
          font-size: 9.5px;
          line-height: 1.45;
          color: #334155;
          text-align: justify;
          margin-bottom: 6px;
        }
      </style>
    </head>
    <body>
      <h1>${name}</h1>
      <div class="header-meta">${contactLine}</div>
      <div class="header-links">${links}</div>

      ${summary ? `<div class="section-title">Profile Summary</div><p class="summary-text">${summary}</p>` : ""}
      ${eduHtml ? `<div class="section-title">Education</div>${eduHtml}` : ""}
      ${skillsHtml ? `<div class="section-title">Technical Skills</div><div>${skillsHtml}</div>` : ""}
      ${expHtml ? `<div class="section-title">Projects</div>${expHtml}` : ""}
      ${achievementsHtml ? `<div class="section-title">Achievements &amp; Problem Solving</div><div>${achievementsHtml}</div>` : ""}
    </body>
    </html>
  `;
};
export default minimalTemplate;
