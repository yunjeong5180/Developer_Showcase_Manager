// 통합 서비스 export
export * as authService from "./authService";
export { projectAPI as projectService } from "./projectService";
export { imageAPI as imageService } from "./imageService";
export { statisticsAPI as statisticsService } from "./statisticsService";

// Supabase 클라이언트 export
export { supabase } from "../../config/supabase";
