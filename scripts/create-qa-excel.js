const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// QA 테스트 템플릿 생성
function createQAExcel() {
  const wb = XLSX.utils.book_new();

  // 1. 테스트 개요 시트
  const overviewData = [
    ['MyCodit-vue QA 테스트 기록'],
    [],
    ['프로젝트명', 'MyCodit-vue'],
    ['테스트 버전', '1.0.0'],
    ['테스트 환경', 'Development / Production'],
    ['테스터', ''],
    ['테스트 기간', '2025-01-01 ~ 현재'],
    [],
    ['총 테스트 케이스', '=COUNTA(인증기능!B:B)-1'],
    ['성공', '=COUNTIF(인증기능!G:G,"통과")+COUNTIF(프로필관리!G:G,"통과")+COUNTIF(포스트관리!G:G,"통과")+COUNTIF(대시보드!G:G,"통과")+COUNTIF(UI_UX!G:G,"통과")'],
    ['실패', '=COUNTIF(인증기능!G:G,"실패")+COUNTIF(프로필관리!G:G,"실패")+COUNTIF(포스트관리!G:G,"실패")+COUNTIF(대시보드!G:G,"실패")+COUNTIF(UI_UX!G:G,"실패")'],
    ['보류', '=COUNTIF(인증기능!G:G,"보류")+COUNTIF(프로필관리!G:G,"보류")+COUNTIF(포스트관리!G:G,"보류")+COUNTIF(대시보드!G:G,"보류")+COUNTIF(UI_UX!G:G,"보류")']
  ];
  const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(wb, wsOverview, '개요');

  // 2. 인증 기능 테스트 시트
  const authHeaders = [
    ['테스트 ID', '기능 분류', '테스트 케이스', '테스트 단계', '예상 결과', '실제 결과', '상태', '테스트 일자', '담당자', '비고']
  ];
  const authData = [
    ['AUTH-001', '회원가입', '정상 회원가입', '1. 회원가입 페이지 접속\n2. 유효한 정보 입력\n3. 가입 버튼 클릭', '회원가입 성공 및 로그인 페이지 이동', '', '', '', '', ''],
    ['AUTH-002', '회원가입', '중복 이메일 검증', '1. 이미 존재하는 이메일 입력\n2. 가입 시도', '중복 이메일 에러 메시지 표시', '', '', '', '', ''],
    ['AUTH-003', '회원가입', '비밀번호 유효성 검증', '1. 짧은 비밀번호 입력\n2. 가입 시도', '비밀번호 규칙 에러 메시지 표시', '', '', '', '', ''],
    ['AUTH-004', '로그인', '정상 로그인', '1. 로그인 페이지 접속\n2. 올바른 계정 정보 입력\n3. 로그인 버튼 클릭', '로그인 성공 및 대시보드 이동', '', '', '', '', ''],
    ['AUTH-005', '로그인', '잘못된 비밀번호', '1. 올바른 이메일, 잘못된 비밀번호 입력\n2. 로그인 시도', '로그인 실패 메시지 표시', '', '', '', '', ''],
    ['AUTH-006', '로그인', '로그인 상태 유지', '1. 로그인 상태 유지 체크\n2. 로그인\n3. 브라우저 종료 후 재접속', '자동 로그인 유지', '', '', '', '', ''],
    ['AUTH-007', '로그아웃', '정상 로그아웃', '1. 로그인 상태에서 로그아웃 버튼 클릭', '로그아웃 및 홈 페이지 이동', '', '', '', '', ''],
    ['AUTH-008', '비밀번호 재설정', '이메일로 재설정', '1. 비밀번호 찾기 클릭\n2. 이메일 입력\n3. 재설정 링크 확인', '재설정 이메일 발송 및 변경 가능', '', '', '', '', ''],
    ['AUTH-009', '소셜 로그인', 'Google 로그인', '1. Google 로그인 버튼 클릭\n2. Google 계정으로 인증', 'Google 계정으로 로그인 성공', '', '', '', '', ''],
    ['AUTH-010', '세션 관리', '서버 재시작 시 로그아웃', '1. 로그인 상태\n2. 서버 재시작\n3. 페이지 새로고침', '자동 로그아웃 처리', '', '', '', '', '']
  ];
  const wsAuth = XLSX.utils.aoa_to_sheet([...authHeaders, ...authData]);
  XLSX.utils.book_append_sheet(wb, wsAuth, '인증기능');

  // 3. 프로필 관리 테스트 시트
  const profileHeaders = authHeaders;
  const profileData = [
    ['PROF-001', '프로필 조회', '내 프로필 보기', '1. 프로필 페이지 접속', '프로필 정보 정상 표시', '', '', '', '', ''],
    ['PROF-002', '프로필 수정', '닉네임 변경', '1. 프로필 편집 클릭\n2. 닉네임 수정\n3. 저장', '닉네임 변경 성공', '', '', '', '', ''],
    ['PROF-003', '프로필 수정', '프로필 이미지 업로드', '1. 이미지 선택\n2. 업로드', '이미지 업로드 및 표시', '', '', '', '', ''],
    ['PROF-004', '프로필 수정', '기술 스택 추가', '1. 기술 스택 모달 열기\n2. 기술 선택\n3. 저장', '기술 스택 추가 성공', '', '', '', '', ''],
    ['PROF-005', '프로필 수정', '자기소개 수정', '1. 자기소개 텍스트 입력\n2. 저장', '자기소개 업데이트 성공', '', '', '', '', '']
  ];
  const wsProfile = XLSX.utils.aoa_to_sheet([...profileHeaders, ...profileData]);
  XLSX.utils.book_append_sheet(wb, wsProfile, '프로필관리');

  // 4. 포스트 관리 테스트 시트
  const postHeaders = authHeaders;
  const postData = [
    ['POST-001', '포스트 작성', '새 포스트 작성', '1. 포스트 작성 페이지 접속\n2. 제목, 내용 입력\n3. 발행', '포스트 생성 성공', '', '', '', '', ''],
    ['POST-002', '포스트 작성', '이미지 첨부', '1. 이미지 업로드\n2. 본문에 삽입', '이미지 정상 표시', '', '', '', '', ''],
    ['POST-003', '포스트 조회', '포스트 목록 조회', '1. 포스트 목록 페이지 접속', '포스트 목록 정상 표시', '', '', '', '', ''],
    ['POST-004', '포스트 조회', '포스트 상세 보기', '1. 포스트 클릭\n2. 상세 페이지 이동', '포스트 내용 정상 표시', '', '', '', '', ''],
    ['POST-005', '포스트 수정', '포스트 내용 수정', '1. 수정 버튼 클릭\n2. 내용 수정\n3. 저장', '포스트 수정 성공', '', '', '', '', ''],
    ['POST-006', '포스트 삭제', '포스트 삭제', '1. 삭제 버튼 클릭\n2. 확인', '포스트 삭제 성공', '', '', '', '', ''],
    ['POST-007', '포스트 검색', '키워드 검색', '1. 검색어 입력\n2. 검색 실행', '관련 포스트 표시', '', '', '', '', ''],
    ['POST-008', '포스트 필터', '카테고리 필터링', '1. 카테고리 선택', '해당 카테고리 포스트만 표시', '', '', '', '', '']
  ];
  const wsPost = XLSX.utils.aoa_to_sheet([...postHeaders, ...postData]);
  XLSX.utils.book_append_sheet(wb, wsPost, '포스트관리');

  // 5. 대시보드 테스트 시트
  const dashboardHeaders = authHeaders;
  const dashboardData = [
    ['DASH-001', '통계 표시', '방문자 통계', '1. 대시보드 접속', '방문자 통계 정상 표시', '', '', '', '', ''],
    ['DASH-002', '통계 표시', '포스트 통계', '1. 대시보드 접속', '포스트 통계 정상 표시', '', '', '', '', ''],
    ['DASH-003', '빠른 작업', '새 포스트 작성 버튼', '1. 빠른 작업 버튼 클릭', '포스트 작성 페이지 이동', '', '', '', '', ''],
    ['DASH-004', '빠른 작업', '프로필 편집 버튼', '1. 프로필 편집 버튼 클릭', '프로필 페이지 이동', '', '', '', '', ''],
    ['DASH-005', '차트 표시', '차트 렌더링', '1. 대시보드 로드', '차트 정상 렌더링', '', '', '', '', '']
  ];
  const wsDashboard = XLSX.utils.aoa_to_sheet([...dashboardHeaders, ...dashboardData]);
  XLSX.utils.book_append_sheet(wb, wsDashboard, '대시보드');

  // 6. UI/UX 테스트 시트
  const uiHeaders = authHeaders;
  const uiData = [
    ['UI-001', '반응형 디자인', '모바일 뷰', '1. 모바일 크기로 리사이즈', '레이아웃 정상 조정', '', '', '', '', ''],
    ['UI-002', '반응형 디자인', '태블릿 뷰', '1. 태블릿 크기로 리사이즈', '레이아웃 정상 조정', '', '', '', '', ''],
    ['UI-003', '네비게이션', '메뉴 동작', '1. 각 메뉴 클릭', '올바른 페이지 이동', '', '', '', '', ''],
    ['UI-004', '폼 유효성', '필수 필드 검증', '1. 빈 필드로 제출', '에러 메시지 표시', '', '', '', '', ''],
    ['UI-005', '로딩 상태', '로딩 인디케이터', '1. API 호출 시', '로딩 표시 정상 동작', '', '', '', '', ''],
    ['UI-006', '에러 처리', '에러 메시지', '1. 에러 발생 시나리오', '사용자 친화적 에러 표시', '', '', '', '', ''],
    ['UI-007', '접근성', '키보드 네비게이션', '1. Tab 키로 이동', '모든 요소 접근 가능', '', '', '', '', ''],
    ['UI-008', 'PWA', '오프라인 모드', '1. 네트워크 차단\n2. 앱 사용', '기본 기능 동작', '', '', '', '', '']
  ];
  const wsUI = XLSX.utils.aoa_to_sheet([...uiHeaders, ...uiData]);
  XLSX.utils.book_append_sheet(wb, wsUI, 'UI_UX');

  // 7. 버그 추적 시트
  const bugHeaders = [
    ['버그 ID', '발견 일자', '심각도', '상태', '제목', '재현 단계', '예상 동작', '실제 동작', '해결 방법', '해결 일자', '담당자']
  ];
  const bugData = [
    ['BUG-001', '', '높음/중간/낮음', '신규/진행중/해결/종료', '', '', '', '', '', '', '']
  ];
  const wsBug = XLSX.utils.aoa_to_sheet([...bugHeaders, ...bugData]);
  XLSX.utils.book_append_sheet(wb, wsBug, '버그추적');

  // 8. 테스트 환경 시트
  const envData = [
    ['테스트 환경 정보'],
    [],
    ['항목', '개발 환경', '운영 환경'],
    ['OS', 'Windows/Mac/Linux', 'Linux'],
    ['브라우저', 'Chrome, Firefox, Safari, Edge', 'Chrome, Firefox, Safari, Edge'],
    ['Node.js', 'v18.x', 'v18.x'],
    ['Vue.js', 'v3.x', 'v3.x'],
    ['데이터베이스', 'Supabase (PostgreSQL)', 'Supabase (PostgreSQL)'],
    ['배포 플랫폼', 'localhost', 'Railway'],
    [],
    ['테스트 도구'],
    ['단위 테스트', 'Jest, Vue Test Utils'],
    ['E2E 테스트', 'Cypress (계획)'],
    ['성능 테스트', 'Lighthouse'],
    ['접근성 테스트', 'axe DevTools']
  ];
  const wsEnv = XLSX.utils.aoa_to_sheet(envData);
  XLSX.utils.book_append_sheet(wb, wsEnv, '테스트환경');

  // 스타일 적용 (열 너비 조정)
  const sheets = ['인증기능', '프로필관리', '포스트관리', '대시보드', 'UI_UX', '버그추적'];
  sheets.forEach(sheetName => {
    if (wb.Sheets[sheetName]) {
      wb.Sheets[sheetName]['!cols'] = [
        { wch: 12 }, // 테스트 ID
        { wch: 15 }, // 기능 분류
        { wch: 25 }, // 테스트 케이스
        { wch: 35 }, // 테스트 단계
        { wch: 30 }, // 예상 결과
        { wch: 30 }, // 실제 결과
        { wch: 10 }, // 상태
        { wch: 12 }, // 테스트 일자
        { wch: 10 }, // 담당자
        { wch: 20 }  // 비고
      ];
    }
  });

  // 파일 저장
  const outputPath = path.join(__dirname, '..', 'docs', 'QA_Test_Record.xlsx');
  XLSX.writeFile(wb, outputPath);
  
  console.log(`✅ QA 테스트 엑셀 파일이 생성되었습니다: ${outputPath}`);
  console.log('\n📋 시트 구성:');
  console.log('1. 개요 - 프로젝트 정보 및 테스트 통계');
  console.log('2. 인증기능 - 로그인/회원가입 관련 테스트');
  console.log('3. 프로필관리 - 프로필 CRUD 테스트');
  console.log('4. 포스트관리 - 포스트 CRUD 테스트');
  console.log('5. 대시보드 - 대시보드 기능 테스트');
  console.log('6. UI_UX - UI/UX 및 반응형 테스트');
  console.log('7. 버그추적 - 발견된 버그 관리');
  console.log('8. 테스트환경 - 테스트 환경 정보');
  
  console.log('\n💡 사용 방법:');
  console.log('1. 각 시트의 테스트 케이스를 실행');
  console.log('2. "실제 결과"와 "상태" 열에 결과 기록');
  console.log('3. 상태는 "통과", "실패", "보류" 중 선택');
  console.log('4. 버그 발견 시 "버그추적" 시트에 기록');
}

// 실행
createQAExcel();