import { Language, Category } from '../../types';

export interface HeroItem {
  text: string;
  annotation: string;
  category: Category | null;
}

export interface HomeContent {
  heroItems: HeroItem[];
  intro: string;
  selectedWorks: string;
  years: string;
}

export const HOME_DATA: Record<Language, HomeContent> = {
  zh: {
    heroItems: [
      { text: "UI/UX", annotation: "（当前主攻，兴趣所在）", category: Category.DESIGN },
      { text: "静态摄影", annotation: "（不得不摄）", category: Category.PHOTO },
      { text: "AI 应用", annotation: "（Vibe coding）", category: Category.DEV },
      { text: "炒粉炒饭", annotation: "（还在学）", category: null }
    ],
    intro: "这里填写你的个人简介。|可以分行显示，用竖线分隔。",
    selectedWorks: "精选作品",
    years: "[ 2021 — 2025 ]"
  },
  en: {
    heroItems: [
      { text: "UI/UX", annotation: "(Main Focus & Passion)", category: Category.DESIGN },
      { text: "Photography", annotation: "(Can't Stop Shooting)", category: Category.PHOTO },
      { text: "AI Apps", annotation: "(Vibe Coding)", category: Category.DEV },
      { text: "Cooking", annotation: "(Still Learning)", category: null }
    ],
    intro: "A photographer who doesn't understand design is not a good product manager. | Learning by doing, living the MVP life, aiming for full-stack, but valuing actual impact above all.",
    selectedWorks: "Selected Works",
    years: "[ 2021 — 2025 ]"
  }
};
