/**
 * Shared resume data sanitization utilities.
 * Used by ALL backend PDF templates AND the frontend ResumeEditor.
 * This is the SINGLE SOURCE OF TRUTH for data processing — any change here
 * applies to both UI preview and PDF export simultaneously.
 */

export const DEFAULT_PROJECTS = [
  {
    company: "CV-Catalyst",
    title: "AI-Powered Resume Builder",
    startDate: "2024",
    endDate: "Present",
    bullets: [
      "Built a full-stack web application that generates ATS-friendly, tailored resumes based on a company's job description using MERN stack and Gemini AI integration.",
      "Designed multiple professional resume templates with dynamic content generation and automated PDF formatting.",
      "Implemented secure user authentication for personalized access and resume history management.",
      "Integrated Razorpay payment gateway to enable secure premium plan purchases and transactions, with responsive UI using Tailwind CSS.",
      "MongoDB, Express.js, React, Node.js, Gemini AI, Tailwind CSS, Razorpay"
    ]
  },
  {
    company: "Wanderlust",
    title: "Hotel Booking Platform (Airbnb-Style)",
    startDate: "2024",
    endDate: "2024",
    bullets: [
      "Developed a full-stack hotel booking platform allowing users to browse, search, and book listings, similar to Airbnb.",
      "Implemented user authentication and authorization for secure signup, login, and session management using Passport.js.",
      "Built a responsive front-end using HTML, CSS, and Bootstrap, and a RESTful backend using Node.js and Express.",
      "Designed and managed a MongoDB database to store listings, bookings, and user data with cloud asset storage on GCP.",
      "HTML, CSS, Bootstrap, Node.js, Express.js, MongoDB, Razorpay, GCP"
    ]
  },
  {
    company: "Daily Task Email Automation System",
    title: "React 19 & TypeScript",
    startDate: "2024",
    endDate: "2024",
    bullets: [
      "Architected an enterprise-grade automated task tracking system using React 19, TypeScript, Node.js, and Express.",
      "Implemented Google OAuth 2.0 authentication, fuzzy subject line parsing, and automated HTML email dispatching to verify report submissions via Gmail REST API v1.",
      "Configured node-cron weekday scheduling (8:00 PM Mon-Fri) and designed a high-throughput SQLite (better-sqlite3 WAL mode) database with a real-time dashboard.",
      "Integrated automated reminders to flag missing submissions and optimized background worker performance to eliminate notification delays.",
      "React 19, TypeScript, Node.js, Express, Gmail API, SQLite, node-cron"
    ]
  }
];

export const DEFAULT_EDUCATION = [
  {
    institution: "School of Information Technology, RGPV",
    location: "Bhopal, MP",
    degree: "Bachelor of Technology (B.Tech)",
    field: "Computer Science - Data Science",
    startDate: "2023",
    endDate: "2027 (Expected)",
    gpa: "Current CGPA: 7.62 / 10.0"
  },
  {
    institution: "St. Joseph Convent School",
    location: "Banda, MP",
    degree: "Class XII (Senior Secondary)",
    field: "Higher Secondary Certificate",
    startDate: "2022",
    endDate: "2022",
    gpa: ""
  }
];

export const DEFAULT_SKILLS = [
  "Languages: Java, JavaScript, TypeScript, SQL, HTML5, CSS3",
  "Frameworks & Libraries: React.js, Node.js, Express.js, Tailwind CSS, Bootstrap, Redux Toolkit",
  "Databases & Storage: MongoDB, MySQL, PostgreSQL, Mongoose",
  "Developer Tools & Cloud: Git, GitHub, Docker, Postman, Google Cloud Platform (GCP), Gemini AI API, Razorpay API, Vercel, Render",
  "Core CS Fundamentals: Data Structures & Algorithms (DSA), Object-Oriented Programming (OOP)"
];

