'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Profile {
  user_id: number
  name: string
  title: string
  email: string
  github: string
  bio: string
}

interface Skill {
  skill_id: number
  name: string
  level: string
  category: string
}

interface Project {
  project_id: number
  title: string
  description: string
  technologies: string[]
  image_url?: string
  demo_url?: string
  github_url?: string
  start_date: string
  end_date?: string
}

export default function UserPortfolio() {
  const params = useParams()
  const userId = params.userId as string
  
  const [profile, setProfile] = useState<Profile | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [activeSection, setActiveSection] = useState('about')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPortfolioData()
  }, [userId])

  const fetchPortfolioData = async () => {
    try {
      setLoading(true)
      
      // 프로필 정보 가져오기
      const profileRes = await fetch(`http://localhost:3000/api/profiles/public/${userId}`)
      if (!profileRes.ok) {
        throw new Error('프로필을 찾을 수 없습니다')
      }
      const profileData = await profileRes.json()
      setProfile(profileData)

      // 기술 스택 가져오기
      const skillsRes = await fetch(`http://localhost:3000/api/user-skills/user/${userId}`)
      if (skillsRes.ok) {
        const skillsData = await skillsRes.json()
        setSkills(skillsData)
      }

      // 프로젝트 가져오기
      const projectsRes = await fetch(`http://localhost:3000/api/projects/user/${userId}`)
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        setProjects(projectsData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">포트폴리오를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">포트폴리오를 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-8">{error || '요청하신 포트폴리오가 존재하지 않습니다.'}</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
            <nav className="flex gap-6">
              <button
                onClick={() => setActiveSection('about')}
                className={`font-medium transition-colors ${
                  activeSection === 'about' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                소개
              </button>
              <button
                onClick={() => setActiveSection('skills')}
                className={`font-medium transition-colors ${
                  activeSection === 'skills' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                기술 스택
              </button>
              <button
                onClick={() => setActiveSection('projects')}
                className={`font-medium transition-colors ${
                  activeSection === 'projects' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                프로젝트
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-5xl font-bold mb-4">{profile.name}</h2>
          <p className="text-2xl mb-6">{profile.title || '개발자'}</p>
          <div className="flex gap-4">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                GitHub
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="bg-white text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                이메일
              </a>
            )}
          </div>
        </div>
      </section>

      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* 소개 섹션 */}
        {activeSection === 'about' && (
          <section className="animate-fadeIn">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">소개</h3>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {profile.bio || '자기소개가 아직 작성되지 않았습니다.'}
              </p>
            </div>
          </section>
        )}

        {/* 기술 스택 섹션 */}
        {activeSection === 'skills' && (
          <section className="animate-fadeIn">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">기술 스택</h3>
            {skills.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill) => (
                  <div key={skill.skill_id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xl font-semibold text-gray-800">{skill.name}</h4>
                      <span className="text-sm text-gray-500">{skill.category}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{
                            width: skill.level === '고급' ? '90%' : skill.level === '중급' ? '60%' : '30%'
                          }}
                        ></div>
                      </div>
                      <span className="ml-4 text-sm font-medium text-gray-600">{skill.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                아직 등록된 기술 스택이 없습니다.
              </div>
            )}
          </section>
        )}

        {/* 프로젝트 섹션 */}
        {activeSection === 'projects' && (
          <section className="animate-fadeIn">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">프로젝트</h3>
            {projects.length > 0 ? (
              <div className="space-y-8">
                {projects.map((project) => (
                  <div key={project.project_id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex">
                      {project.image_url && (
                        <div className="md:w-1/3">
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-64 md:h-full object-cover"
                          />
                        </div>
                      )}
                      <div className={`${project.image_url ? 'md:w-2/3' : ''} p-8`}>
                        <h4 className="text-2xl font-bold text-gray-800 mb-2">{project.title}</h4>
                        <p className="text-gray-600 mb-4 whitespace-pre-wrap">{project.description}</p>
                        
                        <div className="mb-4">
                          <span className="text-sm text-gray-500">
                            {new Date(project.start_date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
                            {' ~ '}
                            {project.end_date 
                              ? new Date(project.end_date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })
                              : '진행중'
                            }
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-4">
                          {project.demo_url && (
                            <a
                              href={project.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              라이브 데모 →
                            </a>
                          )}
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-800 font-medium"
                            >
                              GitHub →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                아직 등록된 프로젝트가 없습니다.
              </div>
            )}
          </section>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-4">이 포트폴리오는 DevShowcase로 제작되었습니다</p>
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            나도 포트폴리오 만들기 →
          </Link>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}