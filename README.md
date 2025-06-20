🎨 Developer Showcase Frontend

개발자 포트폴리오를 관리하는 관리자 페이지 프론트엔드

이미지 표시
이미지 표시
이미지 표시
📋 프로젝트 소개
Developer Showcase는 개발자들이 자신의 포트폴리오를 효과적으로 관리하고 보여줄 수 있는 플랫폼입니다.
이 프론트엔드 프로젝트는 관리자 페이지로, 포트폴리오 소유자가 자신의 프로젝트와 정보를 관리할 수 있는 대시보드를 제공합니다.
🎯 주요 목표

📊 직관적인 포트폴리오 관리 인터페이스 제공
🚀 초보 개발자도 쉽게 사용할 수 있는 가이드 제공
💡 모든 프로젝트를 한 곳에서 체계적으로 관리

✨ 주요 기능
🔐 사용자 인증

회원가입 / 로그인
JWT 기반 인증 시스템
비밀번호 재설정

📝 프로젝트 관리

프로젝트 생성, 수정, 삭제
프로젝트 이미지 업로드
기술 스택 태그 관리
프로젝트 공개/비공개 설정

👤 프로필 관리

개인 정보 수정
프로필 이미지 업로드
소셜 링크 관리 (GitHub, LinkedIn 등)
자기소개 작성

📊 경력 관리

경력 사항 추가/수정
학력 정보 관리
자격증 관리

🛠 기술 스택
Frontend

Vue.js 3 - 프레임워크
Vue Router - 라우팅
Vuex/Pinia - 상태 관리
Axios - HTTP 클라이언트
Element Plus / Vuetify - UI 컴포넌트

Development Tools

Vue CLI - 개발 환경
ESLint - 코드 린팅
Prettier - 코드 포맷팅

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
🔗 관련 프로젝트
이 프로젝트는 Developer Showcase 플랫폼의 일부입니다:

Frontend (관리자): developer-showcase-frontend ⭐ 현재 저장소
Frontend (사용자): portfolio - 일반 사용자가 보는 포트폴리오 페이지
Backend API: developer-showcase-backend - Spring Boot API 서버

🌐 배포 구조
www.내도메인.com     → 사용자 페이지 (portfolio)
admin.내도메인.com   → 관리자 페이지 (이 프로젝트)
api.내도메인.com     → 백엔드 API 서버
📝 개발 진행 상황
✅ 완료된 작업

프로젝트 초기 설정
Vue CLI 환경 구성
ESLint 설정
Git 저장소 연결

🚧 진행 중

기본 레이아웃 구성
라우팅 설정
인증 페이지 개발

📋 예정된 작업

API 연동
프로젝트 관리 기능
파일 업로드 기능
반응형 디자인 적용

🤝 기여하기

Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request

📄 라이선스
This project is licensed under the MIT License - see the LICENSE file for details.
📞 연락처

개발자: YunJeong
GitHub: @yunjeong5180
프로젝트 링크: https://github.com/yunjeong5180/developer-showcase-frontend


⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!