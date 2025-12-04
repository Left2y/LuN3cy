import { Category, Project, Experience, Skill, Language, HonorsData, Article, ArticleCategory } from './types';
import { Sparkles, Image, History, Send } from 'lucide-react';
import { PROJECT_DATA } from './src/data/projects';
import { ARTICLE_DATA } from './src/data/articles';

export const CATEGORY_LABELS: Record<Language, Record<string, string>> = {
  zh: {
    'All': '全部',
    'Videography': '动态影像', // Renamed
    'Graphics & UI': '平面交互',
    'Photography': '静态摄影', // Renamed
    'Development': '程序开发'
  },
  en: {
    'All': 'All',
    'Videography': 'Videography',
    'Graphics & UI': 'Graphics & UI',
    'Photography': 'Photography',
    'Development': 'Development'
  }
};

export const ARTICLE_LABELS: Record<Language, Record<string, string>> = {
  zh: {
    'All': '全部',
    [ArticleCategory.DIT]: 'DiT | 数媒与课程',
    [ArticleCategory.LUNA]: 'LUNA | 影像相关',
    [ArticleCategory.TALK]: '瞎叨be叨 | 杂记',
    [ArticleCategory.AFTER8]: 'After8 | 聊艺术',
    [ArticleCategory.SERENITY]: '山海疗养院 | 游记'
  },
  en: {
    'All': 'All',
    [ArticleCategory.DIT]: 'DiT | DMT & Courses',
    [ArticleCategory.LUNA]: 'LUNA | Visual Arts',
    [ArticleCategory.TALK]: 'Random Thoughts',
    [ArticleCategory.AFTER8]: 'After8 | Art Talk',
    [ArticleCategory.SERENITY]: 'Serenity Vista | Travel'
  }
};

export const PROJECTS: Record<Language, Project[]> = {
  zh: PROJECT_DATA.map(p => ({
    id: p.id,
    ...p.common,
    ...p.zh,
    // Inject bilingual title for fallback UI
    bilingualTitle: {
      zh: p.zh.title,
      en: p.en.title
    }
  })),
  en: PROJECT_DATA.map(p => ({
    id: p.id,
    ...p.common,
    ...p.en,
    // Inject bilingual title for fallback UI
    bilingualTitle: {
      zh: p.zh.title,
      en: p.en.title
    }
  }))
};

export const ARTICLES: Record<Language, Article[]> = {
  zh: ARTICLE_DATA.map(a => ({
    id: a.id,
    ...a.common,
    ...a.zh
  })),
  en: ARTICLE_DATA.map(a => ({
    id: a.id,
    ...a.common,
    ...a.en
  }))
};
