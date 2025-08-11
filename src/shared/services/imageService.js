import { supabase } from '@/config/supabase'

// 이미지 업로드 및 관리 관련 API 함수들
export const imageAPI = {
  // 프로젝트 이미지 업로드 (다중 파일 지원)
  async uploadProjectImages(files, projectId) {
    try {
      console.log('프로젝트 이미지 업로드:', files.length, '개 파일, 프로젝트 ID:', projectId)

      // 현재 인증된 사용자 정보 가져오기
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        return {
          success: false,
          error: '사용자 인증이 필요합니다.',
          data: null
        }
      }

      if (!files || files.length === 0) {
        return {
          success: false,
          error: '업로드할 파일이 없습니다.',
          data: null
        }
      }

      const uploadedImages = []
      const maxFileSize = 10 * 1024 * 1024 // 10MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // 파일 타입 검증
        if (!allowedTypes.includes(file.type)) {
          return {
            success: false,
            error: `지원하지 않는 파일 형식입니다: ${file.name}. JPG, PNG, WebP, GIF만 지원됩니다.`,
            data: null
          }
        }

        // 파일 크기 검증
        if (file.size > maxFileSize) {
          return {
            success: false,
            error: `파일 크기가 너무 큽니다: ${file.name}. 최대 10MB까지 지원됩니다.`,
            data: null
          }
        }

        // 고유한 파일명 생성
        const fileExt = file.name.split('.').pop().toLowerCase()
        const fileName = `${user.id}/projects/${projectId}/${Date.now()}_${i + 1}.${fileExt}`

        try {
          // Supabase Storage에 업로드
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('project-images')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) {
            console.error('이미지 업로드 오류:', uploadError)
            return {
              success: false,
              error: `이미지 업로드 실패: ${uploadError.message}`,
              data: null
            }
          }

          // 공개 URL 생성
          const { data: urlData } = supabase.storage
            .from('project-images')
            .getPublicUrl(fileName)

          uploadedImages.push({
            path: uploadData.path,
            publicUrl: urlData.publicUrl,
            originalName: file.name,
            size: file.size,
            type: file.type
          })

          console.log('이미지 업로드 성공:', file.name)

        } catch (fileError) {
          console.error('개별 파일 업로드 오류:', fileError)
          return {
            success: false,
            error: `파일 "${file.name}" 업로드 중 오류가 발생했습니다: ${fileError.message}`,
            data: null
          }
        }
      }

      console.log(`프로젝트 이미지 업로드 완료: ${uploadedImages.length}개 파일`)
      return {
        success: true,
        error: null,
        data: {
          images: uploadedImages,
          count: uploadedImages.length
        }
      }

    } catch (error) {
      console.error('프로젝트 이미지 업로드 예외:', error)
      return {
        success: false,
        error: `이미지 업로드 중 오류가 발생했습니다: ${error.message}`,
        data: null
      }
    }
  },

  // 프로젝트 이미지 삭제
  async deleteProjectImages(imagePaths) {
    try {
      console.log('프로젝트 이미지 삭제:', imagePaths)

      // 현재 인증된 사용자 정보 가져오기
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        return {
          success: false,
          error: '사용자 인증이 필요합니다.',
          data: null
        }
      }

      if (!imagePaths || imagePaths.length === 0) {
        return {
          success: false,
          error: '삭제할 이미지가 없습니다.',
          data: null
        }
      }

      // URL에서 파일 패스 추출
      const filePaths = imagePaths.map(urlOrPath => {
        if (urlOrPath.includes('/storage/v1/object/public/')) {
          // 공개 URL인 경우 패스 추출
          const parts = urlOrPath.split('/storage/v1/object/public/project-images/')
          return parts[1]
        } else {
          // 이미 패스인 경우 그대로 사용
          return urlOrPath
        }
      })

      // 사용자 소유 파일만 삭제하도록 필터링
      const userFilePaths = filePaths.filter(path => path.startsWith(`${user.id}/`))

      if (userFilePaths.length === 0) {
        return {
          success: false,
          error: '삭제 권한이 없는 이미지입니다.',
          data: null
        }
      }

      // Supabase Storage에서 삭제
      const { data: deleteData, error: deleteError } = await supabase.storage
        .from('project-images')
        .remove(userFilePaths)

      if (deleteError) {
        console.error('이미지 삭제 오류:', deleteError)
        return {
          success: false,
          error: `이미지 삭제 실패: ${deleteError.message}`,
          data: null
        }
      }

      console.log(`프로젝트 이미지 삭제 완료: ${userFilePaths.length}개 파일`)
      return {
        success: true,
        error: null,
        data: {
          deletedFiles: deleteData,
          count: userFilePaths.length
        }
      }

    } catch (error) {
      console.error('프로젝트 이미지 삭제 예외:', error)
      return {
        success: false,
        error: `이미지 삭제 중 오류가 발생했습니다: ${error.message}`,
        data: null
      }
    }
  },

  // 프로필 이미지 업로드
  async uploadProfileImage(imageFile) {
    try {
      console.log('프로필 이미지 업로드:', imageFile.name)

      // 현재 인증된 사용자 정보 가져오기
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        return {
          success: false,
          error: '사용자 인증이 필요합니다.',
          data: null
        }
      }

      // 파일 검증
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(imageFile.type)) {
        return {
          success: false,
          error: 'JPG, PNG, WebP 형식의 이미지만 업로드 가능합니다.',
          data: null
        }
      }

      // 파일 크기 검증 (5MB 제한)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (imageFile.size > maxSize) {
        return {
          success: false,
          error: '이미지 크기는 5MB 이하여야 합니다.',
          data: null
        }
      }

      // 고유한 파일명 생성
      const fileExt = imageFile.name.split('.').pop().toLowerCase()
      const fileName = `${user.id}/profile.${fileExt}`

      // 기존 프로필 이미지 삭제 시도
      try {
        const possibleExts = ['jpg', 'jpeg', 'png', 'webp']
        const deletePromises = possibleExts.map(ext => 
          supabase.storage
            .from('profile-images')
            .remove([`${user.id}/profile.${ext}`])
        )
        await Promise.all(deletePromises)
      } catch (deleteError) {
        console.log('기존 프로필 이미지 삭제 시도 (무시 가능):', deleteError.message)
      }

      // 새 파일 업로드
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('프로필 이미지 업로드 오류:', uploadError)
        return {
          success: false,
          error: `프로필 이미지 업로드 실패: ${uploadError.message}`,
          data: null
        }
      }

      // 공개 URL 생성
      const { data: urlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName)

      console.log('프로필 이미지 업로드 성공:', urlData.publicUrl)
      return {
        success: true,
        error: null,
        data: {
          path: uploadData.path,
          publicUrl: urlData.publicUrl,
          originalName: imageFile.name,
          size: imageFile.size,
          type: imageFile.type
        }
      }

    } catch (error) {
      console.error('프로필 이미지 업로드 예외:', error)
      return {
        success: false,
        error: `프로필 이미지 업로드 중 오류가 발생했습니다: ${error.message}`,
        data: null
      }
    }
  },

  // 프로필 이미지 삭제
  async deleteProfileImage() {
    try {
      console.log('프로필 이미지 삭제')

      // 현재 인증된 사용자 정보 가져오기
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        return {
          success: false,
          error: '사용자 인증이 필요합니다.',
          data: null
        }
      }

      // 가능한 확장자들로 삭제 시도
      const extensions = ['jpg', 'jpeg', 'png', 'webp']
      const deletePromises = extensions.map(ext => 
        supabase.storage
          .from('profile-images')
          .remove([`${user.id}/profile.${ext}`])
      )

      await Promise.all(deletePromises)

      console.log('프로필 이미지 삭제 완료')
      return {
        success: true,
        error: null,
        data: { message: '프로필 이미지가 삭제되었습니다.' }
      }

    } catch (error) {
      console.error('프로필 이미지 삭제 예외:', error)
      return {
        success: false,
        error: `프로필 이미지 삭제 중 오류가 발생했습니다: ${error.message}`,
        data: null
      }
    }
  },

  // 이미지 리사이징 (클라이언트 사이드)
  async resizeImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
    return new Promise((resolve, reject) => {
      try {
        console.log('이미지 리사이징:', file.name, `${maxWidth}x${maxHeight}`)

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
          // 원본 비율 유지하면서 최대 크기 계산
          let { width, height } = img
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }

          // 캔버스 크기 설정
          canvas.width = width
          canvas.height = height

          // 이미지 그리기
          ctx.drawImage(img, 0, 0, width, height)

          // Blob으로 변환
          canvas.toBlob(
            (blob) => {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              })

              console.log('이미지 리사이징 완료:', 
                `${img.width}x${img.height} → ${width}x${height}`,
                `${(file.size / 1024 / 1024).toFixed(2)}MB → ${(resizedFile.size / 1024 / 1024).toFixed(2)}MB`
              )

              resolve(resizedFile)
            },
            file.type,
            quality
          )
        }

        img.onerror = () => {
          reject(new Error('이미지 로드 실패'))
        }

        img.src = URL.createObjectURL(file)

      } catch (error) {
        reject(error)
      }
    })
  },

  // 이미지 미리보기 URL 생성
  createPreviewUrl(file) {
    try {
      if (!file || !file.type.startsWith('image/')) {
        return null
      }

      const previewUrl = URL.createObjectURL(file)
      console.log('이미지 미리보기 URL 생성:', file.name)
      
      return previewUrl

    } catch (error) {
      console.error('미리보기 URL 생성 오류:', error)
      return null
    }
  },

  // 미리보기 URL 해제 (메모리 정리)
  revokePreviewUrl(url) {
    try {
      if (url) {
        URL.revokeObjectURL(url)
        console.log('미리보기 URL 해제 완료')
      }
    } catch (error) {
      console.error('미리보기 URL 해제 오류:', error)
    }
  },

  // 파일 크기를 읽기 쉬운 형태로 변환
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // 이미지 메타데이터 추출
  async getImageMetadata(file) {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image()
        
        img.onload = () => {
          const metadata = {
            name: file.name,
            size: file.size,
            type: file.type,
            width: img.width,
            height: img.height,
            aspectRatio: (img.width / img.height).toFixed(2),
            lastModified: file.lastModified,
            formattedSize: this.formatFileSize(file.size)
          }

          console.log('이미지 메타데이터:', metadata)
          resolve(metadata)
        }

        img.onerror = () => {
          reject(new Error('이미지 메타데이터 추출 실패'))
        }

        img.src = URL.createObjectURL(file)

      } catch (error) {
        reject(error)
      }
    })
  },

  // 배치 업로드 진행률 추적
  async uploadWithProgress(files, projectId, onProgress) {
    try {
      console.log('배치 업로드 시작:', files.length, '개 파일')

      const results = []
      const total = files.length

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // 개별 파일 업로드
        const result = await this.uploadProjectImages([file], projectId)
        results.push(result)

        // 진행률 콜백 호출
        if (onProgress && typeof onProgress === 'function') {
          onProgress({
            current: i + 1,
            total: total,
            percentage: Math.round(((i + 1) / total) * 100),
            currentFile: file.name,
            result: result
          })
        }
      }

      const successful = results.filter(r => r.success)
      const failed = results.filter(r => !r.success)

      console.log(`배치 업로드 완료: ${successful.length}개 성공, ${failed.length}개 실패`)

      return {
        success: successful.length > 0,
        error: failed.length > 0 ? `${failed.length}개 파일 업로드 실패` : null,
        data: {
          successful: successful,
          failed: failed,
          total: total
        }
      }

    } catch (error) {
      console.error('배치 업로드 예외:', error)
      return {
        success: false,
        error: `배치 업로드 중 오류가 발생했습니다: ${error.message}`,
        data: null
      }
    }
  }
}