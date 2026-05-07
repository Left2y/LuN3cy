import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Bot, ExternalLink, MessageCircle, Send, X } from 'lucide-react';
import { CATEGORY_LABELS, PROJECTS } from '../constants';
import { CONTACT_DATA } from '../src/data/contact';
import { HOME_DATA } from '../src/data/home';
import { resolveAsset } from '../src/utils/path';
import { AppTab, Category, Language, Project } from '../types';

export interface AssistantLaunch {
  id: number;
  question: string;
  project?: Project;
}

interface DigitalDoubleDockProps {
  language: Language;
  launch?: AssistantLaunch | null;
  onNavigate: (tab: AppTab) => void;
}

type AgentAction = {
  label: string;
  href?: string;
  tab?: AppTab;
};

type AgentMessage = {
  id: number;
  role: 'assistant' | 'user';
  content: string;
  sources?: string[];
  actions?: AgentAction[];
};

const QUESTION_INTENTS = {
  focus: ['主要', '做什么', '介绍', '你是谁', '方向', 'about', 'focus', 'who', 'what'],
  recommend: ['推荐', '先看', '作品', 'portfolio', 'recommend', 'showcase', 'best'],
  ai: ['ai', 'aigc', '应用', '大模型', 'qwen', 'gemini', 'coding', 'agent'],
  contact: ['联系', '合作', '邮箱', '实习', 'contact', 'email', 'hire', 'internship', 'cooperate'],
  resume: ['简历', 'resume', 'cv'],
  role: ['职责', '负责', '分工', 'role', 'responsibility'],
  tech: ['技术', '技术栈', 'stack', 'tech', 'framework', '工具'],
  links: ['链接', 'demo', 'github', 'figma', '入口', '预览', 'link'],
};

const normalize = (value: string) => value.toLowerCase().trim();

const hasIntent = (question: string, tokens: string[]) => {
  const normalized = normalize(question);
  return tokens.some((token) => normalized.includes(token.toLowerCase()));
};

