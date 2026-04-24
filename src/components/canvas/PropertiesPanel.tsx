'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PropertiesPanelProps {
  selectedObject: any | null;
  onUpdate: (updates: Record<string, unknown>) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export function PropertiesPanel({
  selectedObject,
  onUpdate,
  onDelete,
  onDuplicate,
}: PropertiesPanelProps) {
  if (!selectedObject) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-neutral-500 text-center py-8">
            Select an object to edit its properties
          </div>
        </CardContent>
      </Card>
    );
  }

  const set = (key: string, value: unknown) => onUpdate({ [key]: value });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-sans">Properties</CardTitle>
          <Badge variant="primary" className="text-xs capitalize">
            {selectedObject.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* Position & Size */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Position &amp; Size
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'X', key: 'x' },
              { label: 'Y', key: 'y' },
              { label: 'W', key: 'width' },
              { label: 'H', key: 'height' },
            ].map(({ label, key }) => (
              <div key={key} className="space-y-1">
                <Label className="text-xs">{label}</Label>
                <Input
                  type="number"
                  value={Math.round(selectedObject[key] ?? 0)}
                  onChange={(e) => set(key, parseFloat(e.target.value))}
                  className="h-8"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Rotation */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Rotation
          </h4>
          <div className="flex items-center gap-3">
            <Slider
              min={0}
              max={360}
              step={1}
              value={[selectedObject.rotation ?? 0]}
              onValueChange={([val]: number[]) => set('rotation', val)}
              className="flex-1"
            />
            <span className="text-sm w-10 text-right font-mono tabular-nums">
              {Math.round(selectedObject.rotation ?? 0)}°
            </span>
          </div>
        </div>

        {/* Opacity */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Opacity
          </h4>
          <div className="flex items-center gap-3">
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[selectedObject.opacity ?? 1]}
              onValueChange={([val]: number[]) => set('opacity', val)}
              className="flex-1"
            />
            <span className="text-sm w-10 text-right tabular-nums">
              {Math.round((selectedObject.opacity ?? 1) * 100)}%
            </span>
          </div>
        </div>

        {/* Image-specific */}
        {selectedObject.type === 'image' && (
          <div className="space-y-2 border-t border-neutral-200 pt-4">
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Image
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" onClick={() => set('flipH', true)}>
                Flip H
              </Button>
              <Button variant="secondary" size="sm" onClick={() => set('flipV', true)}>
                Flip V
              </Button>
            </div>
          </div>
        )}

        {/* Text-specific */}
        {selectedObject.type === 'text' && (
          <div className="space-y-2 border-t border-neutral-200 pt-4">
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Text
            </h4>
            <div className="space-y-1">
              <Label className="text-xs">Font</Label>
              <Input
                value={selectedObject.fontFamily ?? 'Georgia'}
                onChange={(e) => set('fontFamily', e.target.value)}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Size</Label>
              <Input
                type="number"
                value={selectedObject.fontSize ?? 18}
                onChange={(e) => set('fontSize', parseFloat(e.target.value))}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={selectedObject.fontColor ?? '#000000'}
                  onChange={(e) => set('fontColor', e.target.value)}
                  className="w-10 h-8 p-1 cursor-pointer"
                />
                <Input
                  value={selectedObject.fontColor ?? '#000000'}
                  onChange={(e) => set('fontColor', e.target.value)}
                  className="h-8 flex-1 font-mono text-xs"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedObject.fontWeight === 'bold' ? 'primary' : 'secondary'}
                size="sm"
                className="flex-1 font-bold"
                onClick={() =>
                  set('fontWeight', selectedObject.fontWeight === 'bold' ? 'normal' : 'bold')
                }
              >
                B
              </Button>
              <Button
                variant={selectedObject.fontStyle === 'italic' ? 'primary' : 'secondary'}
                size="sm"
                className="flex-1 italic"
                onClick={() =>
                  set('fontStyle', selectedObject.fontStyle === 'italic' ? 'normal' : 'italic')
                }
              >
                I
              </Button>
            </div>
          </div>
        )}

        {/* Sticker tint */}
        {selectedObject.type === 'sticker' && (
          <div className="space-y-2 border-t border-neutral-200 pt-4">
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Sticker Tint
            </h4>
            <div className="flex items-center gap-3">
              <Slider
                min={0}
                max={360}
                step={1}
                value={[selectedObject.hueTint ?? 0]}
                onValueChange={([val]: number[]) => set('hueTint', val)}
                className="flex-1"
              />
              <span className="text-sm w-10 text-right font-mono">
                {selectedObject.hueTint ?? 0}°
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="border-t border-neutral-200 pt-4 space-y-2">
          <Button variant="secondary" size="sm" className="w-full" onClick={onDuplicate}>
            Duplicate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
