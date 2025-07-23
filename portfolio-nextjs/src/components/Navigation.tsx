"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isClient && isScrolled 
        ? 'bg-white/98 backdrop-blur-md shadow-lg' 
        : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            Portfolio
          </Link>
          <ul className="flex space-x-8">
            <li>
              <Link 
                href="/" 
                className={`hover:text-blue-600 transition-colors ${
                  pathname === '/' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                }`}
              >
                홈
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                className={`hover:text-blue-600 transition-colors ${
                  pathname === '/about' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                }`}
              >
                소개
              </Link>
            </li>
            <li>
              <Link 
                href="/projects" 
                className={`hover:text-blue-600 transition-colors ${
                  pathname === '/projects' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                }`}
              >
                프로젝트
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className={`hover:text-blue-600 transition-colors ${
                  pathname === '/contact' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                }`}
              >
                연락처
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}