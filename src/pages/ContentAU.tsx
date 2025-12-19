import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { FileText, ArrowRight, Mail } from 'lucide-react';

export default function ContentAU() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const docId = params.get('doc') || '';
  const core = params.get('core') === 'true';
  const audience = params.get('audience') === 'true';
  const ebook = params.get('ebook') === 'true';

  const document = storage.getDocument(docId);
  const [email, setEmail] = useState('');
  const [health, setHealth] = useState<{ hasApiKey: boolean; hasFromEmail: boolean } | null>(null);
  const metrics = useMemo(() => {
    const length = document?.content.trim().length || 0;
    const recent = document ? (Date.now() - new Date(document.updatedAt).getTime() <= 7*24*60*60*1000) : false;
    const recognition = core || audience || ebook;
    const authorReady = length >= 12000 && recognition && recent;
    const level = authorReady ? 'Author Level' : 'Draft Level';
    return { length, recent, recognition, level, authorReady };
  }, [document, core, audience, ebook]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/email-health');
        if (r.ok) {
          const data = await r.json();
          setHealth(data);
        } else {
          setHealth({ hasApiKey: false, hasFromEmail: false });
        }
      } catch {
        setHealth({ hasApiKey: false, hasFromEmail: false });
      }
    })();
  }, []);

  const sendEmail = async () => {
    if (!email.trim()) return;
    const subject = `[Content AU] 판별 결과 – ${document!.title}`;
    const html = `
      <h2>판정: ${metrics.level}</h2>
      <p>길이: ${metrics.length}자</p>
      <p>최근 수정: ${metrics.recent ? '7일 내' : '7일 초과'}</p>
      <p>인식 체크: ${metrics.recognition ? '충족' : '미충족'}</p>
      <p>다음 단계: ${metrics.authorReady ? '한나전(시장 등록)' : 'Draft Space로 보완'}</p>
    `;
    try {
      const r = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email, subject, html })
      });
      if (!r.ok) {
        const msg = r.status === 404 ? '배포 후 사용 가능합니다(Vercel Functions).' : '발송 실패';
        alert(msg);
        return;
      }
      alert('발송 완료');
    } catch {
      alert('네트워크 오류로 발송 실패');
    }
  };

  if (!document) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/80 mb-4">문서를 찾을 수 없습니다.</p>
          <button onClick={() => navigate('/drafts')} className="px-4 py-2 rounded-lg bg-white text-neutral-900">Draft Space로 이동</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=2400&auto=format&fit=crop')] bg-cover bg-center" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/50 to-neutral-950/90" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="mb-8 flex items-center gap-3 text-white">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/10">Stage 1</span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Content AU 판별 결과</h1>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-white/70 mb-1">문서</div>
                <div className="text-xl font-semibold">{document.title}</div>
              </div>
              <FileText className="w-5 h-5 text-white/50" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-white/15 bg-white/5">
                <div className="text-sm text-white/70">길이</div>
                <div className="text-lg font-medium">{metrics.length.toLocaleString()}자</div>
              </div>
              <div className="p-4 rounded-xl border border-white/15 bg-white/5">
                <div className="text-sm text-white/70">최근 수정</div>
                <div className="text-lg font-medium">{metrics.recent ? '7일 내' : '7일 초과'}</div>
              </div>
              <div className="p-4 rounded-xl border border-white/15 bg-white/5">
                <div className="text-sm text-white/70">인식 체크</div>
                <div className="text-lg font-medium">{metrics.recognition ? '충족' : '미충족'}</div>
              </div>
            </div>
            <div className="mt-6 p-5 rounded-xl border border-white/15 bg-white/5">
              <div className="text-sm text-white/70 mb-2">판정</div>
              <div className="text-2xl font-semibold">{metrics.level}</div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-6 text-white">
            <div className="text-sm text-white/70 mb-2">다음 단계</div>
            {metrics.authorReady ? (
              <div>
                <p className="text-white/80 mb-4">시장 등록 단계로 이동합니다.</p>
                <button onClick={() => navigate('/hanajeon')} className="w-full px-4 py-3 rounded-xl bg-white text-neutral-900 flex items-center justify-center gap-2">
                  <ArrowRight className="w-4 h-4" /> 한나전으로 이동
                </button>
              </div>
            ) : (
              <div>
                <p className="text-white/80 mb-4">원고 보완 후 다시 판별하세요.</p>
                <button onClick={() => navigate('/')} className="w-full px-4 py-3 rounded-xl bg-white text-neutral-900">Draft Space로 돌아가기</button>
              </div>
            )}
            <div className="mt-6">
              <div className="text-sm text-white/70 mb-2">결과 이메일 발송</div>
              <div className="flex items-center gap-2">
                <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="이메일" className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/60" />
                <button onClick={sendEmail} disabled={!health?.hasApiKey || !health?.hasFromEmail} className={`${health?.hasApiKey && health?.hasFromEmail ? 'px-4 py-2 rounded-lg bg-white text-neutral-900' : 'px-4 py-2 rounded-lg bg-white/5 text-white/50 border border-white/20 cursor-not-allowed'} flex items-center gap-2`}><Mail className="w-4 h-4"/>발송</button>
              </div>
              {health && (
                <div className="mt-2 text-xs text-white/70">상태: API 키 {health.hasApiKey ? '설정됨' : '없음'} / 발신 이메일 {health.hasFromEmail ? '설정됨' : '없음'}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
