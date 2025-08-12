import { createClient } from "@supabase/supabase-js";

// Supabase 프로젝트 설정 - 환경 변수 사용 (Vite는 import.meta.env 사용)
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key-here";

// Supabase가 제대로 설정되었는지 확인
const isSupabaseConfigured =
  supabaseUrl !== "https://your-project.supabase.co" &&
  supabaseKey !== "your-anon-key-here" &&
  supabaseUrl &&
  supabaseKey;

// Supabase 클라이언트 생성 (설정된 경우에만)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true, // 세션 유지 (로그인 상태 유지)
        autoRefreshToken: true,
        detectSessionInUrl: true,
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  : null;

// 인증 관련 API 함수들
export const authAPI = {
  // 닉네임 중복 체크 - 임시 회원가입 시도로 실제 중복 확인
  async checkNicknameDuplicate(nickname) {
    // Supabase가 설정되지 않은 경우 처리
    if (!supabase) {
      console.log("Supabase 미설정 - 로컬 모드");
      return {
        data: { exists: false },
        error: null,
      };
    }

    try {
      console.log("닉네임 중복 확인:", nickname);

      // 1. 금지된 닉네임 목록 확인
      const forbiddenNicknames = [
        "admin",
        "test",
        "administrator",
        "root",
        "user",
        "null",
        "undefined",
      ];
      if (forbiddenNicknames.includes(nickname.toLowerCase())) {
        return {
          data: { exists: true },
          error: null,
        };
      }

      // 2. 임시 회원가입으로 실제 중복 확인
      console.log("임시 회원가입으로 닉네임 중복 확인 시작");

      // 고유한 임시 이메일 생성
      const tempEmail = `temp_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}@tempcheck.dev`;

      try {
        // users 테이블에 임시 삽입 시도
        const { data: insertData, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              email: tempEmail,
              name: "Temp User",
              nickname: nickname.trim(),
              auth_user_id: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select();

        if (insertError) {
          // 중복 에러 확인
          if (
            insertError.code === "23505" &&
            insertError.message.includes("nickname")
          ) {
            console.log("닉네임 중복 발견:", nickname);
            return {
              data: { exists: true },
              error: null,
            };
          }

          // 기타 에러 (RLS 등)는 사용 가능으로 처리
          console.log("기타 에러로 인한 사용 가능 처리:", insertError.message);
          return {
            data: { exists: false },
            error: null,
          };
        }

        // 삽입 성공 시 즉시 삭제
        if (insertData && insertData.length > 0) {
          try {
            await supabase.from("users").delete().eq("id", insertData[0].id);
            console.log("임시 사용자 삭제 완료");
          } catch (deleteError) {
            console.warn("임시 사용자 삭제 실패:", deleteError.message);
          }
        }

        // 중복 없음
        console.log("닉네임 사용 가능:", nickname);
        return {
          data: { exists: false },
          error: null,
        };
      } catch (error) {
        console.error("임시 삽입 중 오류:", error);
        return {
          data: { exists: false },
          error: null,
        };
      }
    } catch (error) {
      console.error("닉네임 중복 확인 오류:", error);
      return {
        data: { exists: false },
        error: null,
      };
    }
  },

  // 이메일 중복 체크 - 임시 삽입 시도로 실제 중복 확인
  async checkEmailDuplicate(email) {
    // Supabase가 설정되지 않은 경우 처리
    if (!supabase) {
      console.log("Supabase 미설정 - 로컬 모드");
      return {
        data: { exists: false },
        error: null,
      };
    }

    try {
      console.log("이메일 중복 확인:", email);

      // 1. 금지된 이메일 목록 확인
      const forbiddenEmails = ["admin@test.com", "test@example.com"];
      if (forbiddenEmails.includes(email.toLowerCase())) {
        return {
          data: { exists: true, forbidden: true },
          error: null,
        };
      }

      // 2. 임시 삽입으로 실제 중복 확인
      console.log("임시 삽입으로 이메일 중복 확인 시작");

      // 고유한 임시 닉네임 생성
      const tempNickname = `temp_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      try {
        // users 테이블에 임시 삽입 시도
        const { data: insertData, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              email: email.toLowerCase().trim(),
              name: "Temp User",
              nickname: tempNickname,
              auth_user_id: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select();

        if (insertError) {
          // 중복 에러 확인
          if (
            insertError.code === "23505" &&
            insertError.message.includes("email")
          ) {
            console.log("이메일 중복 발견:", email);
            return {
              data: { exists: true },
              error: null,
            };
          }

          // 기타 에러 (RLS 등)는 사용 가능으로 처리
          console.log("기타 에러로 인한 사용 가능 처리:", insertError.message);
          return {
            data: { exists: false },
            error: null,
          };
        }

        // 삽입 성공 시 즉시 삭제
        if (insertData && insertData.length > 0) {
          try {
            await supabase.from("users").delete().eq("id", insertData[0].id);
            console.log("임시 이메일 확인용 데이터 삭제 완료");
          } catch (deleteError) {
            console.warn("임시 데이터 삭제 실패:", deleteError.message);
          }
        }

        // 중복 없음
        console.log("이메일 사용 가능:", email);
        return {
          data: { exists: false },
          error: null,
        };
      } catch (error) {
        console.error("임시 삽입 중 오류:", error);
        return {
          data: { exists: false },
          error: null,
        };
      }
    } catch (error) {
      console.error("이메일 중복 확인 오류:", error);
      return {
        data: { exists: false },
        error: null,
      };
    }
  },

  // 회원가입 시도를 통한 이메일 중복 확인 (안전한 방법)
  async checkEmailBySignupAttempt(email) {
    try {
      // 임시 회원가입 시도 (실제로는 생성되지 않음)
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password: "temp_password_for_check_only_" + Math.random(),
        options: {
          data: {
            temp_check: true, // 임시 확인용 플래그
          },
        },
      });

      if (error) {
        // 이미 가입된 이메일인 경우
        if (
          error.message.includes("already") ||
          error.message.includes("exists")
        ) {
          return {
            data: { exists: true },
            error: null,
          };
        }

        // 기타 오류
        console.warn("이메일 확인 중 오류:", error.message);
        return {
          data: { exists: false },
          error: null,
        };
      }

      // 회원가입이 성공했다면 즉시 삭제 시도
      if (data.user) {
        try {
          await supabase.auth.admin.deleteUser(data.user.id);
          console.log("임시 사용자 삭제 완료");
        } catch (deleteError) {
          console.warn("임시 사용자 삭제 실패:", deleteError.message);
        }
      }

      return {
        data: { exists: false },
        error: null,
      };
    } catch (error) {
      console.error("이메일 확인 예외:", error);
      return {
        data: { exists: false },
        error: error.message,
      };
    }
  },

  // 기존 이메일 중복 체크 (하위 호환성)
  async checkEmailExists(email) {
    const result = await this.checkEmailDuplicate(email);
    return !result.available;
  },

  // 🔥 핵심 수정: 회원가입 함수 - 순차적 처리로 안전성 확보
  async signUp(userData) {
    // Supabase가 설정되지 않은 경우 처리
    if (!supabase) {
      console.log("Supabase 미설정 - 로컬 모드로 회원가입");
      const mockUser = {
        id: "local-" + Date.now(),
        email: userData.email,
        name: userData.name,
        nickname: userData.nickname,
        created_at: new Date().toISOString(),
      };

      // 로컬 스토리지에 저장
      const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
      localUsers.push(mockUser);
      localStorage.setItem("localUsers", JSON.stringify(localUsers));

      return {
        success: true,
        user: mockUser,
        message: "로컬 모드로 회원가입 완료",
      };
    }

    let authUserId = null;

    try {
      console.log("회원가입 시도:", userData);

      // 1. users 테이블에 먼저 삽입 시도 (중복 확인)
      try {
        console.log("users 테이블에 사용자 정보 삽입 시도");
        const { data: userTableData, error: userTableError } = await supabase
          .from("users")
          .insert([
            {
              email: userData.email.toLowerCase().trim(),
              name: userData.name.trim(),
              nickname: userData.nickname.trim(),
              auth_user_id: null, // 임시로 null, 나중에 업데이트
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select();

        if (userTableError) {
          console.error("users 테이블 삽입 오류:", userTableError);

          // 중복 에러 처리
          if (userTableError.code === "23505") {
            let errorMessage = "이미 가입된 정보입니다.";

            if (userTableError.message.includes("email")) {
              errorMessage = "이미 가입된 이메일입니다.";
            } else if (userTableError.message.includes("nickname")) {
              errorMessage = "이미 사용 중인 닉네임입니다.";
            }

            return {
              success: false,
              error: errorMessage,
            };
          }

          // 기타 에러 처리
          return {
            success: false,
            error: `사용자 정보 저장 실패: ${userTableError.message}`,
          };
        }

        console.log("users 테이블 삽입 성공:", userTableData);

        // 2. auth.users 테이블에 인증 정보 생성
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email: userData.email.toLowerCase().trim(),
            password: userData.password,
            options: {
              data: {
                full_name: userData.name,
                nickname: userData.nickname,
                signup_method: "email",
              },
            },
          }
        );

        if (authError) {
          console.error("Supabase 회원가입 오류:", authError);

          // auth.users 생성 실패 시 users 테이블에서 삭제
          try {
            await supabase.from("users").delete().eq("id", userTableData[0].id);
            console.log("users 테이블에서 실패한 사용자 삭제 완료");
          } catch (deleteError) {
            console.warn("users 테이블 삭제 실패:", deleteError.message);
          }

          return {
            success: false,
            error: authError.message,
          };
        }

        console.log("회원가입 응답:", authData);

        // 사용자가 생성되었는지 확인
        if (!authData.user) {
          console.error("사용자 객체가 없습니다");
          return {
            success: false,
            error: "사용자 생성에 실패했습니다",
          };
        }

        authUserId = authData.user.id;

        // 3. users 테이블의 auth_user_id 업데이트
        const { error: updateError } = await supabase
          .from("users")
          .update({ auth_user_id: authData.user.id })
          .eq("id", userTableData[0].id);

        if (updateError) {
          console.error("auth_user_id 업데이트 실패:", updateError);
        } else {
          console.log("auth_user_id 업데이트 성공");
        }

        // 4. 🚨 핵심: 회원가입 성공 후 즉시 로그아웃하여 자동 로그인 방지
        if (authData.user) {
          console.log("회원가입 성공, 자동 로그인 방지를 위해 로그아웃 실행");
          await supabase.auth.signOut();

          // localStorage에서 모든 Supabase 관련 항목 삭제
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes("supabase") || key.includes("sb-"))) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach((key) => {
            localStorage.removeItem(key);
            console.log("Removed key:", key);
          });

          // sessionStorage도 초기화
          sessionStorage.clear();

          console.log("자동 로그아웃 완료");
        }

        console.log("회원가입 성공:", {
          userId: authData.user.id,
          email: authData.user.email,
          emailConfirmed: authData.user.email_confirmed_at,
        });

        return {
          success: true,
          user: null,
          session: null,
          message:
            "회원가입이 완료되었습니다. 로그인 페이지에서 다시 로그인해주세요.",
        };
      } catch (tableError) {
        console.error("users 테이블 처리 예외:", tableError);
        return {
          success: false,
          error: `회원가입 중 오류가 발생했습니다: ${tableError.message}`,
        };
      }
    } catch (error) {
      console.error("회원가입 예외:", error);

      // 혹시 auth.users에 사용자가 생성되었다면 삭제 시도
      if (authUserId) {
        try {
          await supabase.auth.admin.deleteUser(authUserId);
          console.log("예외 발생 시 auth.users에서 사용자 삭제 완료");
        } catch (deleteError) {
          console.warn("예외 발생 시 사용자 삭제 실패:", deleteError.message);
        }
      }

      return {
        success: false,
        error: `회원가입 중 오류가 발생했습니다: ${error.message}`,
      };
    }
  },

  // 기존 로그인 + 자동 마이그레이션
  async signIn(email, password, rememberMe = false) {
    // Supabase가 설정되지 않은 경우 처리
    if (!supabase) {
      console.log("Supabase 미설정 - 로컬 모드로 로그인");
      const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
      const user = localUsers.find((u) => u.email === email);

      if (user) {
        return {
          success: true,
          data: {
            auth: { user },
            user,
          },
        };
      } else {
        return {
          success: false,
          error: "등록되지 않은 사용자입니다.",
          data: null,
        };
      }
    }

    try {
      console.log("로그인 시도:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password,
      });

      if (error) {
        console.error("Supabase 로그인 오류:", error.message);
        return {
          success: false,
          error: error.message,
          data: null,
        };
      }

      if (!data.user) {
        console.error("사용자 정보 없음");
        return {
          success: false,
          error: "사용자 정보를 가져올 수 없습니다.",
          data: null,
        };
      }

      // 🆕 로그인 성공 후 users 테이블에 사용자 정보 확인 및 마이그레이션
      await this.ensureUserInUsersTable(data.user);

      // Remember me 기능
      if (rememberMe) {
        localStorage.setItem("rememberUser", "true");
        localStorage.setItem("userEmail", email);
      } else {
        localStorage.removeItem("rememberUser");
        localStorage.removeItem("userEmail");
      }

      console.log("로그인 성공:", data.user.email);
      return {
        success: true,
        error: null,
        data: {
          auth: data,
          user: {
            email: data.user.email,
            name:
              data.user.user_metadata?.full_name ||
              data.user.user_metadata?.name ||
              "User",
            nickname: data.user.user_metadata?.nickname || "",
            id: data.user.id,
            provider: data.user.app_metadata?.provider || "email",
          },
        },
      };
    } catch (error) {
      console.error("로그인 예외:", error);
      return {
        success: false,
        error: `로그인 중 오류가 발생했습니다: ${error.message}`,
        data: null,
      };
    }
  },

  // 사용자가 users 테이블에 있는지 확인하고 없으면 추가
  async ensureUserInUsersTable(authUser) {
    try {
      console.log("users 테이블에 사용자 존재 확인:", authUser.email);

      // 1. users 테이블에서 현재 사용자 조회
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", authUser.id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        console.error("users 테이블 조회 오류:", checkError);
        return;
      }

      // 2. 사용자가 이미 존재하면 스킵
      if (existingUser) {
        console.log("사용자가 이미 users 테이블에 존재함");
        return;
      }

      // 3. 사용자가 없으면 추가 (마이그레이션)
      console.log("users 테이블에 사용자 없음, 마이그레이션 실행");

      const userToInsert = {
        email: authUser.email,
        name:
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          authUser.email?.split("@")[0] ||
          "User",
        nickname:
          authUser.user_metadata?.nickname ||
          authUser.email?.split("@")[0] ||
          `user_${authUser.id.substring(0, 8)}`,
        auth_user_id: authUser.id,
        created_at: authUser.created_at,
        updated_at: authUser.updated_at || authUser.created_at,
      };

      const { data: insertedUser, error: insertError } = await supabase
        .from("users")
        .insert([userToInsert])
        .select();

      if (insertError) {
        console.error("사용자 마이그레이션 실패:", insertError);

        // 중복 에러인 경우 (이미 마이그레이션된 경우)
        if (insertError.code === "23505") {
          console.log("사용자가 이미 마이그레이션되어 있음");
          return;
        }

        // 다른 에러인 경우 로그만 남기고 계속 진행
        console.warn("마이그레이션 실패하지만 로그인 계속 진행");
        return;
      }

      console.log("사용자 마이그레이션 성공:", insertedUser);
    } catch (error) {
      console.error("ensureUserInUsersTable 예외:", error);
    }
  },

  // 소셜 로그인 - GitHub
  async signInWithGitHub() {
    try {
      console.log("GitHub 로그인 시도");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: "user:email",
        },
      });

      if (error) {
        console.error("GitHub 로그인 오류:", error);
        return {
          success: false,
          error: error.message,
        };
      }

      console.log("GitHub 로그인 리디렉션 시작");
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("GitHub 로그인 예외:", error);
      return {
        success: false,
        error: `GitHub 로그인 중 오류가 발생했습니다: ${error.message}`,
      };
    }
  },

  // 소셜 로그인 - Google
  async signInWithGoogle() {
    try {
      console.log("Google 로그인 시도");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: "email profile",
        },
      });

      if (error) {
        console.error("Google 로그인 오류:", error);
        return {
          success: false,
          error: error.message,
        };
      }

      console.log("Google 로그인 리디렉션 시작");
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Google 로그인 예외:", error);
      return {
        success: false,
        error: `Google 로그인 중 오류가 발생했습니다: ${error.message}`,
      };
    }
  },

  // 비밀번호 재설정 요청
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("비밀번호 재설정 요청 오류:", error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        message: "비밀번호 재설정 링크가 이메일로 전송되었습니다.",
      };
    } catch (error) {
      console.error("비밀번호 재설정 예외:", error);
      return {
        success: false,
        error: `비밀번호 재설정 요청 중 오류가 발생했습니다: ${error.message}`,
      };
    }
  },

  // 비밀번호 업데이트
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error("비밀번호 업데이트 오류:", error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        message: "비밀번호가 성공적으로 변경되었습니다.",
      };
    } catch (error) {
      console.error("비밀번호 업데이트 예외:", error);
      return {
        success: false,
        error: `비밀번호 변경 중 오류가 발생했습니다: ${error.message}`,
      };
    }
  },

  // 현재 세션 가져오기
  async getSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("세션 가져오기 오류:", error);
        return null;
      }

      return session;
    } catch (error) {
      console.error("세션 가져오기 예외:", error);
      return null;
    }
  },

  // 현재 사용자 정보 가져오기
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("사용자 정보 가져오기 오류:", error);
        return null;
      }

      return user;
    } catch (error) {
      console.error("사용자 정보 가져오기 예외:", error);
      return null;
    }
  },

  // 로그아웃
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Remember me 정보도 제거
      localStorage.removeItem("rememberUser");
      localStorage.removeItem("userEmail");

      return { success: true };
    } catch (error) {
      console.error("로그아웃 오류:", error);
      return { success: false, error: error.message };
    }
  },

  // 인증 상태 변화 리스너
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Remember me 체크
  shouldRememberUser() {
    return localStorage.getItem("rememberUser") === "true";
  },

  // 저장된 이메일 가져오기
  getRememberedEmail() {
    return localStorage.getItem("userEmail") || "";
  },
};

// 프로필 관련 API 함수들
export const profileAPI = {
  // 현재 사용자의 프로필 정보 조회
  async getUserProfile(authUserId) {
    try {
      console.log("사용자 프로필 조회:", authUserId);

      const { data, error } = await supabase
        .from("users")
        .select(
          `
          id,
          email,
          name,
          nickname,
          title,
          one_liner,
          bio,
          profile_image_url,
          github_url,
          linkedin_url,
          portfolio_url,
          blog_url,
          phone,
          location,
          skills,
          created_at,
          updated_at
        `
        )
        .eq("auth_user_id", authUserId)
        .single();

      if (error) {
        console.error("프로필 조회 오류:", error);
        return {
          success: false,
          error: error.message,
          data: null,
        };
      }

      console.log("프로필 조회 성공:", data);
      return {
        success: true,
        error: null,
        data: data,
      };
    } catch (error) {
      console.error("프로필 조회 예외:", error);
      return {
        success: false,
        error: `프로필 조회 중 오류가 발생했습니다: ${error.message}`,
        data: null,
      };
    }
  },

  // 프로필 정보 업데이트
  async updateUserProfile(authUserId, profileData) {
    try {
      console.log("프로필 업데이트:", authUserId, profileData);

      const updateData = {
        name: profileData.name?.trim(),
        title: profileData.title?.trim() || null,
        one_liner: profileData.oneLiner?.trim() || null,
        bio: profileData.bio?.trim() || null,
        profile_image_url: profileData.profileImage || null,
        github_url: profileData.githubUrl?.trim() || null,
        linkedin_url: profileData.linkedinUrl?.trim() || null,
        portfolio_url: profileData.portfolioUrl?.trim() || null,
        blog_url: profileData.blogUrl?.trim() || null,
        phone: profileData.phone?.trim() || null,
        location: profileData.location?.trim() || null,
        skills: profileData.skills || [],
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("auth_user_id", authUserId)
        .select()
        .single();

      if (error) {
        console.error("프로필 업데이트 오류:", error);
        return {
          success: false,
          error: error.message,
          data: null,
        };
      }

      console.log("프로필 업데이트 성공:", data);
      return {
        success: true,
        error: null,
        data: data,
      };
    } catch (error) {
      console.error("프로필 업데이트 예외:", error);
      return {
        success: false,
        error: `프로필 업데이트 중 오류가 발생했습니다: ${error.message}`,
        data: null,
      };
    }
  },

  // 프로필 이미지 업로드 (Supabase Storage)
  async uploadProfileImage(authUserId, imageFile) {
    try {
      console.log("프로필 이미지 업로드:", authUserId, imageFile.name);

      // 파일 확장자 검증
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(imageFile.type)) {
        return {
          success: false,
          error: "JPG, PNG, WebP 형식의 이미지만 업로드 가능합니다.",
          data: null,
        };
      }

      // 파일 크기 검증 (5MB 제한)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (imageFile.size > maxSize) {
        return {
          success: false,
          error: "이미지 크기는 5MB 이하여야 합니다.",
          data: null,
        };
      }

      // 고유한 파일명 생성
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${authUserId}/profile.${fileExt}`;

      // 기존 파일이 있다면 삭제
      try {
        await supabase.storage.from("profile-images").remove([fileName]);
      } catch (deleteError) {
        console.log("기존 파일 삭제 시도 (무시 가능):", deleteError.message);
      }

      // 새 파일 업로드
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, imageFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("이미지 업로드 오류:", uploadError);
        return {
          success: false,
          error: uploadError.message,
          data: null,
        };
      }

      // 공개 URL 생성
      const { data: urlData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(fileName);

      console.log("이미지 업로드 성공:", urlData.publicUrl);
      return {
        success: true,
        error: null,
        data: {
          path: uploadData.path,
          publicUrl: urlData.publicUrl,
        },
      };
    } catch (error) {
      console.error("이미지 업로드 예외:", error);
      return {
        success: false,
        error: `이미지 업로드 중 오류가 발생했습니다: ${error.message}`,
        data: null,
      };
    }
  },

  // 프로필 이미지 삭제
  async deleteProfileImage(authUserId) {
    try {
      console.log("프로필 이미지 삭제:", authUserId);

      // 가능한 확장자들로 삭제 시도
      const extensions = ["jpg", "jpeg", "png", "webp"];
      const deletePromises = extensions.map((ext) =>
        supabase.storage
          .from("profile-images")
          .remove([`${authUserId}/profile.${ext}`])
      );

      await Promise.all(deletePromises);

      return {
        success: true,
        error: null,
      };
    } catch (error) {
      console.error("이미지 삭제 예외:", error);
      return {
        success: false,
        error: `이미지 삭제 중 오류가 발생했습니다: ${error.message}`,
      };
    }
  },
};

// 마이그레이션 함수들
export const migrationAPI = {
  // 기존 auth.users 데이터를 users 테이블로 마이그레이션
  async migrateExistingUsers() {
    try {
      console.log("기존 사용자 마이그레이션 시작");

      // 1. auth.users에서 모든 사용자 가져오기 (Admin API 필요)
      const { data: authUsers, error: authError } =
        await supabase.auth.admin.listUsers();

      if (authError) {
        console.error("Auth users 조회 실패:", authError);
        return {
          success: false,
          error: "Admin API 권한이 필요합니다.",
        };
      }

      console.log(`발견된 auth.users: ${authUsers.users.length}명`);

      // 2. users 테이블에서 이미 마이그레이션된 사용자들 확인
      const { data: existingUsers, error: existingError } = await supabase
        .from("users")
        .select("auth_user_id");

      if (existingError) {
        console.error("기존 users 조회 실패:", existingError);
        return {
          success: false,
          error: "users 테이블 조회 실패",
        };
      }

      const existingAuthIds = existingUsers.map((user) => user.auth_user_id);
      console.log(`이미 마이그레이션된 사용자: ${existingAuthIds.length}명`);

      // 3. 마이그레이션이 필요한 사용자들 필터링
      const usersToMigrate = authUsers.users.filter(
        (user) => !existingAuthIds.includes(user.id)
      );

      console.log(`마이그레이션할 사용자: ${usersToMigrate.length}명`);

      if (usersToMigrate.length === 0) {
        return {
          success: true,
          message: "마이그레이션할 사용자가 없습니다.",
          migrated: 0,
        };
      }

      // 4. 사용자 데이터 변환 및 삽입
      const migrationData = usersToMigrate.map((user) => ({
        email: user.email,
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Unknown User",
        nickname:
          user.user_metadata?.nickname ||
          user.email?.split("@")[0] ||
          `user_${user.id.substring(0, 8)}`,
        auth_user_id: user.id,
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at,
      }));

      console.log("마이그레이션 데이터:", migrationData);

      // 5. users 테이블에 배치 삽입
      const { data: insertedUsers, error: insertError } = await supabase
        .from("users")
        .insert(migrationData)
        .select();

      if (insertError) {
        console.error("사용자 마이그레이션 실패:", insertError);
        return {
          success: false,
          error: `마이그레이션 실패: ${insertError.message}`,
        };
      }

      console.log("마이그레이션 성공:", insertedUsers);

      return {
        success: true,
        message: `${usersToMigrate.length}명의 사용자가 성공적으로 마이그레이션되었습니다.`,
        migrated: usersToMigrate.length,
        users: insertedUsers,
      };
    } catch (error) {
      console.error("마이그레이션 예외:", error);
      return {
        success: false,
        error: `마이그레이션 중 오류 발생: ${error.message}`,
      };
    }
  },

  // 마이그레이션 상태 확인
  async checkMigrationStatus() {
    try {
      // auth.users 총 수 (Admin API 필요)
      const { data: authUsers, error: authError } =
        await supabase.auth.admin.listUsers();

      if (authError) {
        console.error("Auth users 조회 실패:", authError);
        return {
          success: false,
          error: "Admin API 권한이 필요합니다.",
        };
      }

      // users 테이블 총 수
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id");

      if (usersError) {
        console.error("Users 조회 실패:", usersError);
        return {
          success: false,
          error: "users 테이블 조회 실패",
        };
      }

      return {
        success: true,
        authUsersCount: authUsers.users.length,
        usersTableCount: users.length,
        needMigration: authUsers.users.length > users.length,
      };
    } catch (error) {
      console.error("마이그레이션 상태 확인 실패:", error);
      return {
        success: false,
        error: `상태 확인 중 오류 발생: ${error.message}`,
      };
    }
  },
};

// 디버깅을 위한 함수들
export const debugAPI = {
  // auth.users 테이블 확인 (관리자만 가능)
  async checkAuthUsers() {
    try {
      // 이 쿼리는 보안상 실패할 수 있습니다
      const { data, error } = await supabase
        .from("auth.users")
        .select("*")
        .limit(5);

      console.log("auth.users 데이터:", data);
      if (error) console.error("auth.users 쿼리 오류:", error);

      return data;
    } catch (error) {
      console.error("auth.users 확인 실패:", error);
      return null;
    }
  },

  // 현재 세션 디버깅
  async debugSession() {
    const session = await authAPI.getSession();
    const user = await authAPI.getCurrentUser();

    console.log("=== 세션 디버깅 ===");
    console.log("Session:", session);
    console.log("User:", user);
    console.log("==================");

    return { session, user };
  },
};
