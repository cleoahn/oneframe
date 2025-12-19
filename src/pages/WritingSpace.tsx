import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Upload, Save } from 'lucide-react';
import { Document } from '../types/document';
import { storage } from '../utils/storage';
import { processFile } from '../utils/fileProcessor';
import { generatePDF, downloadTextFile } from '../utils/pdfGenerator';

export default function WritingSpace() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('새 문서');
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [msgIntent, setMsgIntent] = useState({ core: false, audience: false, ebook: false });

  // 현재 문서 ID가 있으면 해당 문서 로드
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const docId = urlParams.get('doc');
    if (docId) {
      const document = storage.getDocument(docId);
      if (document) {
        setCurrentDocumentId(docId);
        setContent(document.content);
        setTitle(document.title);
      }
    }
  }, []);

  const autoSave = useCallback(() => {
    setIsAutoSaving(true);
    const document: Document = {
      id: currentDocumentId || Date.now().toString(),
      title: title || '무제',
      content,
      createdAt: currentDocumentId ? storage.getDocument(currentDocumentId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    storage.saveDocument(document);
    if (!currentDocumentId) {
      setCurrentDocumentId(document.id);
      window.history.replaceState({}, '', `/?doc=${document.id}`);
    }
    
    setTimeout(() => setIsAutoSaving(false), 1000);
  }, [content, title, currentDocumentId]);

  // 자동 저장 (30초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      if (content.trim()) {
        autoSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [content, title, autoSave]);

  const isEligible = () => {
    const docs = storage.getDocuments();
    const hasDocs = docs.length > 0;
    const lengthOK = content.trim().length >= 8000;
    const recentOK = (() => {
      const updated = currentDocumentId ? storage.getDocument(currentDocumentId)?.updatedAt : null;
      if (!updated) return false;
      const diff = Date.now() - new Date(updated).getTime();
      return diff <= 7 * 24 * 60 * 60 * 1000;
    })();
    const recognitionOK = msgIntent.core || msgIntent.audience || msgIntent.ebook;
    return { hasDocs, lengthOK, recentOK, recognitionOK, all: hasDocs && lengthOK && recentOK && recognitionOK };
  };

  const handleDiagnosis = () => {
    const ok = isEligible();
    if (!ok.all) return;
    const params = new URLSearchParams();
    params.set('doc', currentDocumentId || '');
    params.set('core', String(msgIntent.core));
    params.set('audience', String(msgIntent.audience));
    params.set('ebook', String(msgIntent.ebook));
    navigate(`/content-au?${params.toString()}`);
  };

  const handleFileUpload = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const fileContent = await processFile(file);
        setContent(prev => prev + '\n\n' + fileContent);
      } catch {
        alert(`${file.name} 파일 처리 중 오류가 발생했습니다.`);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    dragCounter.current = 0;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleExportPDF = () => {
    if (!content.trim()) {
      alert('내용이 없습니다.');
      return;
    }
    generatePDF(content, title);
  };

  const handleExportText = () => {
    if (!content.trim()) {
      alert('내용이 없습니다.');
      return;
    }
    downloadTextFile(content, title);
  };

  const handleManualSave = () => {
    if (content.trim()) {
      autoSave();
      alert('저장되었습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2400&auto=format&fit=crop')] bg-cover bg-center" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/50 to-neutral-950/90" />

      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 inset-x-0 z-40 bg-white/10 backdrop-blur-lg border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/10 text-white">현재 위치</span>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-white">쓰기 공간</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/drafts')}
                className="px-4 py-2 text-white/90 hover:text-white rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Draft Space
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {isAutoSaving && (
        <div className="fixed top-16 inset-x-0 z-30 bg-white/5 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-8">
              <Save className="w-4 h-4 text-white mr-2" />
              <span className="text-sm text-white/80">자동 저장 중...</span>
            </div>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        className="mt-16 bg-white/10 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-medium text-white placeholder-white/70 bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 rounded px-3 py-2"
                placeholder="문서 제목"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.docx"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>파일 가져오기</span>
              </button>
              <button
                onClick={handleExportText}
                className="flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>텍스트 다운로드</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>PDF 내보내기</span>
              </button>
              <button
                onClick={handleManualSave}
                className="flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>저장</span>
              </button>
              <button
                onClick={handleDiagnosis}
                disabled={!isEligible().all}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isEligible().all ? 'bg-white text-neutral-900 hover:bg-neutral-100' : 'bg-white/5 text-white/50 border border-white/20 cursor-not-allowed'}`}
              >
                <span>진단받기</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex-1">
        <div
          className={`min-h-screen ${isDragging ? 'bg-white/5' : ''}`}
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-6 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-4 text-white">
              <div className="text-sm mb-2">진단 활성 조건</div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2"><div className={`h-2 w-2 rounded-full ${content.trim().length>=8000?'bg-emerald-400':'bg-red-400'}`}></div><span>문서 길이 8,000자 이상</span></div>
                <div className="flex items-center gap-2"><div className={`h-2 w-2 rounded-full ${isEligible().recentOK?'bg-emerald-400':'bg-red-400'}`}></div><span>최근 7일 이내 수정</span></div>
                <div className="flex items-center gap-2"><div className={`h-2 w-2 rounded-full ${isEligible().hasDocs?'bg-emerald-400':'bg-red-400'}`}></div><span>저장된 문서 1개 이상</span></div>
                <div className="flex items-center gap-2"><div className={`h-2 w-2 rounded-full ${isEligible().recognitionOK?'bg-emerald-400':'bg-red-400'}`}></div><span>인식 체크 최소 1개</span></div>
              </div>
              <div className="mt-3 grid sm:grid-cols-3 gap-2">
                <label className="flex items-center gap-2"><input type="checkbox" checked={msgIntent.core} onChange={(e)=>setMsgIntent(s=>({...s,core:e.target.checked}))} /><span className="text-white/80">핵심 메시지 있음</span></label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={msgIntent.audience} onChange={(e)=>setMsgIntent(s=>({...s,audience:e.target.checked}))} /><span className="text-white/80">특정 독자 떠올림</span></label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={msgIntent.ebook} onChange={(e)=>setMsgIntent(s=>({...s,ebook:e.target.checked}))} /><span className="text-white/80">전자책 의도 있음</span></label>
              </div>
              <div className="mt-2 text-xs text-white/60">Content AU는 글을 고쳐주지 않습니다. 현재 글이 메시지로 설 수 있는지 판단합니다.</div>
            </div>
            {isDragging && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                  <Upload className="w-10 h-10 text-white mx-auto mb-4" />
                  <p className="text-base text-white/80">파일을 여기에 드롭하세요</p>
                </div>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md shadow-soft"
            >
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="여기에 텍스트를 입력하거나 파일을 드롭하세요"
                className="w-full min-h-[70vh] p-6 sm:p-8 text-white placeholder-white/40 bg-transparent focus:outline-none resize-none"
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-5 left-0 right-0 z-40 sm:hidden">
        <div className="mx-auto max-w-sm px-4">
          <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg p-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 mr-2 px-4 py-3 text-white/90 rounded-xl border border-white/20 bg-white/5"
            >
              파일
            </button>
            <button
              onClick={handleExportPDF}
              className="flex-1 ml-2 px-4 py-3 rounded-xl bg-white text-neutral-900"
            >
              PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
