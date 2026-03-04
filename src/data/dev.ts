import { Project, BilingualProject, Category } from '../../types';

export const DEV_DATA: BilingualProject[] = [
  {
    id: 'dev1',
    common: {
      category: Category.DEV,
      image: '', // Placeholder
      icon: 'id-card',
      websiteUrl: 'https://lun3cy.github.io/LUNA-Badge/',
      githubUrl: 'https://github.com/LuN3cy/LUNA-Badge'
    },
    zh: {
      title: '工牌生成器',
      subtitle: 'React / Tailwind',
      description: '具有设计感的自定义工牌生成应用。',
      role: 'vibe builder',
      tags: ['React', 'Tailwind CSS'],
      roleDetail: "You`re absolutely RIGHT!"
    },
    en: {
      title: 'LUNA-Badge Generator',
      subtitle: 'React / Tailwind',
      description: 'A designer badge generator application with custom styles.',
      role: 'vibe builder',
      tags: ['React', 'Tailwind CSS'],
      roleDetail: "You`re absolutely RIGHT!"
    }
  },
  {
    id: 'dev2',
    common: {
      category: Category.DEV,
      image: '', // Placeholder
      icon: 'file-text',
      websiteUrl: 'https://lun3cy.github.io/Md2Design/',
      githubUrl: 'https://github.com/LuN3cy/Md2Design'
    },
    zh: {
      title: 'Md2Design',
      subtitle: 'React 19 / Tailwind v4',
      description: '将 Markdown 内容快速转换为适合社媒宣发的美观卡片。支持自动分页、浮动图层、自定义字体与样式，以及一键导出 PNG/JPG。',
      role: 'vibe builder',
      tags: ['React 19', 'Tailwind v4', 'Framer Motion', 'Zustand', '工具'],
      roleDetail: "基于 Gemini 3 Pro 与 Trae IDE 开发。"
    },
    en: {
      title: 'Md2Design',
      subtitle: 'React 19 / Tailwind v4',
      description: 'Quickly turn plain Markdown into beautifully styled cards for social media promotion. Supports auto pagination, floating layers, custom fonts, and one-click export.',
      role: 'vibe builder',
      tags: ['React 19', 'Tailwind v4', 'Framer Motion', 'Zustand', 'Tool'],
      roleDetail: "Developed with Gemini 3 Pro & Trae IDE."
    }
  },
  {
    id: 'dev3',
    common: {
      category: Category.DEV,
      image: '', // Placeholder
      icon: 'smile',
      websiteUrl: 'https://emojicut-qwen.vercel.app/',
      githubUrl: 'https://github.com/Left2y/EmojiCut'
    },
    zh: {
      title: 'Emoji Cut Qwen',
      subtitle: 'React 19 / Qwen AI',
      description: '一键生成表情包切图工具。上传角色图，即可利用 Qwen AI 模型生成 16 张可爱的 LINE 风格贴纸，支持自定义风格与批量导出。',
      role: 'vibe builder',
      tags: ['React 19', 'TypeScript', 'AI', 'Qwen'],
      roleDetail: "基于 Qwen AI 图像生成模型开发，实现自动切图与打包下载。"
    },
    en: {
      title: 'Emoji Cut Qwen',
      subtitle: 'React 19 / Qwen AI',
      description: 'One-click emoji sticker generator. Upload a character image to create 16 cute LINE-style stickers using the Qwen AI model. Supports custom styles and batch export.',
      role: 'vibe builder',
      tags: ['React 19', 'TypeScript', 'AI', 'Qwen'],
      roleDetail: "Developed with Qwen AI image generation model, featuring automatic cutting and batch download."
    }
  }
];