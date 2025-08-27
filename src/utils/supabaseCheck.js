// Supabase 연결 상태를 확인하는 유틸리티

export const checkSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const isConfigured =
    url &&
    key &&
    url !== "https://your-project.supabase.co" &&
    key !== "your-anon-key-here";

  return {
    isConfigured,
    url,
    key: key ? "***" + key.slice(-4) : null, // 보안을 위해 키의 마지막 4자리만 표시
    message: isConfigured
      ? "Supabase가 설정되었습니다."
      : "Supabase 설정이 필요합니다. .env.development 파일을 확인하세요.",
  };
};

export const isSupabaseEnabled = () => {
  const config = checkSupabaseConfig();
  return config.isConfigured;
};
