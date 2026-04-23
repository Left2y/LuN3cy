# LEFT2Y

一个围绕 `UI/UX · Photography · AI Apps` 展开的个人作品集网站。

这个项目不是通用模板，而是为 Left2y 当前的作品呈现方式定制的一套前端档案系统。它用 `React + Vite + TypeScript` 构建，强调纸张感、档案感、可扫读的信息层级，以及带一点实验性质的交互表达。

## 项目概览

- 双语切换：中英文内容一键切换。
- 明暗主题：默认按本地时间选择主题，也会记住用户上次选择。
- 档案式首页：左侧讲方法，右侧讲作品分类，而不是单纯堆大图。
- 作品索引：按类别筛选设计、摄影、应用开发等项目。
- 地图模式：把作品重新组织成一张可缩放、可拖拽、可聚焦的自由画板。
- 详情弹窗：项目支持封面、Figma、外链、视频、图集等不同展示路径。
- 彩蛋交互：`Boom` 模式会触发基于 `Matter.js` 的页面重力散落效果。

## 主要特性

### 1. 首页不是传统 hero

首页不是一句口号加三张图，而是一个“工作室索引”：

- 左侧用方法卡片说明做事方式。
- 右侧用分类索引把用户直接导向作品。
- 联系方式、简历和状态保持在首页可直接触达。

### 2. 作品区是内容主轴

作品区基于本地数据文件驱动，不依赖 CMS：

- 分类筛选
- 项目卡片
- 项目详情弹窗
- 摄影图集 lightbox
- Figma 预览入口
- Demo / GitHub / 外链跳转

### 3. Map 是独立浏览模式

`Map` 模式不是普通列表换皮，而是一块桌面端优先的自由画板：

- 作品节点漂浮排布
- 分区浏览
- 缩放 / 平移 / 聚焦
- 点击卡片后再打开右侧信息面板
- 键盘快捷键和本地布局记忆

移动端下会自动回退到常规作品页，而不是强行保留复杂画板交互。

## 技术栈

- `React 19`
- `TypeScript`
- `Vite 6`
- `Tailwind CSS`
- `lucide-react`
- `motion`
- `matter-js`

## 本地运行

建议使用当前 Node.js LTS 版本。

```bash
npm install
npm run dev
```

默认 Vite 会输出本地开发地址。也可以手动指定：

```bash
npm run dev -- --host 127.0.0.1 --port 4174
```

生产构建：

```bash
npm run build
```

本地预览构建结果：

```bash
npm run preview
```

## 目录结构

```text
.
├── App.tsx
├── components/
│   ├── CanvasBoard.tsx
│   ├── HeroSection.tsx
│   ├── MusicPlayer.tsx
│   ├── PortfolioSection.tsx
│   ├── Sidebar.tsx
│   └── ...
├── public/
│   ├── *.png / *.jpg
│   └── resume.pdf
├── src/
│   ├── data/
│   │   ├── design.ts
│   │   ├── dev.ts
│   │   ├── photography_projects.ts
│   │   ├── canvas.ts
│   │   ├── contact.ts
│   │   └── ...
│   └── utils/
├── index.css
├── types.ts
└── package.json
```

## 内容维护方式

这个站点目前是“本地数据驱动”结构，改内容基本不需要动组件逻辑。

### 项目内容

项目主数据在这些文件里：

- [`src/data/design.ts`](src/data/design.ts)
- [`src/data/dev.ts`](src/data/dev.ts)
- [`src/data/photography_projects.ts`](src/data/photography_projects.ts)

统一聚合在：

- [`src/data/projects.ts`](src/data/projects.ts)

### 地图内容

地图节点和分组逻辑在：

- [`src/data/canvas.ts`](src/data/canvas.ts)

渲染和交互在：

- [`components/CanvasBoard.tsx`](components/CanvasBoard.tsx)

### 首页与联系信息

- 首页文案：[`src/data/home.ts`](src/data/home.ts)
- 联系信息：[`src/data/contact.ts`](src/data/contact.ts)
- 导航标签：[`src/data/navigation.ts`](src/data/navigation.ts)

### 视觉样式

全局视觉语言主要集中在：

- [`index.css`](index.css)

这里定义了：

- 色彩变量
- 明暗主题
- 顶栏系统样式
- 首页档案板式
- 作品卡片
- 地图画板 UI

## 设计取向

这个项目的视觉方向不是“通用作品集 UI”，而是偏向：

- 编辑感
- 档案感
- 纸张与边框的触感
- 橙色信号色
- 结构清晰但不完全克制的实验气质

它有意识避开了这些方向：

- 通用 SaaS dashboard 风格
- 大面积玻璃拟态
- 模板感很重的卡片瀑布流
- 只靠大图撑场面的作品集首页

## 额外脚本

项目里包含一些内容维护辅助脚本，例如：

- `scripts/compress-images.cjs`
- `compress-images.bat`
- `scripts/add-song.cjs`

它们不影响主站运行，但在整理素材和数据时会用到。

## 注意事项

- 这是个人站点仓库，内容和结构明显偏定制化。
- 目前没有接入后端，也没有环境变量依赖。
- `.playwright-cli/` 等本地调试产物不应提交。
- 如果要把它改造成通用模板，优先抽离 `src/data/*` 和首页 / 地图的强定制文案。

## License

当前仓库用于个人作品展示与持续迭代，默认不作为开源模板承诺长期兼容性。
