"use client"

import { useState, useEffect } from 'react'
import type { Project } from '@/types/portfolio'

interface ProjectsListProps {
  initialProjects: Project[]
}

const gradients = [
  'from-purple-500 to-purple-700',
  'from-red-500 to-yellow-500',
  'from-green-500 to-blue-500',
  'from-blue-400 to-cyan-500',
  'from-pink-500 to-rose-500',
  'from-indigo-500 to-purple-500'
]

export default function ProjectsList({ initialProjects }: ProjectsListProps) {
  const [filter, setFilter] = useState('all')
  const [projects, setProjects] = useState(initialProjects)
  const [filteredProjects, setFilteredProjects] = useState(initialProjects)

  useEffect(() => {
    if (filter === 'all') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(project => 
        project.category.includes(filter)
      ))
    }
  }, [filter, projects])

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll('.fade-in')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [filteredProjects])

  return (
    <>
      {/* 필터 버튼 */}
      <section className="py-8 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center gap-4 flex-wrap fade-in">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilter('web')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === 'web' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              웹 개발
            </button>
            <button
              onClick={() => setFilter('frontend')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === 'frontend' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              프론트엔드
            </button>
            <button
              onClick={() => setFilter('fullstack')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === 'fullstack' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              풀스택
            </button>
          </div>
        </div>
      </section>

      {/* 프로젝트 목록 */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow fade-in"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`h-48 bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center text-7xl`}>
                  {project.image_url}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">주요 기능</h4>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                      {project.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    {project.demo_url && (
                      <a 
                        href={project.demo_url} 
                        className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a 
                        href={project.github_url} 
                        className="flex-1 text-center border-2 border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}