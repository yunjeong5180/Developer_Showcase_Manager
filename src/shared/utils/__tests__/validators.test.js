import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  isValidPassword,
  isValidUrl,
  isValidPhone,
} from "../validators";

describe("Validators", () => {
  describe("isValidEmail", () => {
    it("유효한 이메일 주소를 검증하는지 확인", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.co.kr")).toBe(true);
      expect(isValidEmail("user+tag@example.org")).toBe(true);
    });

    it("유효하지 않은 이메일 주소를 거부하는지 확인", () => {
      expect(isValidEmail("invalid")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
      expect(isValidEmail("user@.com")).toBe(false);
      expect(isValidEmail("")).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });
  });

  describe("isValidPassword", () => {
    it("유효한 비밀번호를 검증하는지 확인", () => {
      expect(isValidPassword("Password123!")).toBe(true);
      expect(isValidPassword("Abc123!@#")).toBe(true);
      expect(isValidPassword("StrongP@ss1")).toBe(true);
    });

    it("유효하지 않은 비밀번호를 거부하는지 확인", () => {
      expect(isValidPassword("short")).toBe(false); // 너무 짧음
      expect(isValidPassword("password123")).toBe(false); // 대문자 없음
      expect(isValidPassword("PASSWORD123")).toBe(false); // 소문자 없음
      expect(isValidPassword("Password")).toBe(false); // 숫자 없음
      expect(isValidPassword("")).toBe(false);
      expect(isValidPassword(null)).toBe(false);
    });
  });

  describe("isValidUrl", () => {
    it("유효한 URL을 검증하는지 확인", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://www.example.com")).toBe(true);
      expect(isValidUrl("https://sub.domain.com/path")).toBe(true);
      expect(isValidUrl("http://localhost:3000")).toBe(true);
    });

    it("유효하지 않은 URL을 거부하는지 확인", () => {
      expect(isValidUrl("not-a-url")).toBe(false);
      expect(isValidUrl("ftp://example.com")).toBe(false);
      expect(isValidUrl("//example.com")).toBe(false);
      expect(isValidUrl("")).toBe(false);
      expect(isValidUrl(null)).toBe(false);
    });
  });

  describe("isValidPhone", () => {
    it("유효한 전화번호를 검증하는지 확인", () => {
      expect(isValidPhone("010-1234-5678")).toBe(true);
      expect(isValidPhone("01012345678")).toBe(true);
      expect(isValidPhone("02-123-4567")).toBe(true);
      expect(isValidPhone("021234567")).toBe(true);
    });

    it("유효하지 않은 전화번호를 거부하는지 확인", () => {
      expect(isValidPhone("123-456")).toBe(false);
      expect(isValidPhone("abcd-efgh-ijkl")).toBe(false);
      expect(isValidPhone("")).toBe(false);
      expect(isValidPhone(null)).toBe(false);
    });
  });
});
