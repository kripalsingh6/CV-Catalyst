import puppeteer from "puppeteer";
import fs from "fs";
import { classicTemplate } from "../templates/classic.template.js";
import { modernTemplate } from "../templates/modern.template.js";
import { minimalTemplate } from "../templates/minimal.template.js";

const getExecutablePath = () => {
  const chromePaths = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ];
  for (const p of chromePaths) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
};

const TEMPLATES = {
  classic: classicTemplate,
  modern: modernTemplate,
  minimal: minimalTemplate,
};

/**
 * Generate a PDF from structured resume data using Puppeteer headless Chrome.
 * @param {object} resumeData  — rewrittenData from Resume model
 * @param {string} template    — "classic" | "modern" | "minimal"
 * @returns {Promise<Buffer>}  — PDF buffer ready to stream to client
 */
export const generatePDF = async (resumeData, template = "classic") => {
  const templateFn = TEMPLATES[template] || TEMPLATES.classic;
  const html = templateFn(resumeData);

  const execPath = getExecutablePath();
  const launchOptions = {
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  };
  if (execPath) {
    launchOptions.executablePath = execPath;
  }

  const browser = await puppeteer.launch(launchOptions);

  try {
    const page = await browser.newPage();

    // Standard A4 pixel size at 96 DPI: 794 x 1123
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

    // Load HTML content — waits for DOM and fonts without hanging on networkidle0
    await page.setContent(html, { waitUntil: ["domcontentloaded", "load"], timeout: 60000 });
    await page.evaluateHandle("document.fonts.ready");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      pageRanges: "1",
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
};

export default { generatePDF };
