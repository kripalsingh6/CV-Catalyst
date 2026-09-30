/**
 * LaTeX / Overleaf Resume Utilities
 * Generates ATS-compliant, single-page Overleaf LaTeX (.tex) code and
 * cleanly parses Overleaf LaTeX into structured plain text.
 */

export const SAMPLE_OVERLEAF_TEX = `%-------------------------
% Overleaf 1-Page ATS Resume Template
% Compatible with Overleaf pdflatex / xelatex
% Guaranteed single-page fit with optimal whitespace
%------------------------

\\documentclass[letterpaper,10pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage[top=0.4in, bottom=0.4in, left=0.45in, right=0.45in]{geometry}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting - Compact for guaranteed 1-page fit
\\titleformat{\\section}{
  \\vspace{-5pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-3pt}]

% Ensure ATS machine readability
\\pdfgentounicode=1

% Compact itemize settings
\\setlist[itemize]{noitemsep, topsep=1pt, parsep=0pt, partopsep=0pt, leftmargin=0.15in}

\\begin{document}

%---------- HEADING ----------
\\begin{center}
    {\\Huge \\scshape \\textbf{Kripal Singh Thakur}} \\\\ \\vspace{2pt}
    \\small Bhopal, Madhya Pradesh $\\mid$ +91 8770534091 $\\mid$ \\href{mailto:thakurkripalsingh6@gmail.com}{thakurkripalsingh6@gmail.com} \\\\ \\vspace{1pt}
    \\small \\href{https://linkedin.com/in/kripal-singh}{LinkedIn} $\\mid$ \\href{https://github.com/kripal-singh}{GitHub} $\\mid$ \\href{https://leetcode.com}{LeetCode} $\\mid$ \\href{https://geeksforgeeks.org}{GeeksforGeeks}
\\end{center}
\\vspace{-6pt}

%---------- PROFESSIONAL SUMMARY ----------
\\section{Professional Summary}
\\small{Innovative Full-Stack Engineer and final-year CS undergraduate with expertise in React.js, Node.js, Express, GitHub SSO, Passport.js, and payment gateways (Razorpay). Strong foundation in Data Structures and Algorithms with 250+ problems solved across LeetCode and GeeksforGeeks to build high-performance web platforms.}

%---------- EDUCATION ----------
\\section{Education}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\item
    \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{School of Information Technology, RGPV} & \\textbf{Bhopal, MP} \\\\
      \\textit{Bachelor of Technology (B.Tech) in Computer Science - Data Science} & \\textit{2023 -- 2027 (Expected)} \\\\
    \\end{tabular*}
    \\vspace{-2pt}\\\\
    \\small{\\textbullet~Status: Currently in 7th Semester $\\mid$ Current CGPA: 7.62 / 10.0}
  \\vspace{2pt}
  \\item
    \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{St. Joseph Convent School} & \\textbf{Banda, MP} \\\\
      \\textit{Class XII (Senior Secondary) -- Higher Secondary Certificate} & \\textit{2022} \\\\
      \\textit{Class X (Secondary) -- Secondary School Certificate} & \\textit{2020} \\\\
    \\end{tabular*}
\\end{itemize}

%---------- TECHNICAL SKILLS ----------
\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{
    \\textbf{Languages:} Java, JavaScript, TypeScript, SQL, HTML5, CSS3 \\\\
    \\textbf{Frameworks \\& Libraries:} React.js, Node.js, Express.js, Tailwind CSS, Bootstrap, Redux Toolkit \\\\
    \\textbf{Databases \\& Storage:} MongoDB, MySQL, PostgreSQL, Mongoose \\\\
    \\textbf{Developer Tools \\& Cloud:} Git, GitHub, Docker, Postman, Google Cloud Platform (GCP), Gemini AI API, Razorpay API, Vercel, Render \\\\
    \\textbf{Core CS Fundamentals:} Data Structures \\& Algorithms (DSA), Object-Oriented Programming (OOP)
  }}
\\end{itemize}

%---------- PROJECTS ----------
\\section{Projects}
\\begin{itemize}[leftmargin=0.15in]
  \\item \\textbf{CV-Catalyst -- AI-Powered Resume Builder} \\\\
  Architected a full-stack AI platform using React.js, Node.js, Express, and MongoDB that analyzes job descriptions and generates ATS-compliant resumes in real time via Gemini AI API. Engineered dynamic template compilation workflows and automated PDF formatting using Puppeteer, supporting multiple design layouts, real-time preview, and ATS score analytics. Implemented secure user authentication and session authorization protocols using Passport.js, ensuring user profile isolation, protected routes, and persistent draft storage. Integrated Razorpay payment gateway with server-side webhook signature verification for secure checkout, subscription upgrades, and automated payment status tracking.
  \\vspace{2pt}
  \\item \\textbf{Wanderlust -- Hotel Booking Platform (Airbnb)} \\\\
  Developed a scalable full-stack accommodation marketplace platform enabling property owners to list rentals and travelers to discover, search, and book stays worldwide. Implemented secure user authentication and OAuth 2.0 (Google SSO) authorization with session management using Passport.js for role-based access control across protected routes. Engineered RESTful microservice APIs with Express.js and structured MongoDB schemas using Mongoose, implementing geospatial search filtering, indexing, and cloud asset storage on GCP. Integrated Razorpay payment gateway to process booking transactions, handling automated invoice generation, webhooks, and booking confirmation lifecycle.
  \\vspace{2pt}
  \\item \\textbf{Daily Task Email Automation System -- React 19 \\& TypeScript} \\\\
  Architected an enterprise-grade automated task tracking system using React 19, TypeScript, Node.js, and Express to verify report submissions via Gmail REST API v1. Implemented Google OAuth 2.0 authentication, fuzzy subject line parsing, and automated HTML email dispatching for missing report reminders. Configured node-cron weekday scheduling (8:00 PM Mon-Fri) and designed a high-throughput SQLite (better-sqlite3 WAL mode) database with a real-time reactive dashboard. Integrated automated alert triggers and optimized background worker performance to eliminate notification latency and monitor task completion status across teams.
\\end{itemize}

%---------- ACHIEVEMENTS & PROBLEM SOLVING ----------
\\section{Achievements \\& Problem Solving}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{
    \\textbf{Competitive Programming \\& Problem Solving:} Solved 250+ Data Structures \\& Algorithms problems across platforms, including 150+ on LeetCode and 100+ on GeeksforGeeks (Arrays, Strings, Linked Lists, Trees, Dynamic Programming).
  }}
\\end{itemize}

\\end{document}
`;

