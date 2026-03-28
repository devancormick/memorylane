'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { JournalCanvasProps, CanvasData } from '@/lib/canvas/types';
import { useCanvasHistory } from '@/hooks/useCanvasHistory';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export function JournalCanvas({
  initialData,
  onSave,
  onSelectionChange,
  width = CANVAS_WIDTH,
  height = CANVAS_HEIGHT
}: JournalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<any[]>([]);

  // Initialize with default canvas data
  const defaultData: CanvasData = {
    version: '1.0',
    objects: [],
    size: { width, height }
  };

  const { saveState } = useCanvasHistory(initialData || defaultData);

  // Save canvas state
  const saveCanvasState = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects().map((obj: any, index: number) => ({
      id: obj.id || `object-${index}`,
      type: 'image' as const,
      x: obj.left || 0,
      y: obj.top || 0,
      width: obj.width || 0,
      height: obj.height || 0,
      rotation: obj.angle || 0,
      scaleX: obj.scaleX || 1,
      scaleY: obj.scaleY || 1,
      opacity: obj.opacity || 1,
      visible: obj.visible !== false,
      src: obj?.src // images may have src
    }));

    const canvasData: CanvasData = {
      version: '1.0',
      objects,
      size: { width, height }
    };

    saveState(canvasData);
    onSave(canvasData);
  }, [width, height, saveState, onSave]);

  // Add image from URL
  const addImageFromUrl = useCallback((url: string) => {
    fabric.Image.fromURL(url).then((img: any) => {
      if (!img) return;

      const maxWidth = width * 0.5;
      const maxHeight = height * 0.5;
      const scale = Math.min(maxWidth / img.width!, maxHeight / img.height!, 1);

      img.scale(scale);
      img.set({
        left: Math.random() * (width - img.getScaledWidth()),
        top: Math.random() * (height - img.getScaledHeight()),
        id: `img-${Date.now()}`
      });

      fabricCanvasRef.current!.add(img);
      fabricCanvasRef.current!.setActiveObject(img);
    });
  }, [width, height]);

  // Toggle grid visibility
  const toggleGrid = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    const gridObjects = canvas.getObjects().filter((obj: any) => obj.isGrid);
    gridObjects.forEach((obj: any) => {
      obj.visible = !obj.visible;
    });
    canvas.renderAll();
  }, []);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true
    });

    fabricCanvasRef.current = canvas;

    // Add grid overlay
    const gridSize = 16;
    const gridLines: fabric.Line[] = [];

    for (let i = 0; i <= width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: '#e5e7eb',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        opacity: 0.5
      }) as any;
      line.isGrid = true;
      gridLines.push(line);
      canvas.add(line);
    }

    for (let i = 0; i <= height; i += gridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: '#e5e7eb',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        opacity: 0.5
      }) as any;
      line.isGrid = true;
      gridLines.push(line);
      canvas.add(line);
    }

    // Send grid to back
    gridLines.forEach(line => canvas.sendObjectToBack(line));

    // Selection handlers
    const updateSelection = (selected: fabric.FabricObject[]) => {
      const objects = selected.map((obj: any) => ({
        id: obj.id || '',
        type: 'image' as const,
        x: obj.left || 0,
        y: obj.top || 0,
        width: obj.width || 0,
        height: obj.height || 0,
        rotation: obj.angle || 0,
        scaleX: obj.scaleX || 1,
        scaleY: obj.scaleY || 1,
        opacity: obj.opacity || 1,
        visible: obj.visible !== false
      }));
      setSelectedObjects(objects);
      if (onSelectionChange) {
        onSelectionChange(objects);
      }
    };

    canvas.on('selection:created', (e: any) => {
      updateSelection(e.selected || []);
    });

    canvas.on('selection:updated', (e: any) => {
      updateSelection(e.selected || []);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObjects([]);
      if (onSelectionChange) onSelectionChange([]);
    });

    // Modification handlers
    canvas.on('object:modified', () => {
      saveCanvasState();
    });

    canvas.on('object:added', () => {
      saveCanvasState();
    });

    canvas.on('object:removed', () => {
      saveCanvasState();
    });

    return () => {
      canvas.dispose();
    };
  }, [width, height, onSelectionChange, saveCanvasState]);

  // Load initial data
  useEffect(() => {
    if (!fabricCanvasRef.current || !initialData) return;

    const canvas = fabricCanvasRef.current;
    canvas.clear();

    // Re-add grid after clear
    const gridSize = 16;
    for (let i = 0; i <= width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: '#e5e7eb',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        opacity: 0.5
      }) as any;
      line.isGrid = true;
      canvas.add(line);
    }
    for (let i = 0; i <= height; i += gridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: '#e5e7eb',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        opacity: 0.5
      }) as any;
      line.isGrid = true;
      canvas.add(line);
    }

    initialData.objects.forEach((obj: any) => {
      if (obj.type === 'image') {
        fabric.Image.fromURL(obj.src).then((img: any) => {
          if (!img) return;
          img.set({
            left: obj.x,
            top: obj.y,
            angle: obj.rotation,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            opacity: obj.opacity,
            id: obj.id
          });
          canvas.add(img);
        });
      }
    });

    // Ensure grid is behind all objects
    setTimeout(() => {
      const gridObjs = canvas.getObjects().filter((obj: any) => obj.isGrid);
      gridObjs.forEach((obj: any) => canvas.sendObjectToBack(obj));
    }, 0);
  }, [initialData, width, height]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="border border-neutral-300" style={{ display: 'block' }} />

      {/* Controls */}
      <div className="absolute top-2 left-2 flex gap-2">
        <button
          onClick={() => {
            if (!fabricCanvasRef.current) return;
            const canvas = fabricCanvasRef.current;
            canvas.zoomToPoint(
              new fabric.Point(canvas.width! / 2, canvas.height! / 2),
              canvas.getZoom() * 1.2
            );
          }}
          className="px-3 py-1 bg-primary-500 text-white text-sm rounded hover:bg-primary-600 shadow-sm"
        >
          Zoom In
        </button>
        <button
          onClick={() => {
            if (!fabricCanvasRef.current) return;
            const canvas = fabricCanvasRef.current;
            canvas.zoomToPoint(
              new fabric.Point(canvas.width! / 2, canvas.height! / 2),
              canvas.getZoom() * 0.8
            );
          }}
          className="px-3 py-1 bg-primary-500 text-white text-sm rounded hover:bg-primary-600 shadow-sm"
        >
          Zoom Out
        </button>
        <button
          onClick={() => {
            if (!fabricCanvasRef.current) return;
            const canvas = fabricCanvasRef.current;
            canvas.setZoom(1);
            canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
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

      {/* Image URL Input */}
      <div className="absolute top-2 right-2">
        <input
          type="text"
          placeholder="Enter image URL and press Enter"
          className="px-3 py-1.5 text-sm border border-neutral-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-56"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const url = (e.target as HTMLInputElement).value.trim();
              if (url) {
                addImageFromUrl(url);
                (e.target as HTMLInputElement).value = '';
              }
            }
          }}
        />
      </div>

      {/* Selection Info */}
      {selectedObjects.length > 0 && (
        <div className="absolute bottom-2 left-2 bg-neutral-800 bg-opacity-75 text-white px-3 py-1 rounded text-xs">
          {selectedObjects.length} selected
        </div>
      )}
    </div>
  );
}