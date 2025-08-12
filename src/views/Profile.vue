<template>
  <div class="profile">
    <div class="page-header">
      <h1>👤 프로필 관리</h1>
      <p>개인 정보와 포트폴리오 설정을 관리하세요</p>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>프로필 정보를 불러오는 중...</p>
    </div>

    <!-- 메시지 표시 -->
    <div v-if="message.text" :class="`message ${message.type}`">
      {{ message.text }}
    </div>

    <div v-if="!isLoading" class="profile-container">
      <div class="profile-photo-section">
        <div class="photo-container">
          <img
            :src="profileForm.profileImage || defaultAvatar"
            alt="프로필 사진"
            class="profile-photo"
          />
          <div class="photo-upload-overlay">
            <input
              type="file"
              accept="image/*"
              @change="handlePhotoUpload"
              class="photo-input"
              id="photoUpload"
            />
            <label for="photoUpload" class="photo-upload-btn" title="사진 변경">
              📷
            </label>
          </div>
        </div>
        <h2>{{ profileForm.name || "사용자명" }}</h2>
        <p class="profile-role">{{ profileForm.title || "개발자" }}</p>
      </div>

      <div class="profile-form-section">
        <form @submit.prevent="handleSubmit" class="profile-form">
          <div class="form-section">
            <h3>기본 정보</h3>

            <div class="form-group">
              <label for="name">이름 *</label>
              <input
                id="name"
                v-model="profileForm.name"
                type="text"
                placeholder="예: 홍길동"
                :class="{ error: errors.name }"
                required
              />
              <span v-if="errors.name" class="error-message">{{
                errors.name
              }}</span>
            </div>

            <div class="form-group">
              <label for="email">이메일</label>
              <input
                id="email"
                v-model="profileForm.email"
                type="email"
                placeholder="your@email.com"
                disabled
              />
              <small>이메일은 변경할 수 없습니다</small>
            </div>

            <div class="form-group">
              <label for="title">직책/타이틀</label>
              <input
                id="title"
                v-model="profileForm.title"
                type="text"
                placeholder="예: Frontend Developer"
              />
            </div>

            <div class="form-group">
              <label for="oneLiner">한 줄 소개</label>
              <input
                id="oneLiner"
                v-model="profileForm.oneLiner"
                type="text"
                placeholder="예: 사용자 경험을 중시하는 프론트엔드 개발자입니다"
                maxlength="100"
              />
              <small>{{ profileForm.oneLiner?.length || 0 }}/100자</small>
            </div>

            <div class="form-group">
              <label for="bio">상세 소개</label>
              <textarea
                id="bio"
                v-model="profileForm.bio"
                rows="5"
                placeholder="자신에 대한 상세한 소개를 작성해주세요"
                maxlength="500"
              ></textarea>
              <small>{{ profileForm.bio?.length || 0 }}/500자</small>
            </div>
          </div>

          <div class="form-section">
            <h3>링크 정보</h3>

            <div class="form-group">
              <label for="githubUrl">GitHub URL</label>
              <input
                id="githubUrl"
                v-model="profileForm.githubUrl"
                type="url"
                placeholder="https://github.com/username"
                :class="{ error: errors.githubUrl }"
              />
              <span v-if="errors.githubUrl" class="error-message">{{
                errors.githubUrl
              }}</span>
            </div>

            <div class="form-group">
              <label for="linkedinUrl">LinkedIn URL</label>
              <input
                id="linkedinUrl"
                v-model="profileForm.linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/username"
                :class="{ error: errors.linkedinUrl }"
              />
              <span v-if="errors.linkedinUrl" class="error-message">{{
                errors.linkedinUrl
              }}</span>
            </div>

            <div class="form-group">
              <label for="portfolioUrl">개인 웹사이트</label>
              <input
                id="portfolioUrl"
                v-model="profileForm.portfolioUrl"
                type="url"
                placeholder="https://your-website.com"
                :class="{ error: errors.portfolioUrl }"
              />
              <span v-if="errors.portfolioUrl" class="error-message">{{
                errors.portfolioUrl
              }}</span>
            </div>

            <div class="form-group">
              <label for="blogUrl">블로그 URL</label>
              <input
                id="blogUrl"
                v-model="profileForm.blogUrl"
                type="url"
                placeholder="https://your-blog.com"
                :class="{ error: errors.blogUrl }"
              />
              <span v-if="errors.blogUrl" class="error-message">{{
                errors.blogUrl
              }}</span>
            </div>
          </div>

          <div class="form-section">
            <h3>연락 정보</h3>

            <div class="form-group">
              <label for="phone">전화번호</label>
              <input
                id="phone"
                v-model="profileForm.phone"
                type="tel"
                placeholder="010-1234-5678"
              />
            </div>

            <div class="form-group">
              <label for="location">거주지</label>
              <input
                id="location"
                v-model="profileForm.location"
                type="text"
                placeholder="예: 서울, 대한민국"
              />
            </div>
          </div>

          <div class="form-section">
            <h3>기술 스택</h3>

            <div class="form-group">
              <label>주요 기술</label>
              <div class="skill-input">
                <input
                  v-model="newSkill"
                  type="text"
                  placeholder="기술명을 입력하고 Enter 또는 + 버튼을 누르세요"
                  @keyup.enter="addSkill"
                />
                <button type="button" @click="addSkill" class="add-skill-btn">
                  +
                </button>
                <button
                  type="button"
                  @click="openSkillsModal"
                  class="modal-skill-btn"
                >
                  🛠️ 선택
                </button>
              </div>
              <div class="skills-list">
                <span
                  v-for="(skill, index) in profileForm.skills"
                  :key="index"
                  class="skill-tag"
                >
                  {{ getSkillEmoji(skill) }} {{ skill }}
                  <button
                    type="button"
                    @click="removeSkill(index)"
                    class="remove-skill"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-save" :disabled="isSaving">
              {{ isSaving ? "저장 중..." : "프로필 저장" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="!isLoading" class="preview-section">
      <h3>포트폴리오 미리보기</h3>
      <div class="portfolio-preview">
        <div class="preview-header">
          <img
            :src="profileForm.profileImage || defaultAvatar"
            alt="프로필"
            class="preview-photo"
          />
          <div class="preview-info">
            <h2>{{ profileForm.name || "사용자명" }}</h2>
            <p class="preview-title">{{ profileForm.title || "개발자" }}</p>
            <p class="preview-oneliner">
              {{ profileForm.oneLiner || "한 줄 소개" }}
            </p>
          </div>
        </div>

        <div class="preview-bio">
          <h4>소개</h4>
          <p>{{ profileForm.bio || "상세 소개가 여기에 표시됩니다." }}</p>
        </div>

        <div class="preview-skills" v-if="profileForm.skills?.length">
          <h4>기술 스택</h4>
          <div class="preview-skills-list">
            <span
              v-for="skill in profileForm.skills"
              :key="skill"
              class="preview-skill-tag"
            >
              {{ getSkillEmoji(skill) }} {{ skill }}
            </span>
          </div>
        </div>

        <div class="preview-links">
          <h4>링크</h4>
          <div class="preview-links-list">
            <a
              v-if="profileForm.githubUrl"
              :href="profileForm.githubUrl"
              target="_blank"
            >
              🔗 GitHub
            </a>
            <a
              v-if="profileForm.linkedinUrl"
              :href="profileForm.linkedinUrl"
              target="_blank"
            >
              🔗 LinkedIn
            </a>
            <a
              v-if="profileForm.portfolioUrl"
              :href="profileForm.portfolioUrl"
              target="_blank"
            >
              🔗 웹사이트
            </a>
            <a
              v-if="profileForm.blogUrl"
              :href="profileForm.blogUrl"
              target="_blank"
            >
              🔗 블로그
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 기술 스택 선택 모달 -->
    <SkillsModal
      v-if="showSkillsModal"
      :initial-skills="profileForm.skills"
      @save="handleSkillsSelected"
      @close="showSkillsModal = false"
    />
  </div>
</template>

<script>
import { supabase } from "@/config/supabase";
import { getUserByEmail, updateUser } from "@/services/authService";
import { imageAPI } from "@/services/imageService";
import SkillsModal from "@/components/SkillsModal.vue";

// 기본 프로필 API 함수들
const profileAPI = {
  async getCurrentUserProfile() {
    try {
      // 현재 인증된 사용자 정보 가져오기
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        return { success: false, error: "사용자 인증이 필요합니다." };
      }

      // users 테이블에서 프로필 정보 조회
      const response = await getUserByEmail(user.email);
      return response;
    } catch (error) {
      // console.error('프로필 조회 오류:', error);
      return { success: false, error: error.message };
    }
  },

  async updateProfile(profileData) {
    try {
      // 현재 인증된 사용자 정보 가져오기
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        return { success: false, error: "사용자 인증이 필요합니다." };
      }

      // users 테이블에서 user_id 조회
      const { data: userData, error: userDataError } = await supabase
        .from("users")
        .select("id")
        .eq("email", user.email)
        .single();

      if (userDataError || !userData) {
        return { success: false, error: "사용자 정보를 찾을 수 없습니다." };
      }

      // 프로필 업데이트
      const response = await updateUser(userData.id, profileData);
      return response;
    } catch (error) {
      // console.error('프로필 업데이트 오류:', error);
      return { success: false, error: error.message };
    }
  },
};

