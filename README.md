# 한나전 0번 전자책 기획안 시스템 - MVP 랜딩페이지

고전환율 MVP 랜딩페이지로, 관심 단계의 방문자가 "나도 해보고 싶다"라고 느끼게 하고 39,000원을 결제하도록 유도합니다.

## 프로젝트 구성

### 페이지
1. **index.html** - 메인 랜딩 페이지
   - 프리-히어로 섹션 (스토리 형식)
   - 히어로 섹션 (메인 헤드라인)
   - 문제 공감 섹션
   - 해결 방식 섹션
   - 0번 상품 소개
   - A/B 테스트 신뢰 블록
   - 최종 CTA

2. **thank-you.html** - 결제 완료 페이지
   - 구매 완료 메시지
   - 다운로드 버튼 (2개)
   - 다음 단계 안내
   - 1번, 2번 상품 업셀
   - 번들 옵션

3. **bundle.html** - 번들 안내 페이지
   - 전체 패키지 소개
   - 할인 가격 표시
   - 번들 구매 CTA

## A/B 테스트

URL 파라미터로 A/B 테스트 가능:
- `?ver=A` - 구조 중심 메시지 (기본값)
- `?ver=B` - 사람 + 구조 메시지

예시:
```
https://yoursite.com/?ver=A
https://yoursite.com/?ver=B
```

## 사용 방법

### 1. 결제 링크 교체
다음 링크를 실제 결제 링크로 교체하세요:
- `PAYMENT_LINK` - 0번 상품 결제 링크
- `PAYMENT_LINK_PRODUCT1` - 1번 상품 결제 링크
- `PAYMENT_LINK_PRODUCT2` - 2번 상품 결제 링크
- `PAYMENT_LINK_BUNDLE` - 번들 결제 링크

### 2. 로컬 테스트
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

브라우저에서 `http://localhost:8000` 접속

### 3. 배포
정적 사이트 호스팅 서비스에 업로드:
- **Vercel**: GitHub 연동 후 자동 배포
- **Netlify**: 드래그 앤 드롭으로 배포
- **GitHub Pages**: 레포지토리 설정

#### Vercel 배포 (추천)
1. GitHub에 프로젝트 업로드
2. Vercel 계정 생성
3. GitHub 연동
4. 자동 배포 설정

#### Netlify 배포
1. netlify.com 접속
2. "Add new site" 클릭
3. 프로젝트 폴더 드래그 앤 드롭
4. 배포 완료

## 디자인 스펙

- **Primary Color**: #0f766e (진한 청록)
- **Secondary Color**: #f8fafc (밝은 회톤)
- **Font**: Pretendard
- **Button Style**: 8px 둥근 모서리, 플랫 디자인
- **Layout**: 모바일 우선 반응형

## 파일 다운로드

thank-you.html 페이지에서 다음 파일 다운로드 가능:
- 전자책 기획안 템플릿
- AI 사고 검증 질문 12문항

## 분석 및 추적

브라우저 콘솔에서 다음 정보 확인 가능:
- A/B 테스트 버전
- 다운로드 트래킹
- 페이지 방문 추적

## 라이선스

이 프로젝트는 한나전의 전자책 기획안 시스템을 위한 MVP로 제작되었습니다.