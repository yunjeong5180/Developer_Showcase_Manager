import ProjectsList from '@/components/ProjectsList'
import type { Project } from '@/types/portfolio'

async function getProjects() {
  // const supabase = createServerSupabaseClient()
  
  // 먼저 로컬 데이터로 시작, 나중에 Supabase 연결
  const mockProjects: Project[] = [
    {
      id: '1',
      title: '포트폴리오 웹사이트',
      description: '반응형 디자인과 애니메이션 효과를 적용한 개인 포트폴리오 웹사이트입니다. 순수 HTML, CSS, JavaScript로 제작했습니다.',
      category: ['frontend', 'web'],
      tech_stack: ['HTML', 'CSS', 'JavaScript', '반응형'],
      features: ['반응형 웹 디자인', '스크롤 애니메이션', '스무스 스크롤 네비게이션', '연락처 폼'],
      image_url: '🌐',
      order_index: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title: '할일 관리 앱 (To-Do List)',
      description: 'Spring Boot와 Supabase를 활용한 할일 관리 웹 애플리케이션입니다. CRUD 기능과 카테고리 분류 기능을 구현했습니다.',
      category: ['fullstack', 'web'],
      tech_stack: ['Java', 'Spring Boot', 'Supabase', 'PostgreSQL'],
      features: ['할일 추가/수정/삭제', '카테고리별 분류', '완료 상태 관리', '데이터 영구 저장'],
      image_url: '📝',
      order_index: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      title: '실시간 채팅 애플리케이션',
      description: 'WebSocket을 활용한 실시간 채팅 서비스입니다. 다중 채팅방과 이모티콘 기능을 지원합니다.',
      category: ['fullstack', 'web'],
      tech_stack: ['Spring Boot', 'WebSocket', 'JavaScript', 'Railway'],
      features: ['실시간 메시지 전송', '다중 채팅방', '이모티콘 지원', '사용자 온라인 상태 표시'],
      image_url: '💬',
      order_index: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      title: '날씨 정보 앱',
      description: '외부 API를 활용한 날씨 정보 제공 웹 애플리케이션입니다. 현재 위치 기반 날씨 정보를 제공합니다.',
      category: ['frontend', 'web'],
      tech_stack: ['JavaScript', 'Weather API', 'CSS3', 'HTML5'],
      features: ['현재 위치 날씨 정보', '5일 예보', '시간별 날씨', '날씨 애니메이션'],
      image_url: '🌤️',
      order_index: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
  
  // TODO: Supabase 연결 시 아래 코드로 교체
  // const { data: projects, error } = await supabase
  //   .from('projects')
  //   .select('*')
  //   .order('order_index', { ascending: true })
  
  // if (error) {
  //   console.error('Error fetching projects:', error)
  //   return []
  // }
  
  // return projects || []
  
  return mockProjects
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <>
      {/* 프로젝트 헤더 */}
      <section className="pt-32 pb-12 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 fade-in">My Projects</h1>
          <p className="text-xl text-gray-600 fade-in">지금까지 진행한 프로젝트들을 소개합니다</p>
        </div>
      </section>

      {/* 프로젝트 목록 컴포넌트 */}
      <ProjectsList initialProjects={projects} />
    </>
  )
}