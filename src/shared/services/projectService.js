import { supabase } from '@/config/supabase'

// 프로젝트 관련 API 함수들
export const projectAPI = {
  // 프로젝트 생성
  async createProject(projectData) {
    try {
      console.log('프로젝트 생성 시도:', projectData)

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

      // 프로젝트 데이터 준비
      const projectToInsert = {
        user_id: userData.id,
        title: projectData.title?.trim(),
        description: projectData.description?.trim() || null,
        tech_stack: projectData.tech_stack || [],
        github_url: projectData.github_url?.trim() || null,
        demo_url: projectData.demo_url?.trim() || null,
        image_urls: projectData.image_urls || [],
        start_date: projectData.start_date || null,
        end_date: projectData.end_date || null,
        is_featured: projectData.is_featured || false,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // 프로젝트 생성
      const { data: newProject, error: insertError } = await supabase
        .from('projects')
        .insert([projectToInsert])
        .select()
        .single()

      if (insertError) {
        console.error('프로젝트 생성 오류:', insertError)
        return {
          success: false,
          error: `프로젝트 생성 실패: ${insertError.message}`,
          data: null
        }
      }

      // 활동 로그 기록
      await this.logActivity(userData.id, 'CREATE', 'project', newProject.id, 
        `새 프로젝트 "${newProject.title}"를 생성했습니다.`, {
          project_title: newProject.title,
          tech_stack: newProject.tech_stack
        })

      console.log('프로젝트 생성 성공:', newProject)
      return {
        success: true,
        error: null,
        data: newProject
      }

    } catch (error) {
      console.error('프로젝트 생성 예외:', error)
      return {
        success: false,
        error: `프로젝트 생성 중 오류가 발생했습니다: ${error.message}`,
        data: null
      }
    }
  },

  // 프로젝트 목록 조회
  async getProjects(filters = {}) {
    try {
      console.log('프로젝트 목록 조회:', filters)

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

      // 쿼리 빌더 시작
      let query = supabase
        .from('projects')
        .select('*')
        .eq('user_id', userData.id)

      // 검색 필터
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      // 기술 스택 필터
      if (filters.techStack && filters.techStack.length > 0) {
        query = query.contains('tech_stack', filters.techStack)
      }

      // 특성 프로젝트 필터
      if (filters.featured !== undefined) {
        query = query.eq('is_featured', filters.featured)
      }

      // 날짜 범위 필터
      if (filters.startDate) {
        query = query.gte('start_date', filters.startDate)
      }
      if (filters.endDate) {
        query = query.lte('end_date', filters.endDate)
      }

      // 정렬
      const sortBy = filters.sortBy || 'created_at'
      const sortOrder = filters.sortOrder || 'desc'
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      // 페이지네이션
      const page = filters.page || 1
      const limit = filters.limit || 12
      const offset = (page - 1) * limit
      query = query.range(offset, offset + limit - 1)

      const { data: projects, error, count } = await query

      if (error) {
        console.error('프로젝트 목록 조회 오류:', error)
        return {
          success: false,
          error: `프로젝트 목록 조회 실패: ${error.message}`,
          data: null
        }
      }

      console.log(`프로젝트 목록 조회 성공: ${projects.length}개 프로젝트`)
      return {
        success: true,
        error: null,
        data: {
          projects: projects || [],
          pagination: {
            page: page,
            limit: limit,
            total: count || projects.length,
            totalPages: Math.ceil((count || projects.length) / limit)
          }
        }
      }

    } catch (error) {
      console.error('프로젝트 목록 조회 예외:', error)
      return {
        success: false,
        error: `프로젝트 목록 조회 중 오류가 발생했습니다: ${error.message}`,
        data: null
      }
    }
  },

  // 프로젝트 상세 조회
  async getProject(projectId) {
    try {
      console.log('프로젝트 상세 조회:', projectId)

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

      // 프로젝트 조회 (사용자 소유 확인 포함)
      const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', userData.id)
        .single()

      if (error) {
        console.error('프로젝트 조회 오류:', error)
        return {
          success: false,
          error: error.code === 'PGRST116' ? '프로젝트를 찾을 수 없습니다.' : `프로젝트 조회 실패: ${error.message}`,
          data: null
        }
      }

      // 조회수 증가
      const { error: updateError } = await supabase
        .from('projects')
        .update({ 
          view_count: project.view_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .eq('user_id', userData.id)

      if (updateError) {
        console.warn('조회수 업데이트 실패:', updateError.message)
      }

      // 업데이트된 조회수 반영
      project.view_count = project.view_count + 1

      console.log('프로젝트 상세 조회 성공:', project.title)
      return {
        success: true,
        error: null,
        data: project
      }

    } catch (error) {
      console.error('프로젝트 상세 조회 예외:', error)
      return {
        success: false,
        error: `프로젝트 조회 중 오류가 발생했습니다: ${error.message}`,
        data: null
      }
    }
  },

  // 프로젝트 업데이트
  async updateProject(projectId, updateData) {
    try {
      console.log('프로젝트 업데이트:', projectId, updateData)

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

      // 기존 프로젝트 조회 (권한 확인)
      const { data: existingProject, error: existingError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', userData.id)
        .single()

      if (existingError || !existingProject) {
        return {
          success: false,
          error: '프로젝트를 찾을 수 없거나 수정 권한이 없습니다.',
          data: null
        }
      }

      // 업데이트 데이터 준비
      const updatePayload = {
        updated_at: new Date().toISOString()
      }

      // 변경된 필드만 업데이트
      if (updateData.title !== undefined) updatePayload.title = updateData.title?.trim()
      if (updateData.description !== undefined) updatePayload.description = updateData.description?.trim() || null
      if (updateData.tech_stack !== undefined) updatePayload.tech_stack = updateData.tech_stack || []
      if (updateData.github_url !== undefined) updatePayload.github_url = updateData.github_url?.trim() || null
      if (updateData.demo_url !== undefined) updatePayload.demo_url = updateData.demo_url?.trim() || null
      if (updateData.image_urls !== undefined) updatePayload.image_urls = updateData.image_urls || []
      if (updateData.start_date !== undefined) updatePayload.start_date = updateData.start_date || null
      if (updateData.end_date !== undefined) updatePayload.end_date = updateData.end_date || null
      if (updateData.is_featured !== undefined) updatePayload.is_featured = updateData.is_featured

      // 프로젝트 업데이트
      const { data: updatedProject, error: updateError } = await supabase
        .from('projects')
        .update(updatePayload)
        .eq('id', projectId)
        .eq('user_id', userData.id)
        .select()
        .single()

      if (updateError) {
        console.error('프로젝트 업데이트 오류:', updateError)
        return {
          success: false,
          error: `프로젝트 업데이트 실패: ${updateError.message}`,
          data: null
        }
      }

      // 활동 로그 기록
      await this.logActivity(userData.id, 'UPDATE', 'project', projectId, 
        `프로젝트 "${updatedProject.title}"를 수정했습니다.`, {
          project_title: updatedProject.title,
          updated_fields: Object.keys(updatePayload).filter(key => key !== 'updated_at')
        })

      console.log('프로젝트 업데이트 성공:', updatedProject.title)
      return {
        success: true,
        error: null,
        data: updatedProject
      }

    } catch (error) {
      console.error('프로젝트 업데이트 예외:', error)
      return {
        success: false,
        error: `프로젝트 업데이트 중 오류가 발생했습니다: ${error.message}`,
        data: null
      }
    }
  },

  // 프로젝트 삭제
  async deleteProject(projectId) {
    try {
      console.log('프로젝트 삭제:', projectId)

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

      // 기존 프로젝트 조회 (권한 확인 및 이미지 URL 수집)
      const { data: existingProject, error: existingError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', userData.id)
        .single()

      if (existingError || !existingProject) {
        return {
          success: false,
          error: '프로젝트를 찾을 수 없거나 삭제 권한이 없습니다.',
          data: null
        }
      }

      // 관련 이미지 삭제 (Supabase Storage에서)
      if (existingProject.image_urls && existingProject.image_urls.length > 0) {
        try {
          const imagePaths = existingProject.image_urls.map(url => {
            // URL에서 파일 패스 추출
            const urlParts = url.split('/')
            return urlParts[urlParts.length - 1]
          })

          const { error: storageError } = await supabase.storage
            .from('project-images')
            .remove(imagePaths)

          if (storageError) {
            console.warn('이미지 삭제 실패:', storageError.message)
          } else {
            console.log('프로젝트 이미지 삭제 완료')
          }
        } catch (imageError) {
          console.warn('이미지 삭제 중 오류:', imageError.message)
        }
      }

      // 프로젝트 삭제
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', userData.id)

      if (deleteError) {
        console.error('프로젝트 삭제 오류:', deleteError)
        return {
          success: false,
          error: `프로젝트 삭제 실패: ${deleteError.message}`,
          data: null
        }
      }

      // 활동 로그 기록
      await this.logActivity(userData.id, 'DELETE', 'project', projectId, 
        `프로젝트 "${existingProject.title}"를 삭제했습니다.`, {
          project_title: existingProject.title,
          deleted_at: new Date().toISOString()
        })

      console.log('프로젝트 삭제 성공:', existingProject.title)
      return {
        success: true,
        error: null,
        data: { deletedProject: existingProject }
      }

    } catch (error) {
      console.error('프로젝트 삭제 예외:', error)
      return {
        success: false,
        error: `프로젝트 삭제 중 오류가 발생했습니다: ${error.message}`,
        data: null
      }
    }
  },

  // 활동 로그 기록 헬퍼 함수
  async logActivity(userId, actionType, targetType, targetId, description, metadata = {}) {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert([{
          user_id: userId,
          action_type: actionType,
          target_type: targetType,
          target_id: targetId,
          description: description,
          metadata: metadata,
          created_at: new Date().toISOString()
        }])

      if (error) {
        console.warn('활동 로그 기록 실패:', error.message)
      } else {
        console.log('활동 로그 기록 완료:', description)
      }
    } catch (error) {
      console.warn('활동 로그 기록 예외:', error.message)
    }
  }
}