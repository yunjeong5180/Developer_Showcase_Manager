'use client'

import { useState } from 'react'
import Link from 'next/link'

// 데모 데이터
const demoData = {
  profile: {
    name: "김개발",
    title: "풀스택 개발자",
    email: "demo@example.com",
    github: "https://github.com/demo",
    bio: "5년차 풀스택 개발자입니다. 사용자 경험을 중시하며, 확장 가능한 웹 애플리케이션 개발에 열정을 가지고 있습니다.",
    skills: [
      { id: 1, name: "React", level: "고급", category: "Frontend" },
      { id: 2, name: "Next.js", level: "고급", category: "Frontend" },
      { id: 3, name: "TypeScript", level: "중급", category: "Language" },
      { id: 4, name: "Node.js", level: "중급", category: "Backend" },
      { id: 5, name: "PostgreSQL", level: "중급", category: "Database" },
      { id: 6, name: "Docker", level: "초급", category: "DevOps" }
    ]
  },
  projects: [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "대규모 이커머스 플랫폼 개발. 일일 10만 명 이상의 사용자가 이용하는 서비스로 성장",
      technologies: ["React", "Node.js", "PostgreSQL", "Redis"],
      imageUrl: "/api/placeholder/600/400",
      demoUrl: "https://demo-ecommerce.com",
      githubUrl: "https://github.com/demo/ecommerce",
      startDate: "2023-01",
      endDate: "2023-12",
      highlights: [
        "마이크로서비스 아키텍처 도입으로 확장성 향상",
        "결제 시스템 안정성 99.9% 달성",
        "페이지 로드 속도 40% 개선"
      ]
    },
    {
      id: 2,
      title: "실시간 협업 도구",
      description: "팀 협업을 위한 실시간 문서 편집 및 화상 회의 플랫폼",
      technologies: ["Next.js", "WebRTC", "Socket.io", "MongoDB"],
      imageUrl: "/api/placeholder/600/400",
      githubUrl: "https://github.com/demo/collab-tool",
      startDate: "2023-06",
      endDate: null,
      highlights: [
        "WebRTC를 활용한 P2P 화상 통화 구현",
        "실시간 문서 동기화 알고리즘 개발",
        "동시 접속자 1,000명 처리 가능"
      ]
    },
    {
      id: 3,
      title: "AI 기반 추천 시스템",
      description: "머신러닝을 활용한 개인화된 콘텐츠 추천 시스템",
      technologies: ["Python", "TensorFlow", "FastAPI", "React"],
      imageUrl: "/api/placeholder/600/400",
      startDate: "2022-09",
      endDate: "2023-03",
      highlights: [
        "추천 정확도 85% 달성",
        "A/B 테스트를 통한 지속적인 개선",
        "일일 1억 건의 추천 요청 처리"
      ]
    }
  ]
}

export default function DemoPortfolio() {
  const [activeSection, setActiveSection] = useState('about')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">{demoData.profile.name}</h1>
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
          <h2 className="text-5xl font-bold mb-4">{demoData.profile.name}</h2>
          <p className="text-2xl mb-6">{demoData.profile.title}</p>
          <div className="flex gap-4">
            <a
              href={demoData.profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              GitHub
            </a>
            <a
              href={`mailto:${demoData.profile.email}`}
              className="bg-white text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              이메일
            </a>
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
              <p className="text-lg text-gray-700 leading-relaxed">
                {demoData.profile.bio}
              </p>
            </div>
          </section>
        )}

        {/* 기술 스택 섹션 */}
        {activeSection === 'skills' && (
          <section className="animate-fadeIn">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">기술 스택</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demoData.profile.skills.map((skill) => (
                <div key={skill.id} className="bg-white rounded-lg shadow-md p-6">
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
          </section>
        )}

        {/* 프로젝트 섹션 */}
        {activeSection === 'projects' && (
          <section className="animate-fadeIn">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">프로젝트</h3>
            <div className="space-y-8">
              {demoData.projects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-8">
                      <h4 className="text-2xl font-bold text-gray-800 mb-2">{project.title}</h4>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      
                      <div className="mb-4">
                        <span className="text-sm text-gray-500">
                          {project.startDate} ~ {project.endDate || '진행중'}
                        </span>
                      </div>

                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-700 mb-2">주요 성과</h5>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {project.highlights.map((highlight, index) => (
                            <li key={index}>{highlight}</li>
                          ))}
                        </ul>
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
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            라이브 데모 →
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
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