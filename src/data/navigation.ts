import { Language } from '../../types';

export const NAV_ITEMS: Record<Language, { id: string; label: string }[]> = {
  zh: [
    { id: 'dashboard', label: '主页' },
    { id: 'portfolio', label: '作品' },
    { id: 'contact', label: '联系' }
  ],
  en: [
    { id: 'dashboard', label: 'Home' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'contact', label: 'Contact' }
  ]
};
