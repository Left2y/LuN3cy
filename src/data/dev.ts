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
  },
  {
    id: 'dev4',
    common: {
      category: Category.DEV,
      image: '',
      icon: 'terminal',
      githubUrl: 'https://github.com/Left2y/left2y-trace-eagle'
    },
    zh: {
      title: 'Eagle 位图转矢量插件',
      subtitle: 'Eagle Plugin / Node.js',
      description: '一个将位图 (PNG, JPG, BMP) 转换为矢量 SVG 的 Eagle 实用插件。支持现场调参、智能画质增强。',
      role: 'vibe builder',
      tags: ['Eagle插件', '矢量化', 'SVG', 'Node.js'],
      concept: "将位图高效矢量化的一站式解决方案。核心特色在于引入了实时预览与参数调节功能，配合智能超采样技术，让转换精度有了质的飞跃。",
      roleDetail: "独立完成 Eagle 插件架构开发、位图追踪引擎集成以及实时预览界面的设计。"
    },
    en: {
      title: 'Eagle Raster to Vector',
      subtitle: 'Eagle Plugin / Node.js',
      description: 'An Eagle plugin to convert bitmaps (PNG, JPG, BMP) to vector SVGs. Features live tuning and AI enhancement.',
      role: 'vibe builder',
      tags: ['Eagle Plugin', 'Vectorization', 'SVG', 'Node.js'],
      concept: "A one-stop solution for high-efficiency bitmap vectorization. The core features a live tuning interface and smart upsampling technology to significantly improve conversion precision.",
      roleDetail: "Independently developed the Eagle plugin architecture, integrated the tracing engine, and designed the live preview UI."
    }
  },
  {
    id: 'dev5',
    common: {
      category: Category.DEV,
      image: '',
      icon: 'zap',
      githubUrl: 'https://github.com/Left2y/figma-color-change'
    },
    zh: {
      title: 'Figma 极速换色',
      subtitle: 'Figma Plugin / No-Build',
      description: '批量调整 Figma 中所有颜色的色相、饱和度和明度。具有交互式色板、联动模式、颜色占比条。无需构建，即插即用。',
      role: 'vibe builder',
      tags: ['Figma插件', 'JS', '色彩管理', 'No-Build'],
      concept: "旨在提高 UI 设计师调色效率的工具。通过 No-Build 架构实现即插即用，支持色相旋转、联动模式以及可视化颜色占比，是大规模色彩重构的利器。",
      roleDetail: "采用纯原生 JS + Figma Plugin API 开发，实现了极其轻量的无构建安装流程和高性能的实时变色逻辑。"
    },
    en: {
      title: 'Figma Color Change Pro',
      subtitle: 'Figma Plugin / No-Build',
      description: 'Bulk adjust HSL of all colors in Figma selections. Features interactive color wheel, link mode, and usage bars. No build required.',
      role: 'vibe builder',
      tags: ['Figma Plugin', 'JS', 'Color Management', 'No-Build'],
      concept: "A tool designed to boost UI designer color-tuning efficiency. It features a plug-and-play No-Build architecture, hue rotation, linked mode, and visualized color ratios.",
      roleDetail: "Developed using pure vanilla JS and Figma Plugin API, achieving an extremely lightweight installation process and high-performance real-time color adjustment logic."
    }
  },
  {
    id: 'dev6',
    common: {
      category: Category.DEV,
      image: '',
      icon: 'mic',
      websiteUrl: 'https://pdca-todo.vercel.app/today',
      githubUrl: 'https://github.com/Left2y/PDCA-todo'
    },
    zh: {
      title: 'PDCA Todo',
      subtitle: 'Next.js 15 / AI / Hardware UI',
      description: '语音驱动的个人效率“硬件”工位。将口语描述自动建模为 PDCA 任务卡，深受 Teenage Engineering 模拟美学启发。',
      role: 'vibe builder',
      tags: ['Next.js 15', 'AI', '语音识别', '硬件美学'],
      concept: "打破传统 Todo 工具的沉闷。通过拟物化的 LCD 点阵屏、LED 指示灯和模拟拨轮，为软件操作赋予“实体触感”。集成 AI 语音识别，实现‘所说即所得’的效率闭环。",
      roleDetail: "负责全栈架构设计。实现高保真拟物化 UI 组件库，集成阿里云百炼语音/大模型 API，并完成 Docker 容器化部署方案。"
    },
    en: {
      title: 'PDCA Todo',
      subtitle: 'Next.js 15 / AI / Hardware UI',
      description: 'Voice-driven efficiency workstation. Transforms speech into PDCA cards, inspired by Teenage Engineering analog aesthetics.',
      role: 'vibe builder',
      tags: ['Next.js 15', 'AI', 'ASR', 'Hardware UI'],
      concept: "Challenging the dullness of traditional Todo tools. Providing a 'tangible' software experience via LCD displays and LED indicators. Leveraging AI to turn spoken words into structured action items.",
      roleDetail: "Responsible for full-stack architecture. Developed a high-fidelity skeuomorphic UI library, integrated Aliyun AI APIs, and implemented Docker containerization."
    }
  }
];