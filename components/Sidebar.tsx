import React from 'react';
import { NAV_ITEMS } from '../src/data/navigation';
import { Language } from '../types';
import { Bomb, Globe, Moon, Sun } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  toggleLanguage: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onTriggerGravity: () => void;
  gravityActive?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  language,
  toggleLanguage,
  theme,
  toggleTheme,
  onTriggerGravity,
  gravityActive = false,
}) => {
  const items = NAV_ITEMS[language];

  return (
    <div className="fixed inset-x-0 top-3 z-50 px-3 md:top-4 md:px-6">
      <nav className="system-panel mx-auto w-full max-w-[1600px] overflow-hidden">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-stretch">
          <button
            className="system-module system-brand"
            onClick={() => setActiveTab('dashboard')}
            aria-label={language === 'zh' ? '回到主页' : 'Back to home'}
          >
            LEFT2Y
          </button>

          <div className="system-module hidden xl:flex">
            <span className="status-light" />
            <span>{theme === 'dark' ? 'Night Studio' : 'Studio Open'}</span>
          </div>

          <div className="flex min-w-0 overflow-x-auto no-scrollbar">
            {items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`system-button shrink-0 ${isActive ? 'system-button-active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-stretch">
            <button className="system-button px-3 md:px-4" onClick={toggleLanguage} title="Switch language">
              <Globe size={16} />
              <span className="hidden sm:inline">{language === 'zh' ? 'EN' : '中'}</span>
            </button>

            <button
              className="system-button px-3 md:px-4"
              onClick={toggleTheme}
              title="Toggle theme"
              aria-pressed={theme === 'dark'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              <span className="hidden lg:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>

            <button
              className="system-button system-button-accent px-3 md:px-4"
              onClick={onTriggerGravity}
              title="Trigger gravity"
              disabled={gravityActive}
              aria-pressed={gravityActive}
            >
              <Bomb size={16} />
              <span className="hidden lg:inline">{gravityActive ? 'Live' : 'Boom'}</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};
