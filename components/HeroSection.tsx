import React from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { HOME_DATA } from '../src/data/home';
import { CONTACT_DATA } from '../src/data/contact';
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
  const featuredMedia = [
    '/sony-store-cover.png',
    '/golden-bay-dashboard-cover.jpg',
    '/p7-washer-minions.png',
  ];

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
                  {heroItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => item.category && onCategorySelect(item.category)}
                      className="group min-h-[132px] border border-[var(--paper)] bg-[var(--paper)] p-4 text-left text-[var(--ink)] transition-transform duration-300 hover:-translate-y-1 hover:bg-[var(--surface)]"
                    >
                      <span className="system-label text-[var(--muted)]">0{index + 1}</span>
                      <div className="font-display text-3xl font-extrabold uppercase leading-[0.9] text-[var(--ink)] md:text-4xl">
                        {item.text}
                      </div>
                      <p className="mt-4 font-mono text-[0.68rem] font-bold uppercase text-[var(--muted)]">
                        {item.annotation}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col bg-[var(--paper)] p-4 md:p-6 xl:border-l-2 xl:border-[var(--line)]">
            <div className="hero-media-grid">
              {featuredMedia.map((item, index) => (
                <img
                  key={item}
                  src={resolveAsset(item)}
                  alt={language === 'zh' ? `精选作品预览 ${index + 1}` : `Featured work preview ${index + 1}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>

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
