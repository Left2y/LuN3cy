import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { FileDown, Mail, MessageCircle, Phone, RotateCcw } from 'lucide-react';
import { CanvasBoard } from './components/CanvasBoard';
import { HeroSection } from './components/HeroSection';
import { MusicPlayer } from './components/MusicPlayer';
import { PortfolioSection } from './components/PortfolioSection';
import { Sidebar } from './components/Sidebar';
import { CONTACT_DATA } from './src/data/contact';
import { PORTFOLIO_PAGE_DATA } from './src/data/portfolioPage';
import { resolveAsset } from './src/utils/path';
import { AppTab, Category, Language } from './types';

interface ExplodedElementData {
  element: HTMLElement;
  originalStyle: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [language, setLanguage] = useState<Language>('zh');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [portfolioCategory, setPortfolioCategory] = useState<string>('All');
  const [gravityActive, setGravityActive] = useState(false);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);
  const lastStandardTabRef = useRef<AppTab>('dashboard');

  const engineRef = useRef<any>(null);
  const runnerRef = useRef<any>(null);
  const requestRef = useRef<number | null>(null);
  const explodedElementsRef = useRef<ExplodedElementData[]>([]);
  const dissipatedElementsRef = useRef<ExplodedElementData[]>([]);
  const scrollPositionRef = useRef<number>(0);

  const startViewTransition = (update: () => void) => {
    const anyDoc = document as any;
    if (anyDoc && typeof anyDoc.startViewTransition === 'function') {
      anyDoc.startViewTransition(update);
    } else {
      update();
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      return;
    }

    const hour = new Date().getHours();
    setTheme(hour >= 19 || hour < 6 ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  const commitTab = (tab: AppTab) => {
    if (tab !== 'canvas') {
      lastStandardTabRef.current = tab;
    }

    setActiveTab(tab);
  };

  const navigateToTab = (tab: AppTab, options?: { withTransition?: boolean }) => {
    const update = () => {
      commitTab(tab);
    };

    if (options?.withTransition === false) {
      update();
      return;
    }

    startViewTransition(update);
  };

  const openCanvas = () => {
    if (gravityActive) return;

    if (window.matchMedia('(max-width: 1023px)').matches) {
      setPortfolioCategory('All');
      navigateToTab('portfolio', { withTransition: false });
      return;
    }

    if (activeTab !== 'canvas') {
      lastStandardTabRef.current = activeTab;
    }

    setActiveTab('canvas');
  };

  const closeCanvas = () => {
    navigateToTab(lastStandardTabRef.current, { withTransition: false });
  };

  const handleHeroNavigation = (category: Category) => {
    startViewTransition(() => {
      setPortfolioCategory(category);
      commitTab('portfolio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleInteraction = (event: MouseEvent) => {
    if (!engineRef.current) return;
    const engine = engineRef.current;
    const mouseX = event.clientX + window.scrollX;
    const mouseY = event.clientY + window.scrollY;
    const bodies = Matter.Composite.allBodies(engine.world);

    bodies.forEach((body: any) => {
      if (body.isStatic) return;

      if (event.type === 'mousedown') {
        const bodyX = body.position.x;
        const bodyY = body.position.y;
        const distance = Math.sqrt(Math.pow(mouseX - bodyX, 2) + Math.pow(mouseY - bodyY, 2));

        if (distance < 500) {
          const forceMagnitude = 0.8 * (1 - distance / 500);
          const angle = Math.atan2(bodyY - mouseY, bodyX - mouseX);

          Matter.Body.applyForce(body, body.position, {
            x: Math.cos(angle) * forceMagnitude,
            y: Math.sin(angle) * forceMagnitude,
          });
        }
      }
    });
  };

  const triggerGravity = () => {
    if (gravityActive || !Matter || activeTab === 'canvas') return;

    scrollPositionRef.current = window.scrollY;
    document.body.style.height = `${document.documentElement.scrollHeight}px`;
    document.body.style.overflow = 'hidden';
    setGravityActive(true);

    const Engine = Matter.Engine;
    const Runner = Matter.Runner;
    const Bodies = Matter.Bodies;
    const Composite = Matter.Composite;

    const engine = Engine.create({
      positionIterations: 12,
      velocityIterations: 8,
      constraintIterations: 4,
    });

    engineRef.current = engine;

    const largeComponents = Array.from(
      document.querySelectorAll('main img, .aspect-\\[4\\/3\\], .aspect-\\[16\\/10\\]')
    ) as HTMLElement[];

    const dissipatedData: ExplodedElementData[] = [];

    largeComponents.forEach((element) => {
      dissipatedData.push({
        element,
        originalStyle: element.getAttribute('style') || '',
      });

      element.style.transition = 'all 0.5s ease-out';
      element.style.transform = 'scale(0.8)';
      element.style.opacity = '0';
      element.style.pointerEvents = 'none';
    });

    dissipatedElementsRef.current = dissipatedData;

    const selector = `
      nav button, nav span, nav div,
      footer p, footer a, footer span,
      main h1, main h2, main h3, main h4, main p, main span,
      main svg, main button, main a, main li,
      .system-chip, .system-label,
      div[class*="border-b"], div[class*="border-t"]
    `;

    const candidates = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    const visibleCandidates = candidates.filter((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.width < 5 || rect.height < 5) return false;
      if (window.getComputedStyle(element).display === 'none') return false;
      if (window.getComputedStyle(element).opacity === '0') return false;
      if (largeComponents.includes(element)) return false;
      return true;
    });

    const validElements = visibleCandidates.filter((element) => {
      return !visibleCandidates.some((parent) => parent !== element && parent.contains(element));
    });

    const bodies: any[] = [];
    const explodedData: ExplodedElementData[] = [];

    validElements.forEach((element) => {
      explodedData.push({
        element,
        originalStyle: element.getAttribute('style') || '',
      });

      const rect = element.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const centerX = rect.left + rect.width / 2 + scrollX;
      const centerY = rect.top + rect.height / 2 + scrollY;

      const body = Bodies.rectangle(centerX, centerY, rect.width, rect.height, {
        restitution: 0.2,
        friction: 0.5,
        frictionAir: 0.05,
        density: 0.002,
        chamfer: { radius: Math.min(rect.width, rect.height) * 0.1 },
        angle: (Math.random() - 0.5) * 0.05,
      });

      (body as any).domElement = element;
      bodies.push(body);

      element.style.boxSizing = 'border-box';
      element.style.position = 'absolute';
      element.style.left = `${rect.left + scrollX}px`;
      element.style.top = `${rect.top + scrollY}px`;
      element.style.width = `${rect.width}px`;
      element.style.height = `${rect.height}px`;
      element.style.margin = '0';
      element.style.transform = 'translate(0, 0) rotate(0deg)';
      element.style.zIndex = '1000';
      element.style.pointerEvents = 'none';
      element.style.transition = 'none';
    });

    explodedElementsRef.current = explodedData;

    const totalHeight = document.documentElement.scrollHeight;
    const floor = Bodies.rectangle(window.innerWidth / 2, totalHeight + 500, window.innerWidth, 1000, {
      isStatic: true,
      render: { visible: false },
    });
    const wallLeft = Bodies.rectangle(-500, totalHeight / 2, 1000, totalHeight * 2, {
      isStatic: true,
      render: { visible: false },
    });
    const wallRight = Bodies.rectangle(window.innerWidth + 500, totalHeight / 2, 1000, totalHeight * 2, {
      isStatic: true,
      render: { visible: false },
    });

    Composite.add(engine.world, [floor, wallLeft, wallRight, ...bodies]);

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    const update = () => {
      if (!engineRef.current) return;

      bodies.forEach((body) => {
        const element = (body as any).domElement;
        if (!element) return;

        const { x, y } = body.position;
        const angle = body.angle;
        const initialLeft = parseFloat(element.style.left);
        const initialTop = parseFloat(element.style.top);
        const width = parseFloat(element.style.width);
        const height = parseFloat(element.style.height);
        const initialCenterX = initialLeft + width / 2;
        const initialCenterY = initialTop + height / 2;
        const dx = x - initialCenterX;
        const dy = y - initialCenterY;

        element.style.transform = `translate(${dx}px, ${dy}px) rotate(${angle}rad)`;
      });

      requestRef.current = requestAnimationFrame(update);
    };

    update();

    setTimeout(() => {
      window.addEventListener('mousedown', handleInteraction);
    }, 50);
  };

  const resetGravity = () => {
    window.removeEventListener('mousedown', handleInteraction);

    if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
    if (engineRef.current) {
      Matter.World.clear(engineRef.current.world, false);
      Matter.Engine.clear(engineRef.current);
    }
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    engineRef.current = null;
    runnerRef.current = null;

    explodedElementsRef.current.forEach(({ element }) => {
      void element.offsetWidth;
      element.style.transition = 'transform 1s cubic-bezier(0.19, 1, 0.22, 1)';
      element.style.transform = 'translate(0, 0) rotate(0deg)';
    });

    dissipatedElementsRef.current.forEach(({ element }) => {
      element.style.transition = 'all 1s ease';
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
    });

    setTimeout(() => {
      explodedElementsRef.current.forEach(({ element, originalStyle }) => {
        element.setAttribute('style', originalStyle);
      });
      dissipatedElementsRef.current.forEach(({ element, originalStyle }) => {
        element.setAttribute('style', originalStyle);
      });

      explodedElementsRef.current = [];
      dissipatedElementsRef.current = [];
      document.body.style.height = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollPositionRef.current);
      setGravityActive(false);
    }, 1000);
  };

  const content = CONTACT_DATA[language];

  const renderContactPage = () => {
    const cards = [
      {
        label: language === 'zh' ? '邮箱' : 'Email',
        value: content.email,
        href: `mailto:${content.email}`,
        icon: <Mail size={22} />,
        accent: 'text-[var(--accent)]',
      },
      {
        label: language === 'zh' ? '电话' : 'Phone',
        value: '18613079615',
        href: 'tel:18613079615',
        icon: <Phone size={22} />,
        accent: '',
      },
      {
        label: language === 'zh' ? '微信' : 'WeChat',
        value: 'ysf1028',
        href: '',
        icon: <MessageCircle size={22} />,
        accent: '',
      },
    ];

    const copyValue = async (label: string, value: string) => {
      try {
        await navigator.clipboard.writeText(value);
        setCopiedContact(label);
        window.setTimeout(() => setCopiedContact(null), 1600);
      } catch {
        setCopiedContact(null);
      }
    };

    return (
      <div className="mx-auto w-full max-w-[1600px] px-0">
        <section className="system-panel overflow-hidden">
          <div className="grid border-b-2 border-[var(--line)] lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="system-grid-signal bg-[var(--accent)] px-5 py-10 text-[var(--paper)] md:px-10 md:py-14">
              <span className="system-chip border-[var(--paper)] bg-transparent text-[var(--paper)]">
                COMMS / OPEN CHANNEL
              </span>
              <h1 className="system-display-shadow mt-5 font-display text-[clamp(4rem,13vw,10rem)] font-extrabold uppercase leading-[0.82] text-[var(--paper)]">
                {content.hello}
              </h1>
              <p className="mt-6 max-w-3xl text-lg font-semibold leading-relaxed text-[var(--paper)]/92 md:text-2xl">
                {content.intro}
              </p>
            </div>

            <div className="border-t-2 border-[var(--line)] bg-[var(--paper)] p-5 lg:border-l-2 lg:border-t-0 md:p-6">
              <span className="system-label">Base</span>
              <div className="font-display text-3xl font-extrabold uppercase leading-tight text-[var(--ink)]">
                {content.locationValue}
              </div>
              <p className="mt-4 text-sm font-medium leading-relaxed text-[var(--muted)]">
                {content.tooltip}
              </p>
              <a
                href={resolveAsset('/resume.pdf')}
                download="体验设计师简历.pdf"
                className="mt-6 flex min-h-[56px] items-center justify-center border border-[var(--line)] bg-[var(--ink)] px-4 font-mono text-xs font-bold uppercase text-[var(--paper)] transition-colors hover:bg-[var(--accent)]"
              >
                <FileDown size={16} className="mr-2" />
                {content.resumeLabel}
              </a>
            </div>
          </div>

          <div className="system-section-header">
            <span>[ Comm Lines ]</span>
            <strong>{language === 'zh' ? '直接联系' : 'Direct Lines'}</strong>
          </div>

          <div className="grid gap-px bg-[var(--line)] md:grid-cols-3">
            {cards.map((card) => (
              <article key={card.label} className="bg-[var(--paper)] p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="system-label">{card.label}</span>
                    <div className={`flex items-center gap-3 font-display text-2xl font-extrabold ${card.accent}`}>
                      {card.icon}
                      <span className="break-all">{card.value}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyValue(card.label, card.value)}
                    aria-label={`${language === 'zh' ? '复制' : 'Copy'} ${card.label}`}
                    className="shrink-0 border border-[var(--line)] bg-[var(--surface)] px-3 py-2 font-mono text-[0.68rem] font-bold uppercase text-[var(--ink)] transition-colors hover:bg-[var(--surface-strong)]"
                  >
                    {copiedContact === card.label ? (language === 'zh' ? '已复制' : 'Copied') : (language === 'zh' ? '复制' : 'Copy')}
                  </button>
                </div>
                {card.href && (
                  <a
                    href={card.href}
                    className="mt-5 inline-flex min-h-[46px] items-center justify-center border border-[var(--line)] bg-[var(--ink)] px-4 font-mono text-xs font-bold uppercase text-[var(--paper)] transition-colors hover:bg-[var(--accent)]"
                  >
                    {language === 'zh' ? '立即打开' : 'Open'}
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <HeroSection
              onNavigate={(tab) => navigateToTab(tab as AppTab)}
              onCategorySelect={handleHeroNavigation}
              language={language}
            />
            <PortfolioSection language={language} externalFilter={portfolioCategory} />
          </>
        );
      case 'portfolio':
        return (
          <div className="mx-auto w-full max-w-[1600px]">
            <section className="system-panel overflow-hidden">
              <div className="grid border-b-2 border-[var(--line)] lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="system-grid-signal bg-[var(--accent)] px-5 py-10 text-[var(--paper)] md:px-10 md:py-14">
                  <span className="system-chip border-[var(--paper)] bg-transparent text-[var(--paper)]">
                    PORTFOLIO / ACTIVE INDEX
                  </span>
                  <h1 className="system-display-shadow mt-5 font-display text-[clamp(4rem,13vw,10rem)] font-extrabold uppercase leading-[0.82] text-[var(--paper)]">
                    {PORTFOLIO_PAGE_DATA[language].title}
                  </h1>
                  <p className="mt-6 max-w-3xl text-lg font-semibold leading-relaxed text-[var(--paper)]/92 md:text-2xl">
                    {PORTFOLIO_PAGE_DATA[language].description}
                  </p>
                </div>

                <div className="border-t-2 border-[var(--line)] bg-[var(--paper)] p-5 lg:border-l-2 lg:border-t-0 md:p-6">
                  <span className="system-label">Directory Notes</span>
                  <p className="text-base font-semibold leading-relaxed text-[var(--ink)]">
                    {language === 'zh'
                      ? '优先看作品本身，再进入案例、影像或外部 Demo。'
                      : 'Start with the work, then open cases, frames, or external demos.'}
                  </p>
                </div>
              </div>
            </section>

            <PortfolioSection language={language} externalFilter={portfolioCategory} />
          </div>
        );
      case 'contact':
        return renderContactPage();
      case 'canvas':
        return <CanvasBoard language={language} onExit={closeCanvas} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden text-[var(--ink)]">
      <MusicPlayer />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={navigateToTab}
        language={language}
        toggleLanguage={toggleLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenCanvas={openCanvas}
        canvasActive={activeTab === 'canvas'}
        onTriggerGravity={triggerGravity}
        gravityActive={gravityActive}
      />

      <main className={`vt-page w-full px-3 pt-24 md:px-6 md:pt-28 ${activeTab === 'canvas' ? 'pb-8' : 'pb-20'}`}>
        <div key={activeTab} className={activeTab === 'canvas' ? '' : 'space-y-8'}>
          {renderContent()}
        </div>

        {activeTab !== 'canvas' && (
          <footer className="mx-auto mt-8 w-full max-w-[1600px]">
            <section className="system-panel overflow-hidden">
              <div className="grid gap-px bg-[var(--line)] md:grid-cols-[1fr_1fr_2fr]">
                <div className="bg-[var(--paper)] p-5">
                  <span className="system-label">Directories</span>
                  <p className="font-mono text-xs font-bold uppercase text-[var(--ink)]">
                    Home / Portfolio / Contact / Map
                  </p>
                </div>
                <div className="bg-[var(--paper)] p-5">
                  <span className="system-label">Status</span>
                  <p className="font-mono text-xs font-bold uppercase text-[var(--accent)]">
                    Studio Index Live
                  </p>
                </div>
                <div className="bg-[var(--paper)] p-5">
                  <span className="system-label">System Log</span>
                  <p className="text-sm font-semibold leading-relaxed text-[var(--muted)]">
                    © 2026 LEFT2Y // {content.footerDesign}
                  </p>
                </div>
              </div>
            </section>
          </footer>
        )}
      </main>

      {gravityActive && (
        <div className="pointer-events-none fixed bottom-6 left-0 z-[1001] flex w-full justify-center px-4">
          <button
            onClick={resetGravity}
            className="pointer-events-auto system-panel flex min-h-[56px] items-center gap-3 bg-[var(--ink)] px-6 font-mono text-sm font-bold uppercase text-[var(--paper)]"
          >
            <RotateCcw size={18} />
            {language === 'zh' ? '恢复秩序' : 'Restore Order'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
