"use client"

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 여기에 이메일 전송 로직 추가 가능
    console.log('Form submitted:', formData)
    alert('메시지가 전송되었습니다!')
    setFormData({ name: '', email: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      {/* 연락처 헤더 */}
      <section className="pt-32 pb-12 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Contact Me</h1>
          <p className="text-xl text-gray-600">프로젝트 협업이나 문의사항이 있으시면 연락주세요!</p>
        </div>
      </section>

      {/* 연락처 정보 및 폼 */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* 연락처 정보 */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
            <p className="text-gray-600">
              새로운 기회와 협업에 항상 열려있습니다. 프로젝트 제안이나 궁금한 점이 있으시면 편하게 연락주세요!
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
                  📧
                </div>
                <div>
                  <h3 className="font-semibold">이메일</h3>
                  <p className="text-gray-600">your.email@example.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
                  💼
                </div>
                <div>
                  <h3 className="font-semibold">LinkedIn</h3>
                  <p className="text-gray-600">linkedin.com/in/yourprofile</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
                  🐙
                </div>
                <div>
                  <h3 className="font-semibold">GitHub</h3>
                  <p className="text-gray-600">github.com/yourusername</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">응답 시간</h3>
              <p className="text-gray-600">
                보통 24-48시간 내에 답변드립니다. 급한 용무가 있으시면 직접 연락 부탁드립니다.
              </p>
            </div>
          </div>

          {/* 연락처 폼 */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">메시지 보내기</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  이름 *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="홍길동"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  메시지 *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="프로젝트에 대해 이야기해주세요..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                메시지 전송
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 추가 정보 섹션 */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">자주 묻는 질문</h2>
          <div className="space-y-6 text-left">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">어떤 프로젝트를 주로 하시나요?</h3>
              <p className="text-gray-600">
                웹 애플리케이션 개발을 주로 하며, 프론트엔드와 백엔드 모두 다룰 수 있습니다. 
                React, Next.js, Spring Boot 등을 활용한 프로젝트 경험이 있습니다.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">프리랜서 작업도 가능한가요?</h3>
              <p className="text-gray-600">
                현재는 학습과 개인 프로젝트에 집중하고 있지만, 좋은 기회가 있다면 고려해볼 수 있습니다.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">협업 도구는 무엇을 사용하시나요?</h3>
              <p className="text-gray-600">
                GitHub를 통한 코드 관리, Slack이나 Discord를 통한 커뮤니케이션, Notion을 통한 문서 관리를 선호합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}