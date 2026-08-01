const formatCategorizedSkills = (skillsInput) => {
  let lines = [];
  if (Array.isArray(skillsInput)) {
    lines = skillsInput.flatMap((s) => (typeof s === "string" ? s.split("\n") : [s]));
  } else if (typeof skillsInput === "string") {
    lines = skillsInput.split("\n");
  }

  const categories = [];
  let currentCat = null;

  for (const line of lines) {
    const trimmed = (line || "").trim();
    if (!trimmed) continue;

    if (trimmed.includes(":")) {
      if (currentCat) categories.push(currentCat);
      const [catName, ...valParts] = trimmed.split(":");
      currentCat = {
        name: catName.trim(),
        items: valParts.join(":").split(",").map((i) => i.trim()).filter(Boolean),
      };
    } else if (currentCat) {
      const items = trimmed.split(",").map((i) => i.trim()).filter(Boolean);
      currentCat.items.push(...items);
    } else {
      const items = trimmed.split(",").map((i) => i.trim()).filter(Boolean);
      if (!currentCat) {
        currentCat = { name: "Core Skills", items: [] };
      }
      currentCat.items.push(...items);
    }
  }
  if (currentCat) categories.push(currentCat);

  if (categories.length === 0) {
    return [{ name: "Core Skills", items: lines.map((l) => l.trim()).filter(Boolean) }];
  }

  return categories.map((cat) => ({
    name: cat.name,
    items: Array.from(new Set(cat.items)),
  }));
};

