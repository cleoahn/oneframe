import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, Edit, Trash2, Download, Plus } from 'lucide-react';
import { Document } from '../types/document';
import { storage } from '../utils/storage';
import { generatePDF, downloadTextFile } from '../utils/pdfGenerator';

export default function DraftSpace() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    const docs = storage.getDocuments();
    setDocuments(docs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  };

  const handleEditDocument = (document: Document) => {
    navigate(`/?doc=${document.id}`);
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm('정말로 이 문서를 삭제하시겠습니까?')) {
      storage.deleteDocument(id);
      loadDocuments();
    }
  };

  const handleExportPDF = (document: Document) => {
    generatePDF(document.content, document.title);
  };

  const handleExportText = (document: Document) => {
    downloadTextFile(document.content, document.title);
  };

  const handleNewDocument = () => {
    navigate('/');
  };

  const eligible = (doc: Document) => {
    const hasDocs = storage.getDocuments().length > 0;
    const lengthOK = doc.content.trim().length >= 8000;
    const recentOK = (() => {
      const diff = Date.now() - new Date(doc.updatedAt).getTime();
      return diff <= 7 * 24 * 60 * 60 * 1000;
    })();
    return { hasDocs, lengthOK, recentOK, all: hasDocs && lengthOK && recentOK };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2400&auto=format&fit=crop')] bg-cover bg-center" />
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
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-white">Draft Space</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNewDocument}
                className="px-4 py-2 rounded-lg bg-white text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                새 문서
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-white/90 hover:text-white rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
              >
                쓰기 공간
              </button>
              <button
                disabled
                className="px-4 py-2 text-white/50 rounded-lg border border-white/20 bg-white/5 cursor-not-allowed"
              >
                진단받기
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">임시 저장된 문서</h2>
          <p className="text-white/70">총 {documents.length}개의 문서가 있습니다.</p>
        </motion.div>

        {documents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="text-center py-16"
          >
            <FileText className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-white mb-2">저장된 문서가 없습니다</h3>
            <p className="text-white/70 mb-6">쓰기 공간에서 새 문서를 작성해보세요.</p>
            <button
              onClick={handleNewDocument}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>새 문서 작성하기</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {documents.map((document) => (
              <div key={document.id} className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-6 hover:bg-white/15 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1 truncate">
                      {document.title}
                    </h3>
                    <p className="text-sm text-white/60">
                      {formatDate(document.updatedAt)}
                    </p>
                  </div>
                  <FileText className="w-5 h-5 text-white/40 ml-3 flex-shrink-0" />
                </div>
                <div className="mb-4">
                  <p className="text-white/80 text-sm line-clamp-3">
                    {document.content.substring(0, 150)}
                    {document.content.length > 150 && '...'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditDocument(document)}
                    className="px-3 py-1.5 text-white/90 hover:text-white rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-sm"
                  >
                    <Edit className="w-3 h-3 mr-1" />편집
                  </button>
                  <button
                    onClick={() => handleExportPDF(document)}
                    className="px-3 py-1.5 rounded-lg bg-white text-neutral-900 hover:bg-neutral-100 text-sm"
                  >
                    <Download className="w-3 h-3 mr-1" />PDF
                  </button>
                  <button
                    onClick={() => handleExportText(document)}
                    className="px-3 py-1.5 text-white/90 hover:text-white rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-sm"
                  >
                    <FileText className="w-3 h-3 mr-1" />텍스트
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(document.id)}
                    className="px-3 py-1.5 text-red-300 hover:text-red-400 rounded-lg border border-red-300/30 bg-red-300/10 hover:bg-red-300/20 text-sm"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />삭제
                  </button>
                  <button
                    onClick={() => navigate(`/content-au?doc=${document.id}`)}
                    disabled={!eligible(document).all}
                    className={`${eligible(document).all ? 'px-3 py-1.5 rounded-lg bg-white text-neutral-900 hover:bg-neutral-100 text-sm' : 'px-3 py-1.5 text-white/50 rounded-lg border border-white/20 bg-white/5 cursor-not-allowed text-sm'}`}
                  >
                    진단받기
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