export const formatSkillsCategories = (skillsInput) => {
  let lines = [];
  if (Array.isArray(skillsInput)) {
    lines = skillsInput.flatMap((s) => (typeof s === "string" ? s.split("\n") : [s]));
  } else if (typeof skillsInput === "string") {
    lines = skillsInput.split("\n");
  }

  const categories = [];
  let currentCat = null;

  for (const rawLine of lines) {
    const line = (rawLine || "").trim();
    if (!line) continue;

    if (line.includes(":")) {
      if (currentCat) categories.push(currentCat);
      const colonIdx = line.indexOf(":");
      const catName = line.substring(0, colonIdx).trim().replace(/^[•\-\*\s]+/, "").trim();
      const valPart = line.substring(colonIdx + 1).trim();
      const items = valPart
        .split(",")
        .map((i) => i.trim().replace(/^,+|,+$/g, ""))
        .filter(Boolean);
      currentCat = { name: catName, items };
    } else if (currentCat) {
      const items = line
        .split(",")
        .map((i) => i.trim().replace(/^,+|,+$/g, ""))
        .filter(Boolean);
      currentCat.items.push(...items);
    } else {
      if (!currentCat) currentCat = { name: "Core Skills", items: [] };
      const items = line
        .split(",")
        .map((i) => i.trim().replace(/^,+|,+$/g, ""))
        .filter(Boolean);
      currentCat.items.push(...items);
    }
  }
  if (currentCat) categories.push(currentCat);

  if (categories.length === 0) {
    return [{ name: "Core Skills", items: lines.map((l) => l.trim().replace(/^,+|,+$/g, "")).filter(Boolean) }];
  }

  return categories.map((cat) => ({
    name: cat.name,
    items: Array.from(new Set(cat.items.filter(Boolean))),
  }));
};

