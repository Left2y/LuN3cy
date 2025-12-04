import { Language } from '../../types';

export interface PortfolioPageContent {
  title: string;
  description: string;
}

export const PORTFOLIO_PAGE_DATA: Record<Language, PortfolioPageContent> = {
  zh: {
    title: '作品',
    description: '精选影像创作、视觉设计和应用开发作品。'
  },
  en: {
    title: 'Portfolio',
    description: 'A selection of works spanning Videography, Visual Design, and Application Development.'
  }
};