const getProjectText = (project: Project) => {
  return [
    project.title,
    project.subtitle,
    project.description,
    project.role,
    project.roleDetail,
    project.concept,
    ...(project.tags || []),
    ...(project.awards || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
};

const getQuestionTerms = (question: string) => {
  const normalized = normalize(question);
  const words = normalized.match(/[a-z0-9]+/g) || [];
  const cjk = normalized.replace(/[^\u4e00-\u9fa5]/g, '');
  const grams = new Set<string>(words.filter((word) => word.length > 1));

  for (let size = 2; size <= 3; size += 1) {
    for (let index = 0; index <= cjk.length - size; index += 1) {
      grams.add(cjk.slice(index, index + size));
    }
  }

  return Array.from(grams).filter((term) => term.length > 1).slice(0, 24);
};

const searchProjects = (question: string, projects: Project[]) => {
  const terms = getQuestionTerms(question);

  return projects
    .map((project) => {
      const text = getProjectText(project);
      const score = terms.reduce((total, term) => total + (text.includes(term) ? 1 : 0), 0);
      return { project, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.project);
};

const getProjectLinks = (project: Project, language: Language): AgentAction[] => {
  const labels =
    language === 'zh'
      ? { website: '打开 Demo', github: '查看 GitHub', figma: '打开 Figma', external: '外部入口' }
      : { website: 'Open Demo', github: 'View GitHub', figma: 'Open Figma', external: 'External Link' };

  return [
    project.websiteUrl && { label: labels.website, href: project.websiteUrl },
    project.githubUrl && { label: labels.github, href: project.githubUrl },
    project.figmaUrl && { label: labels.figma, href: project.figmaUrl },
    project.externalLink && { label: labels.external, href: project.externalLink },
  ].filter(Boolean) as AgentAction[];
};

const buildProjectAnswer = (question: string, project: Project, language: Language): AgentMessage => {
  const isZh = language === 'zh';
  const tags = project.tags?.length ? project.tags.join(' / ') : isZh ? '暂无标签' : 'No tags yet';
  const category = CATEGORY_LABELS[language][project.category] || project.category;
  const links = getProjectLinks(project, language);
  let content = '';

  if (hasIntent(question, QUESTION_INTENTS.role)) {
    content = isZh
      ? `在《${project.title}》里，我的角色是 ${project.role || '创作者'}。\n${project.roleDetail || project.description}\n\n这个项目适合用来说明我的实际执行边界：从问题拆解、视觉或交互方案，到可演示结果的整理。`
      : `For "${project.title}", my role is ${project.role || 'builder'}.\n${project.roleDetail || project.description}\n\nThis case is useful for explaining the execution boundary: problem framing, interface or visual decisions, and the final presentable output.`;
  } else if (hasIntent(question, QUESTION_INTENTS.tech)) {
    content = isZh
      ? `《${project.title}》的技术或媒介标签是：${tags}。\n\n副标题：${project.subtitle || category}。\n${project.concept ? `设计意图：${project.concept}` : `项目说明：${project.description}`}`
      : `"${project.title}" uses these stack or media tags: ${tags}.\n\nSubtitle: ${project.subtitle || category}.\n${project.concept ? `Concept: ${project.concept}` : `Summary: ${project.description}`}`;
  } else if (hasIntent(question, QUESTION_INTENTS.links)) {
    content =
      links.length > 0
        ? isZh
          ? `《${project.title}》有 ${links.length} 个可访问入口。你可以从下方按钮直接打开 Demo、GitHub、Figma 或外部链接。`
          : `"${project.title}" has ${links.length} access point(s). Use the buttons below to open the demo, GitHub, Figma, or external link.`
        : isZh
          ? `《${project.title}》当前没有配置外部入口。可以先查看站内项目说明、职责、标签和图片资料。`
          : `"${project.title}" does not have external links configured yet. The local case details are still available in this portfolio.`;
  } else {
    content = isZh
      ? `《${project.title}》属于 ${category}。\n\n${project.description}\n\n我的角色：${project.role || '创作者'}。${project.roleDetail ? `\n${project.roleDetail}` : ''}${project.concept ? `\n\n核心意图：${project.concept}` : ''}`
      : `"${project.title}" sits under ${category}.\n\n${project.description}\n\nMy role: ${project.role || 'builder'}.${project.roleDetail ? `\n${project.roleDetail}` : ''}${project.concept ? `\n\nCore idea: ${project.concept}` : ''}`;
  }

  return {
    id: Date.now() + Math.random(),
    role: 'assistant',
    content,
    sources: [project.title, category],
    actions: links,
  };
};

const buildGeneralAnswer = (question: string, language: Language): AgentMessage => {
  const isZh = language === 'zh';
  const projects = PROJECTS[language];
  const home = HOME_DATA[language];
  const contact = CONTACT_DATA[language];
  const counts = {
    design: projects.filter((project) => project.category === Category.DESIGN).length,
    photo: projects.filter((project) => project.category === Category.PHOTO).length,
    dev: projects.filter((project) => project.category === Category.DEV).length,
  };

  if (hasIntent(question, QUESTION_INTENTS.contact)) {
    return {
      id: Date.now() + Math.random(),
      role: 'assistant',
      content: isZh
        ? `可以直接联系。\n\n邮箱：${contact.email}\n地点：${contact.locationValue}\n方向：${contact.intro}\n\n如果是作品集、实习、AI 应用或影像相关合作，建议邮件里直接带上背景、周期和希望看的作品类型。`
        : `You can contact me directly.\n\nEmail: ${contact.email}\nBase: ${contact.locationValue}\nScope: ${contact.intro}\n\nFor portfolio, internship, AI app, or visual work conversations, include the context, timeline, and the type of work you want to review.`,
      sources: [isZh ? '联系信息' : 'Contact data'],
      actions: [
        { label: isZh ? '发邮件' : 'Email', href: `mailto:${contact.email}` },
        { label: isZh ? '联系页' : 'Contact page', tab: 'contact' },
      ],
    };
  }

  if (hasIntent(question, QUESTION_INTENTS.resume)) {
    return {
      id: Date.now() + Math.random(),
      role: 'assistant',
      content: isZh
        ? '简历入口已经配置在站点里。你可以下载 PDF，也可以先从作品集筛选 UI/UX、摄影或应用开发项目来判断匹配度。'
        : 'The resume is available as a PDF. You can also review UI/UX, photography, and development cases before deciding fit.',
      sources: [isZh ? '简历入口' : 'Resume entry'],
      actions: [
        { label: isZh ? '下载简历' : 'Download resume', href: resolveAsset('/resume.pdf') },
        { label: isZh ? '作品集' : 'Portfolio', tab: 'portfolio' },
      ],
    };
  }

  if (hasIntent(question, QUESTION_INTENTS.ai)) {
    const aiProjects = projects
      .filter((project) => project.category === Category.DEV || /ai|qwen|gemini|coding|大模型|语音/.test(getProjectText(project)))
      .slice(0, 5);
    const list = aiProjects.map((project) => `- ${project.title}: ${project.description}`).join('\n');

    return {
      id: Date.now() + Math.random(),
      role: 'assistant',
      content: isZh
        ? `目前 AI 和应用开发方向可以重点看这些：\n${list}\n\n这些项目更能说明我把设计判断、前端实现和模型能力拼到一个可演示产品里的能力。`
        : `For AI and app-building work, start here:\n${list}\n\nThese projects show how I combine design judgment, frontend implementation, and model capabilities into presentable product prototypes.`,
      sources: [isZh ? '应用开发项目' : 'Development projects'],
      actions: [{ label: isZh ? '打开作品集' : 'Open portfolio', tab: 'portfolio' }],
    };
  }

  if (hasIntent(question, QUESTION_INTENTS.recommend)) {
    const design = projects.filter((project) => project.category === Category.DESIGN).slice(0, 2);
    const dev = projects.filter((project) => project.category === Category.DEV).slice(0, 2);
    const photo = projects.filter((project) => project.category === Category.PHOTO).slice(0, 1);
    const picks = [...design, ...dev, ...photo];
    const list = picks.map((project) => `- ${project.title}: ${project.description}`).join('\n');

    return {
      id: Date.now() + Math.random(),
      role: 'assistant',
      content: isZh
        ? `建议先按“设计能力 + AI 实作 + 视觉审美”三条线看：\n${list}\n\n如果是招聘或合作场景，先看 UI/UX，再看 AI Apps，最后用摄影作品补充视觉感受。`
        : `I would review the archive through three lanes: design ability, AI implementation, and visual taste.\n${list}\n\nFor recruiting or collaboration, start with UI/UX, then AI Apps, and use photography as visual context.`,
      sources: [isZh ? '作品数据' : 'Project data'],
      actions: [{ label: isZh ? '打开作品集' : 'Open portfolio', tab: 'portfolio' }],
    };
  }

  if (hasIntent(question, QUESTION_INTENTS.focus)) {
    return {
      id: Date.now() + Math.random(),
      role: 'assistant',
      content: isZh
        ? `Left2y 的作品集围绕三条主线：UI/UX、静态摄影、AI 应用。\n\n${home.intro}\n\n当前归档里有 ${counts.design} 个 UI/UX 项目、${counts.photo} 个摄影项目、${counts.dev} 个应用开发项目。整体优势是把信息结构、视觉语言、原型和前端实现连起来。`
        : `Left2y's portfolio is built around three lanes: UI/UX, photography, and AI apps.\n\n${home.intro}\n\nThe archive currently includes ${counts.design} UI/UX projects, ${counts.photo} photography projects, and ${counts.dev} development projects. The core strength is connecting information structure, visual language, prototypes, and frontend implementation.`,
      sources: [isZh ? '首页信息' : 'Home data', isZh ? '作品归档' : 'Project archive'],
      actions: [
        { label: isZh ? '看作品' : 'View work', tab: 'portfolio' },
        { label: isZh ? '联系' : 'Contact', tab: 'contact' },
      ],
    };
  }

  const matches = searchProjects(question, projects);
  if (matches.length > 0) {
    const list = matches.map((project) => `- ${project.title}: ${project.description}`).join('\n');
    return {
      id: Date.now() + Math.random(),
      role: 'assistant',
      content: isZh
        ? `我在作品库里找到了这些可能相关的内容：\n${list}\n\n如果你想看更具体的信息，可以点开作品详情后问“我的职责是什么”“技术栈是什么”或“有没有 Demo”。`
        : `I found these related entries in the archive:\n${list}\n\nFor deeper context, open a project and ask about role, stack, or demo links.`,
      sources: matches.map((project) => project.title),
      actions: [{ label: isZh ? '打开作品集' : 'Open portfolio', tab: 'portfolio' }],
    };
  }

  return {
    id: Date.now() + Math.random(),
    role: 'assistant',
    content: isZh
      ? '这个问题在当前本地作品集资料里没有明确答案。你可以换成作品、职责、技术栈、AI 应用、联系方式或简历相关的问题。'
      : 'I do not have a clear answer for that from the local portfolio data. Try asking about work, role, stack, AI apps, contact, or resume.',
    sources: [isZh ? '本地作品集资料' : 'Local portfolio data'],
    actions: [{ label: isZh ? '联系本人' : 'Contact', tab: 'contact' }],
  };
};

const createAssistantReply = (question: string, language: Language, project?: Project): AgentMessage => {
  if (project) {
    return buildProjectAnswer(question, project, language);
  }

  return buildGeneralAnswer(question, language);
};

export const DigitalDoubleDock: React.FC<DigitalDoubleDockProps> = ({ language, launch, onNavigate }) => {
  const isZh = language === 'zh';
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [projectContext, setProjectContext] = useState<Project | null>(null);
  const [messages, setMessages] = useState<AgentMessage[]>(() => [
    {
      id: 1,
      role: 'assistant',
      content:
        language === 'zh'
          ? '这里是 Left2y 的本地数字分身。可以问作品、职责、技术栈、AI 应用、联系方式或简历。'
          : "This is Left2y's local digital double. Ask about work, role, stack, AI apps, contact, or resume.",
      sources: [language === 'zh' ? '本地作品集资料' : 'Local portfolio data'],
    },
  ]);
  const lastLaunchId = useRef<number | null>(null);
  const threadRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = useMemo(
    () =>
      projectContext
        ? [
            isZh ? '这个项目我的职责是什么？' : 'What was my role in this project?',
            isZh ? '这个项目的技术栈或方法是什么？' : 'What stack or method did this use?',
            isZh ? '有没有 Demo、GitHub 或 Figma？' : 'Does it have a demo, GitHub, or Figma?',
          ]
        : [
            isZh ? '你主要做什么？' : 'What do you focus on?',
            isZh ? '推荐先看哪些作品？' : 'Which works should I review first?',
            isZh ? '有哪些 AI 应用？' : 'Which AI apps have you built?',
            isZh ? '如何联系合作？' : 'How can I contact you?',
          ],
    [isZh, projectContext]
  );

  const submitQuestion = (question: string, project?: Project | null) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;

    const contextProject = project === undefined ? projectContext : project;
    if (project !== undefined) {
      setProjectContext(project);
    }

    const userMessage: AgentMessage = {
      id: Date.now() + Math.random(),
      role: 'user',
      content: contextProject ? `${contextProject.title} / ${cleanQuestion}` : cleanQuestion,
    };
    const assistantMessage = createAssistantReply(cleanQuestion, language, contextProject || undefined);

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setDraft('');
    setOpen(true);
  };

  useEffect(() => {
    setMessages((current) => {
      const first = current[0];
      if (!first || first.id !== 1) return current;
      return [
        {
          ...first,
          content:
            language === 'zh'
              ? '这里是 Left2y 的本地数字分身。可以问作品、职责、技术栈、AI 应用、联系方式或简历。'
              : "This is Left2y's local digital double. Ask about work, role, stack, AI apps, contact, or resume.",
          sources: [language === 'zh' ? '本地作品集资料' : 'Local portfolio data'],
        },
        ...current.slice(1),
      ];
    });
  }, [language]);

  useEffect(() => {
    if (!launch || launch.id === lastLaunchId.current) return;
    lastLaunchId.current = launch.id;
    submitQuestion(launch.question, launch.project || null);
  }, [launch]);

  useEffect(() => {
    if (!threadRef.current) return;
    threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages, open]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitQuestion(draft);
  };

  return (
    <div className={`agent-dock ${open ? 'is-open' : ''}`}>
      {open && (
        <section className="agent-panel system-panel-flat" aria-label={isZh ? 'Left2y 数字分身' : 'Left2y digital double'}>
          <header className="agent-panel-head">
            <div className="agent-title">
              <span className="agent-avatar" aria-hidden="true">
                <Bot size={18} />
              </span>
              <div>
                <span className="system-label">ASK LEFT2Y</span>
                <strong>{isZh ? '作品集档案助手' : 'Portfolio Archive Agent'}</strong>
              </div>
            </div>
            <button className="agent-icon-button" onClick={() => setOpen(false)} aria-label={isZh ? '收起助手' : 'Close assistant'}>
              <X size={18} />
            </button>
          </header>

          <div className="agent-context-row">
            <span className="agent-status-dot" />
            <span>{projectContext ? `${isZh ? '当前项目' : 'Context'}: ${projectContext.title}` : isZh ? '本地作品集资料' : 'Local portfolio data'}</span>
            {projectContext && (
              <button type="button" onClick={() => setProjectContext(null)}>
                {isZh ? '清除' : 'Clear'}
              </button>
            )}
          </div>

          <div className="agent-thread" ref={threadRef}>
            {messages.map((message) => (
              <article key={message.id} className={`agent-message agent-message-${message.role}`}>
                <div className="agent-message-role">{message.role === 'assistant' ? 'LEFT2Y.AI' : isZh ? '你' : 'You'}</div>
                <p>{message.content}</p>

                {message.sources && message.sources.length > 0 && (
                  <div className="agent-sources">
                    {message.sources.slice(0, 4).map((source) => (
                      <span key={source}>{source}</span>
                    ))}
                  </div>
                )}

                {message.actions && message.actions.length > 0 && (
                  <div className="agent-actions">
                    {message.actions.map((action) =>
                      action.href ? (
                        <a key={action.label} href={action.href} target={action.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
                          {action.label}
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <button key={action.label} type="button" onClick={() => action.tab && onNavigate(action.tab)}>
                          {action.label}
                        </button>
                      )
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="agent-quick-prompts">
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => submitQuestion(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <form className="agent-input-row" onSubmit={handleSubmit}>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={isZh ? '问作品、职责、技术栈...' : 'Ask about work, role, stack...'}
              aria-label={isZh ? '输入问题' : 'Enter question'}
            />
            <button type="submit" aria-label={isZh ? '发送问题' : 'Send question'}>
              <Send size={17} />
            </button>
          </form>
        </section>
      )}

      <button className="agent-launcher system-panel-flat" onClick={() => setOpen((value) => !value)} aria-label={isZh ? '打开数字分身' : 'Open digital double'}>
        <MessageCircle size={20} />
        <span>ASK</span>
      </button>
    </div>
  );
};
