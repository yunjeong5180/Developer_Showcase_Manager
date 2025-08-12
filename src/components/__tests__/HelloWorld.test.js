import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";

describe("HelloWorld.vue", () => {
  it("props.msg를 렌더링하는지 확인", () => {
    const msg = "Welcome to Your Vue.js App";
    const wrapper = mount(HelloWorld, {
      props: { msg },
    });

    expect(wrapper.text()).toContain(msg);
  });

  it("h1 태그에 메시지가 표시되는지 확인", () => {
    const msg = "Test Message";
    const wrapper = mount(HelloWorld, {
      props: { msg },
    });

    const h1 = wrapper.find("h1");
    expect(h1.exists()).toBe(true);
    expect(h1.text()).toBe(msg);
  });

  it("필수 링크들이 표시되는지 확인", () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: "Test" },
    });

    // Essential Links 섹션 확인
    expect(wrapper.text()).toContain("Essential Links");

    // 링크 존재 여부 확인
    const links = wrapper.findAll("a");
    expect(links.length).toBeGreaterThan(0);
  });

  it("Ecosystem 섹션이 표시되는지 확인", () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: "Test" },
    });

    expect(wrapper.text()).toContain("Ecosystem");
  });
});
