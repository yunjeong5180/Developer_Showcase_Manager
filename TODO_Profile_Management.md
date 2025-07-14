# 📋 프로필 관리 기능 완성 작업 목록

## 🚨 1단계: DB 문제 해결 (필수 - 최우선)

### Supabase 데이터베이스 설정

#### users 테이블에 누락된 열들 추가
```sql
ALTER TABLE users ADD COLUMN title TEXT;
ALTER TABLE users ADD COLUMN one_liner TEXT;
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN profile_image_url TEXT;
ALTER TABLE users ADD COLUMN github_url TEXT;
ALTER TABLE users ADD COLUMN linkedin_url TEXT;
ALTER TABLE users ADD COLUMN portfolio_url TEXT;
ALTER TABLE users ADD COLUMN blog_url TEXT;
ALTER TABLE users ADD COLUMN phone TEXT;
ALTER TABLE users ADD COLUMN location TEXT;
ALTER TABLE users ADD COLUMN skills JSONB DEFAULT '[]'::jsonb;
```

#### Supabase Storage 설정
- [ ] **`profile-images` 버킷 생성**
- [ ] **버킷 권한 설정** (인증된 사용자만 업로드 가능)

---

## 🔧 2단계: 기본 기능 테스트

- [ ] **프로필 데이터 로드 확인**
- [ ] **프로필 정보 저장 확인** 
- [ ] **이미지 업로드 확인**

---

## 🎨 3단계: 기술 스택 모달 기능 구현

### 모달 창 추가
- [ ] **기술 스택 모달 컴포넌트 생성**
- [ ] **모달 열기/닫기 버튼 연동**

### 기술 선택 인터페이스 
- [ ] **기술 목록 데이터 준비** 
  - Frontend: Vue.js, React, Angular, JavaScript, TypeScript, HTML5, CSS3, Sass, Less
  - Backend: Node.js, Python, Java, C#, PHP, Ruby, Go, Rust
  - Database: MySQL, PostgreSQL, MongoDB, Redis, SQLite
  - DevOps: Docker, Kubernetes, AWS, Azure, GCP, Jenkins, Git
  - Mobile: React Native, Flutter, Swift, Kotlin
  - Other: GraphQL, REST API, Webpack, Vite, Jest, Cypress

- [ ] **카테고리별 기술 분류 표시**
- [ ] **체크박스 방식 다중 선택 구현**
- [ ] **검색 기능 추가**

### 선택 로직 구현
- [ ] **중복 선택 방지 로직**
- [ ] **선택된 기술 실시간 표시**
- [ ] **선택 취소 기능**
- [ ] **최대 20개 제한 확인**

---

## 📋 4단계: 최종 테스트

- [ ] **전체 프로필 관리 기능 테스트**
  - 프로필 정보 입력 및 저장
  - 이미지 업로드 및 미리보기
  - URL 유효성 검사
  - 에러 메시지 표시

- [ ] **기술 스택 모달 동작 확인**
  - 모달 열기/닫기
  - 기술 선택/해제
  - 검색 기능
  - 중복 방지 및 제한

- [ ] **에러 처리 확인**
  - 네트워크 오류 시 대응
  - 잘못된 입력 처리
  - 로딩 상태 표시

---

## ⚡ 작업 순서

1. **DB 설정** → 2. **기본 기능 테스트** → 3. **모달 기능 구현** → 4. **최종 테스트**

## ⚠️ 중요 사항

- **1단계 DB 문제를 먼저 해결해야 나머지 기능들이 정상 작동합니다!**
- 현재 발생한 오류들:
  - `column users.title does not exist`
  - `Bucket not found` (profile-images)

## 📁 수정할 파일들

- `src/config/supabase.js` - DB 쿼리 수정 (열 이름 확인)
- `src/views/Profile.vue` - 모달 창 및 선택 로직 추가

---

*작성일: 2025-01-14*
*상태: 진행 중*