export default {
  name: "ProfilePage",
  components: {
    SkillsModal,
  },
  data() {
    return {
      profileForm: {
        name: "",
        email: "",
        title: "",
        oneLiner: "",
        bio: "",
        profileImage: null,
        githubUrl: "",
        linkedinUrl: "",
        portfolioUrl: "",
        blogUrl: "",
        phone: "",
        location: "",
        skills: [],
      },
      newSkill: "",
      profileImageFile: null,
      isSaving: false,
      isLoading: true,
      currentUser: null,
      errors: {},
      message: {
        text: "",
        type: "",
      },
      defaultAvatar: "https://placehold.co/150x150/42b883/ffffff?text=👤",
      showSkillsModal: false,
    };
  },

  async mounted() {
    await this.loadUserProfile();
  },
  methods: {
    // 사용자 프로필 로드
    async loadUserProfile() {
      try {
        this.isLoading = true;
        // console.log('프로필 페이지 로드 시작');

        // 사용자 프로필 정보 조회
        const result = await profileAPI.getCurrentUserProfile();

        if (result.success && result.user) {
          // DB에서 가져온 데이터를 폼에 설정
          const userData = result.user;
          this.profileForm = {
            name: userData.name || "",
            email: userData.email || "",
            title: userData.title || "",
            oneLiner: userData.one_liner || "",
            bio: userData.bio || "",
            profileImage: userData.profile_image_url || null,
            githubUrl: userData.github_url || "",
            linkedinUrl: userData.linkedin_url || "",
            portfolioUrl: userData.portfolio_url || "",
            blogUrl: userData.personal_blog_url || "",
            phone: userData.phone || "",
            location: userData.location || "",
            skills: userData.skills || [],
          };

          // console.log('프로필 데이터 로드 완료:', this.profileForm);
        } else {
          // console.warn('프로필 데이터 조회 실패:', result.error);
          this.message = {
            text: result.error || "프로필 정보를 불러올 수 없습니다.",
            type: "error",
          };
        }
      } catch (error) {
        // console.error('프로필 로드 오류:', error);
        this.message = {
          text: "프로필 정보를 불러오는 중 오류가 발생했습니다.",
          type: "error",
        };
      } finally {
        this.isLoading = false;
      }
    },

    // 프로필 사진 업로드 처리
    async handlePhotoUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        // 파일 유효성 검사
        if (!this.validateImageFile(file)) return;

        // 미리보기 설정
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileForm.profileImage = e.target.result;
        };
        reader.readAsDataURL(file);

        // 실제 파일은 나중에 저장 시 업로드
        this.profileImageFile = file;
      } catch (error) {
        // console.error('이미지 처리 오류:', error)
        this.message = {
          text: "이미지 처리 중 오류가 발생했습니다.",
          type: "error",
        };
      }
    },

    // 이미지 파일 유효성 검사
    validateImageFile(file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        this.message = {
          text: "JPG, PNG, WebP 형식의 이미지만 업로드 가능합니다.",
          type: "error",
        };
        return false;
      }

      if (file.size > maxSize) {
        this.message = {
          text: "이미지 크기는 5MB 이하여야 합니다.",
          type: "error",
        };
        return false;
      }

      return true;
    },

    // 기술 스택 추가
    addSkill() {
      const skill = this.newSkill.trim();

      if (!skill) {
        this.message = {
          text: "기술명을 입력해주세요.",
          type: "error",
        };
        return;
      }

      if (this.profileForm.skills.includes(skill)) {
        this.message = {
          text: "이미 추가된 기술입니다.",
          type: "error",
        };
        return;
      }

      if (this.profileForm.skills.length >= 20) {
        this.message = {
          text: "기술 스택은 최대 20개까지 추가할 수 있습니다.",
          type: "error",
        };
        return;
      }

      this.profileForm.skills.push(skill);
      this.newSkill = "";
      this.message = { text: "", type: "" };
    },

    // 기술 스택 삭제
    removeSkill(index) {
      this.profileForm.skills.splice(index, 1);
    },

    // 기술 스택 모달 열기
    openSkillsModal() {
      this.showSkillsModal = true;
    },

    // 모달에서 선택된 기술들 처리
    handleSkillsSelected(selectedSkills) {
      this.profileForm.skills = [...selectedSkills];
      this.showSkillsModal = false;

      // 성공 메시지 표시
      this.message = {
        text: `${selectedSkills.length}개의 기술이 선택되었습니다.`,
        type: "success",
      };

      // 메시지 자동 제거
      setTimeout(() => {
        this.message = { text: "", type: "" };
      }, 2000);
    },

    // 기술 스택 이모티콘 가져오기
    getSkillEmoji(skillName) {
      // 기술 스택 이모티콘 매핑 (SkillsModal과 동일한 데이터)
      const skillsEmojiMap = {
        // Frontend
        "Vue.js": "💚",
        React: "⚛️",
        Angular: "🅰️",
        Svelte: "🔥",
        "Next.js": "▲",
        "Nuxt.js": "💚",
        JavaScript: "🟨",
        TypeScript: "🔷",
        HTML5: "🧡",
        CSS3: "💙",
        Sass: "💗",
        Less: "🔵",
        "Tailwind CSS": "🌊",
        Bootstrap: "🅱️",
        "Material-UI": "🎨",
        "Ant Design": "🐜",
        jQuery: "💛",
        "Alpine.js": "🏔️",
        Stimulus: "⚡",
        "Ember.js": "🔥",

        // Backend
        "Node.js": "💚",
        "Express.js": "🚂",
        NestJS: "🐱",
        Fastify: "⚡",
        "Koa.js": "🥥",
        Python: "🐍",
        Django: "🎸",
        FastAPI: "🚀",
        Flask: "🌶️",
        Tornado: "🌪️",
        Java: "☕",
        "Spring Boot": "🍃",
        "Spring MVC": "🍃",
        Hibernate: "💤",
        "C#": "🔷",
        ".NET Core": "🌐",
        ".NET Framework": "🌐",
        "ASP.NET": "🌐",
        PHP: "🐘",
        Laravel: "🎭",
        Symfony: "🎼",
        CodeIgniter: "🔥",
        Ruby: "💎",
        "Ruby on Rails": "🚄",
        Sinatra: "🎤",
        Go: "🐹",
        Gin: "🍸",
        Echo: "📢",
        Rust: "🦀",
        Actix: "🎭",

        // Database
        MySQL: "🐬",
        PostgreSQL: "🐘",
        SQLite: "🪶",
        MariaDB: "🌊",
        MongoDB: "🍃",
        Redis: "🔴",
        Cassandra: "💍",
        CouchDB: "🛋️",
        Oracle: "🔮",
        "MS SQL Server": "🔷",
        DynamoDB: "⚡",
        Elasticsearch: "🔍",
        Neo4j: "🕸️",
        InfluxDB: "📈",

        // DevOps
        Docker: "🐳",
        Kubernetes: "☸️",
        "Docker Compose": "🐙",
        AWS: "☁️",
        Azure: "☁️",
        "Google Cloud": "☁️",
        Heroku: "💜",
        Vercel: "▲",
        Jenkins: "👨‍🔧",
        "GitLab CI/CD": "🦊",
        "GitHub Actions": "🤖",
        CircleCI: "⭕",
        Terraform: "🏗️",
        Ansible: "🔴",
        Chef: "👨‍🍳",
        Puppet: "🎭",
        Nginx: "🌐",
        Apache: "🪶",
        Git: "🌿",
        SVN: "📁",

        // Mobile
        "React Native": "📱",
        Flutter: "🦋",
        Ionic: "⚡",
        Cordova: "📱",
        Swift: "🍎",
        "Objective-C": "🍎",
        Kotlin: "🤖",
        "Java Android": "🤖",
        Xamarin: "🔷",
        Unity: "🎮",
        "Unreal Engine": "🎮",

        // Other
        GraphQL: "📊",
        "REST API": "🌐",
        WebSockets: "🔌",
        gRPC: "📡",
        Webpack: "📦",
        Vite: "⚡",
        Rollup: "📦",
        Parcel: "📦",
        Babel: "🔄",
        ESLint: "🔍",
        Prettier: "💅",
        Jest: "🃏",
        Mocha: "☕",
        Cypress: "🌲",
        Selenium: "🤖",
        Figma: "🎨",
        "Adobe XD": "🎨",
        Sketch: "✏️",
        Photoshop: "🖼️",
        "Machine Learning": "🤖",
        TensorFlow: "🧠",
        PyTorch: "🔥",
      };

      return skillsEmojiMap[skillName] || "🔧";
    },

    // URL 유효성 검사
    validateUrl(url) {
      if (!url) return true; // 빈 값은 허용

      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },

    // 폼 유효성 검사
    validateForm() {
      this.errors = {};
      let isValid = true;

      // 이름 검증
      if (!this.profileForm.name.trim()) {
        this.errors.name = "이름은 필수입니다.";
        isValid = false;
      }

      // URL 검증
      const urlFields = ["githubUrl", "linkedinUrl", "portfolioUrl", "blogUrl"];
      urlFields.forEach((field) => {
        if (
          this.profileForm[field] &&
          !this.validateUrl(this.profileForm[field])
        ) {
          this.errors[field] = "올바른 URL 형식을 입력해주세요.";
          isValid = false;
        }
      });

      // GitHub URL 특별 검증
      if (
        this.profileForm.githubUrl &&
        !this.profileForm.githubUrl.includes("github.com")
      ) {
        this.errors.githubUrl = "GitHub URL을 입력해주세요.";
        isValid = false;
      }

      // LinkedIn URL 특별 검증
      if (
        this.profileForm.linkedinUrl &&
        !this.profileForm.linkedinUrl.includes("linkedin.com")
      ) {
        this.errors.linkedinUrl = "LinkedIn URL을 입력해주세요.";
        isValid = false;
      }

      return isValid;
    },

    // 프로필 저장
    async handleSubmit() {
      if (!this.validateForm()) {
        this.message = {
          text: "입력 정보를 확인해주세요.",
          type: "error",
        };
        return;
      }

      this.isSaving = true;
      this.message = { text: "", type: "" };

      try {
        // console.log('프로필 저장 시작')

        let profileImageUrl = this.profileForm.profileImage;

        // 1. 이미지 업로드 (새 이미지가 있는 경우)
        if (this.profileImageFile) {
          // console.log('이미지 업로드 중...')
          const uploadResult = await imageAPI.uploadProfileImage(
            this.profileImageFile
          );

          if (uploadResult.success) {
            profileImageUrl = uploadResult.data.publicUrl;
            // console.log('이미지 업로드 성공:', profileImageUrl)
          } else {
            // console.warn('이미지 업로드 실패:', uploadResult.error);
            // 이미지 업로드 실패해도 프로필은 저장 진행
          }
        }

        // 2. 프로필 데이터 준비
        const profileData = {
          name: this.profileForm.name.trim(),
          title: this.profileForm.title.trim() || null,
          one_liner: this.profileForm.oneLiner.trim() || null,
          bio: this.profileForm.bio.trim() || null,
          profile_image_url: profileImageUrl,
          github_url: this.profileForm.githubUrl.trim() || null,
          linkedin_url: this.profileForm.linkedinUrl.trim() || null,
          portfolio_url: this.profileForm.portfolioUrl.trim() || null,
          personal_blog_url: this.profileForm.blogUrl.trim() || null,
          phone: this.profileForm.phone.trim() || null,
          location: this.profileForm.location.trim() || null,
          skills: this.profileForm.skills || [],
        };

        // 3. 프로필 정보 업데이트
        // console.log('프로필 정보 업데이트 중...', profileData)
        const updateResult = await profileAPI.updateProfile(profileData);

        if (updateResult.success) {
          console.log("프로필 업데이트 성공");
          this.message = {
            text: "프로필이 성공적으로 저장되었습니다!",
            type: "success",
          };

          // 업로드된 파일 참조 제거
          this.profileImageFile = null;
          this.profileForm.profileImage = profileImageUrl;

          // 성공 메시지 3초 후 제거
          setTimeout(() => {
            this.message = { text: "", type: "" };
          }, 3000);
        } else {
          throw new Error(updateResult.error);
        }
      } catch (error) {
        console.error("프로필 저장 오류:", error);
        this.message = {
          text: `프로필 저장 중 오류가 발생했습니다: ${error.message}`,
          type: "error",
        };
      } finally {
        this.isSaving = false;
      }
    },
  },
};
</script>