export const classicTemplate = (data = {}) => {
  const {
    name = "Kripal Singh Thakur",
    email = "thakurkripalsingh6@gmail.com",
    phone = "+91 8770534091",
    location = "Bhopal, Madhya Pradesh",
    linkedin = "linkedin.com/in/kripal-singh",
    github = "github.com/kripal-singh",
    summary = "",
    education = [],
    skills = [],
    experience = [],
    achievements = [],
  } = data || {};

  // Deduplicate Experience Bullets
  const deduplicatedExperience = (experience || []).map((exp) => {
    const uniqueBullets = Array.from(new Set((exp.bullets || []).map((b) => b.trim()))).filter(Boolean);
    return { ...exp, bullets: uniqueBullets };
  });

  const expHtml = deduplicatedExperience
    .map(
      (exp) => `
    <div style="margin-bottom: 6px;">
      <div style="display: flex; justify-content: space-between; font-size: 10.5px; line-height: 1.3;">
        <span><b>${exp.company || exp.title || ""}</b>${exp.title && exp.company && exp.title !== exp.company ? ` – <span style="font-weight: normal;">${exp.title}</span>` : ""}${exp.subtitle ? ` | <i style="font-weight: normal;">${exp.subtitle}</i>` : ""}</span>
        <span style="font-style: italic; font-weight: normal;">${exp.startDate || ""} ${exp.endDate ? "– " + exp.endDate : ""}</span>
      </div>
      <ul style="margin: 2px 0 0 16px; padding: 0; list-style-type: disc;">
        ${(exp.bullets || []).map((b) => `<li style="margin-bottom: 1.5px; line-height: 1.3; font-weight: normal;">${b}</li>`).join("")}
      </ul>
    </div>
  `
    )
    .join("");

  // Deduplicate Education & Group Repeated School Names
  const uniqueEducation = Array.from(
    new Set((education || []).map((e) => JSON.stringify(e)))
  ).map((s) => JSON.parse(s));

  const eduHtmlList = [];
  let prevInstitution = "";

  uniqueEducation.forEach((edu) => {
    const instName = (edu.institution || "").trim();
    const isSameInstitution = instName && instName.toLowerCase() === prevInstitution.toLowerCase();
    const degreeText = edu.degree && edu.degree !== "Degree / Program" ? `${edu.degree}${edu.field ? " in " + edu.field : ""}` : "";
    const cleanGpa = edu.gpa ? edu.gpa.replace(/^Status:\s*/i, "Status: ") : "";
    const gpaFormatted = cleanGpa ? (cleanGpa.startsWith("Status:") ? `• ${cleanGpa}` : `• Status: ${cleanGpa}`) : "";

    if (!isSameInstitution) {
      prevInstitution = instName;
      eduHtmlList.push(`
        <div style="margin-bottom: 5px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px;">
            <span><b>${instName}</b></span>
            <span style="font-weight: normal;">${edu.location || ""}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-style: italic; font-size: 10.5px;">
            <span>${degreeText}</span>
            <span>${edu.startDate || ""} ${edu.endDate ? "– " + edu.endDate : ""}</span>
          </div>
          ${gpaFormatted ? `<div style="font-size: 10px; margin-top: 1px;">${gpaFormatted}</div>` : ""}
        </div>
      `);
    } else {
      // Repeated school name — do not render header again or bold it!
      eduHtmlList.push(`
        <div style="margin-bottom: 5px; margin-top: -2px;">
          <div style="display: flex; justify-content: space-between; font-style: italic; font-size: 10.5px;">
            <span>${degreeText}</span>
            <span>${edu.startDate || ""} ${edu.endDate ? "– " + edu.endDate : ""}</span>
          </div>
          ${gpaFormatted ? `<div style="font-size: 10px; margin-top: 1px;">${gpaFormatted}</div>` : ""}
        </div>
      `);
    }
  });

  const eduHtml = eduHtmlList.join("");

  // Formatted Skills (single line per category)
  const parsedCategories = formatCategorizedSkills(skills);
  const skillsHtml = parsedCategories
    .map((cat) => `<div style="margin-bottom: 2px;"><b>${cat.name}:</b> ${cat.items.join(", ")}</div>`)
    .join("");

  // Achievements HTML
  const achievementsHtml = (achievements || [])
    .map((ach) => `<div style="margin-bottom: 3px;">• ${ach}</div>`)
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @page { size: A4; margin: 0.25in 0.35in; }
        * { box-sizing: border-box; page-break-inside: avoid; }
        html, body { margin: 0; padding: 0; }
        body { font-family: "Georgia", "Times New Roman", serif; font-size: 10px; line-height: 1.3; color: #000; background: #fff; }
        h1 { text-align: center; font-size: 20px; font-weight: bold; margin: 0 0 2px 0; letter-spacing: 0.2px; }
        .contact-bar { text-align: center; font-size: 9.5px; margin-bottom: 2px; }
        .contact-bar span { margin: 0 4px; }
        .links-bar { text-align: center; font-size: 9.5px; margin-bottom: 6px; }
        .links-bar a { color: #000; text-decoration: underline; margin: 0 4px; }
        .section-header { font-size: 10.5px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 1px; margin-top: 6px; margin-bottom: 4px; letter-spacing: 0.5px; }
        p { margin: 0 0 3px 0; text-align: justify; }
        b { font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>${name}</h1>
      <div class="contact-bar">${[location, phone, email].filter(Boolean).map(item => item === email ? `<u>${item}</u>` : item).join(" | ")}</div>
      <div class="links-bar">
        <a href="${linkedin.startsWith('http') ? linkedin : 'https://' + linkedin}"><u>LinkedIn</u></a> | 
        <a href="${github.startsWith('http') ? github : 'https://' + github}"><u>GitHub</u></a> | 
        <a href="https://leetcode.com"><u>LeetCode</u></a> | 
        <a href="https://geeksforgeeks.org"><u>GeeksforGeeks</u></a>
      </div>
      
      ${summary ? `<div class="section-header">PROFESSIONAL SUMMARY</div><p>${summary}</p>` : ""}
      ${eduHtml ? `<div class="section-header">EDUCATION</div>${eduHtml}` : ""}
      ${skillsHtml ? `<div class="section-header">TECHNICAL SKILLS</div><div>${skillsHtml}</div>` : ""}
      ${expHtml ? `<div class="section-header">TECHNICAL PROJECTS</div>${expHtml}` : ""}
      ${achievementsHtml ? `<div class="section-header">ACHIEVEMENTS & PROBLEM SOLVING</div><div>${achievementsHtml}</div>` : ""}
    </body>
    </html>
  `;
};
