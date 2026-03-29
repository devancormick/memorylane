'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Stage, Layer, Image as KonvaImage, Line } from 'react-konva';
import Konva from 'konva';
import { JournalCanvasProps, CanvasData, CanvasObject } from '@/lib/canvas/types';
import { useCanvasHistory } from '@/hooks/useCanvasHistory';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export function KonvaJournalCanvas({
  initialData,
  onSave,
  width = CANVAS_WIDTH,
  height = CANVAS_HEIGHT
}: JournalCanvasProps) {
  const stageRef = useRef<Konva.Stage | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<CanvasObject[]>([]);
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  // Initialize with default canvas data
  const defaultData: CanvasData = {
    version: '1.0',
    objects: [],
    size: { width, height }
  };

  const { currentState, saveState } = useCanvasHistory(initialData || defaultData);

  const saveCanvasState = useCallback(() => {
    if (!layerRef.current) return;

    const layer = layerRef.current;
    const children = layer.children || [];
    const objects = children
      .filter(child => child.name() !== 'grid') // Exclude grid lines
      .map((child, index) => ({
        id: child.id() || `object-${index}`,
        type: 'image' as const,
        x: child.x(),
        y: child.y(),
        width: child.width(),
        height: child.height(),
        rotation: child.rotation(),
        scaleX: child.scaleX(),
        scaleY: child.scaleY(),
        opacity: child.opacity(),
        visible: child.visible()
      }));

    const canvasData: CanvasData = {
      version: '1.0',
      objects,
      size: { width, height }
    };

    saveState(canvasData);
    onSave(canvasData);
  }, [width, height, saveState, onSave]);

  const addImageFromUrl = useCallback((url: string) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImages(prev => [...prev, img]);

      if (!layerRef.current) return;

      // Scale image to fit within canvas bounds
      const maxWidth = width * 0.5;
      const maxHeight = height * 0.5;
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);

      const imageNode = new Konva.Image({
        image: img,
        x: Math.random() * (width - img.width * scale),
        y: Math.random() * (height - img.height * scale),
        width: img.width * scale,
        height: img.height * scale,
        id: `image-${Date.now()}`,
        draggable: true
      });

      layerRef.current.add(imageNode);
      layerRef.current.draw();

      // Select the new image
      const tr = new Konva.Transformer({
        nodes: [imageNode],
        rotateEnabled: true,
        resizeEnabled: true,
        borderEnabled: true
      });
      layerRef.current.add(tr);
      layerRef.current.draw();
    };
    img.src = url;
  }, [width, height]);

  // Create grid lines
  const createGridLines = useCallback(() => {
    const gridSize = 16;
    const lines = [];

    // Vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i, 0, i, height]}
          stroke="#e0e0e0"
          strokeWidth={1}
          opacity={0.5}
          listening={false}
          name="grid"
        />
      );
    }

    // Horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, i, width, i]}
          stroke="#e0e0e0"
          strokeWidth={1}
          opacity={0.5}
          listening={false}
          name="grid"
        />
      );
    }

    return lines;
  }, [width, height]);

  // Load initial data
  useEffect(() => {
    if (!initialData || !layerRef.current) return;

    const layer = layerRef.current;
    layer.destroyChildren(); // Clear existing objects

    initialData.objects.forEach(obj => {
      if (obj.type === 'image') {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const imageNode = new Konva.Image({
            image: img,
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height,
            rotation: obj.rotation,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            opacity: obj.opacity,
            id: obj.id,
            draggable: true
          });

          layer.add(imageNode);
          layer.draw();
        };
        img.src = (obj as any).src;
      }
    });
  }, [initialData]);

  return (
    <div className="relative">
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        className="border border-gray-300"
        onClick={() => {
          // Clear selection when clicking empty area
          if (layerRef.current) {
            const transformers = layerRef.current.find('Transformer');
            transformers.forEach((tr: any) => tr.destroy());
            layerRef.current.draw();
            setSelectedObjects([]);
          }
        }}
      >
        <Layer ref={layerRef}>
          {/* Grid lines */}
          {createGridLines()}

          {/* Canvas objects will be added here dynamically */}
        </Layer>
      </Stage>

      {/* Canvas Controls */}
      <div className="absolute top-2 left-2 flex gap-2">
        <button
          onClick={() => {
            if (!stageRef.current) return;
            const stage = stageRef.current;
            const currentScale = stage.scaleX();
            stage.scale({ x: currentScale * 1.2, y: currentScale * 1.2 });
          }}
          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
        >
          Zoom In
        </button>
        <button
          onClick={() => {
            if (!stageRef.current) return;
            const stage = stageRef.current;
            const currentScale = stage.scaleX();
            stage.scale({ x: currentScale * 0.8, y: currentScale * 0.8 });
          }}
          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
        >
          Zoom Out
        </button>
        <button
          onClick={() => {
            if (!stageRef.current) return;
            stageRef.current.scale({ x: 1, y: 1 });
            stageRef.current.position({ x: 0, y: 0 });
          }}
          className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
        >
          Fit to Screen
        </button>
      </div>

      {/* Image Upload */}
      <div className="absolute top-2 right-2">
        <input
          type="text"
          placeholder="Enter image URL"
          className="px-3 py-1 border border-gray-300 rounded text-sm mr-2 w-48"
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
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
          {selectedObjects.length} object{selectedObjects.length > 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}