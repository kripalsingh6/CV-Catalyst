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
      if (!currentCat) currentCat = { name: "Core Skills", items: [] };
      const items = trimmed.split(",").map((i) => i.trim()).filter(Boolean);
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
    leetcode = "",
    geeksforgeeks = "",
    summary = "",
    education = [],
    skills = [],
    experience = [],
    achievements = [],
  } = data || {};

  /* ── PROJECTS / EXPERIENCE ─────────────────────────────────────────── */
  const deduplicatedExperience = (experience || []).map((exp) => {
    const uniqueBullets = Array.from(
      new Set((exp.bullets || []).map((b) => b.trim()))
    ).filter(Boolean);
    return { ...exp, bullets: uniqueBullets };
  });

  const expHtml = deduplicatedExperience
    .map((exp) => {
      const titleLine = [
        exp.company || exp.title || "",
        exp.title && exp.company && exp.title !== exp.company
          ? `<span style="font-weight:normal;"> \u2013 ${exp.title}</span>`
          : "",
        exp.subtitle
          ? ` | <i style="font-weight:normal;color:#000;">${exp.subtitle}</i>`
          : "",
      ].join("");

      const dateStr =
        (exp.startDate || "") +
        (exp.endDate ? " \u2013 " + exp.endDate : "");

      const bulletsHtml = (exp.bullets || [])
        .map(
          (b) =>
            `<li style="margin-bottom:2px;line-height:1.35;font-size:10px;">${b}</li>`
        )
        .join("");

      return `
<div style="margin-bottom:7px;">
  <div style="display:flex;justify-content:space-between;align-items:baseline;font-size:10.5px;line-height:1.4;">
    <span style="font-weight:bold;">${titleLine}</span>
    <span style="font-style:italic;font-weight:normal;white-space:nowrap;margin-left:8px;font-size:10px;">${dateStr}</span>
  </div>
  ${
    bulletsHtml
      ? `<ul style="margin:2px 0 0 18px;padding:0;list-style-type:disc;">${bulletsHtml}</ul>`
      : ""
  }
</div>`;
    })
    .join("");

  /* ── EDUCATION ──────────────────────────────────────────────────────── */
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

    const dateStr =
      (edu.startDate || "") + (edu.endDate ? " \u2013 " + edu.endDate : "");

    // GPA / Status bullet
    const rawGpa = (edu.gpa || "").trim();
    let gpaBullet = "";
    if (rawGpa) {
      gpaBullet = rawGpa.startsWith("\u2022")
        ? rawGpa
        : `\u2022 ${rawGpa}`;
    }

    if (!isSame) {
      prevInstitution = instName;
      eduHtmlList.push(`
<div style="margin-bottom:5px;">
  <div style="display:flex;justify-content:space-between;align-items:baseline;font-size:10.5px;line-height:1.4;">
    <span style="font-weight:bold;">${instName}</span>
    <span style="font-weight:normal;font-style:normal;white-space:nowrap;margin-left:8px;font-size:10px;">${edu.location || ""}</span>
  </div>
  ${
    degreeText
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
  ${
    degreeText
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

  /* ── SKILLS ─────────────────────────────────────────────────────────── */
  const parsedCategories = formatCategorizedSkills(skills);
  const skillsHtml = parsedCategories
    .map(
      (cat) =>
        `<div style="margin-bottom:2.5px;font-size:10px;line-height:1.35;"><b>${cat.name}:</b> ${cat.items.join(", ")}</div>`
    )
    .join("");

  /* ── ACHIEVEMENTS ───────────────────────────────────────────────────── */
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

  /* ── LINKS BAR ───────────────────────────────────────────────────────── */
  const linkEntries = [];
  if (linkedin) {
    const href = linkedin.startsWith("http") ? linkedin : "https://" + linkedin;
    linkEntries.push(`<a href="${href}">LinkedIn</a>`);
  }
  if (github) {
    const href = github.startsWith("http") ? github : "https://" + github;
    linkEntries.push(`<a href="${href}">GitHub</a>`);
  }
  // LeetCode
  if (leetcode) {
    const href = leetcode.startsWith("http") ? leetcode : "https://" + leetcode;
    linkEntries.push(`<a href="${href}">LeetCode</a>`);
  } else {
    linkEntries.push(`<a href="https://leetcode.com">LeetCode</a>`);
  }
  // GeeksforGeeks
  if (geeksforgeeks) {
    const href = geeksforgeeks.startsWith("http") ? geeksforgeeks : "https://" + geeksforgeeks;
    linkEntries.push(`<a href="${href}">GeeksforGeeks</a>`);
  } else {
    linkEntries.push(`<a href="https://geeksforgeeks.org">GeeksforGeeks</a>`);
  }

  const linksBarHtml = linkEntries.join(" | ");

  /* ── HTML OUTPUT ─────────────────────────────────────────────────────── */
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
    /* Matches the resume: "Professional Summary", "Education" etc.
       displayed with small-caps and a full horizontal rule beneath */
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

  <!-- TECHNICAL PROJECTS -->
  ${expHtml ? `<div class="section-header">Technical Projects</div>${expHtml}` : ""}

  <!-- ACHIEVEMENTS & PROBLEM SOLVING -->
  ${achievementsHtml ? `<div class="section-header">Achievements &amp; Problem Solving</div><div>${achievementsHtml}</div>` : ""}

</body>
</html>`;
};
