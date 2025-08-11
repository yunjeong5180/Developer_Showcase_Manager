import { supabase } from '@/config/supabase'

// 통계 및 대시보드 관련 API 함수들
export const statisticsAPI = {
  // 대시보드 통계 데이터 조회
  async getDashboardStats() {
    try {
      console.log('대시보드 통계 조회 시작')

      // 현재 인증된 사용자 정보 가져오기
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        return {
          success: false,
          error: '사용자 인증이 필요합니다.',
          data: null
        }
      }

      // users 테이블에서 user_id 조회
      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()

      if (userDataError || !userData) {
        return {
          success: false,
          error: '사용자 정보를 찾을 수 없습니다.',
          data: null
        }
      }

      const currentUserId = userData.id

      // 1. 총 프로젝트 수
      const { count: totalProjects, error: projectCountError } = await supabase
        .from('projects')
        .select('id', { count: 'exact' })
        .eq('user_id', currentUserId)

      if (projectCountError) {
        console.error('프로젝트 수 조회 오류:', projectCountError)
      }

      // 2. 총 조회수 (모든 프로젝트의 view_count 합계)
      const { data: viewCountData, error: viewCountError } = await supabase
        .from('projects')
        .select('view_count')
        .eq('user_id', currentUserId)

      let totalViews = 0
      if (!viewCountError && viewCountData) {
        totalViews = viewCountData.reduce((sum, project) => sum + (project.view_count || 0), 0)
      }

      // 3. 이번 달 업데이트된 프로젝트 수
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count: monthlyUpdates, error: monthlyError } = await supabase
        .from('projects')
        .select('id', { count: 'exact' })
        .eq('user_id', currentUserId)
        .gte('updated_at', startOfMonth.toISOString())

      if (monthlyError) {
        console.error('월별 업데이트 조회 오류:', monthlyError)
      }

      // 4. 특성 프로젝트 수
      const { count: featuredProjects, error: featuredError } = await supabase
        .from('projects')
        .select('id', { count: 'exact' })
        .eq('user_id', currentUserId)
        .eq('is_featured', true)

      if (featuredError) {
        console.error('특성 프로젝트 조회 오류:', featuredError)
      }

      // 5. 최근 30일 활동 수
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { count: recentActivities, error: activityError } = await supabase
        .from('activity_logs')
        .select('id', { count: 'exact' })
        .eq('user_id', currentUserId)
        .gte('created_at', thirtyDaysAgo.toISOString())

      if (activityError) {
        console.error('최근 활동 조회 오류:', activityError)
      }

      // 6. 가장 많이 사용된 기술 스택 (상위 5개)
      const { data: projectsWithTechStack, error: techStackError } = await supabase
        .from('projects')
        .select('tech_stack')
        .eq('user_id', currentUserId)

      let topTechStacks = []
      if (!techStackError && projectsWithTechStack) {
        const techStackCount = {}
        
        projectsWithTechStack.forEach(project => {
          if (project.tech_stack && Array.isArray(project.tech_stack)) {
            project.tech_stack.forEach(tech => {
              techStackCount[tech] = (techStackCount[tech] || 0) + 1
            })
          }
        })

        topTechStacks = Object.entries(techStackCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([tech, count]) => ({ name: tech, count }))
      }

      // 7. 월별 프로젝트 생성 통계 (최근 6개월)
      const monthlyStats = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const startOfTargetMonth = new Date(date.getFullYear(), date.getMonth(), 1)
        const endOfTargetMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)

        const { count: monthlyCount, error: monthlyStatsError } = await supabase
          .from('projects')
          .select('id', { count: 'exact' })
          .eq('user_id', currentUserId)
          .gte('created_at', startOfTargetMonth.toISOString())
          .lte('created_at', endOfTargetMonth.toISOString())

        if (!monthlyStatsError) {
          monthlyStats.push({
            month: date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' }),
            count: monthlyCount || 0
          })
        }
      }

      const dashboardStats = {
        totalProjects: totalProjects || 0,
        totalViews: totalViews,
        monthlyUpdates: monthlyUpdates || 0,
        featuredProjects: featuredProjects || 0,
        recentActivities: recentActivities || 0,
        topTechStacks: topTechStacks,
        monthlyStats: monthlyStats,
        lastUpdated: new Date().toISOString()
      }

      console.log('대시보드 통계 조회 성공:', dashboardStats)
      return {
        success: true,
        error: null,
        data: dashboardStats
      }

    } catch (error) {
      console.error('대시보드 통계 조회 예외:', error)
      return {
        success: false,
        error: `대시보드 통계 조회 중 오류가 발생했습니다: ${error.message}`,
        data: null
      }
    }
  },

  // 최근 활동 목록 조회
  async getRecentActivities(limit = 10) {
    try {
      console.log('최근 활동 조회, 제한:', limit)

      // 현재 인증된 사용자 정보 가져오기
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        return {
          success: false,
          error: '사용자 인증이 필요합니다.',
          data: null
        }
      }

      // users 테이블에서 user_id 조회
      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()

      if (userDataError || !userData) {
        return {
          success: false,
          error: '사용자 정보를 찾을 수 없습니다.',
          data: null
        }
      }

      // 활동 로그 조회 (최신순)
      const { data: activities, error: activitiesError } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (activitiesError) {
        console.error('활동 로그 조회 오류:', activitiesError)
        return {
          success: false,
          error: `활동 로그 조회 실패: ${activitiesError.message}`,
          data: null
        }
      }

      // 활동 데이터 포맷팅
      const formattedActivities = activities.map(activity => {
        const timeDiff = new Date() - new Date(activity.created_at)
        const hours = Math.floor(timeDiff / (1000 * 60 * 60))
        const days = Math.floor(hours / 24)

        let timeAgo
        if (days > 0) {
          timeAgo = `${days}일 전`
        } else if (hours > 0) {
          timeAgo = `${hours}시간 전`
        } else {
          const minutes = Math.floor(timeDiff / (1000 * 60))
          timeAgo = minutes > 0 ? `${minutes}분 전` : '방금 전'
        }

        return {
          id: activity.id,
          action_type: activity.action_type,
          target_type: activity.target_type,
          target_id: activity.target_id,
          description: activity.description,
          metadata: activity.metadata || {},
          created_at: activity.created_at,
          timeAgo: timeAgo
        }
      })

      console.log(`최근 활동 조회 성공: ${formattedActivities.length}개 활동`)
      return {
        success: true,
        error: null,
        data: formattedActivities
      }

    } catch (error) {
      console.error('최근 활동 조회 예외:', error)
      return {
        success: false,
        error: `최근 활동 조회 중 오류가 발생했습니다: ${error.message}`,
        data: null
      }
    }
  },

  // 프로젝트별 조회수 순위 (상위 5개)
  async getTopViewedProjects(limit = 5) {
    try {
      console.log('인기 프로젝트 조회, 제한:', limit)

      // 현재 인증된 사용자 정보 가져오기
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        return {
          success: false,
          error: '사용자 인증이 필요합니다.',
          data: null
        }
      }

      // users 테이블에서 user_id 조회
      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()

      if (userDataError || !userData) {
        return {
          success: false,
          error: '사용자 정보를 찾을 수 없습니다.',
          data: null
        }
      }

      // 조회수 기준 상위 프로젝트 조회
      const { data: topProjects, error: topProjectsError } = await supabase
        .from('projects')
        .select('id, title, view_count, created_at')
        .eq('user_id', userData.id)
        .order('view_count', { ascending: false })
        .limit(limit)

      if (topProjectsError) {
        console.error('인기 프로젝트 조회 오류:', topProjectsError)
        return {
          success: false,
          error: `인기 프로젝트 조회 실패: ${topProjectsError.message}`,
          data: null
        }
      }

      console.log(`인기 프로젝트 조회 성공: ${topProjects.length}개 프로젝트`)
      return {
        success: true,
        error: null,
        data: topProjects || []
      }

    } catch (error) {
      console.error('인기 프로젝트 조회 예외:', error)
      return {
        success: false,
        error: `인기 프로젝트 조회 중 오류가 발생했습니다: ${error.message}`,
        data: null
      }
    }
  },

  // 활동 통계 요약 (액션 타입별)
  async getActivitySummary(days = 30) {
    try {
      console.log(`활동 통계 조회: 최근 ${days}일`)

      // 현재 인증된 사용자 정보 가져오기
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        return {
          success: false,
          error: '사용자 인증이 필요합니다.',
          data: null
        }
      }

      // users 테이블에서 user_id 조회
      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()

      if (userDataError || !userData) {
        return {
          success: false,
          error: '사용자 정보를 찾을 수 없습니다.',
          data: null
        }
      }

      // 날짜 범위 설정
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // 액션 타입별 활동 수 조회
      const { data: activities, error: activitiesError } = await supabase
        .from('activity_logs')
        .select('action_type')
        .eq('user_id', userData.id)
        .gte('created_at', startDate.toISOString())

      if (activitiesError) {
        console.error('활동 통계 조회 오류:', activitiesError)
        return {
          success: false,
          error: `활동 통계 조회 실패: ${activitiesError.message}`,
          data: null
        }
      }

      // 액션 타입별 집계
      const activityCount = {}
      activities.forEach(activity => {
        activityCount[activity.action_type] = (activityCount[activity.action_type] || 0) + 1
      })

      const summary = {
        totalActivities: activities.length,
        period: `${days}일`,
        actionBreakdown: activityCount,
        mostFrequentAction: Object.keys(activityCount).reduce((a, b) => 
          activityCount[a] > activityCount[b] ? a : b, 'CREATE')
      }

      console.log('활동 통계 조회 성공:', summary)
      return {
        success: true,
        error: null,
        data: summary
      }

    } catch (error) {
      console.error('활동 통계 조회 예외:', error)
      return {
        success: false,
        error: `활동 통계 조회 중 오류가 발생했습니다: ${error.message}`,
        data: null
      }
    }
  }
}