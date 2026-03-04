import { Project, BilingualProject, Category } from '../../types';

export const DESIGN_DATA: BilingualProject[] = [
  {
    id: 'd4',
    common: {
      category: Category.DESIGN,
      image: '/sony-store-cover.png',
      figmaUrl: 'https://www.figma.com/design/0UYerz5SLqCbcWvGSMFxyz/sony%E5%95%86%E5%9F%8Erenew?node-id=0-1&t=bK2yaTJGXvueT9Yv-1'
    },
    zh: {
      title: 'Sony 商城 Renew',
      subtitle: '移动端商城设计 (C端)',
      description: '索尼官方商城 C 端界面重构设计。针对移动端购物体验进行全面优化。',
      role: '主 UI 设计师',
      tags: ['电商', 'C端', 'Sony', 'Figma'],
      awards: ["无"],
      concept: "针对索尼商城原有的 C 端体验进行了重构。核心理念是“极致简约与沉浸式体验”，通过重新梳理信息层级，强化了产品的视觉冲击力，并优化了从浏览到支付的转化路径。",
      roleDetail: "主导整体视觉风格设定，完成核心页面设计及交互组件库的搭建。"
    },
    en: {
      title: 'Sony Store Renew',
      subtitle: 'Sony Store Renew',
      description: 'Redesign of the Sony official mobile store interface. Comprehensive optimization for mobile shopping experience.',
      role: 'Lead UI Designer',
      tags: ['E-commerce', 'B2C', 'Sony', 'Figma'],
      awards: ["None"],
      concept: "Reorganized the Sony store's consumer experience. The core concept is 'Exceptional Simplicity & Immersive Experience'. By restructuring information hierarchy, it strengthens visual impact and optimizes the conversion path from browsing to payment.",
      roleDetail: "Led the overall visual style definition, completed core page designs, and built the interaction component library."
    }
  },
  {
    id: 'd5',
    common: {
      category: Category.DESIGN,
      image: '/yankeba-cover.png',
      figmaUrl: 'https://www.figma.com/design/vVNmlCgLpb8mPvJVyNnlol/%E7%9F%A5%E7%A0%94%E5%90%8E%E5%8F%B0?node-id=0-1&t=Gl7tPu21TSxZwOsk-1'
    },
    zh: {
      title: '研课吧中台设计',
      subtitle: 'B端中台管理系统',
      description: '研课吧教育平台的 B 端中台管理系统设计。专注于复杂的业务逻辑梳理与高效的交互体验。',
      role: '主 UI/UX 设计师',
      tags: ['B端', '教育', '中台', 'Figma'],
      awards: ["无"],
      concept: "针对研课吧的业务需求，设计了一套规范化的 B 端中台系统。通过模块化组件库的搭建，提升了开发效率，并优化了多维度数据的展示与管理，确保了在复杂操作场景下的用户体验。",
      roleDetail: "主导中台系统的整体视觉规范制定、交互设计规范流程以及核心业务模块的 UI 绘制。"
    },
    en: {
      title: 'YanKeBa Middle-end Design',
      subtitle: 'B-end Middle-end Management System',
      description: 'Design of the B-end middle-end management system for the YanKeBa education platform. Focused on complex business logic and efficient interaction experience.',
      role: 'Lead UI/UX Designer',
      tags: ['B-end', 'Education', 'Middle-end', 'Figma'],
      awards: ["None"],
      concept: "Designed a standardized B-end middle-end system based on YanKeBa's business needs. By building a modular component library, it improved development efficiency and optimized multi-dimensional data display and management, ensuring a smooth user experience in complex operational scenarios.",
      roleDetail: "Led the overall visual specifications of the middle-end system, interaction design process, and UI creation for core business modules."
    }
  },
  {
    id: 'd6',
    common: {
      category: Category.DESIGN,
      image: '/medical-erp-cover.png',
      figmaUrl: 'https://www.figma.com/design/XGDhHDum1zek8TZrJzdP3t/%E5%8C%BB%E7%96%97%E5%90%8E%E5%8F%B0?node-id=0-1&t=Ydy81KkOVbrymvbP-1'
    },
    zh: {
      title: '医疗中台设计',
      subtitle: 'B端医疗管理系统',
      description: '针对医疗行业的中台管理系统设计。旨在提升医疗数据的处理效率与医护人员的办公体验。',
      role: '主 UI/UX 设计师',
      tags: ['B端', '医疗健康', '中台', 'Figma'],
      awards: ["无"],
      concept: "医疗系统的核心在于“严谨”与“效率”。我采用了深浅适中的冷色调来营造专业感，并针对医疗报表、挂号管理及患者档案等核心模块进行了交互优化，降低了信息录入的错误率。",
      roleDetail: "负责整套系统设计规范（Design System）的建立，以及智慧医疗看板与后台管理模块的交互设计。"
    },
    en: {
      title: 'Medical Middle-end Design',
      subtitle: 'B-end Healthcare Management System',
      description: 'Middle-end management system design for the healthcare industry. Aimed at improving data processing efficiency and staff workflow.',
      role: 'Lead UI/UX Designer',
      tags: ['B-end', 'Healthcare', 'Middle-end', 'Figma'],
      awards: ["None"],
      concept: "The core of healthcare systems lies in 'Precision' and 'Efficiency'. I adopted a professional cool-tone palette and optimized interaction for core modules like medical reports, registration, and patient records to reduce data entry error rates.",
      roleDetail: "Responsible for establishing the full Design System and the interactive design of the smart healthcare dashboard and management modules."
    }
  },
  {
    id: 'd7',
    common: {
      category: Category.DESIGN,
      image: '/yao-plus-cover.png',
      figmaUrl: 'https://www.figma.com/design/PKG5Z8uAIEBbkq1rQMvxHZ/%E5%8C%BB%E7%96%97APP--1-?node-id=96-4598&t=hNV2Osy9TfkFXqI4-1'
    },
    zh: {
      title: 'YAO+ App',
      subtitle: '移动端医药电商设计 (C端)',
      description: '一款专注于家庭常用药购买与健康管理的移动应用。结合“线上问诊+快递送药”的一站式服务体验。',
      role: '主 UI/UX 设计师',
      tags: ['医疗', '电商', 'C端', '移动应用', 'Figma'],
      awards: ["无"],
      concept: "医疗类 C 端产品需要在“亲和力”与“专业感”之间找到平衡。YAO+ 采用了温和的色彩体系与大圆角设计，旨在降低用户的患病焦虑感，同时通过卡片化布局高效梳理了复杂的药品目录。 ",
      roleDetail: "负责从 0 到 1 的视觉框架搭建、核心交互流程设计（找药、购药、用药提醒）以及一套完整的医疗类 UI 组件库。"
    },
    en: {
      title: 'YAO+ App',
      subtitle: 'Medical E-commerce Mobile Design (B2C)',
      description: 'A mobile application focused on purchasing household medicine and health management. Integrates "Online Consultation + Fast Delivery" service.',
      role: 'Lead UI/UX Designer',
      tags: ['Healthcare', 'E-commerce', 'B2C', 'Mobile App', 'Figma'],
      awards: ["None"],
      concept: "Medical B2C products require a balance between 'Approachability' and 'Professionalism'. YAO+ uses a soft color palette and large rounded corners to reduce user anxiety, combined with a card-based layout to organize complex medicine catalogs efficiently.",
      roleDetail: "Responsible for building the visual framework from 0 to 1, designing core interaction flows (search, purchase, medication reminders), and creating a complete medical UI component library."
    }
  },
  {
    id: 'd8',
    common: {
      category: Category.DESIGN,
      image: '/zte-nubia-cover.png',
      figmaUrl: 'https://www.figma.com/design/HWSBVEn3h2Y2K6ysMiyOKE/%E4%B8%AD%E5%85%B4%E6%B6%88%E8%B4%B9%E8%80%85%E4%B8%9A%E5%8A%A1-%E9%A6%96%E9%A1%B5%E8%AE%BE%E8%AE%A1%E6%96%B9%E6%A1%88?node-id=0-1&t=VJSoy9W4qZzj8ziR-1'
    },
    zh: {
      title: '中兴海外消费者首页',
      subtitle: '全球官网 Web 端重构',
      description: '中兴通讯（ZTE）海外消费者业务门户网站首页重构设计。面向全球市场提升品牌形象与国际化视觉表达。',
      role: '主 UI/UX 设计师',
      tags: ['Web设计', '重构', '中兴', '国际化', 'Figma'],
      awards: ["无"],
      concept: "针对海外市场的审美偏好，设计了一套大气、科技且具有国际化质感的 Web 首页方案。通过大面积留白与精致的版式编排，突出了中兴手机及智能硬件的核心卖点，并针对不同屏幕尺寸进行了响应式适配。 ",
      roleDetail: "负责官网首页的视觉风格设定、响应式栅格系统规范以及核心营销 Banner 的交互设计。"
    },
    en: {
      title: 'ZTE Overseas Consumer Portal',
      subtitle: 'Global Website Web Redesign',
      description: 'Homepage redesign for ZTE overseas consumer business. Enhancing brand image and international visual expression for the global market.',
      role: 'Lead UI/UX Designer',
      tags: ['Web Design', 'Redesign', 'ZTE', 'Global', 'Figma'],
      awards: ["None"],
      concept: "Designed a grand, tech-savvy, and internationally-textured web homepage tailored to overseas aesthetic preferences. Through extensive negative space and sophisticated layout, it highlights core selling points of ZTE mobile phones and smart hardware, with full responsive adaptation.",
      roleDetail: "Responsible for visual style definition, responsive grid system specifications, and interaction design of core marketing banners."
    }
  },
  {
    id: 'd9',
    common: {
      category: Category.DESIGN,
      image: '/cfmoto-cover.png',
      figmaUrl: 'https://www.figma.com/design/V0wkkSInxEHhlf7XZjBZgh/%E9%A6%96%E9%A1%B5%E5%AE%9A%E7%A8%BF1210?node-id=0-1&t=j3cJc95hJzZdVphF-1'
    },
    zh: {
      title: '春风动力海外官网设计',
      subtitle: '全球品牌官网 Web 端设计',
      description: '春风动力 (CFMOTO) 全球品牌门户网站设计。旨在通过充满活力的视觉语言传递品牌“乐于动力”的核心精神。',
      role: '主 UI/UX 设计师',
      tags: ['Web设计', '品牌', '春风动力', '运动', 'Figma'],
      awards: ["无"],
      concept: "针对摩托车及全地形车行业的运动属性，设计了一套极具动感与冲击力的 Web 界面。采用了大尺寸精美的产品大片、硬朗的线条以及高对比度的色彩，强化了品牌的竞技基因与国际化视野。",
      roleDetail: "主导全球官网的视觉调性设定、交互层级规划，以及针对不同运动车型（MT, SR, NK等）的主题化展示设计。"
    },
    en: {
      title: 'CFMOTO Overseas Website',
      subtitle: 'Global Brand Portal Web Design',
      description: 'Global brand portal design for CFMOTO. Aims to convey the core spirit of "Experience More Together" through vibrant visual language.',
      role: 'Lead UI/UX Designer',
      tags: ['Web Design', 'Branding', 'CFMOTO', 'Sports', 'Figma'],
      awards: ["None"],
      concept: "Tailored to the sports attributes of the motorcycle and ATV industry, the design features a dynamic and impactful web interface. Utilizing large, high-quality product imagery, bold lines, and high-contrast colors to strengthen the brand's racing DNA and global vision.",
      roleDetail: "Led the visual tone setting, interaction hierarchy planning, and thematic display designs for various sports models (MT, SR, NK, etc.)."
    }
  },
  /*
    {
      id: 'd10',
      common: {
        category: Category.DESIGN,
        image: 'https://www.figma.com/file/5PpW3aDrVyF2sLVDHothK7/thumbnail',
        figmaUrl: 'https://www.figma.com/design/5PpW3aDrVyF2sLVDHothK7/%E8%BF%90%E8%90%A5%E7%9C%8B%E6%9D%BFV2?node-id=5101-13501&t=pfG2rQ5YAkz2ZMOg-1'
      },
      zh: {
        title: 'TCL 运营看板',
        subtitle: 'B端自动化运营数字看板',
        description: '为 TCL 打造的数字化运营监控看板。实时展示全球业务数据，通过数据可视化辅助商业决策。',
        role: '主 UI/UX 设计师',
        tags: ['B端', '数据可视化', 'TCL', '中台', 'Figma'],
        awards: ["无"],
        concept: "数据看板的核心在于“信噪比”。我通过深色模式下的高亮色彩标注异常指标，并设计了灵活的多维过滤系统，让复杂的运营数据变得直观易读。同时确保了在大屏展示环境下的视觉节奏感。",
        roleDetail: "主导看板的视觉语言设定、核心图例组件开发，以及跨端（大屏与 PC）的响应式适配方案。"
      },
      en: {
        title: 'TCL Operations Dashboard',
        subtitle: 'B-end Automated Operations Digital Dashboard',
        description: 'Digital operations monitoring dashboard for TCL. Real-time display of global business data, assisting business decisions through data visualization.',
        role: 'Lead UI/UX Designer',
        tags: ['B-end', 'Data Visualization', 'TCL', 'Dashboard', 'Figma'],
        awards: ["None"],
        concept: "The core of a data dashboard is the 'Signal-to-Noise Ratio'. I used high-contrast colors to highlight abnormal indicators in dark mode and designed a flexible multi-dimensional filtering system to make complex operational data intuitive and readable.",
        roleDetail: "Led the visual language setting, core legend component development, and responsive adaptation across large screens and PC."
      }
    },
  */
  {
    id: 'd11',
    common: {
      category: Category.DESIGN,
      image: '/cosco-dashboard-cover.jpg',
      figmaUrl: 'https://www.figma.com/design/4Nx1IIaOGNkrY7eGWc2wng/%E4%B8%AD%E8%BF%9C%E5%BD%92%E6%A1%A3?node-id=0-1&t=TAQ5rRFHohVHaCP9-1'
    },
    zh: {
      title: '中远海运数据大屏',
      subtitle: '航运物流数字化管理看板',
      description: '为中远海运 (COSCO SHIPPING) 设计的全球航运态势监控大屏。实现全球化物流链路的实时可视化管理。',
      role: '主 UI/UX 设计师',
      tags: ['数据可视化', '大屏设计', '中远海运', 'B端', 'Figma'],
      awards: ["无"],
      concept: "针对航运大屏的超大信息量，采用了“寰球视野+核心指标”的布局策略。以 3D 地球为中心实时展示航线物流，底部及侧边栏清晰呈现一利五率等关键财务与运营指标，确保了决策层在复杂环境下的信息获取效率。",
      roleDetail: "负责大屏的整体视觉风格定义、3D 地球交互逻辑设定以及核心财务指标组件的设计。"
    },
    en: {
      title: 'COSCO SHIPPING Data Dashboard',
      subtitle: 'Maritime Logistics Digital Management Dashboard',
      description: 'Global shipping status monitoring dashboard designed for COSCO SHIPPING. Real-time visual management for global logistics links.',
      role: 'Lead UI/UX Designer',
      tags: ['Data Visualization', 'Large Screen', 'COSCO', 'B-end', 'Figma'],
      awards: ["None"],
      concept: "For the massive information volume, I adopted a layout strategy of 'Global Vision + Core Metrics'. The 3D globe displays real-time routes, while sidebars present key financial and operational indicators like 'One Profit and Five Ratios', ensuring efficient information acquisition.",
      roleDetail: "Responsible for overall visual style definition, 3D globe interaction logic, and character design of core financial metric components."
    }
  },
  {
    id: 'd12',
    common: {
      category: Category.DESIGN,
      image: '/golden-bay-dashboard-cover.jpg',
      figmaUrl: 'https://www.figma.com/design/7k6cNCedsn1mnsx7Kionmo/%E7%B2%A4%E8%A7%84%E9%99%A2%E9%BB%84%E9%87%91%E5%86%85%E6%B9%BE?node-id=1-4777&t=7ypH9Qc8wIZNYUEE-1'
    },
    zh: {
      title: '黄金湾区时空数智平台',
      subtitle: '粤港澳大湾区大数据可视化平台',
      description: '为粤港澳大湾区打造的时空数智看板。通过高精度 3D 建模与大数据实时渲染，实现城市规划的智慧化分析。',
      role: '主 UI/UX 设计师',
      tags: ['数据可视化', '大数据', '智慧城市', 'B端', 'Figma'],
      awards: ["无"],
      concept: "数智平台的核心在于“虚实结合”。由于这是针对大湾区规划的项目，我采用了更具未来感的青绿配色，结合高精细度的 3D 建筑群模与动态生长动画，将原本碎片化的地理数据转化为直观的城市进化叙事。 ",
      roleDetail: "主导数智平台的整体视觉风格设定、时空数据图层逻辑规划，以及针对核心节点（如滨海新区）的精细化 3D 交互设计。"
    },
    en: {
      title: 'Golden Bay Digital Platform',
      subtitle: 'Greater Bay Area Big Data Visualization',
      description: 'Spatio-temporal digital intelligence dashboard for the Greater Bay Area. Intelligent analysis for urban planning via high-precision 3D modeling.',
      role: 'Lead UI/UX Designer',
      tags: ['Data Visualization', 'Big Data', 'Smart City', 'B-end', 'Figma'],
      awards: ["None"],
      concept: "The core of this platform is the 'Integration of Virtual and Real'. For GBA planning, I used a futuristic cyan-green palette combined with high-detail 3D architectural clusters to transform fragmented geospatial data into an intuitive urban evolution narrative.",
      roleDetail: "Led the overall visual style definition, spatio-temporal data layer planning, and refined 3D interactive design for core nodes (e.g., Binhai New Area)."
    }
  },
  {
    id: 'd13',
    common: {
      category: Category.DESIGN,
      image: '/p7-washer-minions.png',
      figmaUrl: 'https://www.figma.com/design/eVBZ8yhBYZKEhG3gQCCUc2/P7%E7%83%98%E5%B9%B2%E6%9C%BA?node-id=0-1&t=y0KxsnmCvjSePfl0-1'
    },
    zh: {
      title: 'P7 洗烘一体机操控页面',
      subtitle: '智能家电 HMI 交互设计 (C端)',
      description: '一款针对 P7 洗烘一体机的智能操控界面设计。引入“小黄人”正版授权主题，将趣味性与实用功能完美结合。',
      role: '主 UI/UX 设计师',
      tags: ['HMI', '智能家居', 'C端', 'IP联名', 'Figma'],
      awards: ["无"],
      concept: "智能家电不应只是冰冷的机器。通过与“小黄人”IP 的深度结合，我设计了一套充满活力的 HMI 界面。核心在于将复杂的洗涤参数转化为直观的主题化交互体验，提升了用户的操作愉悦感，同时保证了核心功能（如洗烘模式切换）的快速触达。",
      roleDetail: "负责操控屏幕的整体 UI 设计、IP 元素与界面的融合方案，以及针对不同洗护模式的动效交互设计。"
    },
    en: {
      title: 'P7 Washer-Dryer Control Page',
      subtitle: 'Smart Appliance HMI Interaction Design (B2C)',
      description: 'Smart control interface design for the P7 washer-dryer. Features an officially licensed "Minions" theme, blending fun and functionality.',
      role: 'Lead UI/UX Designer',
      tags: ['HMI', 'Smart Home', 'B2C', 'IP Branding', 'Figma'],
      awards: ["None"],
      concept: "Smart appliances should not be cold machines. Through deep integration with the \"Minions\" IP, I designed a vibrant HMI interface. The core lies in transforming complex washing parameters into intuitive themed interactions, enhancing user pleasure while ensuring quick access to core functions like wash & dry mode switching.",
      roleDetail: "Responsible for overall UI design of the control screen, integration of IP elements, and interactive animation design for various laundry modes."
    }
  },
  {
    id: 'd14',
    common: {
      category: Category.DESIGN,
      image: '/zte-ux-analysis-cover.png',
      figmaUrl: 'https://www.figma.com/design/mVZLDhvwqwhgTROqbbatYU/%E4%B8%AD%E5%85%B4%E海%E5%A4%96%E6%B6%88%E8%B4%B9%E8%80%85%E7%94%A8%E6%88%B7%E4%BD%93%E9%AA%8C%E5%88%86%E6%9E%90?node-id=1-2&t=7GfR0EE0A4hhTvOE-1'
    },
    zh: {
      title: '中兴海外消费者用户体验分析',
      subtitle: '深度 UX 调研与体验路径优化',
      description: '针对中兴（ZTE）海外门户网站进行的深度用户体验分析。通过用户旅程地图识别痛点并提出优化策略。',
      role: 'UX 研究员 / 策略设计师',
      tags: ['UX研究', '用户旅程', '体验分析', '竞品调研'],
      awards: ["无"],
      concept: "UX 分析的核心在于从“数据”中挖掘“情绪”。我通过构建完整的人群画像（Personas）和用户旅程地图（CJM），量化了用户在不同阶段（发现产品、查看详情、交易、售后）的情绪波动与痛点。通过识别核心卡点（如：参数对比难、内容质量不高），为品牌门户的重构提供了数据支持。",
      roleDetail: "独立完成全链路用户路径拆解、触点分析（Touchpoint Analysis）以及多维度的痛点归纳，并基于此产出了可落地的 UX 优化建议报告。"
    },
    en: {
      title: 'ZTE Overseas UX Analysis',
      subtitle: 'In-depth UX Research & Journey Optimization',
      description: 'Deep dive user experience analysis for ZTE overseas portal. Identifying pain points and proposing strategies via User Journey Mapping.',
      role: 'UX Researcher / Strategy Designer',
      tags: ['UX Research', 'User Journey', 'Experience Analysis', 'Competitive Audit'],
      awards: ["None"],
      concept: "The essence of UX analysis lies in mining 'emotions' from 'data'. By constructing complete Personas and Customer Journey Maps (CJM), I quantified emotional fluctuations and pain points across stages (Discovery, Detail, Transaction, After-sales). Identifying core friction points provided data-driven support for the portal redesign.",
      roleDetail: "Independently completed full-link journey teardown, touchpoint analysis, and multi-dimensional pain point extraction, producing an actionable UX optimization report."
    }
  }
];
