import { Language } from '../../types';

export interface SocialLinks {
  wechat: string;
  xiaohongshu: string;
  bilibili: string;
  px500: string;
}

export interface ContactContent {
  baseLabel: string;
  locationValue: string;
  contactLabel: string;
  emailMeLabel: string;
  email: string;
  hello: string;
  intro: string;
  socials: SocialLinks;
  tooltip?: string;
  githubLabel: string;
  footerDesign: string;
}

export const CONTACT_DATA: Record<Language, ContactContent> = {
  zh: {
    baseLabel: "BASE",
    locationValue: "广东，广州",
    contactLabel: "取得联系",
    emailMeLabel: "邮箱",
    email: "your-email@example.com",
    hello: "你好 ;-)",
    intro: "欢迎探讨与合作。",
    socials: {
      wechat: "你的微信公众号",
      xiaohongshu: "你的小红书昵称",
      bilibili: "你的B站昵称",
      px500: "你的500px昵称"
    },
    tooltip: "生于此，长于此，珠三角随叫随到。",
    githubLabel: "GitHub",
    footerDesign: "Powered by Gemini 3 Pro"
  },
  en: {
    baseLabel: "BASE",
    locationValue: "Guangzhou, Guangdong",
    contactLabel: "Get in touch",
    emailMeLabel: "Email Me",
    email: "your-email@example.com",
    hello: "Hello ;-)",
    intro: "Welcome to discuss & cooperate.",
    socials: {
      wechat: "Your WeChat Official Account",
      xiaohongshu: "Your RED ID",
      bilibili: "Your Bilibili ID",
      px500: "Your 500px ID"
    },
    tooltip: "Born and raised here. Available across the Pearl River Delta.",
    githubLabel: "GitHub",
    footerDesign: "Powered by Gemini 3 Pro"
  }
};
