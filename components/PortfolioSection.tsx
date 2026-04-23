import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Github,
  IdCard,
  MessageCircle,
  Mic,
  Smile,
  Terminal,
  X,
  Zap,
} from 'lucide-react';
import { CATEGORY_LABELS, PROJECTS } from '../constants';
import { Category, Language, Project } from '../types';
import { PHOTOGRAPHY_GALLERY } from '../src/data/photography';
import { resolveAsset } from '../src/utils/path';

interface PortfolioSectionProps {
  language: Language;
  externalFilter?: string;
}

const STATUS_BY_CATEGORY: Record<string, string> = {
  [Category.DESIGN]: 'DEPLOYED',
  [Category.PHOTO]: 'ARCHIVED',
  [Category.DEV]: 'PROTOTYPE',
  [Category.VIDEO]: 'SCREENING',
};

const getProjectIcon = (project: Project) => {
  switch (project.icon) {
    case 'message-circle':
      return <MessageCircle size={44} />;
    case 'id-card':
      return <IdCard size={44} />;
    case 'file-text':
      return <FileText size={44} />;
    case 'smile':
      return <Smile size={44} />;
    case 'zap':
      return <Zap size={44} />;
    case 'mic':
      return <Mic size={44} />;
    default:
      return <Terminal size={44} />;
  }
};

