import { CATEGORY_LABELS, PROJECTS } from '../../constants';
import { Language, Category, Project } from '../../types';
import { CONTACT_DATA } from './contact';
import { HOME_DATA } from './home';

export type CanvasNodeType = 'profile' | 'project' | 'contact' | 'tag' | 'cluster';
export type CanvasTone = 'paper' | 'accent' | 'lapis' | 'signal' | 'ink';

export interface CanvasMetaItem {
  label: string;
  value: string;
}

export interface CanvasLink {
  label: string;
  href: string;
}

export interface CanvasNode {
  id: string;
  type: CanvasNodeType;
  groupId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
  tone?: CanvasTone;
  title: string;
  subtitle?: string;
  body?: string;
  image?: string;
  date?: string;
  chips?: string[];
  meta?: CanvasMetaItem[];
  links?: CanvasLink[];
}

export interface CanvasEdge {
  id: string;
  from: string;
  to: string;
  kind?: 'primary' | 'secondary' | 'dashed';
}

export interface CanvasBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasGroup {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  tone: CanvasTone;
  nodeIds: string[];
  bounds: CanvasBounds;
}

export interface CanvasViewportFocus {
  centerX: number;
  centerY: number;
  scale: number;
}

export interface CanvasScene {
  width: number;
  height: number;
  defaultViewport: CanvasViewportFocus;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  groups: CanvasGroup[];
}

const SCENE_WIDTH = 5600;
const SCENE_HEIGHT = 2600;

const makeProjectLinks = (project: Project, language: Language): CanvasLink[] => {
  const labels = language === 'zh'
    ? { demo: '在线预览', figma: 'Figma', github: 'GitHub', external: '外部链接' }
    : { demo: 'Live Demo', figma: 'Figma', github: 'GitHub', external: 'External' };

  return [
    project.websiteUrl && { label: labels.demo, href: project.websiteUrl },
    project.figmaUrl && { label: labels.figma, href: project.figmaUrl },
    project.githubUrl && { label: labels.github, href: project.githubUrl },
    project.externalLink && { label: labels.external, href: project.externalLink },
  ].filter(Boolean) as CanvasLink[];
};

const createBounds = (nodes: CanvasNode[], nodeIds: string[], padding = 110): CanvasBounds => {
  const groupNodes = nodes.filter((node) => nodeIds.includes(node.id));
  const minX = Math.min(...groupNodes.map((node) => node.x));
  const minY = Math.min(...groupNodes.map((node) => node.y));
  const maxX = Math.max(...groupNodes.map((node) => node.x + node.width));
  const maxY = Math.max(...groupNodes.map((node) => node.y + node.height));

  return {
    x: minX - padding,
    y: minY - padding,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2,
  };
};

const createGroup = (
  nodes: CanvasNode[],
  id: string,
  label: string,
  shortLabel: string,
  description: string,
  tone: CanvasTone,
  nodeIds: string[],
  padding = 130,
): CanvasGroup => ({
  id,
  label,
  shortLabel,
  description,
  tone,
  nodeIds,
  bounds: createBounds(nodes, nodeIds, padding),
});

