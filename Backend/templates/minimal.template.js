export const minimalTemplate = (data = {}) => {
  const {
    name = "Applicant Name",
    email = "",
    phone = "",
    location = "",
    linkedin = "",
    github = "",
    summary = "",
    education = [],
    skills = [],
    experience = [],
  } = data || {};

  const expHtml = (experience || []).map(exp => `
    <div style="margin-bottom: 8px;">
      <div style="display: flex; justify-content: space-between; font-size: 11px; line-height: 1.3;">
        <span><b style="font-weight: 700; color: #000;">${exp.company || exp.title || ""}</b>${exp.title && exp.company && exp.title !== exp.company ? ` – <span style="font-weight: 400; color: #555;">${exp.title}</span>` : ""}</span>
        <span style="font-size: 10px; color: #666; font-weight: 400;">${exp.startDate || ""} ${exp.endDate ? "– " + exp.endDate : ""}</span>
      </div>
      <ul style="margin: 2px 0 0 16px; padding: 0; color: #444; list-style-type: disc;">
        ${(exp.bullets || []).map(b => `<li style="margin-bottom: 1.5px; line-height: 1.3; font-weight: 400;">${b}</li>`).join("")}
      </ul>
    </div>
  `).join("");

  const eduHtml = (education || []).map(edu => `
    <div style="margin-bottom: 5px;">
      <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 11px;">
        <span>${edu.institution || ""}</span>
        <span style="font-size: 10px; color: #666;">${edu.startDate || ""} ${edu.endDate ? "– " + edu.endDate : ""}</span>
      </div>
      <div style="color: #555; font-size: 10.5px;">${edu.degree || ""} ${edu.field ? "in " + edu.field : ""}</div>
    </div>
  `).join("");

  const skillsText = Array.isArray(skills) ? skills.join(", ") : (skills || "");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @page { size: A4; margin: 0.25in 0.35in; }
        * { box-sizing: border-box; page-break-inside: avoid; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; font-size: 10px; line-height: 1.3; color: #222; background: #fff; padding: 0; }
        h1 { font-size: 20px; font-weight: 700; margin: 0 0 2px 0; }
        .contact { font-size: 9.5px; color: #666; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
        .section { font-size: 10.5px; font-weight: 700; text-transform: uppercase; color: #888; margin-top: 8px; margin-bottom: 4px; letter-spacing: 0.5px; }
        p { margin: 0 0 3px 0; color: #333; }
      </style>
    </head>
    <body>
      <h1>${name}</h1>
      <div class="contact">${[location, phone, email, linkedin, github].filter(Boolean).join(" • ")}</div>
      
      ${summary ? `<div class="section">Summary</div><p>${summary}</p>` : ""}
      ${expHtml ? `<div class="section">Experience</div>${expHtml}` : ""}
      ${eduHtml ? `<div class="section">Education</div>${eduHtml}` : ""}
      ${skillsText ? `<div class="section">Skills</div><div>${skillsText}</div>` : ""}
    </body>
    </html>
  `;
};
