# 🧪 자동 페이지 이동 → 모달 변경 테스트 시나리오

## 📋 테스트 개요
기존의 자동 페이지 이동(setTimeout) 기능을 모달로 변경한 후, 모든 기능이 정상적으로 작동하는지 확인하는 테스트입니다.

---

## 🔐 1. 비밀번호 재설정 플로우 테스트

### 1.1 비밀번호 재설정 링크 요청
- [ ] 로그인 페이지 접속
- [ ] "비밀번호를 잊으셨나요?" 링크 클릭
- [ ] 유효한 이메일 주소 입력
- [ ] "재설정 링크 보내기" 버튼 클릭
- [ ] **✅ 모달 확인**: "이메일 전송 완료" 모달이 표시되는가?
- [ ] 모달 메시지: "비밀번호 재설정 링크가 이메일로 전송되었습니다. 로그인 페이지로 이동하시겠습니까?"
- [ ] **확인 버튼 클릭** → 로그인 페이지로 이동하는가?
- [ ] **취소 버튼 클릭** → 비밀번호 찾기 페이지에 머물러 있는가?

### 1.2 비밀번호 재설정 실행
- [ ] 이메일에서 재설정 링크 클릭
- [ ] 비밀번호 재설정 페이지 접속 확인
- [ ] 새 비밀번호 입력 (8자 이상)
- [ ] 비밀번호 확인 입력
- [ ] "비밀번호 변경" 버튼 클릭
- [ ] **✅ 모달 확인**: "비밀번호 변경 완료" 모달이 표시되는가?
- [ ] 모달 메시지: "비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동하시겠습니까?"
- [ ] **확인 버튼 클릭** → 로그인 페이지로 이동하는가?
- [ ] **취소 버튼 클릭** → 재설정 페이지에 머물러 있는가?

### 1.3 비밀번호 재설정 에러 처리
- [ ] 동일한 비밀번호로 재설정 시도
- [ ] **✅ 에러 메시지 확인**: "비밀번호는 이전 비밀번호와 달라야 합니다." 표시되는가?
- [ ] 만료된 재설정 링크 클릭
- [ ] **✅ 모달 확인**: "링크 만료" 에러 모달이 표시되는가?
- [ ] 확인 버튼 클릭 → 비밀번호 찾기 페이지로 이동하는가?

---

## 👤 2. 회원가입 플로우 테스트

### 2.1 신규 회원가입
- [ ] 로그인 페이지에서 "회원가입" 링크 클릭
- [ ] 이름 입력 (실명)
- [ ] 닉네임 입력 (2-20자)
- [ ] 유효한 이메일 주소 입력
- [ ] 비밀번호 입력 (8자 이상, 대소문자, 숫자, 특수문자 포함)
- [ ] 비밀번호 확인 입력
- [ ] "회원가입" 버튼 클릭
- [ ] **✅ 모달 확인**: "회원가입 완료" 모달이 표시되는가?
- [ ] 모달 메시지: "회원가입이 완료되었습니다! 로그인 페이지로 이동하시겠습니까?"
- [ ] **확인 버튼 클릭** → 로그인 페이지로 이동하는가?
- [ ] **취소 버튼 클릭** → 회원가입 페이지에 머물러 있는가?

### 2.2 회원가입 에러 처리
- [ ] 이미 가입된 이메일로 회원가입 시도
- [ ] 적절한 에러 메시지가 표시되는가?
- [ ] 비밀번호 확인 불일치 시 에러 메시지 표시되는가?
- [ ] 닉네임 중복 확인 기능이 정상 작동하는가?

---

## 🔐 3. AuthCallback 에러 처리 테스트

### 3.1 인증 콜백 에러 상황
- [ ] 만료된 OAuth 토큰으로 접속 시도
- [ ] **✅ 모달 확인**: "인증 오류" 모달이 표시되는가?
- [ ] 확인 버튼 클릭 → 적절한 페이지로 이동하는가?
- [ ] 세션 없는 상태에서 콜백 접속
- [ ] **✅ 모달 확인**: "로그인 세션 오류" 모달이 표시되는가?
- [ ] 확인 버튼 클릭 → 로그인 페이지로 이동하는가?

---

## 📝 4. 프로젝트 생성 플로우 테스트

