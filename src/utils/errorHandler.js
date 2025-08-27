// 에러 처리 유틸리티

// 에러 메시지 매핑
const errorMessages = {
  // Supabase Auth 에러
  "Invalid login credentials": "이메일 또는 비밀번호가 올바르지 않습니다",
  "Email not confirmed": "이메일 인증이 필요합니다. 이메일을 확인해주세요",
  "User already registered": "이미 가입된 이메일입니다",
  "Password should be at least 6 characters":
    "비밀번호는 최소 6자 이상이어야 합니다",
  "Network request failed": "네트워크 연결을 확인해주세요",
  "Invalid email": "올바른 이메일 형식이 아닙니다",

  // 커스텀 에러
  NICKNAME_DUPLICATE: "이미 사용 중인 닉네임입니다",
  EMAIL_DUPLICATE: "이미 가입된 이메일입니다",
  INVALID_TOKEN: "유효하지 않은 토큰입니다",
  SESSION_EXPIRED: "세션이 만료되었습니다. 다시 로그인해주세요",
  PERMISSION_DENIED: "권한이 없습니다",
  FILE_TOO_LARGE: "파일 크기가 너무 큽니다 (최대 5MB)",
  INVALID_FILE_TYPE: "지원하지 않는 파일 형식입니다",

  // 기본 에러
  default: "오류가 발생했습니다. 잠시 후 다시 시도해주세요",
};

// 에러 타입 분류
export const errorTypes = {
  AUTH: "auth",
  NETWORK: "network",
  VALIDATION: "validation",
  PERMISSION: "permission",
  SERVER: "server",
  UNKNOWN: "unknown",
};

// 에러 타입 판별
export function getErrorType(error) {
  const message = error.message || error.toString();

  if (
    message.includes("auth") ||
    message.includes("login") ||
    message.includes("password")
  ) {
    return errorTypes.AUTH;
  }
  if (message.includes("network") || message.includes("fetch")) {
    return errorTypes.NETWORK;
  }
  if (message.includes("valid") || message.includes("required")) {
    return errorTypes.VALIDATION;
  }
  if (message.includes("permission") || message.includes("denied")) {
    return errorTypes.PERMISSION;
  }
  if (error.status >= 500) {
    return errorTypes.SERVER;
  }

  return errorTypes.UNKNOWN;
}

// 사용자 친화적 에러 메시지 반환
export function getErrorMessage(error) {
  if (typeof error === "string") {
    return errorMessages[error] || error;
  }

  const message = error.message || error.error || error.toString();

  // 정확한 매칭 시도
  for (const [key, value] of Object.entries(errorMessages)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  return errorMessages.default;
}

// 에러 로깅
export function logError(error, context = {}) {
  const errorInfo = {
    message: error.message || error.toString(),
    stack: error.stack,
    type: getErrorType(error),
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // 개발 환경에서는 콘솔에 출력
  if (import.meta.env.DEV) {
    console.error("Error Log:", errorInfo);
  }

  // 프로덕션에서는 에러 트래킹 서비스로 전송 (예: Sentry)
  // if (import.meta.env.PROD && window.Sentry) {
  //   window.Sentry.captureException(error, { extra: errorInfo })
  // }

  return errorInfo;
}

// 에러 알림 표시
export function showErrorNotification(error, store) {
  const message = getErrorMessage(error);

  if (store) {
    store.dispatch("showNotification", {
      message,
      type: "error",
    });
  }

  return message;
}

// 전역 에러 핸들러 설정
export function setupGlobalErrorHandler(app, store) {
  // Vue 에러 핸들러
  app.config.errorHandler = (error, instance, info) => {
    logError(error, { component: instance?.$options.name, info });
    showErrorNotification(error, store);
  };

  // Promise rejection 핸들러
  window.addEventListener("unhandledrejection", (event) => {
    logError(event.reason, { type: "unhandledRejection" });
    showErrorNotification(event.reason, store);
    event.preventDefault();
  });

  // 일반 에러 핸들러
  window.addEventListener("error", (event) => {
    logError(event.error, { type: "windowError" });
    showErrorNotification(event.error, store);
  });
}

// API 에러 처리 래퍼
export async function handleApiCall(apiCall, options = {}) {
  const {
    showError = true,
    store = null,
    loadingKey = null,
    defaultError = "요청 처리 중 오류가 발생했습니다",
  } = options;

  try {
    if (store && loadingKey) {
      store.commit("setLoading", { [loadingKey]: true });
    }

    const result = await apiCall();
    return { success: true, data: result };
  } catch (error) {
    logError(error, { apiCall: apiCall.toString() });

    if (showError) {
      const message = getErrorMessage(error) || defaultError;
      if (store) {
        showErrorNotification(error, store);
      }
      return { success: false, error: message };
    }

    throw error;
  } finally {
    if (store && loadingKey) {
      store.commit("setLoading", { [loadingKey]: false });
    }
  }
}

export default {
  errorMessages,
  errorTypes,
  getErrorType,
  getErrorMessage,
  logError,
  showErrorNotification,
  setupGlobalErrorHandler,
  handleApiCall,
};
