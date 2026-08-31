const formatSkillsCategories = (skillsInput) => {
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

  return categories;
};

export const modernTemplate = (data = {}) => {
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

  /* ── EXPERIENCE / PROJECTS ─────────────────────────────────────────── */
  const expHtml = (experience || [])
    .map((exp) => {
      const titleStr = exp.company || exp.title || "Project";
      const subtitleStr =
        exp.title && exp.company && exp.title !== exp.company ? exp.title : "";
      const dateStr =
        (exp.startDate || "") + (exp.endDate ? " – " + exp.endDate : "");

      const bulletsHtml = (exp.bullets || [])
        .map(
          (b) =>
            `<li style="margin-bottom:2px;line-height:1.35;font-size:9.5px;">${b}</li>`
        )
        .join("");

      return `
<div style="margin-bottom:8px;">
  <div style="display:flex;justify-content:space-between;align-items:baseline;font-size:10px;line-height:1.3;">
    <span style="font-weight:700;color:#0f172a;">${titleStr}${
        subtitleStr ? `<span style="font-weight:400;color:#475569;"> – ${subtitleStr}</span>` : ""
      }</span>
    <span style="font-size:8.5px;color:#64748b;white-space:nowrap;margin-left:6px;">${dateStr}</span>
  </div>
  ${
    bulletsHtml
      ? `<ul style="margin:2px 0 0 14px;padding:0;color:#334155;list-style-type:disc;">${bulletsHtml}</ul>`
      : ""
  }
</div>`;
    })
    .join("");

  /* ── EDUCATION ──────────────────────────────────────────────────────── */
  const eduHtml = (education || [])
    .map((edu) => {
      const inst = edu.institution || "";
      const degreeText =
        edu.degree || edu.field
          ? `${edu.degree || ""}${edu.field ? " – " + edu.field : ""}`
          : "";
      const dateStr =
        (edu.startDate || "") + (edu.endDate ? " – " + edu.endDate : "");
      const gpa = (edu.gpa || "").trim();

      return `
<div style="margin-bottom:6px;">
  <div style="display:flex;justify-content:space-between;align-items:baseline;font-size:10px;">
    <span style="font-weight:700;color:#0f172a;">${inst}</span>
    <span style="font-size:8.5px;color:#64748b;">${edu.location || ""}</span>
  </div>
  ${
    degreeText
      ? `<div style="display:flex;justify-content:space-between;align-items:baseline;font-style:italic;font-size:9px;color:#475569;margin-top:1px;">
    <span>${degreeText}</span>
    <span style="white-space:nowrap;">${dateStr}</span>
  </div>`
      : ""
  }
  ${
    gpa
      ? `<div style="font-size:8.5px;color:#475569;margin-top:1px;">• ${
          gpa.startsWith("•") ? gpa.replace(/^•\s*/, "") : gpa
        }</div>`
      : ""
  }
</div>`;
    })
    .join("");

  /* ── ACHIEVEMENTS ───────────────────────────────────────────────────── */
  const achievementsHtml = (achievements || [])
    .map((ach) => {
      const text = typeof ach === "string" ? ach : ach.text || "";
      const colonIdx = text.indexOf(":");
      if (colonIdx > 0 && colonIdx < 45) {
        const label = text.substring(0, colonIdx).trim();
        const rest = text.substring(colonIdx + 1).trim();
        return `<div style="margin-bottom:4px;font-size:9.5px;line-height:1.35;color:#334155;text-align:justify;"><b style="color:#0f172a;">${label}:</b> ${rest}</div>`;
      }
      return `<div style="margin-bottom:4px;font-size:9.5px;line-height:1.35;color:#334155;text-align:justify;">${text}</div>`;
    })
    .join("");

  /* ── SIDEBAR SKILLS ─────────────────────────────────────────────────── */
  const parsedCategories = formatSkillsCategories(skills);
  const sidebarSkillsHtml = parsedCategories
    .map((cat) => {
      const badges = cat.items
        .map(
          (item) =>
            `<span style="display:inline-block;background:#1e293b;color:#f1f5f9;border:1px solid #334155;padding:2px 6px;border-radius:4px;font-size:8px;font-weight:500;margin-right:3px;margin-bottom:4px;">${item}</span>`
        )
        .join("");
      return `
<div style="margin-bottom:8px;">
  <div style="font-size:8.5px;font-weight:700;color:#f97316;text-transform:uppercase;margin-bottom:3px;">${cat.name}</div>
  <div>${badges}</div>
</div>`;
    })
    .join("");

  /* ── SIDEBAR CONTACT LINKS ──────────────────────────────────────────── */
  const contactItems = [
    email ? `<div style="margin-bottom:4px;font-size:9px;color:#cbd5e1;word-break:break-all;">✉ ${email}</div>` : "",
    phone ? `<div style="margin-bottom:4px;font-size:9px;color:#cbd5e1;">📱 ${phone}</div>` : "",
    location ? `<div style="margin-bottom:4px;font-size:9px;color:#cbd5e1;">📍 ${location}</div>` : "",
    linkedin ? `<div style="margin-bottom:4px;font-size:9px;color:#cbd5e1;"><a href="${linkedin.startsWith("http") ? linkedin : "https://" + linkedin}" style="color:#cbd5e1;text-decoration:underline;">LinkedIn</a></div>` : "",
    github ? `<div style="margin-bottom:4px;font-size:9px;color:#cbd5e1;"><a href="${github.startsWith("http") ? github : "https://" + github}" style="color:#cbd5e1;text-decoration:underline;">GitHub</a></div>` : "",
    leetcode ? `<div style="margin-bottom:4px;font-size:9px;color:#cbd5e1;"><a href="${leetcode.startsWith("http") ? leetcode : "https://" + leetcode}" style="color:#cbd5e1;text-decoration:underline;">LeetCode</a></div>` : "",
    geeksforgeeks ? `<div style="margin-bottom:4px;font-size:9px;color:#cbd5e1;"><a href="${geeksforgeeks.startsWith("http") ? geeksforgeeks : "https://" + geeksforgeeks}" style="color:#cbd5e1;text-decoration:underline;">GeeksforGeeks</a></div>` : "",
  ].filter(Boolean).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 100%;
      height: 100%;
      background: #ffffff;
      font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      font-size: 10px;
      color: #1e293b;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    table.layout-container {
      width: 100%;
      height: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    td.sidebar {
      width: 32%;
      background: #0f172a;
      color: #f8fafc;
      padding: 24px 16px;
      vertical-align: top;
    }

    td.content {
      width: 68%;
      background: #f8fafc;
      color: #0f172a;
      padding: 24px 20px;
      vertical-align: top;
    }

    h1.name {
      font-size: 18px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.2;
      margin-bottom: 2px;
      letter-spacing: -0.3px;
    }

    .title-subtitle {
      font-size: 9px;
      font-weight: 700;
      color: #f97316;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 14px;
    }

    .sidebar-header {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #94a3b8;
      border-bottom: 1px solid #334155;
      padding-bottom: 2px;
      margin-top: 14px;
      margin-bottom: 6px;
    }

    .main-header {
      font-size: 10.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #0f172a;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 2px;
      margin-top: 12px;
      margin-bottom: 6px;
    }
    .main-header:first-child {
      margin-top: 0;
    }
  </style>
</head>
<body>

<table class="layout-container">
  <tr>
    <!-- LEFT DARK SIDEBAR -->
    <td class="sidebar">
      <h1 class="name">${name}</h1>
      <div class="title-subtitle">Full-Stack Software Engineer</div>

      <div class="sidebar-header">Contact &amp; Links</div>
      <div>${contactItems}</div>

      ${sidebarSkillsHtml ? `<div class="sidebar-header">Skills</div><div>${sidebarSkillsHtml}</div>` : ""}
    </td>

    <!-- RIGHT MAIN CONTENT -->
    <td class="content">
      ${summary ? `<div class="main-header">Profile Summary</div><p style="font-size:9.5px;line-height:1.4;color:#334155;text-align:justify;margin-bottom:8px;">${summary}</p>` : ""}

      ${expHtml ? `<div class="main-header">Experience &amp; Projects</div>${expHtml}` : ""}

      ${eduHtml ? `<div class="main-header">Education</div>${eduHtml}` : ""}

      ${achievementsHtml ? `<div class="main-header">Achievements &amp; Problem Solving</div>${achievementsHtml}` : ""}
    </td>
  </tr>
</table>

</body>
</html>`;
};
