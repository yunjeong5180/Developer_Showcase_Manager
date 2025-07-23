"use client"

import { useEffect } from 'react'

export default function AboutPage() {
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
  }, [])

  return (
    <>
      {/* About 섹션 */}
      <section className="pt-32 pb-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 fade-in">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center fade-in">
              <div className="text-9xl mb-8">👩‍💻</div>
            </div>
            <div className="space-y-6 fade-in">
              <h3 className="text-2xl font-bold">개발자를 꿈꾸는 양윤정</h3>
              <p className="text-gray-600">
                안녕하세요! 저는 웹 개발에 열정을 가진 비전공자 개발자입니다. 
                HTML, CSS, JavaScript부터 시작해서 Java, Spring Boot까지 차근차근 배워나가고 있습니다.
              </p>
              <p className="text-gray-600">
                새로운 기술을 배우는 것을 좋아하고, 사용자 친화적인 웹 애플리케이션을 만들기 위해 노력하고 있습니다. 
                매일 조금씩이라도 성장하는 개발자가 되는 것이 목표입니다.
              </p>
              <p className="text-gray-600">
                현재는 IntelliJ IDEA를 주로 사용하며, GitHub를 통해 코드를 관리하고 있습니다. 
                클라우드 서비스로는 Supabase와 Railway를 활용해 프로젝트를 배포하고 있습니다.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {['HTML/CSS', 'JavaScript', 'Java', 'Spring Boot', 'Git/GitHub', 'IntelliJ IDEA', 'Supabase', 'Railway'].map((skill) => (
                  <span key={skill} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 학습 여정 섹션 */}
      <section className="py-20 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 fade-in">학습 여정</h2>
          <div className="space-y-8">
            {[
              { date: '2024.01', title: '웹 개발 학습 시작', desc: 'HTML, CSS 기초부터 시작해서 웹 개발의 기본기를 다지기 시작했습니다.' },
              { date: '2024.03', title: 'JavaScript 학습', desc: '동적인 웹 페이지를 만들기 위해 JavaScript를 학습하고 다양한 프로젝트를 진행했습니다.' },
              { date: '2024.06', title: 'Java & Spring Boot 학습', desc: '백엔드 개발을 위해 Java와 Spring Boot를 학습하고 웹 애플리케이션을 개발했습니다.' },
              { date: '2024.09', title: '클라우드 서비스 활용', desc: 'Supabase와 Railway를 활용해 실제 서비스를 배포하고 운영하는 경험을 쌓았습니다.' },
              { date: '현재', title: '지속적인 성장', desc: '매일 새로운 것을 배우고, 더 나은 코드를 작성하기 위해 노력하고 있습니다.' }
            ].map((item, index) => (
              <div key={index} className="flex gap-8 fade-in">
                <div className="flex-shrink-0 w-24 text-right font-bold text-blue-600">{item.date}</div>
                <div className="flex-grow border-l-2 border-blue-200 pl-8 pb-8">
                  <div className="relative">
                    <div className="absolute -left-10 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 관심사 & 목표 섹션 */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 fade-in">관심사 & 목표</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🎯', title: '목표', desc: '풀스택 개발자로 성장하여 사용자에게 가치있는 서비스를 제공하는 것이 목표입니다.' },
              { icon: '📚', title: '학습', desc: '새로운 기술과 프레임워크를 배우는 것을 좋아하며, 지속적인 자기계발을 추구합니다.' },
              { icon: '🤝', title: '협업', desc: '팀워크를 중시하며, 다른 개발자들과 소통하고 함께 성장하는 것을 지향합니다.' },
              { icon: '🚀', title: '도전', desc: '새로운 도전을 두려워하지 않으며, 실패를 통해 배우고 성장하는 마인드셋을 가지고 있습니다.' }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow fade-in">
                <div className="text-5xl mb-4 text-center">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-center">{item.title}</h3>
                <p className="text-gray-600 text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}