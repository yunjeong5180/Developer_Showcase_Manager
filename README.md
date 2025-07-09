포트폴리오 관리 시스템
웹 개발을 배우고 있는 열정적인 개발자의 포트폴리오를 관리하는 관리자 페이지입니다.
🚀 프로젝트 소개
이 프로젝트는 Vue.js를 프론트엔드로, Spring Boot를 백엔드로 사용한 포트폴리오 관리 시스템의 관리자 페이지입니다.
포트폴리오 소유자가 자신의 프로젝트, 경력, 프로필 정보를 효율적으로 관리할 수 있는 직관적인 대시보드를 제공합니다.
✨ 주요 기능

포트폴리오 관리: 프로젝트 생성, 수정, 삭제 및 이미지 업로드
프로필 관리: 개인 정보, 자기소개, 소셜 링크 관리
경력 관리: 경력 사항, 학력, 자격증 정보 관리
반응형 디자인: 모바일, 태블릿, 데스크탑 모든 기기에서 최적화
직관적인 UI/UX: 깔끔하고 사용하기 쉬운 관리자 인터페이스
실시간 미리보기: 작성한 내용을 실시간으로 확인 가능

🛠️ 기술 스택
Frontend

Vue.js 3.x
Vue Router (라우팅)
Vuex/Pinia (상태 관리)
JavaScript (ES6+)
CSS3 (Grid, Flexbox, Animations)
Axios (HTTP 클라이언트)

Backend (연동 예정)

Java 17+
Spring Boot 3.x
PostgreSQL
JWT (인증)

개발 도구

Vue CLI
ESLint (코드 린팅)
Git/GitHub

배포

Netlify/Vercel (Frontend)
Railway/Heroku (Backend)

🚀 시작하기
필수 조건

Node.js 18.0 이상
npm 또는 yarn

설치 및 실행

저장소 클론
bashgit clone https://github.com/yunjeong5180/developer-showcase-frontend.git
cd developer-showcase-frontend

의존성 설치
bashnpm install

개발 서버 실행
bashnpm run serve

브라우저에서 확인
http://localhost:8080


기타 명령어
bash# 프로덕션 빌드
npm run build

# 린팅 검사
npm run lint

# 린팅 자동 수정
npm run lint -- --fix
📁 프로젝트 구조
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── common/         # 공통 컴포넌트
│   ├── forms/          # 폼 관련 컴포넌트
│   └── layout/         # 레이아웃 컴포넌트
├── views/              # 페이지 컴포넌트
│   ├── auth/          # 인증 관련 페이지
│   ├── dashboard/     # 대시보드
│   ├── projects/      # 프로젝트 관리
│   └── profile/       # 프로필 관리
├── router/            # 라우팅 설정
├── store/             # 상태 관리
├── services/          # API 서비스
├── utils/             # 유틸리티 함수
├── assets/            # 정적 파일
└── styles/            # 스타일 파일
🌐 시스템 구조
www.내도메인.com     → 사용자 페이지 (포트폴리오 조회)
admin.내도메인.com   → 관리자 페이지 (이 프로젝트)
api.내도메인.com     → 백엔드 API 서버
📝 개발 현황
✅ 완료

프로젝트 초기 설정 및 환경 구성
Vue CLI 개발 환경 설정
Git 저장소 연결 및 GitHub 업로드

🚧 진행 중

기본 레이아웃 및 라우팅 구성
사용자 인증 시스템 개발
API 연동 준비

📋 예정

프로젝트 관리 기능 구현
파일 업로드 시스템
반응형 디자인 적용
백엔드 API 연동

📞 개발자 정보

이름: 양윤정
GitHub: @yunjeong5180
프로젝트: developer-showcase-frontend


⭐ 포트폴리오 관리를 위한 든든한 도구가 되길 바랍니다!