import React from "react";
import { CheckCircle2, Award, Briefcase, GraduationCap, Code } from "lucide-react";
import {
  formatSkillsCategories,
  sanitizeResumeData,
  normalizeProjectForRender,
  DEFAULT_PROJECTS,
} from "../../utils/sanitize-resume.js";

const ResumeEditor = ({ data: rawData, template = "classic" }) => {
  if (!rawData) return null;
  const data = sanitizeResumeData(rawData);

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
    experience = [],
    education = [],
    skills = [],
    achievements = [],
  } = data;

  const links = [
    linkedin ? { label: "LinkedIn", url: linkedin.startsWith("http") ? linkedin : `https://${linkedin}` } : null,
    github ? { label: "GitHub", url: github.startsWith("http") ? github : `https://${github}` } : null,
    leetcode ? { label: "LeetCode", url: leetcode.startsWith("http") ? leetcode : `https://${leetcode}` } : null,
    geeksforgeeks ? { label: "GeeksforGeeks", url: geeksforgeeks.startsWith("http") ? geeksforgeeks : `https://${geeksforgeeks}` } : null,
    portfolio ? { label: "Portfolio", url: portfolio.startsWith("http") ? portfolio : `https://${portfolio}` } : null,
  ].filter(Boolean);

  const parsedSkills = formatSkillsCategories(skills);

  const renderProjectsPreview = (projects = [], isModern = false) => {
    const rawProjects = projects && projects.length > 0 ? projects : DEFAULT_PROJECTS;
    const totalCount = rawProjects.length;
    const projectsToDisplay = totalCount > 4 ? rawProjects.slice(0, 4) : rawProjects;
    const count = projectsToDisplay.length;

    let fontSize = isModern ? "text-[9px]" : "text-[9.5px]";
    let lineHeight = "leading-normal";
    let spacing = "space-y-1.5";
    let maxPoints = 4;

    if (count === 3) {
      fontSize = isModern ? "text-[8.5px]" : "text-[9px]";
      lineHeight = "leading-snug";
      spacing = "space-y-1.5";
      maxPoints = 4;
    } else if (count >= 4) {
      fontSize = isModern ? "text-[8px]" : "text-[8.5px]";
      lineHeight = "leading-tight";
      spacing = "space-y-1";
      maxPoints = 3;
    }

    return (
      <ul className={`list-disc pl-4 ${spacing} text-justify mt-1`}>
        {projectsToDisplay.map((exp, idx) => {
          const { titleStr, bodyText } = normalizeProjectForRender(exp, maxPoints);

          return (
            <li key={idx} className={`${fontSize} ${lineHeight} text-gray-800`}>
              <strong className="text-black font-bold">{titleStr}</strong>
              {bodyText && <span>, {bodyText}</span>}
            </li>
          );
        })}
      </ul>
    );
  };

  // ── CLASSIC TEMPLATE PREVIEW (Exact match to PDF Image, Compact UI Size) ──
  if (template === "classic") {
    return (
      <div id="resume-print-area" className="bg-white text-black rounded-xl p-5 sm:p-6 shadow-xl border border-gray-300 font-serif text-[10px] leading-snug w-full max-w-2xl mx-auto my-2 transition-all">
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
                    <span className="font-normal text-gray-800 text-[8.5px]">{edu.location || ""}</span>
                  </div>
                  {(edu.degree || edu.field) && (
                    <div className="flex justify-between items-baseline italic text-gray-800 text-[8.5px]">
                      <span>{edu.degree}{edu.field ? ` – ${edu.field}` : ""}</span>
                      {(() => {
                        const startD = (edu.startDate || "").replace(/^[\s—–-]+|[\s—–-]+$/g, "").trim();
                        const endD = (edu.endDate || "").replace(/^[\s—–-]+|[\s—–-]+$/g, "").trim();
                        const dates = startD && endD ? `${startD} – ${endD}` : (startD || endD || "");
                        return dates ? <span>{dates}</span> : null;
                      })()}
                    </div>
                  )}
                  {edu.gpa && (
                    <div className="text-[8.5px] text-gray-800 mt-0.5">
                      • {edu.gpa.replace(/\$/g, "").replace(/\s*\|\s*/g, " | ").replace(/^•\s*/, "").replace(/^Status:\s*/i, "Status: ").trim()}
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

        {/* Projects / Experience */}
        {experience.length > 0 && (
          <div className="mb-2.5">
            <h2 className="text-[10px] font-bold text-black uppercase tracking-wider border-b border-black pb-0.5 mb-1">
              Projects
            </h2>
            {renderProjectsPreview(experience, false)}
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
      <div id="resume-print-area" className="bg-white text-gray-900 rounded-xl shadow-xl font-sans text-xs overflow-hidden max-w-2xl mx-auto my-2 border border-gray-300 grid grid-cols-12 w-full transition-all">
        {/* Left Dark Sidebar */}
        <div className="col-span-4 bg-[#0f172a] text-slate-100 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight">{name}</h1>
            <p className="text-orange-400 font-bold text-[9px] mt-0.5 uppercase tracking-wider">Full-Stack Software Engineer</p>

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
              <h2 className="text-[10px] font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1.5">Projects</h2>
              {renderProjectsPreview(experience, true)}
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1">Education</h2>
              <div className="space-y-1.5">
                {education.map((edu, idx) => {
                  const degreeText = edu.degree || edu.field ? `${edu.degree || ""}${edu.field ? " – " + edu.field : ""}` : "";
                  const startD = (edu.startDate || "").replace(/^[\s—–-]+|[\s—–-]+$/g, "").trim();
                  const endD = (edu.endDate || "").replace(/^[\s—–-]+|[\s—–-]+$/g, "").trim();
                  const dateStr = startD && endD ? `${startD} – ${endD}` : (startD || endD || "");
                  return (
                    <div key={idx} className="text-[9.5px]">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{edu.institution}</span>
                        <span className="text-[8.5px] text-slate-500 font-normal">{edu.location}</span>
                      </div>
                      {degreeText && (
                        <div className="flex justify-between italic text-[8.5px] text-slate-600 mt-0.5">
                          <span>{degreeText}</span>
                          {dateStr && <span>{dateStr}</span>}
                        </div>
                      )}
                      {edu.gpa && (
                        <div className="text-[8.5px] text-slate-500 mt-0.5">• {edu.gpa.replace(/^•\s*/, "")}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {achievements.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1">Achievements &amp; Problem Solving</h2>
              <div className="space-y-1 text-[9.5px] text-slate-700">
                {achievements.map((ach, idx) => {
                  const text = typeof ach === "string" ? ach : ach.text || "";
                  const colonIdx = text.indexOf(":");
                  if (colonIdx > 0 && colonIdx < 45) {
                    const label = text.substring(0, colonIdx).trim();
                    const rest = text.substring(colonIdx + 1).trim();
                    return (
                      <div key={idx} className="leading-tight text-justify">
                        <strong className="text-slate-900 font-bold">{label}: </strong>
                        <span>{rest}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={idx} className="leading-tight text-justify">{text}</div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── MINIMAL TEMPLATE PREVIEW ──────────────────────────────────────────────
  return (
    <div id="resume-print-area" className="bg-white text-gray-800 rounded-xl p-6 sm:p-8 shadow-xl font-sans text-[10px] max-w-2xl mx-auto my-2 border border-gray-300">
      <div className="border-b border-slate-200 pb-3 mb-3">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{name}</h1>
        <div className="text-[9px] text-gray-600 mt-0.5">
          {[location, phone, email].filter(Boolean).join(" • ")}
        </div>
        {links.length > 0 && (
          <div className="text-[9px] text-blue-600 flex items-center gap-1.5 mt-1 flex-wrap">
            {links.map((link, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-gray-400">•</span>}
                <a href={link.url} target="_blank" rel="noreferrer" className="hover:underline">
                  {link.label}
                </a>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {summary && (
        <div className="mb-3">
          <h2 className="text-[9.5px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1">
            Profile Summary
          </h2>
          <p className="text-[9.5px] text-slate-700 leading-relaxed text-justify">{summary}</p>
        </div>
      )}

      {education.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[10px] font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1.5">
            Education
          </h2>
          <div className="space-y-1.5">
            {education.map((edu, idx) => {
              const degreeText = edu.degree || edu.field ? `${edu.degree || ""}${edu.field ? " – " + edu.field : ""}` : "";
              const startD = (edu.startDate || "").replace(/^[\s—–-]+|[\s—–-]+$/g, "").trim();
              const endD = (edu.endDate || "").replace(/^[\s—–-]+|[\s—–-]+$/g, "").trim();
              const dateStr = startD && endD ? `${startD} – ${endD}` : (startD || endD || "");
              return (
                <div key={idx} className="text-[9.5px]">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{edu.institution}</span>
                    <span className="text-[8.5px] text-gray-500 font-normal">{edu.location}</span>
                  </div>
                  {degreeText && (
                    <div className="flex justify-between italic text-[8.5px] text-slate-600 mt-0.5">
                      <span>{degreeText}</span>
                      {dateStr && <span>{dateStr}</span>}
                    </div>
                  )}
                  {edu.gpa && (
                    <div className="text-[8.5px] text-gray-600 mt-0.5">• {edu.gpa.replace(/^•\s*/, "")}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {parsedSkills.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[10px] font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1.5">
            Technical Skills
          </h2>
          <div className="space-y-1 text-[9.5px]">
            {parsedSkills.map((cat, idx) => (
              <div key={idx} className="leading-snug">
                <strong className="text-slate-900 font-bold">{cat.name}: </strong>
                <span className="text-slate-800">{cat.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[10px] font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1.5">
            Projects
          </h2>
          {renderProjectsPreview(experience, false)}
        </div>
      )}

      {achievements.length > 0 && (
        <div>
          <h2 className="text-[10px] font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1.5">
            Achievements &amp; Problem Solving
          </h2>
          <div className="space-y-1 text-[9.5px] text-slate-800">
            {achievements.map((ach, idx) => {
              const text = typeof ach === "string" ? ach : ach.text || "";
              const colonIdx = text.indexOf(":");
              if (colonIdx > 0 && colonIdx < 45) {
                const label = text.substring(0, colonIdx).trim();
                const rest = text.substring(colonIdx + 1).trim();
                return (
                  <div key={idx} className="leading-snug text-justify">
                    <strong className="text-slate-900 font-bold">{label}: </strong>
                    <span>{rest}</span>
                  </div>
                );
              }
              return (
                <div key={idx} className="leading-snug text-justify">
                  {text}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeEditor;