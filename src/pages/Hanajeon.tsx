import React from 'react';
export default function Hanajeon() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="mb-8 flex items-center gap-3">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/10">Stage 2</span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">한나전 – 전자책 플랫폼 등록</h1>
        </div>
        <p className="text-white/80 mb-6">준비된 메시지를 실제 플랫폼에 등록해 시장 검증을 시작합니다.</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <a className="rounded-xl border border-white/15 bg-white/10 p-5 hover:bg-white/15" href="https://kmong.com" target="_blank">크몽</a>
          <a className="rounded-xl border border-white/15 bg-white/10 p-5 hover:bg-white/15" href="https://www.upaper.net" target="_blank">유페이퍼</a>
          <a className="rounded-xl border border-white/15 bg-white/10 p-5 hover:bg-white/15" href="https://smartstore.naver.com/duckandcleo" target="_blank">덕앤클레오 스마트스토어</a>
        </div>
      </div>
    </div>
  );
}