export const buildCanvasScene = (language: Language): CanvasScene => {
  const home = HOME_DATA[language];
  const contact = CONTACT_DATA[language];
  const projects = PROJECTS[language];

  const designProjects = projects.filter((project) => project.category === Category.DESIGN);
  const devProjects = projects.filter((project) => project.category === Category.DEV);
  const photoProjects = projects.filter((project) => project.category === Category.PHOTO);

  const nodes: CanvasNode[] = [];
  const edges: CanvasEdge[] = [];

  const identityNodeIds: string[] = [];
  const workNodeIds: string[] = [];
  const contactNodeIds: string[] = [];

  const pushNode = (node: CanvasNode, bucket: string[]) => {
    nodes.push(node);
    bucket.push(node.id);
  };

  pushNode({
    id: 'profile-main',
    type: 'profile',
    groupId: 'identity',
    x: 1840,
    y: 940,
    width: 460,
    height: 520,
    tone: 'accent',
    title: 'LEFT2Y',
    subtitle: contact.locationValue,
    body: home.intro,
    chips: home.heroItems.map((item) => item.text),
    meta: [
      { label: 'RANGE', value: home.years },
    ],
  }, identityNodeIds);

  home.heroItems.forEach((item, index) => {
    const positions = [
      { x: 1670, y: 940 },
      { x: 1660, y: 1120 },
      { x: 1670, y: 1300 },
    ];

    pushNode({
      id: `identity-tag-${index + 1}`,
      type: 'tag',
      groupId: 'identity',
      x: positions[index].x,
      y: positions[index].y,
      width: 140,
      height: 122,
      tone: index === 0 ? 'lapis' : index === 1 ? 'signal' : 'paper',
      title: item.text,
      subtitle: item.annotation,
    }, identityNodeIds);

    edges.push({
      id: `edge-profile-tag-${index + 1}`,
      from: 'profile-main',
      to: `identity-tag-${index + 1}`,
      kind: 'secondary',
    });
  });

  const workCategories = [
    {
      id: 'work-design',
      projects: designProjects,
      columns: [2960, 3332],
      startY: 800,
      rowHeight: 326,
    },
    {
      id: 'work-dev',
      projects: devProjects,
      columns: [3800, 4172],
      startY: 800,
      rowHeight: 326,
    },
    {
      id: 'work-photo',
      projects: photoProjects,
      columns: [4640],
      startY: 800,
      rowHeight: 340,
    },
  ];

  workCategories.forEach((section) => {
    section.projects.forEach((project, index) => {
      const columnIndex = index % section.columns.length;
      const rowIndex = Math.floor(index / section.columns.length);
      const nodeId = `project-${project.id}`;

      pushNode({
        id: nodeId,
        type: 'project',
        groupId: 'work',
        x: section.columns[columnIndex],
        y: section.startY + rowIndex * section.rowHeight,
        width: 342,
        height: project.category === Category.PHOTO ? 304 : 286,
        tone: project.category === Category.DEV ? 'ink' : 'paper',
        title: project.title,
        subtitle: project.subtitle,
        body: project.description,
        image: project.image,
        chips: project.tags.slice(0, 3),
        meta: [
          { label: language === 'zh' ? '分类' : 'Category', value: CATEGORY_LABELS[language][project.category] || project.category },
          { label: language === 'zh' ? '角色' : 'Role', value: project.role || (language === 'zh' ? '创作者' : 'Builder') },
        ],
        links: makeProjectLinks(project, language),
      }, workNodeIds);

      edges.push({
        id: `edge-${section.id}-${nodeId}`,
        from: index === 0 ? 'profile-main' : `project-${section.projects[index - 1].id}`,
        to: nodeId,
        kind: index === 0 ? 'secondary' : 'dashed',
      });
    });
  });

  pushNode({
    id: 'contact-card',
    type: 'contact',
    groupId: 'contact',
    x: 4460,
    y: 420,
    width: 390,
    height: 278,
    tone: 'paper',
    title: contact.hello,
    subtitle: contact.locationValue,
    body: contact.tooltip,
    meta: [
      { label: language === 'zh' ? '邮箱' : 'Email', value: contact.email },
      { label: language === 'zh' ? '微信' : 'WeChat', value: 'ysf1028' },
    ],
    links: [
      { label: language === 'zh' ? '写邮件' : 'Email Me', href: `mailto:${contact.email}` },
      { label: contact.resumeLabel, href: '/resume.pdf' },
    ],
  }, contactNodeIds);

  const contactActionNodes = [
    {
      id: 'contact-mail',
      title: language === 'zh' ? '邮箱' : 'Mail',
      subtitle: contact.email,
      x: 4460,
      y: 730,
      tone: 'accent' as CanvasTone,
    },
    {
      id: 'contact-phone',
      title: language === 'zh' ? '电话' : 'Phone',
      subtitle: '18613079615',
      x: 4670,
      y: 730,
      tone: 'signal' as CanvasTone,
    },
    {
      id: 'contact-wechat',
      title: language === 'zh' ? '微信' : 'WeChat',
      subtitle: 'ysf1028',
      x: 4460,
      y: 870,
      tone: 'paper' as CanvasTone,
    },
    {
      id: 'contact-resume',
      title: language === 'zh' ? '简历' : 'Resume',
      subtitle: language === 'zh' ? '一键下载' : 'Download PDF',
      x: 4670,
      y: 870,
      tone: 'lapis' as CanvasTone,
    },
  ];

  contactActionNodes.forEach((node) => {
    pushNode({
      id: node.id,
      type: 'tag',
      groupId: 'contact',
      x: node.x,
      y: node.y,
      width: 180,
      height: 122,
      tone: node.tone,
      title: node.title,
      subtitle: node.subtitle,
    }, contactNodeIds);

    edges.push({
      id: `edge-contact-${node.id}`,
      from: 'contact-card',
      to: node.id,
      kind: 'secondary',
    });
  });

  edges.push(
    { id: 'edge-profile-contact', from: 'profile-main', to: 'contact-card', kind: 'secondary' },
  );

  const groups: CanvasGroup[] = [
    createGroup(
      nodes,
      'identity',
      language === 'zh' ? '个人信息' : 'Identity',
      language === 'zh' ? '我' : 'Me',
      language === 'zh' ? '首页已呈现的个人信息和主标签。' : 'Hero content already visible on the standard homepage.',
      'accent',
      identityNodeIds,
      160,
    ),
    createGroup(
      nodes,
      'work',
      language === 'zh' ? '作品矩阵' : 'Works',
      language === 'zh' ? '作品' : 'Work',
      language === 'zh' ? '标准作品页里的项目，被按类别重新铺开。' : 'Projects from the standard portfolio, re-laid by category.',
      'ink',
      workNodeIds,
      170,
    ),
    createGroup(
      nodes,
      'contact',
      language === 'zh' ? '开放连接' : 'Open Channel',
      language === 'zh' ? '联系' : 'Reach',
      language === 'zh' ? '联系页里的邮箱、电话、微信和简历入口。' : 'Email, phone, WeChat, and resume entry from the contact page.',
      'accent',
      contactNodeIds,
      160,
    ),
  ];

  return {
    width: SCENE_WIDTH,
    height: SCENE_HEIGHT,
    defaultViewport: {
      centerX: 3180,
      centerY: 1160,
      scale: 0.68,
    },
    nodes,
    edges,
    groups,
  };
};
