import { useState, useCallback } from 'react';
import { UploadCloud, FileText, Loader2, Type } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const ResumeUploader = ({ resumeId, onUploadSuccess, initialText }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload' | 'paste'
  const [rawText, setRawText] = useState(initialText || '');

  // ── PDF Upload ──────────────────────────────────────────
  const onDropPDF = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await api.post(`/resume/${resumeId}/upload-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Resume PDF parsed successfully');
      onUploadSuccess(data.rawText);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to parse file');
    } finally {
      setIsUploading(false);
    }
  }, [resumeId, onUploadSuccess]);

  const { getRootProps: getPDFRootProps, getInputProps: getPDFInputProps, isDragActive: isPDFDragActive } = useDropzone({
    onDrop: onDropPDF,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  // ── Raw Text Paste ──────────────────────────────────────
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

  const tabs = [
    { key: 'upload', label: 'Upload PDF', icon: FileText },
    { key: 'paste', label: 'Paste Text', icon: Type },
  ];

  return (
    <div className="bg-[#12121A] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#1A1A24] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-lg font-bold text-white flex items-center">
          <FileText className="w-5 h-5 mr-2 text-violet-400" />
          Step 1: Provide Resume
        </h3>
        <div className="flex bg-[#0A0A0F] rounded-lg p-1 border border-white/5">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                mode === key ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* ── PDF Upload ── */}
        {mode === 'upload' && (
          <div
            {...getPDFRootProps()}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
              isPDFDragActive ? 'border-violet-500 bg-violet-500/5' : 'border-white/10 hover:border-violet-500/50 hover:bg-white/5'
            }`}
          >
            <input {...getPDFInputProps()} />
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 text-violet-500 animate-spin mb-4" />
                <p className="text-white font-medium">Parsing your PDF...</p>
                <p className="text-gray-400 text-sm mt-1">Extracting text from PDF document</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#0A0A0F] rounded-full flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                  <UploadCloud className="w-8 h-8 text-violet-400" />
                </div>
                <p className="text-white font-medium text-lg mb-1">
                  {isPDFDragActive ? 'Drop your PDF here' : 'Click or drag PDF to upload'}
                </p>
                <p className="text-gray-400 text-sm mb-4">Supports PDF files (.pdf) — up to 10MB</p>
                <button className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors border border-white/5">
                  Select PDF File
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Paste Text ── */}
        {mode === 'paste' && (
          <div className="flex flex-col h-[300px]">
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste your plain text resume here..."
              className="flex-1 w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none font-mono text-sm leading-relaxed"
              disabled={isUploading}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handlePasteSubmit}
                disabled={isUploading || !rawText.trim()}
                className="flex items-center px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Resume Text
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploader;