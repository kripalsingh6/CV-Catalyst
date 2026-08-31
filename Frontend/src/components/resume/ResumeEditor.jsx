import React from "react";
import { CheckCircle2, Award, Briefcase, GraduationCap, Code } from "lucide-react";

const formatSkillsCategories = (skills) => {
  if (!skills) return [];
  let lines = [];
  if (Array.isArray(skills)) {
    lines = skills.flatMap((s) => (typeof s === "string" ? s.split("\n") : [s]));
  } else if (typeof skills === "string") {
    lines = skills.split("\n");
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

const ResumeEditor = ({ data, template = "classic" }) => {
  if (!data) return null;

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
    experience = [],
    education = [],
    skills = [],
    achievements = [],
  } = data;

  const links = [
    linkedin ? { label: "LinkedIn", url: linkedin.startsWith("http") ? linkedin : `https://${linkedin}` } : null,
    github ? { label: "GitHub", url: github.startsWith("http") ? github : `https://${github}` } : null,
    leetcode ? { label: "LeetCode", url: leetcode.startsWith("http") ? leetcode : `https://${leetcode}` } : { label: "LeetCode", url: "https://leetcode.com" },
    geeksforgeeks ? { label: "GeeksforGeeks", url: geeksforgeeks.startsWith("http") ? geeksforgeeks : `https://${geeksforgeeks}` } : { label: "GeeksforGeeks", url: "https://geeksforgeeks.org" },
  ].filter(Boolean);

  const parsedSkills = formatSkillsCategories(skills);

  // ── CLASSIC TEMPLATE PREVIEW (Exact match to PDF Image, Compact UI Size) ──
  if (template === "classic") {
    return (
      <div className="bg-white text-black rounded-xl p-5 sm:p-6 shadow-xl border border-gray-300 font-serif text-[10px] leading-snug w-full max-w-2xl mx-auto my-2 transition-all">
        {/* Name Header */}
        <div className="text-center mb-2">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-black mb-0.5">{name}</h1>
          <div className="text-[9px] text-gray-800 flex justify-center items-center gap-1.5 flex-wrap font-sans">
            {location && <span>{location}</span>}
            {location && phone && <span>|</span>}
            {phone && <span>{phone}</span>}
            {(location || phone) && email && <span>|</span>}
            {email && <span className="underline">{email}</span>}
          </div>
          {links.length > 0 && (
            <div className="text-[9px] text-black flex justify-center items-center gap-1.5 mt-0.5 font-sans">
              {links.map((link, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span>|</span>}
                  <a href={link.url} target="_blank" rel="noreferrer" className="underline hover:text-red-600 transition">
                    {link.label}
                  </a>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Professional Summary */}
        {summary && (
          <div className="mb-2.5">
            <h2 className="text-[10px] font-bold text-black uppercase tracking-wider border-b border-black pb-0.5 mb-1">
              Professional Summary
            </h2>
            <p className="text-[9.5px] leading-relaxed text-justify text-gray-900">{summary}</p>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-2.5">
            <h2 className="text-[10px] font-bold text-black uppercase tracking-wider border-b border-black pb-0.5 mb-1">
              Education
            </h2>
            <div className="space-y-1.5">
              {education.map((edu, idx) => (
                <div key={idx} className="text-[9.5px]">
                  <div className="flex justify-between items-baseline font-bold text-black">
                    <span>{edu.institution}</span>
                    <span className="font-normal text-gray-800 text-[8.5px]">{edu.location || "Bhopal, MP"}</span>
                  </div>
                  {(edu.degree || edu.field) && (
                    <div className="flex justify-between items-baseline italic text-gray-800 text-[8.5px]">
                      <span>{edu.degree}{edu.field ? ` – ${edu.field}` : ""}</span>
                      <span>{edu.startDate} – {edu.endDate || "Present"}</span>
                    </div>
                  )}
                  {edu.gpa && (
                    <div className="text-[8.5px] text-gray-800 mt-0.5">
                      • {edu.gpa.startsWith("•") ? edu.gpa.replace(/^•\s*/, "") : edu.gpa}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {parsedSkills.length > 0 && (
          <div className="mb-2.5">
            <h2 className="text-[10px] font-bold text-black uppercase tracking-wider border-b border-black pb-0.5 mb-1">
              Technical Skills
            </h2>
            <div className="space-y-0.5 text-[9.5px]">
              {parsedSkills.map((cat, idx) => (
                <div key={idx} className="leading-tight">
                  <span className="font-bold text-black">{cat.name}: </span>
                  <span className="text-gray-900">{cat.items.join(", ")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Projects / Experience */}
        {experience.length > 0 && (
          <div className="mb-2.5">
            <h2 className="text-[10px] font-bold text-black uppercase tracking-wider border-b border-black pb-0.5 mb-1">
              Technical Projects
            </h2>
            <div className="space-y-2">
              {experience.map((exp, idx) => (
                <div key={idx} className="text-[9.5px]">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-black">
                      {exp.company || exp.title}
                      {exp.title && exp.company && exp.title !== exp.company && (
                        <span className="font-normal italic"> – {exp.title}</span>
                      )}
                      {exp.subtitle && <span className="font-normal italic"> | {exp.subtitle}</span>}
                    </span>
                    <span className="italic text-[8.5px] text-gray-800 whitespace-nowrap ml-2">
                      {exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ""}
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc pl-3.5 space-y-0.5 mt-0.5 text-[9px] text-gray-900">
                      {exp.bullets.map((bullet, i) => (
                        <li key={i} className="leading-tight text-justify">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements & Problem Solving */}
        {achievements.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold text-black uppercase tracking-wider border-b border-black pb-0.5 mb-1">
              Achievements &amp; Problem Solving
            </h2>
            <div className="space-y-1 text-[9.5px]">
              {achievements.map((ach, idx) => {
                const text = typeof ach === "string" ? ach : ach.text || "";
                const colonIdx = text.indexOf(":");
                if (colonIdx > 0 && colonIdx < 45) {
                  const label = text.substring(0, colonIdx).trim();
                  const rest = text.substring(colonIdx + 1).trim();
                  return (
                    <div key={idx} className="leading-tight text-justify">
                      <span className="font-bold text-black">{label}: </span>
                      <span className="text-gray-900">{rest}</span>
                    </div>
                  );
                }
                return (
                  <div key={idx} className="leading-tight text-justify text-gray-900">
                    {text}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── MODERN TEMPLATE PREVIEW (Split Sidebar Layout) ───────────────────────
  if (template === "modern") {
    return (
      <div className="bg-white text-gray-900 rounded-xl shadow-xl font-sans text-xs overflow-hidden max-w-2xl mx-auto my-2 border border-gray-300 grid grid-cols-12 w-full transition-all">
        {/* Left Dark Sidebar */}
        <div className="col-span-4 bg-[#0f172a] text-slate-100 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight">{name}</h1>
            <p className="text-orange-400 font-bold text-[9.5px] mt-0.5 uppercase tracking-wider">Software Engineer</p>

            {/* Contact Items */}
            <div className="mt-4 space-y-1.5 text-[9px] text-slate-300 border-t border-slate-700/80 pt-3">
              {email && <div className="truncate">✉ {email}</div>}
              {phone && <div>📱 {phone}</div>}
              {location && <div>📍 {location}</div>}
              {links.map((link, idx) => (
                <div key={idx} className="truncate">
                  <a href={link.url} target="_blank" rel="noreferrer" className="underline text-slate-300 hover:text-white">
                    🔗 {link.label}
                  </a>
                </div>
              ))}
            </div>

            {/* Categorized Skills */}
            {parsedSkills.length > 0 && (
              <div className="mt-4 border-t border-slate-700/80 pt-3">
                <h3 className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Skills</h3>
                <div className="space-y-2">
                  {parsedSkills.map((cat, idx) => (
                    <div key={idx}>
                      <div className="text-[8px] font-bold text-orange-400 uppercase mb-0.5">{cat.name}</div>
                      <div className="flex flex-wrap gap-1">
                        {cat.items.map((skill, i) => (
                          <span key={i} className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded text-[8px] font-medium border border-slate-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Main Content */}
        <div className="col-span-8 p-4 sm:p-5 space-y-3 bg-slate-50">
          {summary && (
            <div>
              <h2 className="text-[10px] font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1">Profile Summary</h2>
              <p className="text-[9.5px] text-slate-700 leading-relaxed text-justify">{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1.5">Experience &amp; Projects</h2>
              <div className="space-y-2">
                {experience.map((exp, idx) => (
                  <div key={idx} className="text-[9.5px]">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{exp.company || exp.title}</span>
                      <span className="text-[8.5px] text-slate-500 font-normal">{exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ""}</span>
                    </div>
                    {exp.bullets && (
                      <ul className="list-disc pl-3.5 text-[9px] text-slate-700 mt-0.5 space-y-0.5">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="leading-tight text-justify">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1">Education</h2>
              <div className="space-y-1.5">
                {education.map((edu, idx) => (
                  <div key={idx} className="text-[9.5px]">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{edu.institution}</span>
                      <span className="text-[8.5px] text-slate-500 font-normal">{edu.location}</span>
                    </div>
                    <div className="flex justify-between italic text-[8.5px] text-slate-600">
                      <span>{edu.degree} {edu.field ? `in ${edu.field}` : ""}</span>
                      <span>{edu.startDate} – {edu.endDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {achievements.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1">Achievements</h2>
              <div className="space-y-1 text-[9.5px] text-slate-700">
                {achievements.map((ach, idx) => (
                  <div key={idx} className="leading-tight text-justify">{typeof ach === "string" ? ach : ach.text}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── MINIMAL TEMPLATE PREVIEW ──────────────────────────────────────────────
  return (
    <div className="bg-white text-gray-900 rounded-2xl p-8 sm:p-10 shadow-2xl font-sans text-xs max-w-4xl mx-auto my-4 border border-gray-300">
      <div className="border-l-4 border-red-500 pl-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{name}</h1>
        <p className="text-xs text-gray-600 mt-0.5">{location} | {phone} | {email}</p>
      </div>

      {summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Summary</h2>
          <p className="text-xs text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">Projects &amp; Experience</h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-semibold text-gray-900 text-xs">
                  <span>{exp.title || exp.company}</span>
                  <span className="text-[10px] text-gray-500">{exp.startDate} – {exp.endDate}</span>
                </div>
                {exp.bullets && (
                  <ul className="list-disc pl-4 text-xs text-gray-700 mt-1 space-y-1">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeEditor;