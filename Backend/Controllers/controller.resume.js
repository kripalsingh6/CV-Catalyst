import fs from "fs";
import mongoose from "mongoose";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import Resume from "../models/resume.js";
import User from "../models/user.js";
import {
  rewriteResume,
  calculateATSScore,
  analyzeJobDescription,
  extractTextFromImageOrPDF,
} from "../services/gemini.service.js";

// EXTRACT TEXT FROM UPLOADED FILE (PDF, IMAGE, WORD)
export const extractFileTextController = async (req, res) => {
  let filePath = null;
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    filePath = file.path;
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = file.mimetype || "";
    const fileName = file.originalname || "Uploaded Resume";
    const ext = fileName.toLowerCase();

    let extractedText = "";

    if (mimeType.includes("pdf") || ext.endsWith(".pdf")) {
      try {
        const uint8Array = new Uint8Array(fileBuffer);
        const parser = new PDFParse(uint8Array);
        await parser.load();
        const parsed = await parser.getText();
        extractedText = typeof parsed === "string" ? parsed : parsed?.text || "";
      } catch (pdfErr) {
        console.warn("⚠️ PDFParse failed, falling back to Gemini OCR:", pdfErr.message);
      }

      // If PDF text extraction is empty or too short, use Gemini OCR Vision
      if (!extractedText || extractedText.trim().length < 20) {
        extractedText = await extractTextFromImageOrPDF(fileBuffer, "application/pdf");
      }
    } else if (
      mimeType.includes("word") ||
      mimeType.includes("officedocument") ||
      ext.endsWith(".docx") ||
      ext.endsWith(".doc")
    ) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      extractedText = result.value || "";
    } else if (
      mimeType.startsWith("image/") ||
      ext.endsWith(".png") ||
      ext.endsWith(".jpg") ||
      ext.endsWith(".jpeg") ||
      ext.endsWith(".webp")
    ) {
      extractedText = await extractTextFromImageOrPDF(fileBuffer, mimeType || "image/png");
    } else {
      extractedText = fileBuffer.toString("utf-8");
    }

    // Clean up temporary file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(200).json({
      success: true,
      message: "Text extracted successfully",
      text: extractedText.trim(),
      fileName: fileName,
    });
  } catch (error) {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch {}
    }
    console.error("Error in extractFileTextController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to extract text from file",
      error: error.message,
    });
  }
};

// UPLOAD FILE TO RESUME (PDF, IMAGE, WORD) — saves rawText to the specific resume
export const uploadResumeFile = async (req, res) => {
  let filePath = null;
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    filePath = file.path;
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = file.mimetype || "";
    const ext = (file.originalname || "").toLowerCase();

    let extractedText = "";

    if (mimeType.includes("pdf") || ext.endsWith(".pdf")) {
      // Try native PDF text extraction first
      try {
        const uint8Array = new Uint8Array(fileBuffer);
        const parser = new PDFParse(uint8Array);
        await parser.load();
        const parsed = await parser.getText();
        extractedText = typeof parsed === "string" ? parsed : parsed?.text || "";
      } catch (pdfErr) {
        console.warn("⚠️ PDFParse failed, falling back to Gemini OCR:", pdfErr.message);
      }

      // If PDF text is empty/too short, use Gemini Vision OCR
      if (!extractedText || extractedText.trim().length < 20) {
        extractedText = await extractTextFromImageOrPDF(fileBuffer, "application/pdf");
      }
    } else if (
      mimeType.includes("word") ||
      mimeType.includes("officedocument") ||
      ext.endsWith(".docx") ||
      ext.endsWith(".doc")
    ) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      extractedText = result.value || "";
    } else if (
      mimeType.startsWith("image/") ||
      ext.endsWith(".png") ||
      ext.endsWith(".jpg") ||
      ext.endsWith(".jpeg") ||
      ext.endsWith(".webp")
    ) {
      // Use Gemini Vision OCR for images
      extractedText = await extractTextFromImageOrPDF(fileBuffer, mimeType || "image/png");
    } else {
      extractedText = fileBuffer.toString("utf-8");
    }

    // Clean up temp file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    if (!extractedText || extractedText.trim().length < 5) {
      return res.status(422).json({
        success: false,
        message: "Could not extract any text from the uploaded file. Please try a clearer image or a text-based PDF.",
      });
    }

    resume.rawText = extractedText.trim();
    if (resume.status === "new") resume.status = "draft";
    await resume.save();

    return res.status(200).json({
      success: true,
      message: "File parsed and resume updated successfully",
      rawText: resume.rawText,
    });
  } catch (error) {
    if (filePath && fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch {}
    }
    console.error("Error in uploadResumeFile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process uploaded file",
      error: error.message,
    });
  }
};

