import {
  formatSkillsCategories,
  sanitizeResumeData,
  normalizeProjectForRender,
  DEFAULT_PROJECTS,
} from "../utils/sanitize-resume.js";

export const classicTemplate = (rawInput = {}) => {
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

  /* ── PROJECTS / EXPERIENCE ── */
  const rawExperience = experience && experience.length > 0 ? experience : DEFAULT_PROJECTS;
  const projectsToDisplay = rawExperience.length > 4 ? rawExperience.slice(0, 4) : rawExperience;
  const count = projectsToDisplay.length;

  let projectFontSize = "10px";
  let projectLineHeight = "1.4";
  let projectMarginBottom = "7px";
  let maxPoints = 4;

  if (count === 3) {
    projectFontSize = "9.5px";
    projectLineHeight = "1.34";
    projectMarginBottom = "5px";
    maxPoints = 4;
  } else if (count >= 4) {
    projectFontSize = "8.5px";
    projectLineHeight = "1.28";
    projectMarginBottom = "4px";
    maxPoints = 3;
  } else {
    projectFontSize = "10px";
    projectLineHeight = "1.4";
    projectMarginBottom = "7px";
    maxPoints = 4;
  }

  const expItems = projectsToDisplay.map((exp) => {
    const { titleStr, bodyText } = normalizeProjectForRender(exp, maxPoints);

    return `
<li style="margin-bottom:${projectMarginBottom};font-size:${projectFontSize};line-height:${projectLineHeight};text-align:justify;">
  <b style="font-weight:bold;">${titleStr}</b>${bodyText ? `, ${bodyText}` : ""}
</li>`;
  }).join("");

  const expHtml = expItems
    ? `<ul style="margin:2px 0 6px 18px;padding:0;list-style-type:disc;">${expItems}</ul>`
    : "";

  /* ── EDUCATION ── */
  const uniqueEducation = Array.from(
    new Set((education || []).map((e) => JSON.stringify(e)))
  ).map((s) => JSON.parse(s));

  const eduHtmlList = [];
  let prevInstitution = "";

  uniqueEducation.forEach((edu) => {
    const instName = (edu.institution || "").trim();
    const isSame =
      instName && instName.toLowerCase() === prevInstitution.toLowerCase();

    const degreeText =
      edu.degree && edu.degree !== "Degree / Program"
        ? `${edu.degree}${edu.field ? " \u2013 " + edu.field : ""}`
        : "";

    const startD = (edu.startDate || "").replace(/^[\s—–-]+|[\s—–-]+$/g, "").trim();
    const endD = (edu.endDate || "").replace(/^[\s—–-]+|[\s—–-]+$/g, "").trim();
    const dateStr = startD && endD ? `${startD} \u2013 ${endD}` : (startD || endD || "");

    // GPA / Status bullet
    const rawGpa = (edu.gpa || "")
      .replace(/\$/g, "")
      .replace(/\s*\|\s*/g, " | ")
      .replace(/^•\s*/, "")
      .replace(/^Status:\s*/i, "Status: ")
      .replace(/\s{2,}/g, " ")
      .trim();
    let gpaBullet = "";
    if (rawGpa) {
      gpaBullet = `\u2022 ${rawGpa}`;
    }

    if (!isSame) {
      prevInstitution = instName;
      eduHtmlList.push(`
<div style="margin-bottom:5px;">
  <div style="display:flex;justify-content:space-between;align-items:baseline;font-size:10.5px;line-height:1.4;">
    <span style="font-weight:bold;">${instName}</span>
    <span style="font-weight:normal;font-style:normal;white-space:nowrap;margin-left:8px;font-size:10px;">${edu.location || ""}</span>
  </div>
  ${degreeText
          ? `<div style="display:flex;justify-content:space-between;align-items:baseline;font-style:italic;font-size:10px;line-height:1.3;">
    <span>${degreeText}</span>
    <span style="white-space:nowrap;margin-left:8px;">${dateStr}</span>
  </div>`
          : ""
        }
  ${gpaBullet ? `<div style="font-size:10px;line-height:1.3;margin-top:1px;">${gpaBullet}</div>` : ""}
</div>`);
    } else {
      // Same institution — only show degree row (no repeated bold header)
      eduHtmlList.push(`
<div style="margin-bottom:4px;margin-top:-1px;">
  ${degreeText
          ? `<div style="display:flex;justify-content:space-between;align-items:baseline;font-style:italic;font-size:10px;line-height:1.3;">
    <span>${degreeText}</span>
    <span style="white-space:nowrap;margin-left:8px;">${dateStr}</span>
  </div>`
          : ""
        }
  ${gpaBullet ? `<div style="font-size:10px;line-height:1.3;margin-top:1px;">${gpaBullet}</div>` : ""}
</div>`);
    }
  });

  const eduHtml = eduHtmlList.join("");

  /* ── SKILLS ── */
  const parsedCategories = formatSkillsCategories(skills);
  const skillsHtml = parsedCategories
    .map(
      (cat) =>
        `<div style="margin-bottom:2.5px;font-size:10px;line-height:1.35;"><b>${cat.name}:</b> ${cat.items.join(", ")}</div>`
    )
    .join("");

  /* ── ACHIEVEMENTS ── */
  const achievementsHtml = (achievements || [])
    .map((ach) => {
      const text = typeof ach === "string" ? ach : ach.text || "";
      const colonIdx = text.indexOf(":");
      if (colonIdx > 0) {
        const label = text.substring(0, colonIdx).trim();
        const wordCount = label.split(/\s+/).length;
        if (wordCount <= 7) {
          const rest = text.substring(colonIdx + 1).trim();
          return `<div style="margin-bottom:4px;font-size:10px;line-height:1.35;text-align:justify;"><b>${label}:</b> ${rest}</div>`;
        }
      }
      return `<div style="margin-bottom:4px;font-size:10px;line-height:1.35;text-align:justify;">${text}</div>`;
    })
    .join("");

  /* ── LINKS BAR ── */
  const linkEntries = [];
  if (linkedin) {
    const href = linkedin.startsWith("http") ? linkedin : "https://" + linkedin;
    linkEntries.push(`<a href="${href}">LinkedIn</a>`);
  }
  if (github) {
    const href = github.startsWith("http") ? github : "https://" + github;
    linkEntries.push(`<a href="${href}">GitHub</a>`);
  }
  if (leetcode) {
    const href = leetcode.startsWith("http") ? leetcode : "https://" + leetcode;
    linkEntries.push(`<a href="${href}">LeetCode</a>`);
  }
  if (geeksforgeeks) {
    const href = geeksforgeeks.startsWith("http") ? geeksforgeeks : "https://" + geeksforgeeks;
    linkEntries.push(`<a href="${href}">GeeksforGeeks</a>`);
  }
  if (portfolio) {
    const href = portfolio.startsWith("http") ? portfolio : "https://" + portfolio;
    linkEntries.push(`<a href="${href}">Portfolio</a>`);
  }

  const linksBarHtml = linkEntries.join(" | ");

  /* ── HTML OUTPUT ── */
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    @page {
      size: A4;
      margin: 0.35in 0.45in;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      background: #fff;
      color: #000;
      font-family: "Georgia", "Times New Roman", serif;
      font-size: 10px;
      line-height: 1.35;
    }

    /* ── NAME ── */
    h1 {
      text-align: center;
      font-size: 22px;
      font-weight: bold;
      letter-spacing: 0.4px;
      margin-bottom: 3px;
    }

    /* ── CONTACT / LINKS ── */
    .contact-bar,
    .links-bar {
      text-align: center;
      font-size: 9.5px;
      line-height: 1.5;
    }
    .contact-bar {
      margin-bottom: 0px;
    }
    .links-bar {
      margin-bottom: 6px;
    }
    .links-bar a {
      color: #000;
      text-decoration: underline;
    }

    /* ── SECTION HEADER ── */
    .section-header {
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      border-bottom: 1px solid #000;
      padding-bottom: 1px;
      margin-top: 8px;
      margin-bottom: 4px;
    }

    /* ── BODY TEXT ── */
    p {
      font-size: 10px;
      line-height: 1.4;
      text-align: justify;
      margin-bottom: 3px;
    }

    b { font-weight: bold; }
    i { font-style: italic; }
    u { text-decoration: underline; }

    ul {
      list-style-type: disc;
      padding-left: 18px;
    }
    li {
      line-height: 1.35;
      font-size: 10px;
      margin-bottom: 2px;
    }
  </style>
</head>
<body>

  <!-- NAME -->
  <h1>${name}</h1>

  <!-- CONTACT LINE -->
  <div class="contact-bar">
    ${[location, phone, email ? `<u>${email}</u>` : ""].filter(Boolean).join(" | ")}
  </div>

  <!-- LINKS LINE -->
  <div class="links-bar">${linksBarHtml}</div>

  <!-- PROFESSIONAL SUMMARY -->
  ${summary ? `<div class="section-header">Professional Summary</div><p>${summary}</p>` : ""}

  <!-- EDUCATION -->
  ${eduHtml ? `<div class="section-header">Education</div>${eduHtml}` : ""}

  <!-- TECHNICAL SKILLS -->
  ${skillsHtml ? `<div class="section-header">Technical Skills</div><div>${skillsHtml}</div>` : ""}

  <!-- PROJECTS -->
  ${expHtml ? `<div class="section-header">Projects</div>${expHtml}` : ""}

  <!-- ACHIEVEMENTS & PROBLEM SOLVING -->
  ${achievementsHtml ? `<div class="section-header">Achievements &amp; Problem Solving</div><div>${achievementsHtml}</div>` : ""}

</body>
</html>`;
};
