import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Minus, Plus, RotateCcw, X } from 'lucide-react';
import { buildCanvasScene, CanvasBounds, CanvasEdge, CanvasGroup, CanvasNode } from '../src/data/canvas';
import { resolveAsset } from '../src/utils/path';
import { Language } from '../types';

interface CanvasBoardProps {
  language: Language;
  onExit: () => void;
}

interface CanvasViewport {
  x: number;
  y: number;
  scale: number;
}

interface CanvasSize {
  width: number;
  height: number;
}

interface CanvasLayoutOverride {
  x: number;
  y: number;
}

interface CanvasViewportInsets {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface CanvasViewportOptions {
  inspector?: boolean;
}

const MIN_SCALE = 0.38;
const MAX_SCALE = 1.24;
const LAYOUT_STORAGE_KEY = 'left2y-map-layout-v2';

const clampScale = (value: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

const getNodeBounds = (nodes: CanvasNode[], nodeIds: string[]) => {
  const groupNodes = nodes.filter((node) => nodeIds.includes(node.id));
  if (!groupNodes.length) return null;

  const minX = Math.min(...groupNodes.map((node) => node.x));
  const minY = Math.min(...groupNodes.map((node) => node.y));
  const maxX = Math.max(...groupNodes.map((node) => node.x + node.width));
  const maxY = Math.max(...groupNodes.map((node) => node.y + node.height));

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

const readStoredLayout = () => {
  if (typeof window === 'undefined') return {} as Record<string, CanvasLayoutOverride>;

  try {
    const raw = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (!raw) return {} as Record<string, CanvasLayoutOverride>;

    const parsed = JSON.parse(raw) as Record<string, CanvasLayoutOverride>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {} as Record<string, CanvasLayoutOverride>;
  }
};

const applyStoredLayout = (nodes: CanvasNode[], overrides: Record<string, CanvasLayoutOverride>) =>
  nodes.map((node) => {
    const override = overrides[node.id];
    return override ? { ...node, x: override.x, y: override.y } : node;
  });

const getToneLabel = (group: CanvasGroup) => {
  switch (group.tone) {
    case 'accent':
      return 'canvas-layer-accent';
    case 'ink':
      return 'canvas-layer-ink';
    case 'lapis':
      return 'canvas-layer-lapis';
    case 'signal':
      return 'canvas-layer-signal';
    default:
      return 'canvas-layer-paper';
  }
};

const resolveCanvasHref = (href: string) => (href.startsWith('/') ? resolveAsset(href) : href);

const getViewportInsets = (size: CanvasSize, options: CanvasViewportOptions = {}): CanvasViewportInsets => {
  const isCompact = size.width < 1380;

  return {
    left: isCompact ? 284 : 312,
    right: options.inspector ? (isCompact ? 338 : 366) : 48,
    top: 110,
    bottom: 72,
  };
};

const getViewportFrame = (size: CanvasSize, options: CanvasViewportOptions = {}) => {
  const insets = getViewportInsets(size, options);

  return {
    width: Math.max(360, size.width - insets.left - insets.right),
    height: Math.max(280, size.height - insets.top - insets.bottom),
  };
};

const getViewportTargetPoint = (size: CanvasSize, options: CanvasViewportOptions = {}) => {
  const insets = getViewportInsets(size, options);
  const frame = getViewportFrame(size, options);

  return {
    x: insets.left + frame.width / 2,
    y: insets.top + frame.height / 2,
  };
};

const viewportFromBounds = (bounds: CanvasBounds, size: CanvasSize, options: CanvasViewportOptions = {}) => {
  const frame = getViewportFrame(size, options);
  const target = getViewportTargetPoint(size, options);
  const scale = clampScale(
    Math.min((frame.width * 0.92) / bounds.width, (frame.height * 0.9) / bounds.height, 0.94),
  );

  return {
    scale,
    x: target.x - (bounds.x + bounds.width / 2) * scale,
    y: target.y - (bounds.y + bounds.height / 2) * scale,
  };
};

const getEdgePath = (edge: CanvasEdge, nodeMap: Map<string, CanvasNode>) => {
  const fromNode = nodeMap.get(edge.from);
  const toNode = nodeMap.get(edge.to);

  if (!fromNode || !toNode) return '';

  const fromX = fromNode.x + fromNode.width / 2;
  const fromY = fromNode.y + fromNode.height / 2;
  const toX = toNode.x + toNode.width / 2;
  const toY = toNode.y + toNode.height / 2;
  const horizontalDistance = Math.abs(toX - fromX);
  const verticalDistance = Math.abs(toY - fromY);

  if (horizontalDistance < 180) {
    const controlY = fromY + (toY > fromY ? 120 : -120) + verticalDistance * 0.12;
    return `M ${fromX} ${fromY} C ${fromX} ${controlY}, ${toX} ${controlY}, ${toX} ${toY}`;
  }

  const controlOffset = Math.max(110, Math.min(260, horizontalDistance * 0.32));
  const controlX1 = fromX + (toX > fromX ? controlOffset : -controlOffset);
  const controlX2 = toX - (toX > fromX ? controlOffset : -controlOffset);

  return `M ${fromX} ${fromY} C ${controlX1} ${fromY}, ${controlX2} ${toY}, ${toX} ${toY}`;
};

const CanvasNodeCard: React.FC<{
  language: Language;
  node: CanvasNode;
  selected: boolean;
  onSelect: (nodeId: string) => void;
}> = ({ language, node, selected, onSelect }) => {
  const hasImage = node.type === 'project' && Boolean(node.image);

  return (
    <article
      role="button"
      tabIndex={0}
      data-canvas-node
      data-node-id={node.id}
      data-tone={node.tone || 'paper'}
      data-type={node.type}
      aria-pressed={selected}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        onSelect(node.id);
      }}
      className={`canvas-node ${selected ? 'canvas-node-selected' : ''}`}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${node.width}px`,
        height: `${node.height}px`,
        zIndex: node.zIndex || 2,
      }}
    >
      <div className="canvas-node-topline">
        <span>{node.type.toUpperCase()}</span>
        {node.date && <span>{node.date}</span>}
      </div>

      {hasImage && (
        <div className="canvas-node-media">
          <img
            src={resolveAsset(node.image || '')}
            alt={node.title}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <div className="canvas-node-body">
        <h3 className="canvas-node-title">{node.title}</h3>
        {node.subtitle && <p className="canvas-node-subtitle">{node.subtitle}</p>}
        {node.body && <p className="canvas-node-copy">{node.body}</p>}
      </div>

      {node.meta?.[0] && node.type === 'project' && (
        <div className="canvas-node-primary-meta">
          <span>{node.meta[0].label}</span>
          <strong>{node.meta[0].value}</strong>
        </div>
      )}

      {node.chips?.length && (
        <div className="canvas-node-footer">
          {node.chips?.slice(0, node.type === 'tag' ? 1 : 2).map((chip) => (
            <span key={chip} className="canvas-node-chip">
              {chip}
            </span>
          ))}
          {node.meta?.[0] && node.type !== 'tag' && node.type !== 'project' && (
            <span className="canvas-node-metric">
              {node.meta[0].label}: {node.meta[0].value}
            </span>
          )}
        </div>
      )}

      {node.links?.length ? (
        <div className="canvas-node-action">
          <span>{language === 'zh' ? '详情' : 'Open'}</span>
          <ArrowUpRight size={14} />
        </div>
      ) : null}
    </article>
  );
};

export const CanvasBoard: React.FC<CanvasBoardProps> = ({ language, onExit }) => {
  const scene = useMemo(() => buildCanvasScene(language), [language]);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const layoutNodesRef = useRef<CanvasNode[]>(scene.nodes);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    originScale: number;
    originNodeX: number;
    originNodeY: number;
    moved: boolean;
    mode: 'pan' | 'node';
    targetNodeId: string | null;
  } | null>(null);

  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [layoutNodes, setLayoutNodes] = useState<CanvasNode[]>(scene.nodes);
  const [viewport, setViewport] = useState<CanvasViewport>({
    x: 0,
    y: 0,
    scale: scene.defaultViewport.scale,
  });
  const [containerSize, setContainerSize] = useState<CanvasSize>({ width: 0, height: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const copy = useMemo(() => {
    if (language === 'zh') {
      return {
        atlas: '个人地图',
        layers: 'Layers',
        inspector: 'Inspector',
        resetView: '重置视角',
        resetLayout: '重置布局',
        zoomIn: '放大',
        zoomOut: '缩小',
        cards: '卡片',
        activeZone: '当前区域',
        zoom: '缩放',
        quickHint: '拖动空白 · 滚轮缩放 · 1/2/3 聚焦 · 0 重置',
        layerNote: '拖动任意节点可直接改布局，位置会自动保存在当前浏览器。',
        details: '详情',
        open: '打开',
        closeDetails: '关闭详情',
      };
    }

    return {
      atlas: 'Personal Atlas',
      layers: 'Layers',
      inspector: 'Inspector',
      resetView: 'Reset View',
      resetLayout: 'Reset Layout',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      cards: 'Cards',
      activeZone: 'Active Zone',
      zoom: 'Zoom',
      quickHint: 'Drag canvas · Wheel zoom · 1/2/3 focus · 0 reset',
      layerNote: 'Drag any node to edit the layout. Positions autosave in this browser.',
      details: 'Open',
      open: 'Open',
      closeDetails: 'Close details',
    };
  }, [language]);

  const baseNodeMap = useMemo(() => new Map(scene.nodes.map((node) => [node.id, node])), [scene.nodes]);
  const nodeMap = useMemo(() => new Map(layoutNodes.map((node) => [node.id, node])), [layoutNodes]);
  const groupPaddingMap = useMemo(() => {
    return new Map(
      scene.groups.map((group) => {
        const bounds = getNodeBounds(scene.nodes, group.nodeIds);
        const padding = bounds ? Math.max(0, bounds.minX - group.bounds.x) : 130;
        return [group.id, padding];
      }),
    );
  }, [scene.groups, scene.nodes]);
  const groups = useMemo(() => {
    return scene.groups.map((group) => {
      const bounds = getNodeBounds(layoutNodes, group.nodeIds);
      const padding = groupPaddingMap.get(group.id) ?? 130;

      if (!bounds) return group;

      return {
        ...group,
        bounds: {
          x: bounds.minX - padding,
          y: bounds.minY - padding,
          width: bounds.width + padding * 2,
          height: bounds.height + padding * 2,
        },
      };
    });
  }, [groupPaddingMap, layoutNodes, scene.groups]);
  const selectedNode = selectedNodeId ? nodeMap.get(selectedNodeId) || null : null;

  const persistLayout = (nodes: CanvasNode[]) => {
    if (typeof window === 'undefined') return;

    const overrides = nodes.reduce<Record<string, CanvasLayoutOverride>>((acc, node) => {
      const baseNode = baseNodeMap.get(node.id);
      if (baseNode && (baseNode.x !== node.x || baseNode.y !== node.y)) {
        acc[node.id] = {
          x: Math.round(node.x),
          y: Math.round(node.y),
        };
      }
      return acc;
    }, {});

    if (Object.keys(overrides).length) {
      window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(overrides));
      return;
    }

    window.localStorage.removeItem(LAYOUT_STORAGE_KEY);
  };

  useEffect(() => {
    const overrides = readStoredLayout();
    const nextNodes = applyStoredLayout(scene.nodes, overrides);
    layoutNodesRef.current = nextNodes;
    setLayoutNodes(nextNodes);
  }, [scene.nodes]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    containerRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      const nextSize = {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      };
      setContainerSize(nextSize);

      if (!initializedRef.current && nextSize.width > 0 && nextSize.height > 0) {
        initializedRef.current = true;
        const target = getViewportTargetPoint(nextSize);
        setViewport({
          scale: scene.defaultViewport.scale,
          x: target.x - scene.defaultViewport.centerX * scene.defaultViewport.scale,
          y: target.y - scene.defaultViewport.centerY * scene.defaultViewport.scale,
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [scene.defaultViewport.centerX, scene.defaultViewport.centerY, scene.defaultViewport.scale]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    const handleNativeWheel = (event: WheelEvent) => {
      event.preventDefault();

      const rect = element.getBoundingClientRect();
      const cursorX = event.clientX - rect.left;
      const cursorY = event.clientY - rect.top;

      setViewport((current) => {
        const nextScale = clampScale(current.scale * (event.deltaY > 0 ? 0.92 : 1.08));
        const worldX = (cursorX - current.x) / current.scale;
        const worldY = (cursorY - current.y) / current.scale;

        return {
          scale: nextScale,
          x: cursorX - worldX * nextScale,
          y: cursorY - worldY * nextScale,
        };
      });
    };

    element.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => element.removeEventListener('wheel', handleNativeWheel);
  }, []);

  const resetViewport = () => {
    if (!containerSize.width || !containerSize.height) return;
    const target = getViewportTargetPoint(containerSize);

    setViewport({
      scale: scene.defaultViewport.scale,
      x: target.x - scene.defaultViewport.centerX * scene.defaultViewport.scale,
      y: target.y - scene.defaultViewport.centerY * scene.defaultViewport.scale,
    });
    setSelectedNodeId('');
  };

  const resetLayout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(LAYOUT_STORAGE_KEY);
    }

    layoutNodesRef.current = scene.nodes;
    setLayoutNodes(scene.nodes);
    setSelectedNodeId('');
  };

  const focusGroup = (group: CanvasGroup) => {
    if (!containerSize.width || !containerSize.height) return;

    setViewport(viewportFromBounds(group.bounds, containerSize));
    setSelectedNodeId('');
  };

  const centerOnWorldPoint = (worldX: number, worldY: number, options: CanvasViewportOptions = {}, scale?: number) => {
    if (!containerSize.width || !containerSize.height) return;

    const target = getViewportTargetPoint(containerSize, options);

    setViewport((current) => {
      const nextScale = scale ?? current.scale;
      return {
        scale: nextScale,
        x: target.x - worldX * nextScale,
        y: target.y - worldY * nextScale,
      };
    });
  };

  const adjustZoom = (factor: number) => {
    if (!containerSize.width || !containerSize.height) return;

    const target = getViewportTargetPoint(containerSize, { inspector: Boolean(selectedNode) });

    setViewport((current) => {
      const nextScale = clampScale(current.scale * factor);
      const worldX = (target.x - current.x) / current.scale;
      const worldY = (target.y - current.y) / current.scale;

      return {
        scale: nextScale,
        x: target.x - worldX * nextScale,
        y: target.y - worldY * nextScale,
      };
    });
  };

  const handleSelectNode = (nodeId: string) => {
    if (!nodeId) {
      setSelectedNodeId('');
      return;
    }

    const nextNode = nodeMap.get(nodeId);
    setSelectedNodeId(nodeId);

    if (nextNode) {
      centerOnWorldPoint(nextNode.x + nextNode.width / 2, nextNode.y + nextNode.height / 2, { inspector: true });
    }
  };

  const activeGroupId = useMemo(() => {
    if (!containerSize.width || !containerSize.height) {
      return groups[0]?.id || '';
    }

    const target = getViewportTargetPoint(containerSize, { inspector: Boolean(selectedNode) });
    const focusX = (target.x - viewport.x) / viewport.scale;
    const focusY = (target.y - viewport.y) / viewport.scale;

    return groups.reduce<{ id: string; distance: number } | null>((best, group) => {
      const groupCenterX = group.bounds.x + group.bounds.width / 2;
      const groupCenterY = group.bounds.y + group.bounds.height / 2;
      const distance = Math.hypot(groupCenterX - focusX, groupCenterY - focusY);

      if (!best || distance < best.distance) {
        return { id: group.id, distance };
      }

      return best;
    }, null)?.id;
  }, [containerSize.height, containerSize.width, groups, viewport.scale, viewport.x, viewport.y]);
  const activeGroup = useMemo(
    () => {
      if (selectedNode?.groupId) {
        return groups.find((group) => group.id === selectedNode.groupId) || groups[0] || null;
      }

      return groups.find((group) => group.id === activeGroupId) || groups[0] || null;
    },
    [activeGroupId, groups, selectedNode?.groupId],
  );
  const zoomPercent = Math.round(viewport.scale * 100);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-canvas-panel], [data-canvas-action]')) return;
    const nodeElement = target.closest<HTMLElement>('[data-canvas-node]');
    const targetNodeId = nodeElement?.dataset.nodeId ?? null;
    const targetNode = targetNodeId ? nodeMap.get(targetNodeId) || null : null;
    event.preventDefault();

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: viewport.x,
      originY: viewport.y,
      originScale: viewport.scale,
      originNodeX: targetNode?.x ?? 0,
      originNodeY: targetNode?.y ?? 0,
      moved: false,
      mode: targetNode ? 'node' : 'pan',
      targetNodeId,
    };

    setIsPanning(false);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    event.preventDefault();

    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragRef.current.moved = true;
      setIsPanning(true);
    }

    if (!dragRef.current.moved) return;

    if (dragRef.current.mode === 'node' && dragRef.current.targetNodeId) {
      const nextX = dragRef.current.originNodeX + dx / dragRef.current.originScale;
      const nextY = dragRef.current.originNodeY + dy / dragRef.current.originScale;

      setLayoutNodes((current) => {
        const nextNodes = current.map((node) =>
          node.id === dragRef.current?.targetNodeId ? { ...node, x: nextX, y: nextY } : node,
        );
        layoutNodesRef.current = nextNodes;
        return nextNodes;
      });
      return;
    }

    setViewport({
      x: dragRef.current.originX + dx,
      y: dragRef.current.originY + dy,
      scale: dragRef.current.originScale,
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    event.preventDefault();

    if (dragRef.current.moved && dragRef.current.mode === 'node') {
      persistLayout(layoutNodesRef.current);
    }

    if (!dragRef.current.moved) {
      handleSelectNode(dragRef.current.targetNodeId || '');
    }

    dragRef.current = null;
    setIsPanning(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();

        if (selectedNodeId) {
          setSelectedNodeId('');
          return;
        }

        onExit();
        return;
      }

      if (event.key === '0') {
        event.preventDefault();
        resetViewport();
        return;
      }

      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        adjustZoom(1.1);
        return;
      }

      if (event.key === '-' || event.key === '_') {
        event.preventDefault();
        adjustZoom(0.9);
        return;
      }

      if (!['1', '2', '3'].includes(event.key)) return;

      const group = groups[Number(event.key) - 1];
      if (!group) return;

      event.preventDefault();
      focusGroup(group);
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [adjustZoom, groups, onExit, resetViewport, selectedNodeId]);

  return (
    <div className="mx-auto w-full max-w-[1680px]">
      <section className="canvas-shell system-panel-flat">
        <div
          ref={containerRef}
          className={`canvas-surface ${isPanning ? 'is-panning' : ''}`}
          tabIndex={-1}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="canvas-hintbar" data-canvas-panel>
            <div className="canvas-hint-meta">
              {activeGroup && (
                <span className={`canvas-status-pill ${getToneLabel(activeGroup)}`}>
                  {copy.activeZone}: {activeGroup.label}
                </span>
              )}
              <span className="canvas-status-pill">{copy.zoom}: {zoomPercent}%</span>
              <span className="canvas-status-pill">{copy.cards}: {layoutNodes.length}</span>
            </div>
            <p>{copy.quickHint}</p>
            <div className="canvas-hint-actions">
              <button
                type="button"
                className="canvas-icon-button"
                onClick={() => adjustZoom(0.9)}
                aria-label={copy.zoomOut}
              >
                <Minus size={14} />
              </button>
              <button
                type="button"
                className="canvas-icon-button"
                onClick={() => adjustZoom(1.1)}
                aria-label={copy.zoomIn}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <aside className="canvas-overlay-panel canvas-layer-panel" data-canvas-panel>
            <div className="canvas-panel-head">
              <span className="system-label mb-2">{copy.layers}</span>
              <h2>{copy.atlas}</h2>
            </div>

            <div className="canvas-layer-list">
              {groups.map((group, index) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => focusGroup(group)}
                  className={`canvas-layer-button ${activeGroupId === group.id ? 'is-active' : ''} ${getToneLabel(group)}`}
                >
                  <div className="canvas-layer-button-topline">
                    <span>{group.label}</span>
                    <strong>{String(index + 1).padStart(2, '0')}</strong>
                  </div>
                  <small>{group.description}</small>
                  <em>{group.nodeIds.length} {copy.cards.toLowerCase()}</em>
                </button>
              ))}
            </div>

            <p className="canvas-panel-note">{copy.layerNote}</p>

            <div className="canvas-panel-actions">
              <button type="button" className="canvas-secondary-button" onClick={resetViewport}>
                <RotateCcw size={14} />
                <span>{copy.resetView}</span>
              </button>
              <button type="button" className="canvas-secondary-button" onClick={resetLayout}>
                <RotateCcw size={14} />
                <span>{copy.resetLayout}</span>
              </button>
            </div>
          </aside>

          {selectedNode && (
            <aside className="canvas-overlay-panel canvas-inspector is-detail" data-canvas-panel>
              <div className="canvas-inspector-head">
                <div>
                  <span className="system-label mb-2">{copy.inspector}</span>
                  <h2>{selectedNode.title}</h2>
                </div>
                <button
                  type="button"
                  className="canvas-ghost-button"
                  onClick={() => setSelectedNodeId('')}
                  aria-label={copy.closeDetails}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="canvas-inspector-body">
                {selectedNode.image && (
                  <div className="canvas-inspector-media">
                    <img
                      src={resolveAsset(selectedNode.image)}
                      alt={selectedNode.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {selectedNode.subtitle && <p className="canvas-inspector-subtitle">{selectedNode.subtitle}</p>}
                {selectedNode.body && <p className="canvas-inspector-copy">{selectedNode.body}</p>}

                {selectedNode.meta?.length ? (
                  <div className="canvas-inspector-meta">
                    {selectedNode.meta.map((item) => (
                      <div key={`${selectedNode.id}-${item.label}`} className="canvas-meta-row">
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                ) : null}

                {selectedNode.chips?.length ? (
                  <div className="canvas-chip-row">
                    {selectedNode.chips.map((chip) => (
                      <span key={`${selectedNode.id}-${chip}`} className="canvas-node-chip">
                        {chip}
                      </span>
                    ))}
                  </div>
                ) : null}

                {selectedNode.links?.length ? (
                  <div className="canvas-inspector-links">
                    {selectedNode.links.map((link) => {
                      const href = resolveCanvasHref(link.href);
                      const isExternal = href.startsWith('http');

                      return (
                        <a
                          key={`${selectedNode.id}-${link.href}`}
                          data-canvas-action
                          href={href}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noreferrer' : undefined}
                          className="canvas-link-button"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight size={14} />
                        </a>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </aside>
          )}

          <div
            className="canvas-world"
            style={{
              width: `${scene.width}px`,
              height: `${scene.height}px`,
              transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
            }}
          >
            <div className="canvas-grid-plane" />

            {groups.map((group) => (
              <section
                key={`region-${group.id}`}
                className={`canvas-group-region ${getToneLabel(group)} ${activeGroupId === group.id ? 'is-active' : ''}`}
                style={{
                  left: `${group.bounds.x}px`,
                  top: `${group.bounds.y}px`,
                  width: `${group.bounds.width}px`,
                  height: `${group.bounds.height}px`,
                }}
              >
                <div className="canvas-group-region-watermark" aria-hidden="true">
                  {group.shortLabel}
                </div>
                <div className="canvas-group-region-head">
                  <span>{group.label}</span>
                  <small>{String(group.nodeIds.length).padStart(2, '0')}</small>
                </div>
                <p>{group.description}</p>
              </section>
            ))}

            <svg className="canvas-edge-layer" width={scene.width} height={scene.height} viewBox={`0 0 ${scene.width} ${scene.height}`}>
              {scene.edges.map((edge) => (
                <path
                  key={edge.id}
                  d={getEdgePath(edge, nodeMap)}
                  className={`canvas-edge canvas-edge-${edge.kind || 'secondary'}`}
                />
              ))}
            </svg>

            {layoutNodes.map((node) => (
              <CanvasNodeCard
                key={node.id}
                language={language}
                node={node}
                selected={selectedNodeId === node.id}
                onSelect={handleSelectNode}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