// SAVE RAW TEXT TO RESUME
export const uploadRawText = async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ success: false, message: "No text provided" });
    }

    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    resume.rawText = rawText.trim();
    if (resume.status === "new") resume.status = "draft";
    await resume.save();

    return res.status(200).json({
      success: true,
      message: "Resume text saved successfully",
      rawText: resume.rawText,
    });
  } catch (error) {
    console.error("Error in uploadRawText:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save resume text",
      error: error.message,
    });
  }
};

// CREATE NEW RESUME (WITH AUTOMATIC OPTIMIZATION & REWRITE GENERATION)
export const createResume = async (req, res) => {
  try {
    const { title = "Untitled Resume", rawText = "", template = "classic", jobDescription = "" } = req.body;

    const resume = new Resume({
      userId: req.user._id,
      title,
      rawText,
      template,
      jobDescription,
      status: "draft",
    });

    let jdAnalysis = {};
    if (jobDescription && jobDescription.trim().length > 10) {
      jdAnalysis = await analyzeJobDescription(jobDescription);
      resume.jdAnalysis = jdAnalysis;
    }

    // Always optimize and generate structured resume data if text content or JD is provided
    const textToProcess = rawText && rawText.trim().length > 5 ? rawText : jobDescription;
    if (textToProcess && textToProcess.trim().length > 5) {
      const rewrittenData = await rewriteResume(textToProcess, jdAnalysis);
      const rewrittenString = JSON.stringify(rewrittenData);
      const atsScore = calculateATSScore(rewrittenString, jdAnalysis);

      resume.rewrittenData = rewrittenData;
      resume.atsScore = atsScore;
      resume.status = "rewritten";
    }

    await resume.save();

    // Increment user's resume count
    await User.findByIdAndUpdate(req.user._id, { $inc: { resumeCount: 1 } });

    return res.status(201).json({
      success: true,
      message: resume.status === "rewritten"
        ? "Resume created, AI optimized, and generated successfully!"
        : "Resume created successfully",
      resume,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create resume",
      error: error.message,
    });
  }
};

// GET ALL USER RESUMES
export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      resumes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resumes",
      error: error.message,
    });
  }
};

// GET SINGLE RESUME BY ID
export const getResumeById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Resume ID format" });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
      error: error.message,
    });
  }
};

// REWRITE RESUME WITH AI & CALCULATE ATS SCORE
export const rewriteResumeController = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    if (!resume.rawText) {
      return res.status(400).json({ success: false, message: "Resume text is empty" });
    }

    const { template } = req.body || {};
    if (template && ["classic", "modern", "minimal"].includes(template)) {
      resume.template = template;
    }

    const jdAnalysis = resume.jdAnalysis || {};

    // Call Gemini AI rewrite agent
    const rewrittenData = await rewriteResume(resume.rawText, jdAnalysis);

    // Calculate ATS score
    const rewrittenString = JSON.stringify(rewrittenData);
    const atsScore = calculateATSScore(rewrittenString, jdAnalysis);

    resume.rewrittenData = rewrittenData;
    resume.atsScore = atsScore;
    resume.status = "rewritten";

    await resume.save();

    return res.status(200).json({
      success: true,
      message: "Resume rewritten successfully",
      resume,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to rewrite resume",
      error: error.message,
    });
  }
};

// EXPORT RESUME AS PDF VIA PUPPETEER
export const exportPDFController = async (req, res) => {
  try {
    const { template } = req.body || {};
    const selectedTemplate = template || req.query.template;
    const resumeId = req.params.id;

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    const data = resume.rewrittenData || { name: req.user?.name || "Applicant Name", rawText: resume.rawText };

    const { generatePDF } = await import("../services/puppeteer.service.js");
    const pdfBuffer = await generatePDF(data, selectedTemplate || resume.template || "classic");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${(data.name || "resume").replace(/\s+/g, "_")}_CV.pdf"`,
      "Content-Length": pdfBuffer.length,
    });

    return res.end(pdfBuffer);
  } catch (error) {
    console.error("❌ Export PDF error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to export PDF",
      error: error.message,
    });
  }
};

// DELETE RESUME
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete resume",
      error: error.message,
    });
  }
};
