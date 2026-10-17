import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle2, XCircle, FileText, Hash, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { DocumentReference, DocumentVerifyResult } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DocumentHashModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReferenceHash?: string;
  initialDocumentTitle?: string;
}

export const DocumentHashModal: React.FC<DocumentHashModalProps> = ({
  isOpen,
  onClose,
  initialReferenceHash = '',
  initialDocumentTitle = '',
}) => {
  const { language, t, text } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [referenceHash, setReferenceHash] = useState(initialReferenceHash);
  const [docTitle, setDocTitle] = useState(initialDocumentTitle);
  const [sampleDocs, setSampleDocs] = useState<DocumentReference[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DocumentVerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setReferenceHash(initialReferenceHash);
      setDocTitle(initialDocumentTitle);
      setResult(null);
      setError(null);
      setSelectedFile(null);

      api.getDocumentReferences()
        .then((res) => setSampleDocs(res.documents))
        .catch(() => {});
    }
  }, [isOpen, initialReferenceHash, initialDocumentTitle]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleSelectSampleDoc = (doc: DocumentReference) => {
    setReferenceHash(doc.reference_hash);
    setDocTitle(`${doc.doc_title} (${doc.file_name})`);
    setResult(null);
    setError(null);
  };

  const handleCreateDummyFile = (isTampered: boolean) => {
    const content = isTampered
      ? 'SYNTHETIC LAND DEED DOCUMENT [ALTERED CONTENT INSERTED FOR FRAUD SIMULATION 2026]'
      : 'SYNTHETIC DEED FOR LAND RECORD LR-DHK-2024-001\nPlot 125, Joypara Mouza.\nOfficial Verification SHA-256 Checksum Anchor.';
    const blob = new Blob([content], { type: 'text/plain' });
    const dummyFile = new File([blob], isTampered ? 'tampered_deed.txt' : 'original_deed.txt', {
      type: 'text/plain',
    });
    setSelectedFile(dummyFile);
    setResult(null);
    setError(null);
  };

  const handleVerify = async () => {
    if (!selectedFile) {
      setError(language === 'bn' ? 'অনুগ্রহ করে যাচাইয়ের জন্য একটি ফাইল নির্বাচন করুন।' : 'Please select a document file to verify.');
      return;
    }
    if (!referenceHash.trim()) {
      setError(language === 'bn' ? 'অনুগ্রহ করে অফিসিয়াল রেফারেন্স হ্যাশ প্রদান করুন।' : 'Please provide or select an expected reference hash.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.verifyDocumentHash(selectedFile, referenceHash.trim());
      setResult(res);
    } catch (err: any) {
      setError(err.message || (language === 'bn' ? 'হ্যাশ যাচাইকরণ ব্যর্থ হয়েছে।' : 'Failed to verify document hash.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">{text(t.docModal.title)}</h3>
              <p className="text-xs text-slate-500">{text(t.docModal.subtitle)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Sample Select Helper */}
          {sampleDocs.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {text(t.docModal.selectSample)}
              </label>
              <div className="grid grid-cols-1 gap-1.5 max-h-32 overflow-y-auto pr-1">
                {sampleDocs.slice(0, 5).map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => handleSelectSampleDoc(doc)}
                    className="text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/50 transition-all text-xs flex items-center justify-between group"
                  >
                    <span className="font-medium text-slate-800 group-hover:text-emerald-700 truncate mr-2">
                      {doc.doc_title} ({doc.file_name})
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 shrink-0">
                      {doc.reference_hash.slice(0, 10)}...
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reference Hash Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {text(t.docModal.referenceHash)}
            </label>
            <input
              type="text"
              value={referenceHash}
              onChange={(e) => setReferenceHash(e.target.value)}
              placeholder="e.g. 5d41402abc4b2a76b9719d911017c592..."
              className="w-full px-3 py-2 font-mono text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Document Upload Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {text(t.docModal.uploadFile)}
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
              <input
                type="file"
                id="docUpload"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.txt,.png,.jpg,.jpeg,.doc,.docx"
              />
              <label htmlFor="docUpload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-emerald-700 hover:underline">
                  {selectedFile ? selectedFile.name : text(t.docModal.dropzone)}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'PDF, JPG, PNG, TXT up to 10MB'}
                </span>
              </label>
            </div>

            {/* Quick in-memory synthetic generators for demo testing */}
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-slate-500 text-[11px]">
                {language === 'bn' ? 'দ্রুত পরীক্ষামূলক ফাইল তৈরি:' : 'Quick demo tests:'}
              </span>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => handleCreateDummyFile(false)}
                  className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold hover:bg-emerald-100"
                >
                  {text(t.docModal.quickTestClean)}
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateDummyFile(true)}
                  className="px-2 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold hover:bg-rose-100"
                >
                  {text(t.docModal.quickTestTampered)}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div
              className={`p-4 rounded-xl border ${
                result.is_match
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                {result.is_match ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600" />
                )}
                <span className="text-sm font-bold">
                  {result.is_match ? text(t.docModal.matchSuccess) : text(t.docModal.tamperAlert)}
                </span>
              </div>
              <p className="text-xs mb-3">{result.explanation}</p>
              
              <div className="space-y-1.5 font-mono text-[10px] bg-white/80 p-2.5 rounded-lg border border-current/20">
                <div className="truncate">
                  <span className="font-semibold text-slate-500">Expected: </span>
                  {result.reference_hash}
                </div>
                <div className="truncate">
                  <span className="font-semibold text-slate-500">Computed: </span>
                  {result.computed_hash}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {text(t.common.close)}
          </button>
          <button
            onClick={handleVerify}
            disabled={loading || !selectedFile}
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-1.5"
          >
            {loading ? text(t.common.loading) : text(t.docModal.verifyButton)}
          </button>
        </div>

      </div>
    </div>
  );
};
