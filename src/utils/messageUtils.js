// 공통 메시지 처리 유틸리티 함수들

/**
 * 메시지 표시를 위한 믹스인
 * 모든 컴포넌트에서 사용할 수 있는 공통 메시지 처리 메서드
 */
export const messageMixin = {
  data() {
    return {
      message: {
        text: '',
        type: 'info'
      }
    };
  },
  methods: {
    /**
     * 성공 메시지 표시
     * @param {string} text - 표시할 메시지
     * @param {number} duration - 표시 시간 (ms)
     */
    showSuccessMessage(text, duration = 3000) {
      this.message = {
        text,
        type: 'success'
      };
      
      if (duration > 0) {
        setTimeout(() => {
          this.clearMessage();
        }, duration);
      }
    },

    /**
     * 에러 메시지 표시
     * @param {string} text - 표시할 메시지
     * @param {number} duration - 표시 시간 (ms)
     */
    showErrorMessage(text, duration = 3000) {
      this.message = {
        text,
        type: 'error'
      };
      
      if (duration > 0) {
        setTimeout(() => {
          this.clearMessage();
        }, duration);
      }
    },

    /**
     * 경고 메시지 표시
     * @param {string} text - 표시할 메시지
     * @param {number} duration - 표시 시간 (ms)
     */
    showWarningMessage(text, duration = 3000) {
      this.message = {
        text,
        type: 'warning'
      };
      
      if (duration > 0) {
        setTimeout(() => {
          this.clearMessage();
        }, duration);
      }
    },

    /**
     * 정보 메시지 표시
     * @param {string} text - 표시할 메시지
     * @param {number} duration - 표시 시간 (ms)
     */
    showInfoMessage(text, duration = 3000) {
      this.message = {
        text,
        type: 'info'
      };
      
      if (duration > 0) {
        setTimeout(() => {
          this.clearMessage();
        }, duration);
      }
    },

    /**
     * 메시지 지우기
     */
    clearMessage() {
      this.message = {
        text: '',
        type: 'info'
      };
    }
  }
};

/**
 * 로딩 상태 관리를 위한 믹스인
 */
export const loadingMixin = {
  data() {
    return {
      loading: false,
      loadingMessage: '데이터를 불러오는 중...'
    };
  },
  methods: {
    /**
     * 로딩 시작
     * @param {string} message - 로딩 메시지
     */
    startLoading(message = '데이터를 불러오는 중...') {
      this.loading = true;
      this.loadingMessage = message;
    },

    /**
     * 로딩 종료
     */
    stopLoading() {
      this.loading = false;
    },

    /**
     * 로딩 상태 토글
     * @param {boolean} isLoading - 로딩 상태
     * @param {string} message - 로딩 메시지
     */
    setLoading(isLoading, message = '데이터를 불러오는 중...') {
      this.loading = isLoading;
      if (isLoading) {
        this.loadingMessage = message;
      }
    }
  }
};

/**
 * 에러 처리를 위한 공통 유틸리티 함수
 */
export const errorUtils = {
  /**
   * API 에러 메시지 파싱
   * @param {Error|Object} error - 에러 객체
   * @returns {string} 사용자 친화적인 에러 메시지
   */
  parseErrorMessage(error) {
    if (typeof error === 'string') {
      return error;
    }

    if (error?.message) {
      return error.message;
    }

    if (error?.error) {
      return error.error;
    }

    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    if (error?.response?.data?.error) {
      return error.response.data.error;
    }

    return '알 수 없는 오류가 발생했습니다.';
  },

  /**
   * 네트워크 에러 확인
   * @param {Error} error - 에러 객체
   * @returns {boolean} 네트워크 에러 여부
   */
  isNetworkError(error) {
    return !error.response && error.request;
  },

  /**
   * 인증 에러 확인
   * @param {Error} error - 에러 객체
   * @returns {boolean} 인증 에러 여부
   */
  isAuthError(error) {
    return error?.response?.status === 401 || error?.response?.status === 403;
  },

  /**
   * 서버 에러 확인
   * @param {Error} error - 에러 객체
   * @returns {boolean} 서버 에러 여부
   */
  isServerError(error) {
    return error?.response?.status >= 500;
  }
};

/**
 * 전역에서 사용할 수 있는 메시지 표시 함수들
 */
export const globalMessageUtils = {
  /**
   * 전역 성공 메시지 표시
   * @param {string} message - 메시지
   * @param {Object} options - 옵션
   */
  showSuccess(message, options = {}) {
    const event = new CustomEvent('show-toast', {
      detail: {
        text: message,
        type: 'success',
        ...options
      }
    });
    window.dispatchEvent(event);
  },

  /**
   * 전역 에러 메시지 표시
   * @param {string} message - 메시지
   * @param {Object} options - 옵션
   */
  showError(message, options = {}) {
    const event = new CustomEvent('show-toast', {
      detail: {
        text: message,
        type: 'error',
        ...options
      }
    });
    window.dispatchEvent(event);
  },

  /**
   * 전역 경고 메시지 표시
   * @param {string} message - 메시지
   * @param {Object} options - 옵션
   */
  showWarning(message, options = {}) {
    const event = new CustomEvent('show-toast', {
      detail: {
        text: message,
        type: 'warning',
        ...options
      }
    });
    window.dispatchEvent(event);
  },

  /**
   * 전역 정보 메시지 표시
   * @param {string} message - 메시지
   * @param {Object} options - 옵션
   */
  showInfo(message, options = {}) {
    const event = new CustomEvent('show-toast', {
      detail: {
        text: message,
        type: 'info',
        ...options
      }
    });
    window.dispatchEvent(event);
  }
};