import Resume from "../models/resume.js";
import User from "../models/user.js";
import { rewriteResume, calculateATSScore } from "../services/gemini.service.js";

// CREATE NEW RESUME
export const createResume = async (req, res) => {
  try {
    const { title = "Untitled Resume", rawText = "" } = req.body;

    const resume = new Resume({
      userId: req.user._id,
      title,
      rawText,
      status: "draft",
    });

    await resume.save();

    // Increment user's resume count
    await User.findByIdAndUpdate(req.user._id, { $inc: { resumeCount: 1 } });

    return res.status(201).json({
      success: true,
      message: "Resume created successfully",
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
