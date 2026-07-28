import { useState } from 'react';
import { Sparkles, CheckCircle2, Briefcase, GraduationCap, Code, Mail, Phone, MapPin, Layout } from 'lucide-react';

const ResumeEditor = ({ data, template: initialTemplate = 'classic', onTemplateChange }) => {
  const [activeTemplate, setActiveTemplate] = useState(initialTemplate);

  if (!data) return null;

  const handleSelectTemplate = (tpl) => {
    setActiveTemplate(tpl);
    if (onTemplateChange) onTemplateChange(tpl);
  };

  const { name, email, phone, location, summary, experience = [], education = [], skills = [] } = data;

  return (
    <div className="relative w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden transition-all duration-300">
      
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header & Template Selector Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-white/10">
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
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTemplate === t.id
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
      {/* TEMPLATE 1: CLASSIC (Traditional Centered Layout) */}
      {/* ──────────────────────────────────────────────── */}
      {activeTemplate === 'classic' && (
        <div className="bg-white text-gray-900 rounded-2xl p-6 sm:p-10 shadow-2xl font-sans text-xs sm:text-sm border border-gray-200">
          <div className="text-center pb-6 mb-6 border-b border-gray-200">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{name || 'Your Name'}</h1>
            <div className="flex flex-wrap justify-center items-center gap-4 text-gray-600 mt-2 text-xs font-medium">
              {email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-gray-400" />{email}</span>}
              {phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-gray-400" />{phone}</span>}
              {location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" />{location}</span>}
            </div>
          </div>

          {summary && (
            <div className="mb-6">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">
                Professional Summary
              </h2>
              <p className="text-xs leading-relaxed text-gray-700 font-normal">{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-gray-700" />
                Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="font-bold text-gray-900 text-xs sm:text-sm">{exp.title}</h3>
                      <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                        {exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ''}
                      </span>
                    </div>
                    <div className="font-semibold text-red-600 text-xs">{exp.company}</div>
                    <ul className="list-disc pl-4 space-y-1 mt-2">
                      {(exp.bullets || []).map((b, i) => (
                        <li key={i} className="text-xs text-gray-700 leading-relaxed">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-gray-700" />
                Technical & Core Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s, i) => (
                  <span key={i} className="text-xs bg-gray-100 border border-gray-200 text-gray-800 px-2.5 py-1 rounded-md font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-gray-700" />
                Education & Credentials
              </h2>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900">{edu.degree}</span> {edu.field && `in ${edu.field}`}
                      <div className="text-gray-600 text-[11px]">{edu.institution} {edu.gpa && `| GPA: ${edu.gpa}`}</div>
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">
                      {edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ''}
                    </div>
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
        <div className="bg-[#fafafa] text-gray-900 rounded-2xl p-6 sm:p-10 shadow-2xl font-sans text-xs sm:text-sm border border-gray-200 relative overflow-hidden">
          
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
