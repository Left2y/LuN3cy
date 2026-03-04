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
      { text: "AI 应用", annotation: "（Vibe coding）", category: Category.DEV }
    ],
    intro: "从 UI/UX 到 AIGC，再到 AI Coding，我正在打破边界，构建属于未来的数字体验。",
    selectedWorks: "精选作品",
    years: "[ 2021 — 2025 ]"
  },
  en: {
    heroItems: [
      { text: "UI/UX", annotation: "(Main Focus & Passion)", category: Category.DESIGN },
      { text: "Photography", annotation: "(Can't Stop Shooting)", category: Category.PHOTO },
      { text: "AI Apps", annotation: "(Vibe Coding)", category: Category.DEV }
    ],
    intro: "From UI/UX to AIGC and AI Coding, I'm breaking boundaries to build the digital experiences of the future.",
    selectedWorks: "Selected Works",
    years: "[ 2021 — 2025 ]"
  }
};
