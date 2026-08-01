import { useState } from 'react';
import { Sparkles, CheckCircle2, Briefcase, GraduationCap, Code, Mail, Phone, MapPin, Layout } from 'lucide-react';

const ResumeEditor = ({ data, template: initialTemplate = 'classic', onTemplateChange }) => {
  const [activeTemplate, setActiveTemplate] = useState(initialTemplate);

  if (!data) return null;

  const handleSelectTemplate = (tpl) => {
    setActiveTemplate(tpl);
    if (onTemplateChange) onTemplateChange(tpl);
  };

  const {
    name,
    email,
    phone,
    location,
    linkedin,
    github,
    summary,
    experience = [],
    education = [],
    skills = [],
    rawText = "",
  } = data;

  const displayName = name || "Applicant Name";
  const displaySummary = summary || (rawText ? rawText.split('\n').find(l => l.length > 40) : "");

  const rawExperience = (experience && experience.length > 0)
    ? experience
    : (rawText ? [{
      company: "Key Accomplishments & Experience",
      title: "Technical Projects & Contributions",
      startDate: "",
      endDate: "",
      bullets: rawText.split('\n').map(l => l.trim().replace(/^[-•]\s*/, '')).filter(l => l.length > 20).slice(0, 6)
    }] : []);

  // Deduplicate Experience Bullets
  const displayExperience = (rawExperience || []).map((exp) => {
    const uniqueBullets = Array.from(new Set((exp.bullets || []).map((b) => b.trim()))).filter(Boolean);
    return { ...exp, bullets: uniqueBullets };
  });

  // Deduplicate and format skills into single-line categories
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

  const categorizedSkills = formatCategorizedSkills(
    skills && skills.length > 0 ? skills : rawText ? [rawText] : []
  );

  // Deduplicate Education
  const displayEducation = Array.from(
    new Set((education || []).map((e) => JSON.stringify(e)))
  ).map((s) => JSON.parse(s));

  return (
    <div className="relative w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden transition-all duration-300">

      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header & Template Selector Toolbar */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI ATS Resume Preview</h3>
            <p className="text-[11px] text-gray-400">Switch templates to customize design</p>
          </div>
        </div>

        {/* Template Selector Pills */}
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 p-1.5 rounded-2xl">
          <span className="text-[11px] font-semibold text-gray-400 px-2 flex items-center gap-1">
            <Layout className="w-3.5 h-3.5 text-red-400" />
            Template:
          </span>
          {[
            { id: 'classic', name: 'Classic' },
            { id: 'modern', name: 'Modern' },
            { id: 'minimal', name: 'Minimal' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelectTemplate(t.id)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${activeTemplate === t.id
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* ──────────────────────────────────────────────── */}
      {/* TEMPLATE 1: CLASSIC (Harvard/Standard Tech ATS)  */}
      {/* ──────────────────────────────────────────────── */}
      {activeTemplate === 'classic' && (
        <div className="printable-resume-card bg-white text-black rounded-2xl p-4 sm:p-7 shadow-2xl font-serif text-xs border border-gray-200 leading-snug select-text">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-black font-serif tracking-tight mb-0.5">
              {displayName}
            </h1>

            {/* Contact info line */}
            <div className="text-xs text-black font-serif flex flex-wrap justify-center items-center gap-1.5 mb-0.5">
              {location && <span>{location}</span>}
              {location && (phone || email) && <span>|</span>}
              {phone && <span>{phone}</span>}
              {phone && email && <span>|</span>}
              {email && <span className="underline">{email}</span>}
            </div>

            {/* Links line */}
            <div className="text-xs text-black font-serif flex flex-wrap justify-center items-center gap-2">
              {linkedin ? (
                <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noreferrer" className="underline hover:text-gray-700">
                  LinkedIn
                </a>
              ) : (
                <span className="underline cursor-pointer">LinkedIn</span>
              )}
              <span>|</span>
              {github ? (
                <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noreferrer" className="underline hover:text-gray-700">
                  GitHub
                </a>
              ) : (
                <span className="underline cursor-pointer">GitHub</span>
              )}
              <span>|</span>
              <span className="underline cursor-pointer">LeetCode</span>
              <span>|</span>
              <span className="underline cursor-pointer">GeeksforGeeks</span>
            </div>
          </div>

          {/* PROFESSIONAL SUMMARY */}
          {displaySummary && (
            <div className="mb-4">
              <h2 className="text-xs font-bold text-black uppercase font-serif tracking-wider mb-0.5">
                PROFESSIONAL SUMMARY
              </h2>
              <div className="border-b border-black mb-1.5"></div>
              <p className="text-xs sm:text-[12.5px] font-serif leading-relaxed text-black font-normal text-justify">
                {displaySummary}
              </p>
            </div>
          )}

          {/* EDUCATION */}
          {displayEducation && displayEducation.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xs font-bold text-black uppercase font-serif tracking-wider mb-0.5">
                EDUCATION
              </h2>
              <div className="border-b border-black mb-2"></div>
              <div className="space-y-2 font-serif">
                {displayEducation.map((edu, idx) => {
                  const instName = (edu.institution || "").trim();
                  const prevInst = idx > 0 ? (displayEducation[idx - 1].institution || "").trim() : "";
                  const isSameInstitution = instName && instName.toLowerCase() === prevInst.toLowerCase();

                  const degreeText = edu.degree && edu.degree !== "Degree / Program" ? `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}` : '';
                  const cleanGpa = edu.gpa ? edu.gpa.replace(/^Status:\s*/i, "Status: ") : "";
                  const gpaFormatted = cleanGpa ? (cleanGpa.startsWith("Status:") ? `• ${cleanGpa}` : `• Status: ${cleanGpa}`) : "";

                  return (
                    <div key={idx} className="space-y-0.5">
                      {!isSameInstitution && (
                        <div className="flex justify-between items-baseline text-xs sm:text-sm">
                          <span className="font-bold text-black">{instName}</span>
                          {edu.location && <span className="font-normal text-black">{edu.location}</span>}
                        </div>
                      )}
                      <div className="flex justify-between items-baseline text-xs italic">
                        <span className="text-gray-900">{degreeText}</span>
                        {(edu.startDate || edu.endDate) && (
                          <span className="text-gray-900">{edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ''}</span>
                        )}
                      </div>
                      {gpaFormatted && (
                        <div className="text-xs text-black">
                          {gpaFormatted}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TECHNICAL SKILLS */}
          {categorizedSkills && categorizedSkills.length > 0 && (
            <div className="mb-4 font-serif">
              <h2 className="text-xs font-bold text-black uppercase tracking-wider mb-0.5">
                TECHNICAL SKILLS
              </h2>
              <div className="border-b border-black mb-1.5"></div>
              <div className="space-y-1 text-xs sm:text-[12.5px] text-black">
                {categorizedSkills.map((cat, i) => (
                  <div key={i}>
                    <span className="font-bold">{cat.name}: </span>
                    <span>{cat.items.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TECHNICAL PROJECTS */}
          {displayExperience && displayExperience.length > 0 && (
            <div className="mb-4 font-serif">
              <h2 className="text-xs font-bold text-black uppercase tracking-wider mb-0.5">
                TECHNICAL PROJECTS
              </h2>
              <div className="border-b border-black mb-2"></div>
              <div className="space-y-3">
                {displayExperience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs sm:text-sm">
                      <div>
                        <span className="font-bold text-black">{exp.company || exp.title}</span>
                        {exp.title && exp.company && exp.title !== exp.company && (
                          <span className="font-normal text-black"> – {exp.title}</span>
                        )}
                        {exp.subtitle && (
                          <span className="italic text-gray-900 font-normal"> | {exp.subtitle}</span>
                        )}
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <span className="text-xs italic text-gray-800 font-normal">
                          {exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ''}
                        </span>
                      )}
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-black leading-relaxed">
                      {(exp.bullets || []).map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────── */}
      {/* TEMPLATE 2: MODERN (Sidebar Split Layout) */}
      {/* ──────────────────────────────────────────────── */}
      {activeTemplate === 'modern' && (
        <div className="bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-gray-200">

          {/* Left Sidebar Accent Panel */}
          <div className="md:col-span-4 bg-[#0f172a] text-slate-100 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Name & Badge */}
              <div className="pb-6 mb-6 border-b border-slate-700/60">
                <h1 className="text-2xl font-extrabold text-white tracking-tight leading-tight">{name || 'Your Name'}</h1>
                <p className="text-xs text-orange-400 font-semibold mt-1 uppercase tracking-wider">Professional Profile</p>
              </div>

              {/* Contact Info */}
              <div className="mb-6 space-y-2.5 text-xs text-slate-300">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Contact</h3>
                {email && <div className="flex items-center gap-2 break-all"><Mail className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />{email}</div>}
                {phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />{phone}</div>}
                {location && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />{location}</div>}
              </div>

              {/* Skills Sidebar List */}
              {skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Core Competencies</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s, i) => (
                      <span key={i} className="text-[11px] bg-slate-800 text-slate-200 border border-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Education Sidebar List */}
            {education.length > 0 && (
              <div className="pt-4 border-t border-slate-700/60">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Education</h3>
                <div className="space-y-3 text-xs">
                  {education.map((edu, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="font-bold text-white text-xs">{edu.degree}</div>
                      <div className="text-[11px] text-slate-300">{edu.institution}</div>
                      <div className="text-[10px] text-slate-400">{edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Main Content */}
          <div className="md:col-span-8 p-6 sm:p-8 bg-slate-50">
            {summary && (
              <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1">
                  Executive Summary
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
              </div>
            )}

            {experience.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4 pb-1 border-b-2 border-orange-500 inline-block">
                  Work Experience
                </h2>
                <div className="space-y-5">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className="font-bold text-slate-900 text-sm">{exp.title}</h3>
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full self-start">
                          {exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ''}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-600">{exp.company}</div>
                      <ul className="list-disc pl-4 space-y-1 mt-2">
                        {(exp.bullets || []).map((b, i) => (
                          <li key={i} className="text-xs text-slate-700 leading-relaxed">{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ──────────────────────────────────────────────── */}
      {/* TEMPLATE 3: MINIMAL (Modern Contemporary Layout) */}
      {/* ──────────────────────────────────────────────── */}
      {activeTemplate === 'minimal' && (
        <div className="bg-[#fafafa] text-gray-900 rounded-2xl p-4 sm:p-7 shadow-2xl font-sans text-xs border border-gray-200 relative overflow-hidden">

          {/* Top Gradient Line Header */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500" />

          {/* Clean Left-Aligned Header */}
          <div className="pb-6 mb-6 border-b border-gray-200">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">{name || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-600">
              {email && <span>{email}</span>}
              {phone && <span>• {phone}</span>}
              {location && <span>• {location}</span>}
            </div>
          </div>

          {summary && (
            <div className="mb-6">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">About</h2>
              <p className="text-xs text-gray-800 leading-relaxed font-normal">{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Experience</h2>
              <div className="space-y-6">
                {experience.map((exp, idx) => (
                  <div key={idx} className="border-l-2 border-red-500 pl-4 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="font-bold text-gray-900 text-sm">{exp.title}</h3>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ''}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-gray-700">{exp.company}</div>
                    <ul className="space-y-1 mt-2">
                      {(exp.bullets || []).map((b, i) => (
                        <li key={i} className="text-xs text-gray-600 leading-relaxed flex items-start gap-2">
                          <span className="text-red-500 font-bold">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span key={i} className="text-xs bg-white border border-gray-300 text-gray-900 px-3 py-1 rounded-full font-medium shadow-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Education</h2>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs border-t border-gray-200 pt-2">
                    <div>
                      <span className="font-bold text-gray-900">{edu.degree}</span> {edu.field && `in ${edu.field}`}
                      <div className="text-gray-500 text-[11px]">{edu.institution} {edu.gpa && `| GPA: ${edu.gpa}`}</div>
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono">
                      {edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ResumeEditor;