<style scoped>
.profile {
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.page-header h1 {
  color: #0a0a0a;
  font-size: 2.5rem;
  margin-bottom: 15px;
  font-weight: 700;
}

.page-header p {
  color: #6c757d;
  font-size: 1.15rem;
  font-weight: 400;
}

.profile-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 30px;
  margin-bottom: 50px;
}

/* 프로필 사진 섹션 - 모던한 카드 스타일 */
.profile-photo-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  text-align: center;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.photo-container {
  position: relative;
  display: inline-block;
  margin-bottom: 25px;
}

.profile-photo {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #f8f9fa;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.profile-photo:hover {
  transform: scale(1.05);
}

.photo-upload-overlay {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.photo-input {
  display: none;
}

.photo-upload-btn {
  background: #0a0a0a;
  color: white;
  padding: 10px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.photo-upload-btn:hover {
  background: #28a745;
  transform: scale(1.15);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.5);
}

.photo-upload-btn::after {
  content: "사진 변경";
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  background: #0a0a0a;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.photo-upload-btn:hover::after {
  opacity: 1;
}

.profile-photo-section h2 {
  color: #0a0a0a;
  margin-bottom: 8px;
  font-size: 1.8rem;
  font-weight: 700;
}

.profile-role {
  color: #6c757d;
  font-weight: 500;
  font-size: 1.1rem;
}

/* 폼 섹션 - 깔끔한 카드 스타일 */
.profile-form-section {
  background: white;
  padding: 0;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.form-section {
  padding: 35px;
  border-bottom: 1px solid #f0f0f0;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h3 {
  color: #0a0a0a;
  margin-bottom: 25px;
  font-size: 1.4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 15px;
  border-bottom: 2px solid #0a0a0a;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  color: #495057;
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background: #f8f9fa;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0a0a0a;
  background: white;
  box-shadow: 0 0 0 4px rgba(10, 10, 10, 0.1);
  transform: translateY(-1px);
}

.form-group input:disabled {
  background: #f0f0f0;
  cursor: not-allowed;
  opacity: 0.7;
}

.form-group small {
  color: #6c757d;
  font-size: 0.85rem;
  margin-top: 6px;
  display: block;
  font-weight: 400;
}

/* 스킬 입력 - 모던 스타일 */
.skill-input {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.skill-input input {
  flex: 1;
}

.add-skill-btn {
  background: #0a0a0a;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.add-skill-btn:hover {
  background: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.modal-skill-btn {
  background: white;
  color: #0a0a0a;
  border: 2px solid #0a0a0a;
  padding: 14px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.modal-skill-btn:hover {
  background: #0a0a0a;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.skill-tag {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  color: white;
  padding: 10px 16px;
  border-radius: 25px;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.skill-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.remove-skill {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-skill:hover {
  background: #dc3545;
  transform: scale(1.1);
}

/* 저장 버튼 - 플로팅 스타일 */
.form-actions {
  text-align: center;
  padding: 30px;
  background: linear-gradient(to top, white, rgba(255, 255, 255, 0));
}

.btn-save {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  color: white;
  padding: 16px 50px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-save::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-save:active::before {
  width: 300px;
  height: 300px;
}

.btn-save:hover:not(:disabled) {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.btn-save:disabled {
  background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
  cursor: not-allowed;
  opacity: 0.7;
}

/* 미리보기 섹션 - 모던 카드 */
.preview-section {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  margin-bottom: 40px;
}

.preview-section h3 {
  color: #0a0a0a;
  margin-bottom: 30px;
  text-align: center;
  font-size: 1.6rem;
  font-weight: 600;
}

.portfolio-preview {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  padding: 35px;
  position: relative;
  overflow: hidden;
}

.portfolio-preview::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(10, 10, 10, 0.05) 0%,
    transparent 70%
  );
  animation: rotate 30s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 35px;
  position: relative;
  z-index: 1;
}

.preview-photo {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.preview-info h2 {
  color: #0a0a0a;
  margin-bottom: 8px;
  font-size: 1.5rem;
  font-weight: 700;
}

.preview-title {
  color: #495057;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 1.05rem;
}

.preview-oneliner {
  color: #6c757d;
  font-size: 0.95rem;
  font-style: italic;
}

.preview-bio,
.preview-skills,
.preview-links {
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

.preview-bio h4,
.preview-skills h4,
.preview-links h4 {
  color: #0a0a0a;
  margin-bottom: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 2px solid #e9ecef;
}

.preview-bio p {
  color: #495057;
  line-height: 1.7;
}

.preview-skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.preview-skill-tag {
  background: #0a0a0a;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.preview-links-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.preview-links-list a {
  color: #0a0a0a;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  background: white;
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-links-list a:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #0a0a0a;
  color: white;
}

/* 로딩 및 메시지 스타일 - 모던 디자인 */
.loading-container {
  text-align: center;
  padding: 80px 20px;
  color: #6c757d;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0a0a0a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 25px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.message {
  padding: 18px 24px;
  border-radius: 12px;
  margin-bottom: 25px;
  font-weight: 500;
  animation: slideDown 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.success {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  border-left: 4px solid #28a745;
}

.message.error {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  color: #721c24;
  border-left: 4px solid #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
}

.form-group input.error,
.form-group textarea.error {
  border-color: #dc3545;
}

.form-group input.error:focus,
.form-group textarea.error:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

/* 반응형 - 모바일 최적화 */
@media (max-width: 768px) {
  .profile {
    padding: 20px 15px;
  }

  .page-header {
    padding: 30px 20px;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .profile-container {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .profile-photo-section {
    position: static;
    padding: 30px;
  }

  .form-section {
    padding: 25px;
  }

  .preview-header {
    flex-direction: column;
    text-align: center;
  }

  .preview-photo {
    width: 100px;
    height: 100px;
  }

  .skill-input {
    flex-direction: column;
  }

  .btn-save {
    width: 100%;
  }
}
</style>