### 4.1 프로젝트 생성 및 저장
- [ ] 대시보드에서 "프로젝트 작성" 클릭
- [ ] 프로젝트 제목 입력
- [ ] 프로젝트 설명 입력
- [ ] 프로젝트 URL 입력 (선택사항)
- [ ] GitHub URL 입력 (선택사항)
- [ ] 시작일/종료일 입력
- [ ] 기술 스택 추가
- [ ] 메인 이미지 업로드 (선택사항)
- [ ] "프로젝트 저장" 버튼 클릭
- [ ] **✅ 모달 확인**: "프로젝트 저장 완료" 모달이 표시되는가?
- [ ] 모달 메시지: "프로젝트가 성공적으로 저장되었습니다! 프로젝트 목록 페이지로 이동하시겠습니까?"
- [ ] **확인 버튼 클릭** → 프로젝트 목록 페이지로 이동하는가?
- [ ] **취소 버튼 클릭** → 프로젝트 생성 페이지에 머물러 있는가?

---

## 📱 5. 모바일 반응형 테스트

### 5.1 모바일 뷰 테스트
- [ ] 브라우저 개발자 도구 → 모바일 뷰로 변경
- [ ] 각 모달이 모바일에서 제대로 표시되는가?
- [ ] 모달 버튼들이 세로로 정렬되는가?
- [ ] 모달 텍스트가 적절히 줄바꿈되는가?
- [ ] 모달 오버레이 클릭 시 모달이 닫히는가?
- [ ] 터치 인터페이스에서 버튼 클릭이 정상 작동하는가?

### 5.2 다양한 화면 크기 테스트
- [ ] 320px (iPhone SE) - 모달 표시 확인
- [ ] 768px (태블릿) - 모달 표시 확인
- [ ] 1024px (데스크톱) - 모달 표시 확인

---

## 🔍 6. 세부 기능 테스트

### 6.1 모달 기본 동작 확인
- [ ] 모달이 화면 중앙에 정확히 표시되는가?
- [ ] 모달 배경 오버레이가 반투명하게 표시되는가?
- [ ] 모달 외부 클릭 시 모달이 닫히는가?
- [ ] ESC 키로 모달이 닫히는가? (해당되는 경우)
- [ ] 모달 버튼에 호버 효과가 적용되는가?

### 6.2 자동 이동 제거 확인
- [ ] **중요**: 더 이상 자동으로 페이지가 이동하지 않는가?
- [ ] 사용자가 직접 버튼을 클릭해야만 이동하는가?
- [ ] 모달이 표시된 후 사용자가 충분한 시간을 갖고 메시지를 읽을 수 있는가?

### 6.3 UX 개선 확인
- [ ] 모달 제목과 메시지가 명확하고 이해하기 쉬운가?
- [ ] 확인/취소 버튼의 역할이 명확한가?
- [ ] 사용자가 실수로 취소할 수 있는 옵션이 제공되는가?

---

## 🐛 7. 에러 상황 테스트

### 7.1 네트워크 오류 상황
- [ ] 인터넷 연결 없이 회원가입 시도
- [ ] 적절한 에러 메시지가 표시되는가?
- [ ] 서버 응답 지연 시 로딩 상태가 표시되는가?

### 7.2 잘못된 입력 처리
- [ ] 빈 필드로 폼 제출 시도
- [ ] 유효성 검사 에러 메시지가 표시되는가?
- [ ] 잘못된 이메일 형식 입력 시 에러 표시되는가?

---

## ✅ 테스트 완료 체크리스트

### 핵심 기능 ✅
- [ ] 비밀번호 재설정 플로우 완전 테스트
- [ ] 회원가입 플로우 완전 테스트
- [ ] 프로젝트 생성 플로우 완전 테스트
- [ ] 모든 자동 이동이 모달로 변경됨 확인

### 사용자 경험 ✅
- [ ] 모든 모달이 정상 표시됨
- [ ] 모바일 반응형 정상 작동
- [ ] 에러 처리가 적절함
- [ ] 사용자가 선택권을 가짐

### 기술적 완성도 ✅
- [ ] 콘솔 에러 없음
- [ ] 모든 브라우저에서 정상 작동
- [ ] 성능 이슈 없음

---

## 📝 테스트 결과 메모

### 발견된 이슈
- 이슈 1: 
- 이슈 2: 
- 이슈 3: 

### 개선 사항
- 개선 1: 
- 개선 2: 
- 개선 3: 

### 전체 평가
- [ ] 모든 테스트 통과 ✅
- [ ] 일부 수정 필요 ⚠️
- [ ] 주요 이슈 발견 ❌

---

**테스트 완료일**: `____년 __월 __일`  
**테스터**: `___________`  
**테스트 환경**: `브라우저명 + 버전, OS`