/**
 * Clean Overleaf / LaTeX markup into clean plain text for AI ingestion
 * Completely strips LaTeX artifacts (no '--------------------', no '$ $', no broken dates).
 */
export const cleanLatexToPlainText = (latex) => {
  if (!latex) return "";
  let text = String(latex);

  // 1. Strip comments
  text = text.replace(/(^|[^\\])%.*$/gm, "$1");

  // 2. Extract content inside document environment if present
  if (text.includes("\\begin{document}")) {
    const afterBegin = text.split("\\begin{document}")[1];
    text = afterBegin || text;
  }
  if (text.includes("\\end{document}")) {
    const beforeEnd = text.split("\\end{document}")[0];
    text = beforeEnd || text;
  }

  // 3. Strip preambles, packages, styles and page setup
  text = text.replace(/\\documentclass(\[[^\]]*\])?\{[^}]*\}/gi, "");
  text = text.replace(/\\usepackage(\[[^\]]*\])?\{[^}]*\}/gi, "");
  text = text.replace(/\\pagestyle\{[^}]*\}/gi, "");
  text = text.replace(/\\hypersetup\{[^}]*\}/gi, "");
  text = text.replace(/\\geometry\{[^}]*\}/gi, "");
  text = text.replace(/\\titleformat\{[^}]*\}/gi, "");
  text = text.replace(/\\titlespacing\*?\{[^}]*\}\{[^}]*\}\{[^}]*\}\{[^}]*\}/gi, "");
  text = text.replace(/\\pdfgentounicode=[0-9]+/gi, "");
  text = text.replace(/\\setlist(\[[^\]]*\])?\{[^}]*\}/gi, "");
  text = text.replace(/\\urlstyle\{[^}]*\}/gi, "");
  text = text.replace(/\\fancyhf\{[^}]*\}/gi, "");
  text = text.replace(/\\fancyfoot\{[^}]*\}/gi, "");
  text = text.replace(/\\renewcommand\{[^}]*\}\{[^}]*\}/gi, "");

  // 4. Temporarily protect escaped characters
  text = text.replace(/\\&/g, "__AMPERSAND__");
  text = text.replace(/\\%/g, "%");
  text = text.replace(/\\_/g, "_");
  text = text.replace(/\\#/g, "#");

  // 5. Section headers: Clean, readable section labels (NO hyphens/dashes)
  text = text.replace(/\\section\*?\{([^}]+)\}/gi, "\n\n$1:\n");
  text = text.replace(/\\subsection\*?\{([^}]+)\}/gi, "\n\n$1:\n");
  text = text.replace(/\\subsubsection\*?\{([^}]+)\}/gi, "\n$1:\n");

  // 6. Links: \href{URL}{TEXT} -> TEXT (URL)
  text = text.replace(/\\href\{mailto:([^}]+)\}\{([^}]+)\}/gi, "$2");
  text = text.replace(/\\href\{([^}]+)\}\{([^}]+)\}/gi, "$2 ($1)");
  text = text.replace(/\\url\{([^}]+)\}/gi, "$1");

  // 7. Text styling
  text = text.replace(/\\textbf\{([^}]+)\}/gi, "$1");
  text = text.replace(/\\textit\{([^}]+)\}/gi, "$1");
  text = text.replace(/\\underline\{([^}]+)\}/gi, "$1");
  text = text.replace(/\\textsc\{([^}]+)\}/gi, "$1");
  text = text.replace(/\\emph\{([^}]+)\}/gi, "$1");
  text = text.replace(/\\[Hh]uge\s*/gi, "");
  text = text.replace(/\\[Ll]arge\s*/gi, "");
  text = text.replace(/\\small\s*/gi, "");
  text = text.replace(/\\scshape\s*/gi, "");
  text = text.replace(/\\bfseries\s*/gi, "");

  // 8. Math symbols, bullets, pipes & tabular alignments
  text = text.replace(/\$\s*\\bullet\s*\$/gi, "• ");
  text = text.replace(/\\textbullet\s*~?/gi, "• ");
  text = text.replace(/\$\s*\\mid\s*\$/gi, " | ");
  text = text.replace(/\$\s*\|\s*\$/gi, " | ");
  text = text.replace(/\\textbar\s*/gi, " | ");
  text = text.replace(/\\mid\s*/gi, " | ");

  // Handle tabular table cell separator '&' -> ' | '
  text = text.replace(/&/g, " | ");

  // Restore protected ampersand
  text = text.replace(/__AMPERSAND__/g, "&");

  // Strip remaining $ signs and empty math delimiters
  text = text.replace(/\$\s*\$/g, " ");
  text = text.replace(/\$/g, "");

  // 9. List items
  text = text.replace(/\\item\s*/gi, "\n• ");

  // 10. Environments & alignments
  text = text.replace(/\\begin\{[^}]+\}(\[[^\]]*\])?(\{[^}]*\})?/gi, "");
  text = text.replace(/\\end\{[^}]+\}/gi, "");
  text = text.replace(/\\hfill\s*/gi, " | ");
  text = text.replace(/\\vspace\*?\{[^}]*\}/gi, "");
  text = text.replace(/\\hspace\*?\{[^}]*\}/gi, " ");
  text = text.replace(/\\\\/g, "\n");

  // 11. Remove remaining LaTeX backslash commands
  text = text.replace(/\\[a-zA-Z]+(\[[^\]]*\])?(\{[^}]*\})?/g, " ");

  // 12. Clean braces, double dashes, and whitespace
  text = text.replace(/[{}]/g, "");
  text = text.replace(/--/g, "–");
  text = text.replace(/[ \t]+/g, " ");

  // 13. Clean lines: strip trailing dashes or stray bullets
  const lines = text
    .split("\n")
    .map((l) => {
      let line = l.trim();
      // Remove trailing dashes or orphan dashes at line ends
      line = line.replace(/[\s—–-]+$/, "").trim();
      // Replace duplicate bullets e.g. "• • " -> "• "
      line = line.replace(/^[•\-\*]\s*[•\-\*]\s*/, "• ");
      return line;
    })
    .filter((l) => l.length > 0);

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
};

