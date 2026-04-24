'use client';

import React, { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import * as fabric from 'fabric';
import { jsPDF } from 'jspdf';
import { JournalCanvasProps, CanvasData, CanvasObjectType } from '@/lib/canvas/types';
import { STICKER_CATALOGUE } from '@/lib/stickers';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRID_SIZE = 16;
const HISTORY_LIMIT = 50;

export interface JournalCanvasHandle {
  addText: () => void;
  addImage: (url: string) => void;
  addImageAt: (url: string, canvasX: number, canvasY: number) => void;
  addMap: (location: string) => void;
  addSticker: (stickerId: string) => void;
  undo: () => void;
  redo: () => void;
  exportPNG: () => void;
  exportPDF: () => void;
  updateSelected: (updates: Record<string, unknown>) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  getCanvasEl: () => HTMLCanvasElement | null;
}

export const JournalCanvas = forwardRef<JournalCanvasHandle, JournalCanvasProps>(
  function JournalCanvas(
    { initialData, onSave, onSelectionChange, width = CANVAS_WIDTH, height = CANVAS_HEIGHT },
    ref
  ) {
    const canvasElRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);
    const historyRef = useRef<string[]>([]);
    const historyIdxRef = useRef(-1);
    const skipHistoryRef = useRef(false);
    const gridVisibleRef = useRef(true);
    const lastActiveRef = useRef<fabric.FabricObject | null>(null);

    // ── helpers ──────────────────────────────────────────────────────────────

    const buildCanvasData = useCallback((): CanvasData => {
      const canvas = fabricRef.current;
      if (!canvas) return { version: '1.0', objects: [], size: { width, height } };

      const objects: CanvasObjectType[] = canvas
        .getObjects()
        .filter((o: any) => !o.isGrid)
        .map((o: any, i: number) => {
          const base = {
            id: o.id ?? `obj-${i}`,
            x: (o.left ?? 0) + ((o.width ?? 0) * (o.scaleX ?? 1)) / 2,
            y: (o.top ?? 0) + ((o.height ?? 0) * (o.scaleY ?? 1)) / 2,
            width: o.width ?? 0,
            height: o.height ?? 0,
            rotation: o.angle ?? 0,
            scaleX: o.scaleX ?? 1,
            scaleY: o.scaleY ?? 1,
            opacity: o.opacity ?? 1,
            visible: o.visible !== false,
          };
          if (o._customType === 'text') {
            return {
              ...base,
              type: 'text' as const,
              text: o.text ?? '',
              fontFamily: o.fontFamily ?? 'Georgia',
              fontSize: o.fontSize ?? 18,
              fontColor: (o.fill as string) ?? '#111827',
              fontWeight: (o.fontWeight === 'bold' ? 'bold' : 'normal') as 'bold' | 'normal',
              fontStyle: (o.fontStyle === 'italic' ? 'italic' : 'normal') as 'italic' | 'normal',
              textAlign: (o.textAlign ?? 'left') as 'left' | 'center' | 'right',
              lineHeight: o.lineHeight ?? 1.5,
            };
          }
          if (o._customType === 'sticker') {
            return {
              ...base,
              type: 'sticker' as const,
              stickerId: o._stickerId ?? 'compass',
              hueTint: 0,
            };
          }
          if (o._customType === 'map') {
            return {
              ...base,
              type: 'map' as const,
              location: o._mapLocation ?? '',
              mapUrl: '',
              clipShape: 'rectangle' as const,
            };
          }
          return {
            ...base,
            type: 'image' as const,
            src: (o as any).getSrc?.() ?? '',
          };
        });

      return { version: '1.0', objects, size: { width, height } };
    }, [width, height]);

    const pushHistory = useCallback(() => {
      const canvas = fabricRef.current;
      if (!canvas || skipHistoryRef.current) return;
      const json = JSON.stringify(
        (canvas as any).toJSON(['id', 'isGrid', '_customType', '_stickerId', '_mapLocation'])
      );
      const stack = historyRef.current.slice(0, historyIdxRef.current + 1);
      if (stack.length >= HISTORY_LIMIT) stack.shift();
      stack.push(json);
      historyRef.current = stack;
      historyIdxRef.current = stack.length - 1;
    }, []);

    const applyJson = useCallback((json: string) => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      skipHistoryRef.current = true;
      canvas.loadFromJSON(JSON.parse(json)).then(() => {
        canvas.renderAll();
        skipHistoryRef.current = false;
      });
    }, []);

    const emitSelection = useCallback(
      (selected: fabric.FabricObject[]) => {
        if (!onSelectionChange) return;
        const mapped = selected
          .filter((o: any) => !o.isGrid)
          .map((o: any) => ({
            id: o.id ?? '',
            type: (o._customType ?? 'image') as any,
            x: o.left ?? 0,
            y: o.top ?? 0,
            width: o.width ?? 0,
            height: o.height ?? 0,
            rotation: o.angle ?? 0,
            scaleX: o.scaleX ?? 1,
            scaleY: o.scaleY ?? 1,
            opacity: o.opacity ?? 1,
            visible: o.visible !== false,
            text: o.text,
            fontFamily: o.fontFamily,
            fontSize: o.fontSize,
            fontColor: o.fill,
            fontWeight: o.fontWeight,
            fontStyle: o.fontStyle,
            stickerId: o._stickerId,
          }));
        onSelectionChange(mapped as any);
      },
      [onSelectionChange]
    );

    // ── imperative methods ────────────────────────────────────────────────────

    const undo = useCallback(() => {
      if (historyIdxRef.current <= 0) return;
      historyIdxRef.current--;
      applyJson(historyRef.current[historyIdxRef.current]);
    }, [applyJson]);

    const redo = useCallback(() => {
      if (historyIdxRef.current >= historyRef.current.length - 1) return;
      historyIdxRef.current++;
      applyJson(historyRef.current[historyIdxRef.current]);
    }, [applyJson]);

    const addText = useCallback(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const t = new fabric.IText('Click to edit', {
        left: width / 2 - 80,
        top: height / 2 - 15,
        fontFamily: 'Georgia',
        fontSize: 24,
        fill: '#111827',
      } as any);
      (t as any).id = `text-${Date.now()}`;
      (t as any)._customType = 'text';
      canvas.add(t);
      canvas.setActiveObject(t);
      canvas.renderAll();
      pushHistory();
      onSave(buildCanvasData());
    }, [width, height, pushHistory, onSave, buildCanvasData]);

    const addImage = useCallback(
      (url: string) => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        fabric.Image.fromURL(url).then((img: any) => {
          if (!img) return;
          const maxW = width * 0.5;
          const maxH = height * 0.5;
          const scale = Math.min(maxW / (img.width || 1), maxH / (img.height || 1), 1);
          img.scale(scale);
          img.set({
            left: Math.random() * Math.max(0, width - (img.width || 200) * scale),
            top: Math.random() * Math.max(0, height - (img.height || 200) * scale),
          });
          (img as any).id = `img-${Date.now()}`;
          (img as any)._customType = 'image';
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          pushHistory();
          onSave(buildCanvasData());
        });
      },
      [width, height, pushHistory, onSave, buildCanvasData]
    );

    const addImageAt = useCallback(
      (url: string, canvasX: number, canvasY: number) => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        fabric.Image.fromURL(url).then((img: any) => {
          if (!img) return;
          const maxW = width * 0.5;
          const maxH = height * 0.5;
          const scale = Math.min(maxW / (img.width || 1), maxH / (img.height || 1), 1);
          img.scale(scale);
          img.set({
            left: canvasX - (img.width * scale) / 2,
            top: canvasY - (img.height * scale) / 2,
          });
          (img as any).id = `img-${Date.now()}`;
          (img as any)._customType = 'image';
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          pushHistory();
          onSave(buildCanvasData());
        });
      },
      [width, height, pushHistory, onSave, buildCanvasData]
    );

    const getCanvasEl = useCallback(() => canvasElRef.current, []);

    const addSticker = useCallback(
      (stickerId: string) => {
        const canvas = fabricRef.current;
        const sticker = STICKER_CATALOGUE[stickerId];
        if (!canvas || !sticker) return;
        const svgDataUri = `data:image/svg+xml;base64,${btoa(sticker.svg)}`;
        fabric.Image.fromURL(svgDataUri).then((img: any) => {
          if (!img) return;
          img.set({ left: width / 2 - 60, top: height / 2 - 60, scaleX: 0.6, scaleY: 0.6 });
          (img as any).id = `sticker-${Date.now()}`;
          (img as any)._customType = 'sticker';
          (img as any)._stickerId = stickerId;
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          pushHistory();
          onSave(buildCanvasData());
        });
      },
      [width, height, pushHistory, onSave, buildCanvasData]
    );

    const addMap = useCallback(
      (location: string) => {
        const canvas = fabricRef.current;
        if (!canvas || !location.trim()) return;
        const url = `/api/map?location=${encodeURIComponent(location)}`;
        fabric.Image.fromURL(url).then((img: any) => {
          if (!img) return;
          img.set({ left: width / 2 - 150, top: height / 2 - 100 });
          (img as any).id = `map-${Date.now()}`;
          (img as any)._customType = 'map';
          (img as any)._mapLocation = location;
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          pushHistory();
          onSave(buildCanvasData());
        });
      },
      [width, height, pushHistory, onSave, buildCanvasData]
    );

    const hideGrid = useCallback(() => {
      fabricRef.current
        ?.getObjects()
        .forEach((o: any) => { if (o.isGrid) o.visible = false; });
      fabricRef.current?.renderAll();
    }, []);

    const restoreGrid = useCallback(() => {
      fabricRef.current
        ?.getObjects()
        .forEach((o: any) => { if (o.isGrid) o.visible = gridVisibleRef.current; });
      fabricRef.current?.renderAll();
    }, []);

    const exportPNG = useCallback(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      hideGrid();
      const dataURL = canvas.toDataURL({ format: 'png', multiplier: 2 } as any);
      restoreGrid();
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = 'journal.png';
      a.click();
    }, [hideGrid, restoreGrid]);

    const exportPDF = useCallback(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      hideGrid();
      const dataURL = canvas.toDataURL({ format: 'png', multiplier: 2 } as any);
      restoreGrid();
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      pdf.addImage(dataURL, 'PNG', 0, 0, pw, ph);
      pdf.save('journal.pdf');
    }, [hideGrid, restoreGrid]);

    const updateSelected = useCallback(
      (updates: Record<string, unknown>) => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObject() as any;
        if (!active) return;

        const mapped: Record<string, unknown> = {};
        if ('x' in updates) mapped.left = updates.x;
        if ('y' in updates) mapped.top = updates.y;
        if ('rotation' in updates) mapped.angle = updates.rotation;
        if ('opacity' in updates) mapped.opacity = updates.opacity;
        if ('width' in updates) mapped.width = updates.width;
        if ('height' in updates) mapped.height = updates.height;
        if ('fontFamily' in updates) mapped.fontFamily = updates.fontFamily;
        if ('fontSize' in updates) mapped.fontSize = updates.fontSize;
        if ('fontColor' in updates) mapped.fill = updates.fontColor;
        if ('fontWeight' in updates) mapped.fontWeight = updates.fontWeight;
        if ('fontStyle' in updates) mapped.fontStyle = updates.fontStyle;
        if ('flipH' in updates) mapped.flipX = !active.flipX;
        if ('flipV' in updates) mapped.flipY = !active.flipY;

        active.set(mapped);
        canvas.renderAll();
        pushHistory();
        onSave(buildCanvasData());

        // Re-emit selection so PropertiesPanel reflects the update
        emitSelection([active]);
      },
      [pushHistory, onSave, buildCanvasData, emitSelection]
    );

    const deleteSelected = useCallback(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const active = canvas.getActiveObject() ?? lastActiveRef.current;
      if (!active || (active as any).isGrid) return;

      // ActiveSelection holds multiple objects — remove each individually
      if (active.type === 'activeselection') {
        (active as fabric.ActiveSelection).getObjects().forEach((obj) => {
          if (!(obj as any).isGrid) canvas.remove(obj);
        });
      } else {
        canvas.remove(active);
      }

      canvas.discardActiveObject();
      lastActiveRef.current = null;
      canvas.renderAll();
      pushHistory();
      onSave(buildCanvasData());
    }, [pushHistory, onSave, buildCanvasData]);

    const duplicateSelected = useCallback(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const active = canvas.getActiveObject() as any;
      if (!active || active.isGrid) return;
      active.clone().then((cloned: any) => {
        cloned.set({
          left: (active.left ?? 0) + 20,
          top: (active.top ?? 0) + 20,
          id: `${active.id ?? 'obj'}-copy-${Date.now()}`,
          _customType: active._customType,
          _stickerId: active._stickerId,
          _mapLocation: active._mapLocation,
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.renderAll();
        pushHistory();
        onSave(buildCanvasData());
      });
    }, [pushHistory, onSave, buildCanvasData]);

    useImperativeHandle(
      ref,
      () => ({
        addText,
        addImage,
        addImageAt,
        addMap,
        addSticker,
        undo,
        redo,
        exportPNG,
        exportPDF,
        updateSelected,
        deleteSelected,
        duplicateSelected,
        getCanvasEl,
      }),
      [
        addText, addImage, addImageAt, addMap, addSticker,
        undo, redo, exportPNG, exportPDF,
        updateSelected, deleteSelected, duplicateSelected, getCanvasEl,
      ]
    );

    // ── canvas initialisation (runs once) ─────────────────────────────────────

    useEffect(() => {
      if (!canvasElRef.current) return;

      const canvas = new fabric.Canvas(canvasElRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true,
        preserveObjectStacking: true,
      });
      fabricRef.current = canvas;

      // Draw grid
      const gridLines: fabric.Line[] = [];
      for (let i = 0; i <= width; i += GRID_SIZE) {
        const line = new fabric.Line([i, 0, i, height], {
          stroke: '#e5e7eb', strokeWidth: 1, selectable: false, evented: false, opacity: 0.5,
        }) as any;
        line.isGrid = true;
        gridLines.push(line);
        canvas.add(line);
      }
      for (let i = 0; i <= height; i += GRID_SIZE) {
        const line = new fabric.Line([0, i, width, i], {
          stroke: '#e5e7eb', strokeWidth: 1, selectable: false, evented: false, opacity: 0.5,
        }) as any;
        line.isGrid = true;
        gridLines.push(line);
        canvas.add(line);
      }
      gridLines.forEach(l => canvas.sendObjectToBack(l));

      // Selection events
      canvas.on('selection:created', (e: any) => {
        lastActiveRef.current = canvas.getActiveObject() ?? null;
        emitSelection(e.selected ?? []);
      });
      canvas.on('selection:updated', (e: any) => {
        lastActiveRef.current = canvas.getActiveObject() ?? null;
        emitSelection(e.selected ?? []);
      });
      canvas.on('selection:cleared', () => { if (onSelectionChange) onSelectionChange([]); });

      // Persist on modification
      canvas.on('object:modified', () => {
        if (skipHistoryRef.current) return;
        pushHistory();
        onSave(buildCanvasData());
      });

      // Zoom (Ctrl+scroll) and pan (scroll / middle-mouse drag) — Figma-style
      // Must attach to upperCanvasEl so preventDefault fires before the browser
      // handles native page scroll.
      const upperCanvas = (canvas as any).upperCanvasEl as HTMLElement;
      const wrapperEl = canvas.wrapperEl as HTMLElement;

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.ctrlKey) {
          // Zoom toward cursor
          const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
          let zoom = canvas.getZoom() * zoomFactor;
          zoom = Math.min(Math.max(zoom, 0.05), 20);
          const rect = upperCanvas.getBoundingClientRect();
          canvas.zoomToPoint(new fabric.Point(e.clientX - rect.left, e.clientY - rect.top), zoom);
        } else {
          // Pan viewport
          canvas.relativePan(new fabric.Point(-e.deltaX, -e.deltaY));
        }
      };
      upperCanvas.addEventListener('wheel', onWheel, { passive: false });

      // Middle-mouse drag to pan
      let isPanning = false;
      let lastPanX = 0;
      let lastPanY = 0;

      canvas.on('mouse:down', (opt: any) => {
        if (opt.e.button !== 1) return;
        isPanning = true;
        canvas.selection = false;
        lastPanX = opt.e.clientX;
        lastPanY = opt.e.clientY;
        wrapperEl.style.cursor = 'grabbing';
        opt.e.preventDefault();
      });

      canvas.on('mouse:move', (opt: any) => {
        if (!isPanning) return;
        canvas.relativePan(new fabric.Point(opt.e.clientX - lastPanX, opt.e.clientY - lastPanY));
        lastPanX = opt.e.clientX;
        lastPanY = opt.e.clientY;
      });

      canvas.on('mouse:up', (opt: any) => {
        if (opt.e.button !== 1) return;
        isPanning = false;
        canvas.selection = true;
        wrapperEl.style.cursor = 'default';
      });

      // Keyboard shortcuts
      const onKeyDown = (e: KeyboardEvent) => {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if (
          ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) ||
          ((e.ctrlKey || e.metaKey) && e.key === 'y')
        ) {
          e.preventDefault();
          redo();
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
          const active = canvas.getActiveObject() as any;
          if (!active?.isEditing) deleteSelected();
        }
      };
      window.addEventListener('keydown', onKeyDown);

      // Drag-and-drop images onto canvas
      const onDragOver = (e: DragEvent) => { e.preventDefault(); };
      const onDrop = (e: DragEvent) => {
        e.preventDefault();
        const rect = wrapperEl.getBoundingClientRect();
        const vpt = canvas.viewportTransform ?? [1,0,0,1,0,0];
        const zoom = canvas.getZoom();
        const canvasX = (e.clientX - rect.left - vpt[4]) / zoom;
        const canvasY = (e.clientY - rect.top  - vpt[5]) / zoom;

        // Image dragged from the sidebar (url in dataTransfer)
        const url = e.dataTransfer?.getData('text/plain');
        if (url) { addImageAt(url, canvasX, canvasY); return; }

        // File dragged from OS
        const file = e.dataTransfer?.files?.[0];
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            if (ev.target?.result) addImageAt(ev.target.result as string, canvasX, canvasY);
          };
          reader.readAsDataURL(file);
        }
      };
      wrapperEl.addEventListener('dragover', onDragOver);
      wrapperEl.addEventListener('drop', onDrop);

      // Seed history with empty state
      pushHistory();

      return () => {
        upperCanvas.removeEventListener('wheel', onWheel);
        wrapperEl.removeEventListener('dragover', onDragOver);
        wrapperEl.removeEventListener('drop', onDrop);
        window.removeEventListener('keydown', onKeyDown);
        canvas.dispose();
      };
      // intentionally no deps — runs once on mount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── load initial data ─────────────────────────────────────────────────────

    useEffect(() => {
      const canvas = fabricRef.current;
      if (!canvas || !initialData) return;

      // Remove non-grid objects without destroying the grid
      canvas.getObjects().filter((o: any) => !o.isGrid).forEach(o => canvas.remove(o));

      const load = async () => {
        for (const obj of initialData.objects) {
          if (obj.type === 'image') {
            const img = await fabric.Image.fromURL(obj.src) as any;
            if (!img) continue;
            img.set({
              left: obj.x - (obj.width * obj.scaleX) / 2,
              top: obj.y - (obj.height * obj.scaleY) / 2,
              angle: obj.rotation,
              scaleX: obj.scaleX,
              scaleY: obj.scaleY,
              opacity: obj.opacity,
            });
            img.id = obj.id;
            img._customType = 'image';
            canvas.add(img);
          } else if (obj.type === 'text') {
            const t = new fabric.IText(obj.text, {
              left: obj.x - obj.width / 2,
              top: obj.y - obj.height / 2,
              fontFamily: obj.fontFamily,
              fontSize: obj.fontSize,
              fill: obj.fontColor,
              fontWeight: obj.fontWeight,
              fontStyle: obj.fontStyle,
              textAlign: obj.textAlign,
              width: obj.width,
              angle: obj.rotation,
              opacity: obj.opacity,
            } as any) as any;
            t.id = obj.id;
            t._customType = 'text';
            canvas.add(t);
          }
          // map / sticker objects persist as images via DB src — no special handling needed
        }
        canvas.renderAll();
        pushHistory();
      };

      load().catch(console.error);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    // ── render ────────────────────────────────────────────────────────────────

    const toggleGrid = () => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      gridVisibleRef.current = !gridVisibleRef.current;
      canvas.getObjects().forEach((o: any) => { if (o.isGrid) o.visible = gridVisibleRef.current; });
      canvas.renderAll();
    };

    return (
      <div className="relative">
        <canvas ref={canvasElRef} className="border border-neutral-300" style={{ display: 'block' }} />

        <div className="absolute top-2 left-2 flex gap-2">
          <button
            onClick={() => {
              const c = fabricRef.current;
              if (!c) return;
              c.zoomToPoint(new fabric.Point(c.width! / 2, c.height! / 2), c.getZoom() * 1.2);
            }}
            className="px-3 py-1 bg-primary-500 text-white text-sm rounded hover:bg-primary-600 shadow-sm"
          >
            Zoom In
          </button>
          <button
            onClick={() => {
              const c = fabricRef.current;
              if (!c) return;
              c.zoomToPoint(new fabric.Point(c.width! / 2, c.height! / 2), c.getZoom() * 0.8);
            }}
            className="px-3 py-1 bg-primary-500 text-white text-sm rounded hover:bg-primary-600 shadow-sm"
          >
            Zoom Out
          </button>
          <button
            onClick={() => {
              const c = fabricRef.current;
              if (!c) return;
              c.setZoom(1);
              c.setViewportTransform([1, 0, 0, 1, 0, 0]);
            }}
            className="px-3 py-1 bg-neutral-500 text-white text-sm rounded hover:bg-neutral-600 shadow-sm"
          >
            Fit
          </button>
          <button
            onClick={toggleGrid}
            className="px-3 py-1 bg-neutral-200 text-neutral-700 text-sm rounded hover:bg-neutral-300"
          >
            Grid
          </button>
        </div>
      </div>
    );
  }
);
