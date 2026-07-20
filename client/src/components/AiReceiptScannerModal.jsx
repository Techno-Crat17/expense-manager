import React, { useState } from 'react';
import { X, Camera, Scan, CheckCircle2, Sparkles, UploadCloud, ArrowRight } from 'lucide-react';
import API from '../services/api';

const AiReceiptScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      setPreviewImage(evt.target.result);
      processAiScan(evt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const processAiScan = async (imgData) => {
    try {
      setLoading(true);
      const res = await API.post('/ai/scan-receipt', { receiptData: imgData });
      setScannedData(res.data.extractedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAndAdd = async () => {
    if (!scannedData) return;
    await API.post('/transactions', scannedData);
    onScanSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              AI Vision Receipt Scanner
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {!previewImage ? (
            <div className="border-2 border-dashed border-purple-200 dark:border-purple-900/50 rounded-3xl p-8 text-center bg-purple-50/30 dark:bg-purple-950/20 space-y-3">
              <Camera className="w-12 h-12 mx-auto text-purple-600 dark:text-purple-400 animate-bounce" />
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Upload GPay / PhonePe / Paytm Bill Screenshot
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  AI OCR automatically detects Merchant, Amount (₹), and Category
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="receipt-file-input"
                className="hidden"
              />
              <label
                htmlFor="receipt-file-input"
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/25 transition-all"
              >
                <UploadCloud className="w-4 h-4" /> Snap or Select Screenshot
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image Preview & Scanning Overlay */}
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 max-h-48 bg-black/80 flex items-center justify-center">
                <img src={previewImage} alt="Receipt preview" className="max-h-48 object-contain opacity-90" />
                {loading && (
                  <div className="absolute inset-0 bg-purple-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs font-bold space-y-2">
                    <Scan className="w-8 h-8 animate-spin text-purple-300" />
                    <span>AI Vision Engine Extracting OCR Data...</span>
                  </div>
                )}
              </div>

              {/* Extracted Details Result */}
              {scannedData && (
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> AI OCR Extraction Complete
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-gray-800 dark:text-gray-200 font-semibold pt-1">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Merchant / Title</span>
                      <span>{scannedData.title}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Extracted Amount</span>
                      <span className="text-emerald-600 font-bold">₹{scannedData.amount}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Category</span>
                      <span>{scannedData.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Note</span>
                      <span className="truncate">{scannedData.note}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmAndAdd}
                    className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    Confirm & Save to Ledger <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiReceiptScannerModal;
