import { supabase } from "@/config/supabase";
import { checkSupabaseConfig, isSupabaseEnabled } from "@/utils/supabaseCheck";

// Supabase 연결 상태 체크
export function getSupabaseStatus() {
  return checkSupabaseConfig();
}

// 이메일 중복 체크 (로컬 모드 지원)
export async function checkEmailDuplicate(email) 
{
  // Supabase가 설정되지 않은 경우 로컬 모드
  if (!isSupabaseEnabled()) {
    console.log("Supabase 미설정 - 로컬 모드로 실행");
    // 로컬 모드에서는 항상 사용 가능으로 반환
    return {
      data: { exists: false },
      error: null,
    };
  }

  try {
    // supabase가 null인 경우 로컬 모드로 처리
    if (!supabase) 
      {
      return { data: { exists: false }, error: null };
    }

    const { error } = await supabase
      .from("users")
      .select("email")
      .eq("email", email.toLowerCase())
      .single();

    if (error && error.code === "PGRST116") {
      // 데이터가 없는 경우 (사용 가능)
      return { data: { exists: false }, error: null };
    }

    if (error) throw error;

    // 데이터가 있는 경우 (중복)
    return { data: { exists: true }, error: null };
  } catch (error) {
    console.error("이메일 중복 체크 오류:", error);
    // 오류 발생 시에도 사용 가능으로 처리 (등록 시 실제 오류 발생)
    return { data: { exists: false }, error: null };
  }
}

// 닉네임 중복 체크 (로컬 모드 지원)
export async function checkNicknameDuplicate(nickname) {
  // Supabase가 설정되지 않은 경우 로컬 모드
  if (!isSupabaseEnabled()) {
    console.log("Supabase 미설정 - 로컬 모드로 실행");
    // 로컬 모드에서는 항상 사용 가능으로 반환
    return {
      data: { exists: false },
      error: null,
    };
  }

  try {
    // supabase가 null인 경우 로컬 모드로 처리
    if (!supabase) {
      return { data: { exists: false }, error: null };
    }

    const { error } = await supabase
      .from("users")
      .select("nickname")
      .eq("nickname", nickname)
      .single();

    if (error && error.code === "PGRST116") {
      // 데이터가 없는 경우 (사용 가능)
      return { data: { exists: false }, error: null };
    }

    if (error) throw error;

    // 데이터가 있는 경우 (중복)
    return { data: { exists: true }, error: null };
  } catch (error) {
    console.error("닉네임 중복 체크 오류:", error);
    // 오류 발생 시에도 사용 가능으로 처리 (등록 시 실제 오류 발생)
    return { data: { exists: false }, error: null };
  }
}

// 회원가입 함수 (로컬 모드 지원)
export async function signUp(userData) {
  // Supabase가 설정되지 않은 경우 로컬 모드
  if (!isSupabaseEnabled()) {
    console.log("Supabase 미설정 - 로컬 모드로 회원가입 시뮬레이션");
    // 로컬 모드에서는 가상의 성공 응답 반환
    const mockUser = {
      id: "local-" + Date.now(),
      email: userData.email,
      name: userData.name,
      nickname: userData.nickname || userData.name,
      created_at: new Date().toISOString(),
    };

    // 로컬 스토리지에 저장 (데모용)
    const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
    localUsers.push(mockUser);
    localStorage.setItem("localUsers", JSON.stringify(localUsers));

    return {
      success: true,
      auth: { user: mockUser },
      user: mockUser,
      message: "Supabase가 설정되지 않아 로컬 모드로 실행 중입니다.",
    };
  }

  try {
    // supabase가 null인 경우 로컬 모드로 처리 (이미 위에서 처리함)
    if (!supabase) {
      return {
        success: false,
        error: "Supabase가 설정되지 않았습니다. 로컬 모드를 사용하세요.",
      };
    }

    // 1. Supabase Auth로 인증 계정 생성
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError) throw authError;

    // 2. users 테이블에 추가 정보 저장
    const { data: userRecord, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          email: userData.email,
          name: userData.name,
          nickname: userData.nickname || userData.name,
          profile_image_url: userData.profile_image_url || null,
          one_liner: userData.one_liner || null,
          bio: userData.bio || null,
          github_url: userData.github_url || null,
          linkedin_url: userData.linkedin_url || null,
          personal_blog_url: userData.personal_blog_url || null,
        },
      ])
      .select();

    if (insertError) throw insertError;

    return {
      success: true,
      auth: authData,
      user: userRecord[0],
    };
  } catch (error) {
    console.error("회원가입 오류:", error);
    return { success: false, error: error.message };
  }
}

// 로그인 함수 (로컬 모드 지원)
export async function signIn(email, password) {
  // Supabase가 설정되지 않은 경우 로컬 모드
  if (!isSupabaseEnabled()) {
    console.log("Supabase 미설정 - 로컬 모드로 로그인 시뮬레이션");
    // 로컬 스토리지에서 사용자 확인
    const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
    const user = localUsers.find((u) => u.email === email);

    if (user) {
      return {
        success: true,
        user,
        message: "Supabase가 설정되지 않아 로컬 모드로 실행 중입니다.",
      };
    } else {
      return {
        success: false,
        error:
          "로컬 모드: 등록되지 않은 사용자입니다. 먼저 회원가입을 해주세요.",
      };
    }
  }

  try {
    // supabase가 null인 경우 처리
    if (!supabase) {
      // 로컬 스토리지에서 사용자 확인 (이미 위에서 처리함)
      const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
      const user = localUsers.find((u) => u.email === email);

      if (user) {
        return {
          success: true,
          user,
          message: "Supabase가 설정되지 않아 로컬 모드로 실행 중입니다.",
        };
      } else {
        return {
          success: false,
          error: "로컬 모드: 등록되지 않은 사용자입니다.",
        };
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw error;

    // 추가 사용자 정보 가져오기
    const userInfo = await getUserByEmail(email);

    return {
      success: true,
      auth: data,
      user: userInfo.success ? userInfo.user : null,
    };
  } catch (error) {
    console.error("로그인 오류:", error);
    return { success: false, error: error.message };
  }
}

// 로그아웃 함수
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("로그아웃 오류:", error);
    return { success: false, error: error.message };
  }
}

// 사용자 정보 조회
export async function getUserByEmail(email) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw error;
    return { success: true, user: data };
  } catch (error) {
    console.error("사용자 조회 오류:", error);
    return { success: false, error: error.message };
  }
}

// 사용자 정보 업데이트
export async function updateUser(id, updateData) {
  try {
    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw error;
    return { success: true, user: data[0] };
  } catch (error) {
    console.error("사용자 업데이트 오류:", error);
    return { success: false, error: error.message };
  }
}
