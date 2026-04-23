import React from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { HOME_DATA } from '../src/data/home';
import { CONTACT_DATA } from '../src/data/contact';
import { PROJECT_DATA } from '../src/data/projects';
import { resolveAsset } from '../src/utils/path';
import { Category, Language } from '../types';

interface HeroSectionProps {
  onNavigate: (page: string) => void;
  onCategorySelect: (category: Category) => void;
  language: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onCategorySelect,
  language,
}) => {
  const content = HOME_DATA[language];
  const contactContent = CONTACT_DATA[language];
  const heroItems = content.heroItems || [];
  const heroSignals =
    language === 'zh'
      ? [
          {
            index: '01',
            title: '结构',
            kicker: '研究 / 路径 / 信息层级',
            description: '先把复杂内容拆开，找到主线，再决定界面的节奏与秩序。',
          },
          {
            index: '02',
            title: '语言',
            kicker: '视觉 / 系统 / 动效',
            description: '让页面有识别度，但不让装饰盖过内容本身。',
          },
          {
            index: '03',
            title: '原型',
            kicker: 'Figma / Frontend / AI',
            description: '把想法推进到可演示、可验证、可继续开发的状态。',
          },
        ]
      : [
          {
            index: '01',
            title: 'Structure',
            kicker: 'Research / Flow / Hierarchy',
            description: 'Break down complex information first, then build the rhythm and order of the interface.',
          },
          {
            index: '02',
            title: 'Language',
            kicker: 'Visual / System / Motion',
            description: 'Give the page a signature voice without letting decoration overpower the work.',
          },
          {
            index: '03',
            title: 'Prototype',
            kicker: 'Figma / Frontend / AI',
            description: 'Push concepts into something presentable, testable, and ready for the next build step.',
          },
        ];
  const archiveMeta =
    language === 'zh'
      ? {
          header: '作品分类',
          title: 'Archive Taxonomy',
          description: '把网页截图、长图和设备界面收回到项目详情里。首页这里不再裁切大图，改成更快定位的作品索引。',
          totalLabel: '份档案',
          unitLabel: '项',
          footnote: '点击任一分类，直接进入对应作品清单。',
          notes: {
            [Category.DESIGN]: {
              kicker: '界面 / 系统 / HMI',
              description: '品牌门户、中后台、看板、移动端与智能硬件界面。',
              tags: ['门户', '看板', 'HMI'],
            },
            [Category.PHOTO]: {
              kicker: '影像 / 观察 / 情绪',
              description: '风景、城市观察与阶段性的个人摄影档案。',
              tags: ['风景', '城市', '纪实'],
            },
            [Category.DEV]: {
              kicker: '工具 / 实验 / AI',
              description: 'React 小应用、插件与围绕创作流程展开的 AI 实验。',
              tags: ['React', '插件', 'AI'],
            },
          },
        }
      : {
          header: 'Work Taxonomy',
          title: 'Archive Taxonomy',
          description: 'Large previews now live inside each case. The homepage keeps this panel as a faster routing layer instead of a cropped image wall.',
          totalLabel: 'records',
          unitLabel: 'works',
          footnote: 'Select a lane to jump straight into the filtered archive.',
          notes: {
            [Category.DESIGN]: {
              kicker: 'Interface / System / HMI',
              description: 'Brand portals, dashboards, middle-end systems, mobile apps, and smart-device interfaces.',
              tags: ['Portal', 'Dashboard', 'HMI'],
            },
            [Category.PHOTO]: {
              kicker: 'Image / Observation / Mood',
              description: 'Landscape studies, city observations, and personal photography archives.',
              tags: ['Landscape', 'City', 'Still'],
            },
            [Category.DEV]: {
              kicker: 'Tool / Experiment / AI',
              description: 'React builds, plugins, and AI-driven experiments around creative workflows.',
              tags: ['React', 'Plugin', 'AI'],
            },
          },
        };

  const archiveItems = heroItems
    .filter((item) => item.category !== null)
    .map((item, index) => {
      const category = item.category as Category;
      const count = PROJECT_DATA.filter((project) => project.common.category === category).length;
      const note = archiveMeta.notes[category];

      return {
        index,
        label: item.text,
        annotation: item.annotation,
        category,
        count,
        ...note,
      };
    });

  return (
    <div className="mx-auto w-full max-w-[1600px] animate-fade-in">
      <section className="system-panel overflow-hidden">
        <div className="grid border-b-[2px] border-[var(--line)] xl:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.75fr)]">
          <div className="system-grid-signal bg-[var(--accent)] px-5 py-8 text-[var(--paper)] md:px-9 md:py-12 xl:px-12 xl:py-16">
            <div className="relative z-[1] flex min-h-full flex-col">
              <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
                <span className="system-chip border-[var(--paper)] bg-transparent text-[var(--paper)]">
                  LEFT2Y / CREATIVE INDEX
                </span>
                <span className="font-mono text-xs font-bold uppercase text-[var(--paper)]/82">
                  {content.years}
                </span>
              </div>

              <h1 className="system-display-shadow max-w-[9ch] font-display text-[clamp(4.4rem,13vw,12rem)] font-extrabold uppercase leading-[0.78] text-[var(--paper)]">
                Left2y
              </h1>

              <p className="mt-7 max-w-3xl text-base font-semibold leading-relaxed text-[var(--paper)]/92 md:text-xl">
                {content.intro}
              </p>

              <div className="mt-auto pt-10">
                <div className="grid gap-3 md:grid-cols-3">
                  {heroSignals.map((item) => (
                    <article
                      key={item.index}
                      className="hero-signal-card flex min-h-[172px] flex-col justify-between p-5 text-left text-[var(--ink)]"
                    >
                      <div>
                        <span className="system-label text-[var(--muted)]">{item.index}</span>
                        <div className="mt-3 font-display text-[clamp(2rem,3vw,3.3rem)] font-extrabold uppercase leading-[0.9] text-[var(--ink)]">
                          {item.title}
                        </div>
                        <p className="mt-3 max-w-[24ch] text-sm font-semibold leading-relaxed text-[var(--muted)]">
                          {item.description}
                        </p>
                      </div>

                      <p className="mt-5 font-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
                        {item.kicker}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col bg-[var(--paper)] p-4 md:p-6 xl:border-l-2 xl:border-[var(--line)]">
            <section className="hero-archive-panel">
              <div className="hero-archive-head">
                <span className="system-chip">{archiveMeta.header}</span>
                <span className="hero-archive-total">
                  {PROJECT_DATA.length} {archiveMeta.totalLabel}
                </span>
              </div>

              <div className="hero-archive-copy-block">
                <span className="system-label">{archiveMeta.title}</span>
                <h2 className="hero-archive-title">{archiveMeta.header}</h2>
                <p className="hero-archive-copy">{archiveMeta.description}</p>
              </div>

              <div className="hero-archive-list">
                {archiveItems.map((item) => (
                  <button
                    key={item.category}
                    onClick={() => onCategorySelect(item.category)}
                    className="hero-archive-item"
                  >
                    <div className="hero-archive-item-main">
                      <div className="hero-archive-item-head">
                        <span className="hero-archive-index">
                          {String(item.index + 1).padStart(2, '0')}
                        </span>
                        <span className="hero-archive-kicker">{item.kicker}</span>
                      </div>

                      <div className="hero-archive-item-title-row">
                        <strong className="hero-archive-item-title">{item.label}</strong>
                        <ArrowUpRight size={16} className="hero-archive-item-arrow" />
                      </div>

                      <p className="hero-archive-item-copy">{item.description}</p>

                      <div className="hero-archive-item-tags">
                        {item.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="hero-archive-item-stat">
                      <span className="hero-archive-item-count">
                        {String(item.count).padStart(2, '0')}
                      </span>
                      <span className="hero-archive-item-unit">{archiveMeta.unitLabel}</span>
                      <span className="hero-archive-item-note">{item.annotation}</span>
                    </div>
                  </button>
                ))}
              </div>

              <p className="hero-archive-footnote">{archiveMeta.footnote}</p>
            </section>

            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
              <div className="border border-[var(--line)] bg-[var(--surface)] p-4">
                <span className="system-label">{contactContent.baseLabel}</span>
                <div className="flex items-start gap-3">
                <MapPin className="mt-1 shrink-0" size={18} />
                <div>
                  <div className="font-display text-2xl font-extrabold uppercase leading-tight">
                    {contactContent.locationValue}
                  </div>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-[var(--muted)]">
                    {contactContent.tooltip}
                  </p>
                </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex min-h-[80px] items-center justify-center gap-3 border border-[var(--line)] bg-[var(--ink)] px-5 font-mono text-xs font-bold uppercase text-[var(--paper)] transition-colors hover:bg-[var(--accent)]"
              >
                {contactContent.contactLabel}
                <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <a
                href={resolveAsset('/resume.pdf')}
                download="体验设计师简历.pdf"
                className="inline-flex min-h-[54px] items-center justify-center border border-[var(--line)] bg-[var(--surface)] px-5 font-mono text-xs font-bold uppercase text-[var(--ink)] transition-colors hover:bg-[var(--surface-strong)]"
              >
                {contactContent.resumeLabel}
              </a>
              <div className="flex min-h-[54px] items-center justify-center border border-[var(--line)] bg-[var(--surface)] px-5 font-mono text-xs font-bold uppercase text-[var(--accent)]">
                Available / 2026
              </div>
            </div>
          </aside>
        </div>

        <div className="system-section-header border-b-0">
          <span>[ Selected Works ]</span>
          <strong>{content.selectedWorks}</strong>
        </div>
      </section>
    </div>
  );
};
