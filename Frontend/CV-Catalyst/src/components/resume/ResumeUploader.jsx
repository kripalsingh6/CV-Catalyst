import { useState } from 'react';
import { UploadCloud, FileText, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const ResumeUploader = ({ resumeId, onUploadSuccess, initialText }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload' or 'paste'
  const [rawText, setRawText] = useState(initialText || '');
  const [isDragActive, setIsDragActive] = useState(false);

  const processFile = async (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      toast.error('Only PDF files are supported currently');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await api.post(`/resume/${resumeId}/upload-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Resume parsed successfully');
      onUploadSuccess(data.rawText);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to parse PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handlePasteSubmit = async () => {
    if (!rawText.trim()) {
      toast.error('Please paste your resume text');
      return;
    }

    setIsUploading(true);
    try {
      const { data } = await api.post(`/resume/${resumeId}/upload-raw`, { rawText });
      toast.success('Resume text saved successfully');
      onUploadSuccess(data.rawText);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save text');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
      
      {/* Background ambient glow */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-red-600/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Step 1: Upload Existing Resume</h3>
            <p className="text-xs text-gray-400">PDF extract or raw text paste</p>
          </div>
        </div>

        <div className="flex bg-black/40 rounded-xl p-1 border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setMode('upload')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'upload'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Upload PDF
          </button>
          <button
            onClick={() => setMode('paste')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'paste'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Paste Text
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {mode === 'upload' ? (
          <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`block border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
              isDragActive 
                ? 'border-red-500 bg-red-500/10' 
                : 'border-white/10 hover:border-red-500/50 hover:bg-white/5'
            }`}
          >
            <input 
              type="file" 
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden" 
            />
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
                <p className="text-white font-semibold">Extracting text from PDF...</p>
                <p className="text-gray-400 text-xs mt-1">OCR engine processing document</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-orange-500/10 rounded-2xl flex items-center justify-center mb-4 border border-red-500/20 shadow-lg">
                  <UploadCloud className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-white font-semibold text-base mb-1">
                  {isDragActive ? 'Drop your PDF file here' : 'Click or drag PDF to upload'}
                </p>
                <p className="text-gray-400 text-xs mb-4">Supports PDF files up to 5MB.</p>
                <span className="inline-block px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl transition border border-white/10">
                  Select File
                </span>
              </div>
            )}
          </label>
        ) : (
          <div className="flex flex-col h-[300px]">
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste your plain text resume content here (work experience, skills, education)..."
              className="flex-1 w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-gray-200 focus:outline-none focus:border-red-500/50 resize-none font-sans text-xs leading-relaxed placeholder-gray-500"
              disabled={isUploading}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handlePasteSubmit}
                disabled={isUploading || !rawText.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:opacity-90 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 shadow-lg shadow-red-500/20"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Save Resume Text
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploader;
