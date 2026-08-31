import puppeteer from "puppeteer";
import { classicTemplate } from "../templates/classic.template.js";
import { modernTemplate } from "../templates/modern.template.js";
import { minimalTemplate } from "../templates/minimal.template.js";

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

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();

    // Load HTML content — `networkidle0` waits for Google Fonts to load
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      pageRanges: "1",
      margin:
        template === "modern"
          ? { top: "0in", right: "0in", bottom: "0in", left: "0in" }
          : { top: "0.25in", right: "0.3in", bottom: "0.25in", left: "0.3in" },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
};

export default { generatePDF };