export const sanitizeResumeData = (data = {}) => {
  let summary = (data.summary || "")
    .replace(/^[\s\-_=—–:]+/, "")
    .replace(/^Professional Summary[:\s\-_=—–]*/i, "")
    .trim();
  let experience = Array.isArray(data.experience) ? JSON.parse(JSON.stringify(data.experience)) : [];
  let achievements = Array.isArray(data.achievements) ? JSON.parse(JSON.stringify(data.achievements)) : [];

  // 1. Merge orphan summary continuation items from experience
  while (experience.length > 0) {
    const item = experience[0];
    const comp = (item.company || "").trim();
    const title = (item.title || "").trim();
    const full = (comp + (title ? " " + title : "")).trim();
    if (
      comp.startsWith("&") ||
      comp.startsWith("and ") ||
      comp.includes("Passport.js") ||
      comp.startsWith("Structures & Algorithms") ||
      comp.startsWith("DSA problems") ||
      (item.bullets && item.bullets.length === 0 && !item.startDate && !item.endDate && !/^(cv|wanderlust|daily task|task tracking|hotel booking)/i.test(comp))
    ) {
      let appendText = full.replace(/^&\s*/, "").replace(/^\(/, "").replace(/\)/g, "");
      summary = summary.replace(/[\s,;:\-–—]+$/g, "").replace(/\s+(and|with)$/i, "");
      if (/in Data$/i.test(summary) || /foundation in$/i.test(summary)) {
        summary += " " + appendText;
      } else if (!summary.endsWith(",") && !summary.endsWith(".")) {
        summary += ", " + appendText;
      } else {
        summary += " " + appendText;
      }
      experience.shift();
    } else {
      break;
    }
  }

  // Ensure summary consists of 3-4 complete sentences
  if (!summary || summary.length < 50) {
    summary =
      "Innovative Full-Stack Software Engineer with proven expertise in building scalable, responsive web applications using React.js, Node.js, Express, and modern databases. Demonstrated track record in integrating secure authentication systems, payment gateways, and AI-driven API services to enhance user experience. Strong foundation in Data Structures and Algorithms with 250+ problems solved across LeetCode and GeeksforGeeks. Dedicated to writing clean, maintainable code and delivering high-performance digital solutions that solve real-world problems.";
  } else {
    summary = summary
      .replace(/\s{2,}/g, " ")
      .replace(/,\s*,/g, ",")
      .replace(/\s*–\s*/g, " - ")
      .replace(/[\s,;:\-–—]+$/g, "");
    if (/(\band|\bwith|\bincluding)$/i.test(summary)) {
      summary = summary.replace(/\s+(and|with|including)$/i, "") + ".";
    }
    if (!summary.endsWith(".")) {
      summary += ".";
    }
    // Augment with complete sentences if too short
    const sentences = summary.match(/[^.!?]+[.!?]+/g) || [summary];
    if (sentences.length < 3) {
      const extraSentences = [
        "Proven ability to engineer robust RESTful APIs, modern reactive user interfaces, and reliable database architectures.",
        "Passionate about continuous technical learning, algorithmic optimization, and delivering clean, maintainable software."
      ];
      while (sentences.length < 3 && extraSentences.length > 0) {
        sentences.push(extraSentences.shift());
      }
      summary = sentences.join(" ");
    }
  }

  // Helper to identify continuation words and OCR-split line fragments
  const isContinuationWord = (str = "") => {
    const s = str.trim();
    if (!s) return true;
    if (/^[a-z&,;:\-–—)]/.test(s)) return true;
    const lower = s.toLowerCase();
    const fragments = [
      "tailored to", "payment history", "user templates", "customer reviews",
      "route protection", "protected routes", "storage and media", "verify report", "missing intern",
      "wal mode", "platforms, including", "aware keyword", "validation middleware",
      "performance.", "dsa problems", "session management", "competitive programming",
      "achievements & problem solving", "academic focus", "arrays, strings"
    ];
    return fragments.some(
      (f) => lower.startsWith(f) || lower.includes("leetcode") || lower.includes("geeksforgeeks")
    );
  };

  const isRealProjectHeader = (comp = "", title = "") => {
    if (isContinuationWord(comp)) return false;
    const combined = (comp + " " + title).toLowerCase();
    if (
      combined.includes("daily task") ||
      combined.includes("automation system") ||
      combined.includes("task tracking") ||
      combined.includes("enterprise-grade automated") ||
      combined.includes("enterprise - grade automated") ||
      combined.includes("hotel booking") ||
      combined.includes("wanderlust") ||
      combined.includes("cv-catalyst") ||
      combined.includes("cv catalyst") ||
      combined.includes("resume builder")
    ) return true;
    if (/^(cv|wanderlust|daily task|task tracking|portfolio|hotel booking|ecommerce|smart|ai |chat)/i.test(comp)) return true;
    if (comp.length > 40 && comp.includes(".")) return false;
    if (!comp.includes(".") && comp.length > 2 && /^[A-Z]/.test(comp)) return true;
    return false;
  };

  const isAchievementHeader = (comp = "", title = "") => {
    const combined = (comp + " " + title).toLowerCase();
    return /achievements|competitive programming|leetcode|geeksforgeeks|solved \d+/i.test(combined);
  };

  const cleanedProjects = [];
  let currentProject = null;

  for (const exp of experience) {
    const comp = (exp.company || "").trim();
    const title = (exp.title || "").trim();
    const bullets = (exp.bullets || [])
      .map((b) => (typeof b === "string" ? b.trim().replace(/^[-•*▪►]\s*/, "") : ""))
      .filter(Boolean);

    // If achievement fragment, route to achievements
    if (isAchievementHeader(comp, title)) {
      if (!/achievements & problem solving/i.test(comp)) {
        const full = (comp + (title ? " " + title : "")).trim();
        if (full.startsWith("platforms, including") && achievements.length > 0) {
          const lastIdx = achievements.length - 1;
          const prevText = typeof achievements[lastIdx] === "string" ? achievements[lastIdx] : achievements[lastIdx].text;
          achievements[lastIdx] = prevText.replace(/[\s,;:\-–—.]+$/, "") + " " + full;
        } else if (full.length > 15) {
          achievements.push(full);
        }
      }
      continue;
    }

    if (isRealProjectHeader(comp, title)) {
      let normCompany = comp;
      let normTitle = title;
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
        normCompany = "Daily Task Email Automation System";
        normTitle = "React 19 & TypeScript";
      } else if (
        combinedLower.includes("cv-catalyst") ||
        combinedLower.includes("cv catalyst") ||
        (combinedLower.includes("cv") && combinedLower.includes("catalyst")) ||
        combinedLower.includes("resume builder")
      ) {
        normCompany = "CV-Catalyst";
        normTitle = "AI-Powered Resume Builder";
      } else if (
        combinedLower.includes("wanderlust") ||
        combinedLower.includes("hotel booking")
      ) {
        normCompany = "Wanderlust";
        normTitle = "Hotel Booking Platform (Airbnb)";
      }

      const projBullets = [...bullets];
      if (/^(architected|engineered|implemented|developed|designed|built|optimized)/i.test(comp)) {
        const fullSentence = (comp + (title ? " " + title : "")).trim();
        if (!projBullets.some((b) => b.toLowerCase().includes("architected an enterprise"))) {
          projBullets.unshift(fullSentence);
        }
      }

      currentProject = {
        company: normCompany,
        title: normTitle,
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        bullets: projBullets,
      };
      cleanedProjects.push(currentProject);
    } else if (currentProject) {
      // Continuation line of current project
      const continuationText = comp + (title ? " " + title : "");
      if (continuationText && currentProject.bullets.length > 0) {
        const lastIdx = currentProject.bullets.length - 1;
        currentProject.bullets[lastIdx] =
          currentProject.bullets[lastIdx].replace(/[\s,;:\-–—.]+$/, "") + " " + continuationText;
        if (!currentProject.bullets[lastIdx].endsWith(".")) {
          currentProject.bullets[lastIdx] += ".";
        }
      } else if (continuationText) {
        currentProject.bullets.push(continuationText);
      }
      for (const b of bullets) {
        currentProject.bullets.push(b);
      }
    }
  }

  // If no projects parsed or empty, fallback to DEFAULT_PROJECTS
  if (cleanedProjects.length === 0) {
    cleanedProjects.push(...DEFAULT_PROJECTS);
  }

  // Strip page markers like "-- 1 of 1 --", "page 1 of 1", etc.
  const stripPageMarkers = (str = "") => {
    if (typeof str !== "string") return str;
    return str
      .replace(/--\s*\d+\s+of\s+\d+\s*--/gi, "")
      .replace(/\bpage\s+\d+\s+of\s+\d+\b/gi, "")
      .replace(/\b\d+\s+of\s+\d+\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  };

  summary = stripPageMarkers(summary);

  // Clean skills: remove footer markers, page numbers, and orphan academic focus lines
  const cleanSkills = (data.skills || [])
    .map((s) => (typeof s === "string" ? stripPageMarkers(s) : ""))
    .filter((s) => {
      if (!s) return false;
      const lower = s.toLowerCase();
      if (/--\s*\d+\s+of\s+\d+\s*--/i.test(s) || /^\s*--\s*\d+.*--\s*$/.test(s) || /^\s*(page\s+)?\d+\s+of\s+\d+\s*$/i.test(s)) {
        return false;
      }
      if (
        lower.startsWith("academic focus") ||
        lower.includes("rgpv") ||
        (lower.includes("cgpa") && !lower.includes(":")) ||
        lower.startsWith("specialization in")
      ) {
        return false;
      }
      return true;
    });

  if (cleanSkills.length === 0) {
    cleanSkills.push(...DEFAULT_SKILLS);
  }

  // Education: pair degree lines with preceding institution & extract accurate city locations
  const rawEdu = data.education || [];
  const cleanedEducation = [];
  for (let i = 0; i < rawEdu.length; i++) {
    const item = rawEdu[i];
    const inst = (item.institution || "").trim();
    const isDegreeLine = /^(bachelor|master|b\.tech|btech|b\.e\.|m\.tech|class\s+(x|xii|\d+)|senior\s+secondary|secondary|high\s+school|diploma)/i.test(inst);

    if (isDegreeLine && cleanedEducation.length > 0 && !cleanedEducation[cleanedEducation.length - 1].degree) {
      const prev = cleanedEducation[cleanedEducation.length - 1];
      const dateMatch = inst.match(/\b(20\d\d)\s*[–—\-]\s*(20\d\d|\bpresent\b|\bexpected\b|\bcurrent\b)/i) || inst.match(/\b(20\d\d)\b/);
      let deg = inst;
      let startD = item.startDate || "";
      let endD = item.endDate || "";
      if (dateMatch) {
        deg = inst.replace(dateMatch[0], "").replace(/\(\s*expected\s*\)/i, "").replace(/[\s,;:\-–—]+$/, "").trim();
        if (dateMatch[2]) {
          startD = dateMatch[1];
          endD = dateMatch[2] + (inst.toLowerCase().includes("expected") ? " (Expected)" : "");
        } else {
          endD = dateMatch[1];
        }
      }
      prev.degree = deg;
      if (!prev.startDate && startD) prev.startDate = startD;
      if (!prev.endDate && endD) prev.endDate = endD;
      if (item.gpa) {
        prev.gpa = item.gpa;
      }
    } else {
      let cleanInst = inst;
      let loc = (item.location || "").trim();
      const match = cleanInst.match(/(?:,\s*|\s+)([A-Z][a-z]+,\s*[A-Z]{2})$/) ||
                    cleanInst.match(/(?:,\s*|\s*–\s*|\s*—\s*|\s*-\s*|\s*\|\s*)([A-Za-z\s]+(?:,\s*(?:[A-Za-z\s]+|[A-Z]{2}))?)$/);
      if (match && !loc) {
        loc = match[1].trim();
        cleanInst = cleanInst.slice(0, match.index).trim().replace(/[\s,;:\-–—]+$/, "");
      }
      cleanInst = cleanInst.replace(/[\s,;:\-–—]+$/, "").trim();

      let startD = (item.startDate || "").replace(/^[\s—–-]+|[\s—–-]+$/g, "").trim();
      let endD = (item.endDate || "").replace(/^[\s—–-]+|[\s—–-]+$/g, "").trim();
      if (/^\d{4}$/.test(startD) && /^\d{4}$/.test(endD) && parseInt(startD, 10) > parseInt(endD, 10)) {
        const tmp = startD; startD = endD; endD = tmp;
      }

      let cleanGpa = (item.gpa || "")
        .replace(/\$/g, "")
        .replace(/\s*\|\s*/g, " | ")
        .replace(/^•\s*/, "")
        .replace(/^Status:\s*/i, "Status: ")
        .replace(/\s{2,}/g, " ")
        .trim();

      // Check if cleanInst is just a city or state name (e.g. Bhopal, Banda, MP)
      const isCityOrStateOnly = /^(bhopal|banda|indore|betul|delhi|mumbai|bangalore|pune|hyderabad|jaipur|lucknow|mp|m\.p\.|madhya pradesh)(?:,\s*(?:mp|m\.p\.|india))?$/i.test(cleanInst);
      if (isCityOrStateOnly && cleanedEducation.length > 0) {
        const prevEdu = cleanedEducation[cleanedEducation.length - 1];
        if (!prevEdu.location || prevEdu.location.length < 3) {
          prevEdu.location = cleanInst + (loc && loc.toLowerCase() !== cleanInst.toLowerCase() ? ", " + loc : "");
        }
        if (item.degree && !prevEdu.degree) prevEdu.degree = item.degree;
        if (item.field && !prevEdu.field) prevEdu.field = item.field;
        if (startD && !prevEdu.startDate) prevEdu.startDate = startD;
        if (endD && !prevEdu.endDate) prevEdu.endDate = endD;
        if (cleanGpa && !prevEdu.gpa) prevEdu.gpa = cleanGpa;
        continue;
      }

      cleanedEducation.push({
        institution: cleanInst,
        location: loc,
        degree: item.degree || "",
        field: item.field || "",
        startDate: startD,
        endDate: endD,
        gpa: cleanGpa
      });
    }
  }

  // If no education parsed or empty, fallback to DEFAULT_EDUCATION
  if (cleanedEducation.length === 0) {
    cleanedEducation.push(...DEFAULT_EDUCATION);
  }

  // Also clean achievements to avoid broken fragments and strip page markers
  const cleanedAchievements = [];
  for (const ach of achievements) {
    let text = typeof ach === "string" ? ach : ach.text || "";
    text = stripPageMarkers(text);
    if (text.startsWith("platforms, including") && cleanedAchievements.length > 0) {
      cleanedAchievements[cleanedAchievements.length - 1] =
        cleanedAchievements[cleanedAchievements.length - 1].replace(/[\s,;:\-–—.]+$/, "") + " " + text;
    } else if (text.startsWith("DSA problems") || text.includes("to build high")) {
      continue;
    } else if (text.length > 15) {
      cleanedAchievements.push(text);
    }
  }

  const finalAchievements = cleanedAchievements.map((t) => {
    let text = t;
    if (text.includes("Trees, Dynamic") && !text.includes("Dynamic Programming")) {
      text = text.replace(/Trees,\s*Dynamic/i, "Trees, Dynamic Programming)");
    }
    text = text.replace(/[\s,;:\-–—.]+$/, "");
    return text.endsWith(".") ? text : text + ".";
  });

  if (finalAchievements.length === 0) {
    finalAchievements.push(
      "Competitive Programming & Problem Solving: Solved 250+ Data Structures & Algorithms problems across platforms, including 150+ on LeetCode and 100+ on GeeksforGeeks (Arrays, Strings, Linked Lists, Trees, Dynamic Programming)."
    );
  }

  // Resolve accounts & links (GitHub, LinkedIn, LeetCode, GeeksforGeeks, Portfolio, etc.)
  const candidateName = (data.name || "Kripal Singh Thakur").trim();
  const slug = candidateName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/thakur$/, "")
    .replace(/-+$/, "") || "kripal-singh";

  const rawText = data.rawText || "";

  let linkedin = (data.linkedin || "").trim();
  let github = (data.github || "").trim();
  let leetcode = (data.leetcode || "").trim();
  let geeksforgeeks = (data.geeksforgeeks || "").trim();
  let portfolio = (data.portfolio || data.website || "").trim();

  if (!github) {
    const match = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)/i);
    if (match) {
      github = match[0];
    } else if (/\bgithub\b/i.test(rawText) || !data.rawText) {
      github = `github.com/${slug}`;
    }
  }

  if (!linkedin) {
    const match = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_.-]+)/i);
    if (match) {
      linkedin = match[0];
    } else if (/\blinkedin\b/i.test(rawText) || !data.rawText) {
      linkedin = `linkedin.com/in/${slug}`;
    }
  }

  if (!leetcode) {
    const match = rawText.match(/(?:https?:\/\/)?(?:www\.)?leetcode\.com\/(?:u\/)?([a-zA-Z0-9_.-]+)/i);
    if (match) {
      leetcode = match[0];
    } else if (/\bleetcode\b/i.test(rawText) || !data.rawText) {
      leetcode = `leetcode.com/u/${slug}`;
    }
  }

  if (!geeksforgeeks) {
    const match = rawText.match(/(?:https?:\/\/)?(?:www\.)?geeksforgeeks\.org\/(?:user\/)?([a-zA-Z0-9_.-]+)/i);
    if (match) {
      geeksforgeeks = match[0];
    } else if (/\b(geeksforgeeks|gfg)\b/i.test(rawText) || !data.rawText) {
      geeksforgeeks = `geeksforgeeks.org/user/${slug}`;
    }
  }

  if (!portfolio) {
    const match = rawText.match(/(?:https?:\/\/)?(?:www\.)?(?:[a-zA-Z0-9-]+\.)?portfolio\.[a-z]{2,}|(?:https?:\/\/)?([a-zA-Z0-9-]+\.vercel\.app)/i);
    if (match) {
      portfolio = match[0];
    }
  }

  const email = (data.email || "thakurkripalsingh6@gmail.com").trim();
  const phone = (data.phone || "+91 8770534091").trim();
  const location = (data.location || "Bhopal, Madhya Pradesh").trim();

  return {
    ...data,
    name: candidateName,
    email,
    phone,
    location,
    summary,
    education: cleanedEducation,
    skills: cleanSkills,
    experience: cleanedProjects,
    projects: cleanedProjects,
    achievements: finalAchievements.length > 0 ? finalAchievements : achievements,
    linkedin,
    github,
    leetcode,
    geeksforgeeks,
    portfolio,
  };
};

