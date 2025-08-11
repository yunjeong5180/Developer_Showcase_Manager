// Auth utilities
export const authUtils = {
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  isValidPassword: (password) => {
    return password && password.length >= 6;
  },
  
  isValidNickname: (nickname) => {
    return nickname && nickname.length >= 2 && nickname.length <= 20;
  },
  
  getErrorMessage: (error) => {
    if (error.message) return error.message;
    if (error.error_description) return error.error_description;
    if (error.msg) return error.msg;
    return 'An unexpected error occurred';
  }
};

// Export other utils
export * from './validators';
export * from './formatters';