const getFigmaEmbedUrl = (figmaUrl?: string) => {
  if (!figmaUrl) return null;

  try {
    const url = new URL(figmaUrl);
    if (!url.hostname.endsWith('figma.com')) return null;

    const segments = url.pathname.split('/').filter(Boolean);
    if (segments.length < 2) return null;

    const fileType = segments[0] === 'file' ? 'design' : segments[0];
    const fileKey = segments[1];

    url.hostname = 'embed.figma.com';
    url.pathname = `/${fileType}/${fileKey}`;
    const params = new URLSearchParams(url.search);
    params.delete('t');
    params.delete('embed_host');
    params.delete('embed_origin');
    params.set('embed-host', 'left2y-portfolio');
    params.set('theme', 'system');
    params.set('footer', 'false');
    params.set('page-selector', 'false');
    url.search = params.toString();

    return url.toString();
  } catch {
    return null;
  }
};

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ language, externalFilter }) => {
  const [filter, setFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [displayProject, setDisplayProject] = useState<Project | null>(null);
  const [isModalRendered, setIsModalRendered] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [figmaPreviewActive, setFigmaPreviewActive] = useState(false);

  useEffect(() => {
    if (externalFilter) {
      setFilter(externalFilter);
    }
  }, [externalFilter]);

  useEffect(() => {
    if (selectedProject) {
      setDisplayProject(selectedProject);
      setIsModalRendered(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      const timer = setTimeout(() => {
        setIsModalRendered(false);
        setDisplayProject(null);
        setLightboxIndex(null);
        setFigmaPreviewActive(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedProject]);

  useEffect(() => {
    setFigmaPreviewActive(false);
  }, [displayProject?.id]);

  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  const currentProjects = PROJECTS[language];
  const availableCategories = Array.from(new Set(currentProjects.map((project) => project.category)));
  if (!availableCategories.includes(Category.DEV)) availableCategories.push(Category.DEV);

  const categories = ['All', ...availableCategories];
  const categoryCounts = useMemo(() => {
    return categories.reduce<Record<string, number>>((acc, category) => {
      acc[category] = category === 'All'
        ? currentProjects.length
        : currentProjects.filter((project) => project.category === category).length;
      return acc;
    }, {});
  }, [categories.join('|'), currentProjects]);
  const filteredProjects =
    filter === 'All' ? currentProjects : currentProjects.filter((project) => project.category === filter);
  const selectedProjectIndex = displayProject
    ? filteredProjects.findIndex((project) => project.id === displayProject.id)
    : -1;

  const currentGallery = displayProject
    ? displayProject.gallery || PHOTOGRAPHY_GALLERY[displayProject.id] || []
    : [];
  const figmaEmbedUrl = getFigmaEmbedUrl(displayProject?.figmaUrl);

  const handlePrev = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    if (lightboxIndex === null || currentGallery.length === 0) return;
    setLightboxIndex((prev) => ((prev || 0) - 1 + currentGallery.length) % currentGallery.length);
  };

  const handleNext = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    if (lightboxIndex === null || currentGallery.length === 0) return;
    setLightboxIndex((prev) => ((prev || 0) + 1) % currentGallery.length);
  };

  const handleProjectStep = (direction: -1 | 1) => {
    if (!displayProject || filteredProjects.length < 2 || selectedProjectIndex < 0) return;
    const nextIndex = (selectedProjectIndex + direction + filteredProjects.length) % filteredProjects.length;
    setSelectedProject(filteredProjects[nextIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (event.key === 'ArrowLeft') handlePrev();
      if (event.key === 'ArrowRight') handleNext();
      if (event.key === 'Escape') setLightboxIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, currentGallery.length]);

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) handleNext();
    if (distance < -50) handlePrev();
    setTouchStart(null);
    setTouchEnd(null);
  };

  const getCardMeta = (project: Project) => {
    if (project.category === Category.DEV) {
      return [
        { label: 'STACK', value: project.subtitle || project.tags[0] || 'React' },
        { label: 'ROLE', value: project.role || 'Builder' },
      ];
    }

    if (project.category === Category.PHOTO) {
      const gallery = project.gallery || PHOTOGRAPHY_GALLERY[project.id] || [];
      return [
        { label: 'TYPE', value: 'Photography' },
        { label: 'FRAME', value: gallery.length > 0 ? `${gallery.length} Shots` : 'Archive' },
      ];
    }

    return [
      { label: 'ROLE', value: project.role || 'Designer' },
      { label: 'FORMAT', value: project.subtitle || project.tags[0] || 'Case Study' },
    ];
  };

  const getLinkItems = (project: Project) => {
    return [
      project.githubUrl && { label: 'GitHub', href: project.githubUrl },
      project.websiteUrl && { label: 'Demo', href: project.websiteUrl },
      project.figmaUrl && { label: 'Figma', href: project.figmaUrl },
      project.externalLink && { label: 'External', href: project.externalLink },
    ].filter(Boolean) as { label: string; href: string }[];
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] pb-8">
      <section className="system-panel overflow-hidden">
        <div className="system-section-header">
          <span>[ Work Index ]</span>
          <strong>
            {filteredProjects.length} {language === 'zh' ? '项目' : 'Entries'}
          </strong>
        </div>

        <div className="portfolio-filter-bar no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`portfolio-filter-button ${filter === category ? 'is-active' : ''}`}
              aria-pressed={filter === category}
            >
              {CATEGORY_LABELS[language][category] || category}
              <span className="ml-2 text-[0.68rem] opacity-70">{categoryCounts[category] || 0}</span>
            </button>
          ))}
        </div>

        <div className="project-grid">
          {filteredProjects.map((project, index) => {
            const isDev = project.category === Category.DEV;
            const cardMeta = getCardMeta(project);
            const gallery = project.gallery || PHOTOGRAPHY_GALLERY[project.id] || [];
            const statusLabel = STATUS_BY_CATEGORY[project.category] || 'ACTIVE';

            return (
              <article
                key={project.id}
                className={`system-card group flex min-h-full cursor-pointer flex-col focus-within:outline focus-within:outline-2 focus-within:outline-offset-[-4px] focus-within:outline-[var(--accent)] ${
                  isDev ? 'bg-[var(--ink)] text-[var(--paper)]' : 'bg-[var(--paper)] text-[var(--ink)]'
                }`}
                onClick={() => setSelectedProject(project)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedProject(project);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div
                  className={`flex items-center justify-between border-b border-[var(--line)] px-3 py-2 font-mono text-[11px] font-bold uppercase ${
                    isDev ? 'bg-[var(--ink)] text-[var(--paper)]' : 'bg-[var(--surface)]'
                  }`}
                >
                  <span>{`MOD-${String(index + 1).padStart(3, '0')}`}</span>
                  <span className={isDev ? 'text-[var(--accent-quiet)]' : 'text-[var(--accent)]'}>{statusLabel}</span>
                </div>

                <div
                  className={`relative overflow-hidden border-b border-[var(--line)] ${
                    isDev ? 'bg-[var(--surface-strong)]' : 'bg-[var(--surface-strong)]'
                  } aspect-[16/10]`}
                >
                  {project.image ? (
                    <img
                      src={resolveAsset(project.image)}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="system-card-image h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[var(--paper)]">
                      <div className="flex h-20 w-20 items-center justify-center border border-current bg-[var(--accent)] text-[var(--paper)]">
                        {getProjectIcon(project)}
                      </div>
                    </div>
                  )}

                  {project.category === Category.PHOTO && gallery.length > 0 && (
                    <div className="absolute bottom-3 left-3 border border-[var(--line)] bg-[var(--paper)] px-2 py-1 font-mono text-[10px] font-bold uppercase text-[var(--ink)]">
                      {gallery.length} Frames
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="border border-[var(--line)] bg-[var(--paper)] px-3 py-2 font-mono text-xs font-bold uppercase text-[var(--accent)]">
                      {language === 'zh' ? '查看' : 'Open'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <span className={`system-label ${isDev ? 'text-[var(--muted)]' : ''}`}>
                    {CATEGORY_LABELS[language][project.category] || project.category}
                  </span>

                  <h3 className="font-display text-3xl font-extrabold uppercase leading-[0.92] md:text-4xl">
                    {project.title}
                  </h3>

                  <p className={`mt-3 line-clamp-4 text-sm font-semibold leading-6 ${isDev ? 'text-[var(--muted)]' : 'text-[var(--muted)]'}`}>
                    {project.description}
                  </p>

                  {project.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className={`border px-2 py-1 font-mono text-[10px] font-bold uppercase ${
                            isDev
                              ? 'border-[var(--muted)] text-[var(--paper)]'
                              : 'border-[var(--line)] text-[var(--ink)]'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div
                    className={`mt-auto grid grid-cols-2 gap-px border border-[var(--line)] ${
                      isDev ? 'bg-[var(--muted)]' : 'bg-[var(--line)]'
                    }`}
                  >
                    {cardMeta.map((item) => (
                      <div key={item.label} className={isDev ? 'bg-[var(--ink)] p-3' : 'bg-[var(--paper)] p-3'}>
                        <span className={`block font-mono text-[10px] font-bold uppercase ${isDev ? 'text-[var(--muted)]' : 'text-[var(--muted)]'}`}>
                          {item.label}
                        </span>
                        <span className="mt-2 block text-sm font-bold uppercase leading-tight">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {isModalRendered &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-8" role="presentation">
            {lightboxIndex !== null && (
              <div
                className="fixed inset-0 z-[200] flex items-center justify-center bg-[color-mix(in_oklch,var(--ink)_92%,transparent)] p-4 md:p-10"
                onClick={() => setLightboxIndex(null)}
                onTouchStart={(event) => {
                  setTouchEnd(null);
                  setTouchStart(event.targetTouches[0].clientX);
                }}
                onTouchMove={(event) => setTouchEnd(event.targetTouches[0].clientX)}
                onTouchEnd={onTouchEnd}
              >
                <div className="relative flex h-full w-full max-w-6xl items-center justify-center" onClick={(event) => event.stopPropagation()}>
                  <img
                    src={resolveAsset(currentGallery[lightboxIndex])}
                    alt="Full View"
                    className="max-h-full max-w-full border-2 border-[var(--paper)] object-contain"
                    referrerPolicy="no-referrer"
                    draggable={false}
                  />

                  <button
                    className="absolute right-0 top-0 border border-[var(--paper)] bg-[var(--ink)] px-3 py-2 font-mono text-xs font-bold uppercase text-[var(--paper)] transition-colors hover:bg-[var(--accent)]"
                    onClick={() => setLightboxIndex(null)}
                    aria-label={language === 'zh' ? '关闭大图' : 'Close image'}
                  >
                    <X size={18} />
                  </button>

                  {currentGallery.length > 1 && (
                    <>
                      <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 border border-[var(--paper)] bg-[var(--ink)] p-3 text-[var(--paper)] transition-colors hover:bg-[var(--accent)] md:left-4"
                        onClick={handlePrev}
                        aria-label={language === 'zh' ? '上一张' : 'Previous image'}
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 border border-[var(--paper)] bg-[var(--ink)] p-3 text-[var(--paper)] transition-colors hover:bg-[var(--accent)] md:right-4"
                        onClick={handleNext}
                        aria-label={language === 'zh' ? '下一张' : 'Next image'}
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 border border-[var(--paper)] bg-[var(--ink)] px-3 py-1 font-mono text-xs font-bold uppercase text-[var(--paper)]">
                    {lightboxIndex + 1} / {currentGallery.length}
                  </div>
                </div>
              </div>
            )}

            <div className="backdrop-soft absolute inset-0" onClick={() => setSelectedProject(null)} />

            <div
              className="dialog-panel system-panel relative z-10 flex max-h-[91vh] w-full max-w-6xl flex-col overflow-y-auto bg-[var(--paper)]"
              role="dialog"
              aria-modal="true"
              aria-label={displayProject?.title || 'Project detail'}
            >
              {displayProject && (
                <>
                  <div className="flex flex-wrap items-stretch border-b-2 border-[var(--line)]">
                    <div className="system-module system-brand">
                      {CATEGORY_LABELS[language][displayProject.category] || displayProject.category}
                    </div>
                    <div className="system-module hidden md:flex">{displayProject.subtitle || 'CASE FILE'}</div>
                    {filteredProjects.length > 1 && (
                      <div className="ml-auto flex">
                        <button className="system-button" onClick={() => handleProjectStep(-1)}>
                          <ChevronLeft size={16} />
                          <span className="hidden sm:inline">{language === 'zh' ? '上一个' : 'Prev'}</span>
                        </button>
                        <button className="system-button" onClick={() => handleProjectStep(1)}>
                          <span className="hidden sm:inline">{language === 'zh' ? '下一个' : 'Next'}</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                    <button className={`${filteredProjects.length > 1 ? '' : 'ml-auto'} system-button system-button-accent`} onClick={() => setSelectedProject(null)}>
                      <X size={16} />
                      <span>{language === 'zh' ? '关闭' : 'Close'}</span>
                    </button>
                  </div>

                  {displayProject.category === Category.PHOTO ? (
                    <>
                      <div className="system-grid-signal border-b-2 border-[var(--line)] bg-[var(--accent)] px-5 py-8 text-[var(--paper)] md:px-8 md:py-10">
                        <span className="system-chip border-[var(--paper)] bg-transparent text-[var(--paper)]">
                          Photography Archive
                        </span>
                        <h2 className="system-display-shadow mt-4 font-display text-[clamp(3rem,10vw,7rem)] font-extrabold uppercase leading-[0.9] text-[var(--paper)]">
                          {displayProject.title}
                        </h2>
                        <p className="mt-4 max-w-3xl text-base font-semibold leading-relaxed text-[var(--paper)]/92 md:text-xl">
                          {displayProject.description}
                        </p>
                      </div>

                      <div className="p-4 md:p-6">
                        {currentGallery.length > 0 ? (
                          <div className="grid gap-px bg-[var(--line)] sm:grid-cols-2 xl:grid-cols-4">
                            {currentGallery.map((item, idx) => (
                              <button
                                key={idx}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setLightboxIndex(idx);
                                }}
                                className="group relative aspect-square overflow-hidden bg-[var(--paper)]"
                              >
                                <img
                                  src={resolveAsset(item)}
                                  alt={`${displayProject.title} ${idx + 1}`}
                                  loading="lazy"
                                  decoding="async"
                                  referrerPolicy="no-referrer"
                                  className="system-card-image h-full w-full object-cover"
                                />
                                <div className="absolute bottom-3 left-3 border border-[var(--line)] bg-[var(--paper)] px-2 py-1 font-mono text-[10px] font-bold uppercase text-[var(--ink)]">
                                  Frame {String(idx + 1).padStart(2, '0')}
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="border border-[var(--line)] bg-[var(--surface)] p-8 font-mono text-xs font-bold uppercase text-[var(--muted)]">
                            No local archive frames detected.
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className={`w-full border-b-2 border-[var(--line)] bg-[var(--surface-strong)] ${
                          displayProject.websiteUrl
                            ? 'h-[60vh] md:h-[78vh]'
                            : displayProject.videoUrl || displayProject.bilibiliId
                              ? 'aspect-video'
                              : 'h-[32vh] md:h-[52vh]'
                        }`}
                      >
                        {displayProject.videoUrl ? (
                          <video
                            src={displayProject.videoUrl}
                            controls
                            className="h-full w-full object-contain bg-[var(--ink)]"
                            poster={resolveAsset(displayProject.image)}
                          />
                        ) : displayProject.bilibiliId ? (
                          <iframe
                            src={`https://player.bilibili.com/player.html?bvid=${displayProject.bilibiliId}&page=1&high_quality=1&danmaku=0&autoplay=0`}
                            className="h-full w-full"
                            scrolling="no"
                            frameBorder="0"
                            allowFullScreen
                            sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts allow-presentation"
                          />
                        ) : displayProject.websiteUrl ? (
                          <iframe
                            src={displayProject.websiteUrl}
                            className="h-full w-full border-none bg-[var(--surface)]"
                            title={displayProject.title}
                            allowFullScreen
                          />
                        ) : displayProject.image ? (
                          <img
                            src={resolveAsset(displayProject.image)}
                            alt={displayProject.title}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-[var(--ink)] text-[var(--paper)]">
                            <div className="text-center">
                              <div className="font-display text-6xl uppercase leading-none">{displayProject.title}</div>
                              <div className="mt-3 font-mono text-xs font-bold uppercase text-[var(--accent-quiet)]">
                                Preview Pending
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-5 md:p-8">
                        <span className="system-chip">{displayProject.subtitle || 'Case File'}</span>
                        <h2 className="mt-4 font-display text-[clamp(3rem,8vw,6rem)] font-extrabold uppercase leading-[0.9] text-[var(--ink)]">
                          {displayProject.title}
                        </h2>
                        <p className="mt-4 max-w-4xl text-lg font-semibold leading-relaxed text-[var(--muted)] md:text-2xl">
                          {displayProject.description}
                        </p>

                        {figmaEmbedUrl && (
                          <section className="mt-6 overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3">
                              <div>
                                <div className="font-mono text-xs font-bold uppercase">
                                  {language === 'zh' ? 'Figma 快速预览' : 'Figma Quick Preview'}
                                </div>
                                <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--muted)]">
                                  {language === 'zh'
                                    ? '按需加载新版 Embed Kit 预览，避免打开详情时拖慢页面。'
                                    : 'Load the Embed Kit preview only when needed.'}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => setFigmaPreviewActive((prev) => !prev)}
                                  className="inline-flex min-h-[44px] items-center border border-[var(--line)] bg-[var(--ink)] px-4 font-mono text-xs font-bold uppercase text-[var(--paper)] transition-colors hover:bg-[var(--accent)]"
                                >
                                  {figmaPreviewActive
                                    ? language === 'zh' ? '收起预览' : 'Hide Preview'
                                    : language === 'zh' ? '加载预览' : 'Load Preview'}
                                </button>
                                <a
                                  href={displayProject.figmaUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex min-h-[44px] items-center gap-2 border border-[var(--line)] bg-[var(--paper)] px-4 font-mono text-xs font-bold uppercase text-[var(--ink)] transition-colors hover:bg-[var(--surface-strong)]"
                                >
                                  <ExternalLink size={14} />
                                  Figma
                                </a>
                              </div>
                            </div>

                            {figmaPreviewActive && (
                              <iframe
                                src={figmaEmbedUrl}
                                title={`${displayProject.title} Figma preview`}
                                className="h-[58vh] min-h-[420px] w-full border-0 bg-[var(--surface)]"
                                allowFullScreen
                                loading="lazy"
                              />
                            )}
                          </section>
                        )}

                        <div className="mt-8 grid gap-5 lg:grid-cols-2">
                          {displayProject.concept && (
                            <section className="border border-[var(--line)] bg-[var(--surface)]">
                              <div className="border-b border-[var(--line)] px-4 py-3 font-mono text-xs font-bold uppercase">
                                {language === 'zh' ? 'Concept / 设计意图' : 'Concept / Statement'}
                              </div>
                              <div className="p-4">
                                <p className="text-base font-medium leading-relaxed text-[var(--ink)] md:text-lg">
                                  {displayProject.concept}
                                </p>
                              </div>
                            </section>
                          )}

                          <section className="border border-[var(--line)] bg-[var(--surface)]">
                            <div className="border-b border-[var(--line)] px-4 py-3 font-mono text-xs font-bold uppercase">
                              {language === 'zh' ? 'Role / 分工职责' : 'Role / Responsibility'}
                            </div>
                            <div className="p-4">
                              <div className="text-xl font-black uppercase">{displayProject.role}</div>
                              {displayProject.roleDetail && (
                                <p className="mt-3 text-base font-medium leading-relaxed text-[var(--muted)]">
                                  {displayProject.roleDetail}
                                </p>
                              )}
                            </div>
                          </section>

                          {displayProject.awards && displayProject.awards.length > 0 && (
                            <section className="border border-[var(--line)] bg-[var(--surface)]">
                              <div className="border-b border-[var(--line)] px-4 py-3 font-mono text-xs font-bold uppercase">
                                {language === 'zh' ? 'Awards / 获奖情况' : 'Awards / Recognition'}
                              </div>
                              <div className="space-y-3 p-4">
                                {displayProject.awards.map((award) => (
                                  <div key={award} className="border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-sm font-bold uppercase">
                                    {award}
                                  </div>
                                ))}
                              </div>
                            </section>
                          )}

                          <section className="border border-[var(--line)] bg-[var(--surface)]">
                            <div className="border-b border-[var(--line)] px-4 py-3 font-mono text-xs font-bold uppercase">
                              Tags / Metadata
                            </div>
                            <div className="flex flex-wrap gap-2 p-4">
                              {displayProject.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="border border-[var(--line)] px-3 py-1.5 font-mono text-[10px] font-bold uppercase"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </section>
                        </div>

                        {getLinkItems(displayProject).length > 0 && (
                          <section className="mt-5 border border-[var(--line)] bg-[var(--surface)]">
                            <div className="border-b border-[var(--line)] px-4 py-3 font-mono text-xs font-bold uppercase">
                              {language === 'zh' ? 'Links / 相关入口' : 'Links / Access Points'}
                            </div>
                            <div className="flex flex-wrap gap-3 p-4">
                              {getLinkItems(displayProject).map((item) => (
                                <a
                                  key={item.label}
                                  href={item.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex min-h-[48px] items-center gap-2 border border-[var(--line)] bg-[var(--ink)] px-4 font-mono text-xs font-bold uppercase text-[var(--paper)] transition-colors hover:bg-[var(--accent)]"
                                >
                                  {item.label === 'GitHub' ? <Github size={16} /> : <ExternalLink size={16} />}
                                  <span>{item.label}</span>
                                </a>
                              ))}
                            </div>
                          </section>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