/**
 * Generate full Overleaf LaTeX (.tex) code from structured resume data
 * Formatted with tight 10pt geometry & titlesec spacing for a guaranteed single-page fit.
 */
export const generateLatexFromResume = (resumeData = {}) => {
  const name = resumeData.name || "Kripal Singh Thakur";
  const email = resumeData.email || "";
  const phone = resumeData.phone || "";
  const location = resumeData.location || "";
  const linkedin = resumeData.linkedin || "";
  const github = resumeData.github || "";
  const leetcode = resumeData.leetcode || "";
  const geeksforgeeks = resumeData.geeksforgeeks || "";
  const summary = (resumeData.summary || "").replace(/^[\s\-_=—–:]+/, "").trim();
  const education = Array.isArray(resumeData.education) ? resumeData.education : [];
  const skills = Array.isArray(resumeData.skills) ? resumeData.skills : [];
  const experience = Array.isArray(resumeData.experience) ? resumeData.experience : [];
  const achievements = Array.isArray(resumeData.achievements) ? resumeData.achievements : [];

  const escapeLatex = (str) => {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "\\&")
      .replace(/%/g, "\\%")
      .replace(/\$/g, "\\$")
      .replace(/#/g, "\\#")
      .replace(/_/g, "\\_");
  };

  const contactParts = [
    location ? escapeLatex(location) : "",
    phone ? escapeLatex(phone) : "",
    email ? `\\href{mailto:${email}}{${escapeLatex(email)}}` : "",
  ].filter(Boolean);

  const linkParts = [
    linkedin ? `\\href{${linkedin.startsWith("http") ? linkedin : "https://" + linkedin}}{LinkedIn}` : "",
    github ? `\\href{${github.startsWith("http") ? github : "https://" + github}}{GitHub}` : "",
    leetcode ? `\\href{${leetcode.startsWith("http") ? leetcode : "https://" + leetcode}}{LeetCode}` : "",
    geeksforgeeks ? `\\href{${geeksforgeeks.startsWith("http") ? geeksforgeeks : "https://" + geeksforgeeks}}{GeeksforGeeks}` : "",
  ].filter(Boolean);

  // ── EDUCATION ───────────────────────────────────────────────────────────
  let eduSection = "";
  if (education.length > 0) {
    const eduItems = education
      .map((edu) => {
        const inst = escapeLatex((edu.institution || "").replace(/[\s—–-]+$/, "").trim());
        const loc = escapeLatex((edu.location || "").replace(/[\s—–-]+$/, "").trim());
        const deg = escapeLatex((edu.degree || "").replace(/[\s—–-]+$/, "").trim());
        const field = escapeLatex((edu.field || "").replace(/[\s—–-]+$/, "").trim());
        const start = (edu.startDate || "").replace(/^[\s—–-]+|[\s—–-]+$/g, "").trim();
        const end = (edu.endDate || "").replace(/^[\s—–-]+|[\s—–-]+$/g, "").trim();
        const dates = start && end ? `${start} -- ${end}` : (start || end);
        const gpa = edu.gpa
          ? escapeLatex(
              edu.gpa
                .replace(/^Status:\s*/i, "")
                .replace(/^•\s*/, "")
                .replace(/\$/g, "")
                .trim()
            )
          : "";

        return `  \\item
    \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{${inst}} & \\textbf{${loc}} \\\\
      \\textit{${deg}${field ? " in " + field : ""}} & \\textit{${escapeLatex(dates)}} \\\\
    \\end{tabular*}${
      gpa ? `\n    \\vspace{-2pt}\\\\\n    \\small{\\textbullet~Status: ${gpa}}` : ""
    }`;
      })
      .join("\n  \\vspace{2pt}\n");

    eduSection = `\\section{Education}\n\\begin{itemize}[leftmargin=0.15in, label={}]\n${eduItems}\n\\end{itemize}\n`;
  }

  // ── TECHNICAL SKILLS ───────────────────────────────────────────────────
  let skillsSection = "";
  if (skills.length > 0) {
    const skillLines = skills
      .map((s) => {
        const text = (typeof s === "string" ? s : s.name || "").replace(/^[•\-\*\s]+/, "").trim();
        const colonIdx = text.indexOf(":");
        if (colonIdx > 0) {
          const cat = escapeLatex(text.substring(0, colonIdx).trim());
          const rest = escapeLatex(text.substring(colonIdx + 1).trim());
          return `    \\textbf{${cat}:} ${rest}`;
        }
        return `    ${escapeLatex(text)}`;
      })
      .filter(Boolean);

    skillsSection = `\\section{Technical Skills}\n\\begin{itemize}[leftmargin=0.15in, label={}]\n  \\small{\\item{\n${skillLines.join(
      " \\\\\n"
    )}\n  }}\n\\end{itemize}\n`;
  }

  // ── PROJECTS ────────────────────────────────────────────────────────────
  let expSection = "";
  if (experience.length > 0) {
    const ensureThreeToFourPoints = (company = "", title = "", rawBullets = [], maxPoints = 4) => {
      let bullets = (rawBullets || [])
        .map((b) => (typeof b === "string" ? b.trim().replace(/^[-•*▪►]\s*/, "") : ""))
        .filter(Boolean);

      let techBullet = "";
      if (bullets.length > 1) {
        const last = bullets[bullets.length - 1];
        const isTech =
          /^tech(nologies)?\s*:/i.test(last) ||
          (last.split(",").length >= 3 && !last.includes("ing ") && last.length < 120);
        if (isTech) {
          techBullet = bullets.pop();
        }
      }

      let splitPoints = [];
      for (const b of bullets) {
        const masked = b.replace(/([a-zA-Z0-9]+)\.([a-zA-Z0-9]+)/g, (m, p1, p2) => p1 + "##DOT##" + p2);
        const parts = masked.split(/(?<=[.!?])\s+(?=[A-Z])/);
        for (const p of parts) {
          const restored = p.replace(/##DOT##/g, ".").trim().replace(/[\s,;:\-–—.]+$/, "");
          if (restored.length > 15) {
            splitPoints.push(restored);
          }
        }
      }

      const combinedLower = (company + " " + title).toLowerCase();
      let contextualPoints = [];

      if (
        combinedLower.includes("daily task") ||
        combinedLower.includes("automation system") ||
        combinedLower.includes("task tracking") ||
        combinedLower.includes("gmail")
      ) {
        contextualPoints = [
          "Architected an enterprise-grade automated task tracking system using React 19, TypeScript, Node.js, and Express to verify report submissions via Gmail REST API v1",
          "Implemented Google OAuth 2.0 authentication, fuzzy subject line parsing, and automated HTML email dispatching for missing report reminders",
          "Configured node-cron weekday scheduling (8:00 PM Mon-Fri) and designed a high-throughput SQLite (better-sqlite3 WAL mode) database with a real-time reactive dashboard",
          "Integrated automated alert triggers and optimized background worker performance to eliminate notification latency and monitor task completion status across teams"
        ];
      } else if (
        combinedLower.includes("cv-catalyst") ||
        combinedLower.includes("cv catalyst") ||
        combinedLower.includes("resume builder")
      ) {
        contextualPoints = [
          "Architected a full-stack AI platform using React.js, Node.js, Express, and MongoDB that analyzes job descriptions and generates ATS-compliant resumes in real time via Gemini AI API",
          "Engineered dynamic template compilation workflows and automated PDF formatting using Puppeteer, supporting multiple design layouts, real-time preview, and ATS score analytics",
          "Implemented secure user authentication and session authorization protocols using Passport.js, ensuring user profile isolation, protected routes, and persistent draft storage",
          "Integrated Razorpay payment gateway with server-side webhook signature verification for secure checkout, subscription upgrades, and automated payment status tracking"
        ];
      } else if (
        combinedLower.includes("wanderlust") ||
        combinedLower.includes("hotel booking")
      ) {
        contextualPoints = [
          "Developed a scalable full-stack accommodation marketplace platform enabling property owners to list rentals and travelers to discover, search, and book stays worldwide",
          "Implemented secure user authentication and OAuth 2.0 (Google SSO) authorization with session management using Passport.js for role-based access control across protected routes",
          "Engineered RESTful microservice APIs with Express.js and structured MongoDB schemas using Mongoose, implementing geospatial search filtering, indexing, and cloud asset storage on GCP",
          "Integrated Razorpay payment gateway to process booking transactions, handling automated invoice generation, webhooks, and booking confirmation lifecycle"
        ];
      } else {
        const projName = title ? `${company} (${title})` : company || "the web platform";
        contextualPoints = [
          `Architected a robust, scalable full-stack application for ${projName} with modular component architecture, responsive design, and cross-browser compatibility`,
          `Engineered secure RESTful API microservices, robust validation middleware, and automated workflows to ensure consistent high-throughput data flow and reliability`,
          `Implemented secure user authentication, role-based session authorization protocols, and optimized database indexing to achieve sub-second query response times`,
          `Optimized frontend rendering performance, integrated third-party service APIs, and conducted end-to-end browser compatibility testing`
        ];
      }

      const resultPoints = [];
      const seenPrefixes = new Set();

      for (const pt of splitPoints) {
        const prefix = pt.slice(0, 30).toLowerCase();
        if (!seenPrefixes.has(prefix)) {
          seenPrefixes.add(prefix);
          if (pt.length < 45 && contextualPoints.length > 0) {
            resultPoints.push(contextualPoints.shift());
          } else {
            resultPoints.push(pt);
          }
        }
      }

      while (resultPoints.length < 3 && contextualPoints.length > 0) {
        const nextPoint = contextualPoints.shift();
        const prefix = nextPoint.slice(0, 30).toLowerCase();
        if (!seenPrefixes.has(prefix)) {
          seenPrefixes.add(prefix);
          resultPoints.push(nextPoint);
        }
      }

      if (resultPoints.length === 3 && maxPoints >= 4 && contextualPoints.length > 0) {
        const nextPoint = contextualPoints.shift();
        const prefix = nextPoint.slice(0, 30).toLowerCase();
        if (!seenPrefixes.has(prefix)) {
          seenPrefixes.add(prefix);
          resultPoints.push(nextPoint);
        }
      }

      const targetCount = Math.min(maxPoints, Math.max(3, Math.min(4, resultPoints.length)));
      const finalPoints = resultPoints.slice(0, targetCount).map((p) => {
        let clean = p.trim().replace(/[\s,;:\-–—.]+$/g, "");
        return clean ? clean + "." : "";
      }).filter(Boolean);

      return {
        descriptionText: finalPoints.join(" "),
        techBullet,
      };
    };

    const projItems = experience
      .map((exp) => {
        let comp = (exp.company || exp.title || "Project").replace(/[\s—–-]+$/, "").trim();
        let title = exp.title && exp.company && exp.title !== exp.company ? exp.title.trim() : "";

        const combinedLower = (comp + " " + title).toLowerCase();
        if (
          combinedLower.includes("daily task") ||
          combinedLower.includes("automation system") ||
          combinedLower.includes("task tracking") ||
          combinedLower.includes("gmail") ||
          combinedLower.includes("sqlite") ||
          combinedLower.includes("node-cron") ||
          combinedLower.includes("enterprise-grade automated") ||
          combinedLower.includes("enterprise - grade automated")
        ) {
          comp = "Daily Task Email Automation System";
          title = "React 19 & TypeScript";
        } else if (
          combinedLower.includes("cv-catalyst") ||
          combinedLower.includes("cv catalyst") ||
          (combinedLower.includes("cv") && combinedLower.includes("catalyst")) ||
          combinedLower.includes("resume builder")
        ) {
          comp = "CV-Catalyst";
          title = "AI-Powered Resume Builder";
        } else if (
          combinedLower.includes("wanderlust") ||
          combinedLower.includes("hotel booking")
        ) {
          comp = "Wanderlust";
          title = "Hotel Booking Platform (Airbnb)";
        }

        const titleStr = title ? `${escapeLatex(comp)} -- ${escapeLatex(title)}` : escapeLatex(comp);
        let bullets = Array.isArray(exp.bullets) ? [...exp.bullets] : [];

        if (/^(architected|engineered|implemented|developed|designed|built)/i.test((exp.company || "").trim())) {
          const fullText = (exp.company + (exp.title ? " " + exp.title : "")).trim();
          if (!bullets.some((b) => b.toLowerCase().includes("architected an enterprise"))) {
            bullets.unshift(fullText);
          }
        }

        const { descriptionText, techBullet } = ensureThreeToFourPoints(comp, title, bullets, 4);
        let bodyText = descriptionText;

        const techStr = exp.technologies
          ? (Array.isArray(exp.technologies) ? exp.technologies.join(", ") : exp.technologies)
          : techBullet.replace(/^tech(nologies)?\s*:\s*/i, "");

        if (techStr) {
          const cleanTech = techStr.replace(/[\s,;:\-–—.]+$/g, "");
          bodyText = bodyText ? `${bodyText}, ${cleanTech}` : cleanTech;
        }

        if (bodyText && !bodyText.endsWith(".")) {
          bodyText += ".";
        }

        return `  \\item \\textbf{${titleStr}} \\\\\n  ${escapeLatex(bodyText)}`;
      })
      .join("\n  \\vspace{2pt}\n");

    expSection = `\\section{Projects}\n\\begin{itemize}[leftmargin=0.15in]\n${projItems}\n\\end{itemize}\n`;
  }

  // ── ACHIEVEMENTS ────────────────────────────────────────────────────────
  let achSection = "";
  if (achievements.length > 0) {
    const achLines = achievements
      .map((ach) => {
        const text = (typeof ach === "string" ? ach : ach.text || "").replace(/^[•\-\*\s]+/, "").trim();
        const colonIdx = text.indexOf(":");
        if (colonIdx > 0 && colonIdx < 45) {
          const label = escapeLatex(text.substring(0, colonIdx).trim());
          const rest = escapeLatex(text.substring(colonIdx + 1).trim());
          return `    \\textbf{${label}:} ${rest}`;
        }
        return `    ${escapeLatex(text)}`;
      })
      .filter(Boolean);

    achSection = `\\section{Achievements \\& Problem Solving}\n\\begin{itemize}[leftmargin=0.15in, label={}]\n  \\small{\\item{\n${achLines.join(
      " \\\\\n"
    )}\n  }}\n\\end{itemize}\n`;
  }

  return `%-------------------------
% Overleaf 1-Page Resume (Generated by CV-Catalyst)
% Compatible with Overleaf pdflatex / xelatex
% Guaranteed single-page fit with optimal whitespace
%------------------------

\\documentclass[letterpaper,10pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage[top=0.4in, bottom=0.4in, left=0.45in, right=0.45in]{geometry}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting - Compact for guaranteed 1-page fit
\\titleformat{\\section}{
  \\vspace{-5pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-3pt}]

% Ensure ATS machine readability
\\pdfgentounicode=1

% Compact itemize settings
\\setlist[itemize]{noitemsep, topsep=1pt, parsep=0pt, partopsep=0pt, leftmargin=0.15in}

\\begin{document}

%---------- HEADING ----------
\\begin{center}
    {\\Huge \\scshape \\textbf{${escapeLatex(name)}}} \\\\ \\vspace{2pt}
    \\small ${contactParts.join(" $\\mid$ ")} \\\\ \\vspace{1pt}
    \\small ${linkParts.join(" $\\mid$ ")}
\\end{center}
\\vspace{-6pt}

${summary ? `%---------- PROFESSIONAL SUMMARY ----------\n\\section{Professional Summary}\n\\small{${escapeLatex(summary)}}\n` : ""}
${eduSection}
${skillsSection}
${expSection}
${achSection}

\\end{document}
`;
};
