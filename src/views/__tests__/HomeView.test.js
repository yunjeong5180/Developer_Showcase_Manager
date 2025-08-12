import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import HomeView from "../HomeView.vue";

describe("HomeView.vue", () => {
  it("렌더링이 정상적으로 되는지 확인", () => {
    const wrapper = mount(HomeView);
    expect(wrapper.exists()).toBe(true);
  });

  it("제목이 올바르게 표시되는지 확인", () => {
    const wrapper = mount(HomeView);
    expect(wrapper.text()).toContain("Welcome to Codit");
  });

  it("부제목이 올바르게 표시되는지 확인", () => {
    const wrapper = mount(HomeView);
    expect(wrapper.text()).toContain("개발자를 위한 포트폴리오 플랫폼");
  });

  it("포트폴리오 링크가 있는지 확인", () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: ["router-link"],
      },
    });
    const portfolioLink = wrapper.find('[to="/portfolio"]');
    expect(portfolioLink.exists()).toBe(true);
  });

  it("시작하기 링크가 있는지 확인", () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: ["router-link"],
      },
    });
    const signupLink = wrapper.find('[to="/signup"]');
    expect(signupLink.exists()).toBe(true);
  });

  it("feature 카드들이 4개 표시되는지 확인", () => {
    const wrapper = mount(HomeView);
    const featureCards = wrapper.findAll(".feature-card");
    expect(featureCards.length).toBe(4);
  });

  it("CTA 섹션이 표시되는지 확인", () => {
    const wrapper = mount(HomeView);
    const ctaSection = wrapper.find(".cta-section");
    expect(ctaSection.exists()).toBe(true);
    expect(ctaSection.text()).toContain("지금 시작하세요");
  });
});
