import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

// Paths
const mdPath = path.resolve('../README.md');
const pdfPath = path.resolve('../CV_Catalyst_Project_Presentation.pdf');

const mdContent = fs.readFileSync(mdPath, 'utf-8');

/**
 * Markdown to HTML Converter with overflow, styling, and alert support
 */
function mdToHtml(md) {
  let html = md;

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="${lang || ''}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // GitHub Alerts
  html = html.replace(/^>\s*\[\!NOTE\]\s*(.*$)/gim, '<div class="alert alert-note"><strong>NOTE:</strong> $1</div>');
  html = html.replace(/^>\s*\[\!TIP\]\s*(.*$)/gim, '<div class="alert alert-tip"><strong>TIP:</strong> $1</div>');
  html = html.replace(/^>\s*\[\!IMPORTANT\]\s*(.*$)/gim, '<div class="alert alert-important"><strong>IMPORTANT:</strong> $1</div>');
  html = html.replace(/^>\s*\[\!WARNING\]\s*(.*$)/gim, '<div class="alert alert-warning"><strong>WARNING:</strong> $1</div>');
  html = html.replace(/^>\s*(.*$)/gim, '<blockquote>$1</blockquote>');

  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Markdown Tables
  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = '';
  let newLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      if (line.includes('---')) continue;
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (!inTable) {
        inTable = true;
        tableHtml = '<table><thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
      } else {
        tableHtml += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
      }
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</tbody></table>';
        newLines.push(tableHtml);
        tableHtml = '';
      }
      newLines.push(line);
    }
  }
  if (inTable) {
    tableHtml += '</tbody></table>';
    newLines.push(tableHtml);
  }

  html = newLines.join('\n');

  // Lists
  html = html.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr>');

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');

  return html;
}

const bodyHtml = mdToHtml(mdContent);

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm;
    }
    * {
      box-sizing: border-box;
    }
    html, body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.5;
      color: #1e293b;
      background: #ffffff;
      overflow: visible; /* Prevents Chrome PDF renderer from clipping long content */
    }
    h1 {
      font-size: 20pt;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
      margin-top: 0;
      color: #0f172a;
    }
    h2 {
      font-size: 15pt;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 20px;
      color: #1e293b;
    }
    h3 {
      font-size: 12pt;
      margin-top: 16px;
      color: #334155;
    }
    p, li {
      word-wrap: break-word;
      overflow-wrap: break-word;
      margin-bottom: 10px;
    }
    code {
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 9pt;
      color: #dc2626;
    }
    pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 12px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 8.5pt;
      line-height: 1.4;
    }
    pre code {
      background: transparent;
      padding: 0;
      color: inherit;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 9.5pt;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      text-align: left;
    }
    th {
      background: #f8fafc;
      font-weight: 600;
      color: #0f172a;
    }
    tr:nth-child(even) {
      background: #f8fafc;
    }
    blockquote {
      border-left: 4px solid #94a3b8;
      color: #475569;
      padding-left: 12px;
      margin: 10px 0;
      font-style: italic;
    }
    .alert {
      padding: 10px 14px;
      border-radius: 6px;
      margin: 10px 0;
      font-size: 9.5pt;
    }
    .alert-note { background: #eff6ff; border-left: 4px solid #3b82f6; color: #1e40af; }
    .alert-tip { background: #f0fdf4; border-left: 4px solid #22c55e; color: #15803d; }
    .alert-important { background: #fefce8; border-left: 4px solid #eab308; color: #854d0e; }
    .alert-warning { background: #fef2f2; border-left: 4px solid #ef4444; color: #991b1b; }
    ul {
      padding-left: 20px;
      margin-bottom: 10px;
    }
    li {
      margin-bottom: 3px;
    }
    hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 16px 0;
    }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;

export async function generateDocumentationPDF() {
  console.log('🚀 Launching Puppeteer Headless Chrome Engine...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' }
    });
    console.log('✅ PDF successfully created at:', pdfPath);
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && process.argv[1].endsWith('generate_pdf_doc.js')) {
  generateDocumentationPDF().catch(console.error);
}