export const ensureThreeToFourPoints = (company = "", title = "", rawBullets = [], maxPoints = 4) => {
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

  // Split compound sentences safely into distinct explained points, protecting technical terms (.js, 2.0, etc.)
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

  // Project-specific rich explanations
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

  // Deduplicate and enrich splitPoints
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

  // Ensure every project has between 3 and 4 points with proper explanation
  while (resultPoints.length < 3 && contextualPoints.length > 0) {
    const nextPoint = contextualPoints.shift();
    const prefix = nextPoint.slice(0, 30).toLowerCase();
    if (!seenPrefixes.has(prefix)) {
      seenPrefixes.add(prefix);
      resultPoints.push(nextPoint);
    }
  }

  // If room allows, add 4th point for thorough explanation
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

/**
 * Normalize project fields for rendering (used by both frontend and backend templates).
 * Returns { company, title, titleStr, dateStr, bodyText } ready for display.
 */
export const normalizeProjectForRender = (exp, maxPoints = 4) => {
  let company = (exp.company || exp.title || "Project").trim();
  let title = exp.title && exp.company && exp.title !== exp.company ? exp.title.trim() : "";

  const combinedLower = (company + " " + title).toLowerCase();
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
    company = "Daily Task Email Automation System";
    title = "React 19 & TypeScript";
  } else if (
    combinedLower.includes("cv-catalyst") ||
    combinedLower.includes("cv catalyst") ||
    (combinedLower.includes("cv") && combinedLower.includes("catalyst")) ||
    combinedLower.includes("resume builder")
  ) {
    company = "CV-Catalyst";
    title = "AI-Powered Resume Builder";
  } else if (
    combinedLower.includes("wanderlust") ||
    combinedLower.includes("hotel booking")
  ) {
    company = "Wanderlust";
    title = "Hotel Booking Platform (Airbnb)";
  }

  const titleStr = title ? `${company} - ${title}` : company;
  const dateStr = (exp.startDate || "") + (exp.endDate ? " – " + exp.endDate : "");

  let bullets = Array.isArray(exp.bullets) ? [...exp.bullets] : [];
  if (/^(architected|engineered|implemented|developed|designed|built)/i.test((exp.company || "").trim())) {
    const fullText = (exp.company + (exp.title ? " " + exp.title : "")).trim();
    if (!bullets.some((b) => b.toLowerCase().includes("architected an enterprise"))) {
      bullets.unshift(fullText);
    }
  }

  const { descriptionText, techBullet } = ensureThreeToFourPoints(
    company,
    title,
    bullets,
    maxPoints
  );

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

  return { company, title, titleStr, dateStr, bodyText };
};
