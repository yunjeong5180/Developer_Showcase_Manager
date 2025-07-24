'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 네비게이션 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">Codit</span>
            </div>
            <div className="flex gap-4 items-center">
              <a 
                href="http://localhost:3000" 
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                홈
              </a>
              <a 
                href="http://localhost:8080/dashboard" 
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                My Codit
              </a>
              <Link 
                href="/admin" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            개발자 포트폴리오를
            <br />
            <span className="text-blue-600">쉽게 관리하세요</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            프로필, 프로젝트, 기술 스택을 한 곳에서 관리하고
            <br />
            전문적인 포트폴리오 페이지로 자동 생성하세요
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16">
            <Link 
              href="/admin/signup" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              무료로 시작하기
            </Link>
            <Link 
              href="/portfolio/demo" 
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              데모 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 기능 소개 섹션 */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            두 가지 공간으로 완성되는 포트폴리오
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* 관리자 페이지 */}
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">관리자 페이지</h3>
              <p className="text-gray-600 mb-6">
                프로필 정보, 프로젝트, 기술 스택을 쉽게 등록하고 관리할 수 있는 전용 관리 페이지입니다.
              </p>
              <Link 
                href="/admin" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                관리자 페이지 접속
              </Link>
            </div>

            {/* 포트폴리오 페이지 */}
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">포트폴리오 페이지</h3>
              <p className="text-gray-600 mb-6">
                등록한 정보가 자동으로 전문적인 포트폴리오 페이지로 생성되어 다른 사람들과 공유할 수 있습니다.
              </p>
              <Link 
                href="/portfolio/demo" 
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                샘플 포트폴리오 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            지금 시작해보세요
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            몇 분만에 전문적인 포트폴리오를 만들어보세요
          </p>
          <Link 
            href="/admin/signup" 
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            무료 회원가입
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white py-8 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 DevShowcase. 개발자를 위한 포트폴리오 관리 플랫폼</p>
        </div>
      </footer>
    </div>
  )
}