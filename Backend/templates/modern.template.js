export const modernTemplate = (data = {}) => {
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
        <span><b style="font-weight: 700; color: #111827;">${exp.company || exp.title || ""}</b>${exp.title && exp.company && exp.title !== exp.company ? ` – <span style="font-weight:400; color:#4b5563;">${exp.title}</span>` : ""}</span>
        <span style="font-size: 10px; color: #6b7280; font-weight: 400;">${exp.startDate || ""} ${exp.endDate ? "– " + exp.endDate : ""}</span>
      </div>
      <ul style="margin: 2px 0 0 16px; padding: 0; color: #374151; list-style-type: disc;">
        ${(exp.bullets || []).map(b => `<li style="margin-bottom: 1.5px; line-height: 1.3; font-weight: 400;">${b}</li>`).join("")}
      </ul>
    </div>
  `).join("");

  const eduHtml = (education || []).map(edu => `
    <div style="margin-bottom: 5px;">
      <div style="display: flex; justify-content: space-between; font-weight: 700; color: #111827; font-size: 11px;">
        <span>${edu.institution || ""}</span>
        <span style="font-size: 10px; color: #6b7280;">${edu.location || ""}</span>
      </div>
      <div style="display: flex; justify-content: space-between; color: #4b5563; font-size: 10.5px;">
        <span>${edu.degree || ""} ${edu.field ? "in " + edu.field : ""}</span>
        <span style="font-size: 10px; color: #6b7280;">${edu.startDate || ""} ${edu.endDate ? "– " + edu.endDate : ""}</span>
      </div>
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
        body { font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 10px; line-height: 1.3; color: #1f2937; background: #fff; padding: 0; }
        h1 { font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 2px 0; letter-spacing: -0.5px; }
        .contact-bar { font-size: 9.5px; color: #4b5563; margin-bottom: 6px; }
        .section-header { font-size: 10.5px; font-weight: 800; text-transform: uppercase; color: #dc2626; border-bottom: 1.5px solid #fee2e2; padding-bottom: 2px; margin-top: 8px; margin-bottom: 4px; letter-spacing: 0.5px; }
        p { margin: 0 0 3px 0; color: #374151; }
      </style>
    </head>
    <body>
      <h1>${name}</h1>
      <div class="contact-bar">${[location, phone, email, linkedin, github].filter(Boolean).join(" • ")}</div>
      
      ${summary ? `<div class="section-header">Summary</div><p>${summary}</p>` : ""}
      ${expHtml ? `<div class="section-header">Experience</div>${expHtml}` : ""}
      ${eduHtml ? `<div class="section-header">Education</div>${eduHtml}` : ""}
      ${skillsText ? `<div class="section-header">Skills</div><div>${skillsText}</div>` : ""}
    </body>
    </html>
  `;
};
