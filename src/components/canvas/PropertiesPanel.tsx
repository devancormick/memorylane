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
  onUpdate: (updates: any) => void;
}

export function PropertiesPanel({ selectedObject, onUpdate }: PropertiesPanelProps) {
  if (!selectedObject) {
    return (
      <Card className="h-full">
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

  const handleChange = (key: string, value: any) => {
    onUpdate({ [key]: value });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-sans">Properties</CardTitle>
          <Badge variant="primary" className="text-xs">
            {selectedObject.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Position Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
            Position
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">X</Label>
              <Input
                type="number"
                value={Math.round(selectedObject.x)}
                onChange={(e) => handleChange('x', parseFloat(e.target.value))}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Y</Label>
              <Input
                type="number"
                value={Math.round(selectedObject.y)}
                onChange={(e) => handleChange('y', parseFloat(e.target.value))}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Width</Label>
              <Input
                type="number"
                value={Math.round(selectedObject.width)}
                onChange={(e) => handleChange('width', parseFloat(e.target.value))}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Height</Label>
              <Input
                type="number"
                value={Math.round(selectedObject.height)}
                onChange={(e) => handleChange('height', parseFloat(e.target.value))}
                className="h-8"
              />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
            Rotation
          </h4>
          <div className="flex items-center gap-3">
            <Slider
              min={0}
              max={360}
              step={1}
              value={[selectedObject.rotation || 0]}
              onValueChange={([val]: number[]) => handleChange('rotation', val)}
              className="flex-1"
            />
            <span className="text-sm w-12 text-right font-mono tabular-nums">
              {Math.round(selectedObject.rotation || 0)}°
            </span>
          </div>
        </div>

        {/* Opacity */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
            Opacity
          </h4>
          <div className="flex items-center gap-3">
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[selectedObject.opacity ?? 1]}
              onValueChange={([val]: number[]) => handleChange('opacity', val)}
              className="flex-1"
            />
            <span className="text-sm w-12 text-right">
              {Math.round((selectedObject.opacity ?? 1) * 100)}%
            </span>
          </div>
        </div>

        {/* Type-specific properties */}
        {selectedObject.type === 'image' && (
          <div className="space-y-3 border-t border-neutral-200 pt-4">
            <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
              Image Adjustments
            </h4>
            <Button variant="secondary" size="sm" className="w-full">
              Flip Horizontal
            </Button>
            <Button variant="secondary" size="sm" className="w-full">
              Flip Vertical
            </Button>
          </div>
        )}

        {selectedObject.type === 'text' && (
          <div className="space-y-3 border-t border-neutral-200 pt-4">
            <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
              Text Formatting
            </h4>
            <div className="space-y-1">
              <Label className="text-xs">Font Family</Label>
              <Input
                value={selectedObject.fontFamily || 'Georgia'}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Font Size</Label>
              <Input
                type="number"
                value={selectedObject.fontSize || 18}
                onChange={(e) => handleChange('fontSize', parseFloat(e.target.value))}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={selectedObject.fontColor || '#000000'}
                  onChange={(e) => handleChange('fontColor', e.target.value)}
                  className="w-10 h-8 p-1"
                />
                <Input
                  type="text"
                  value={selectedObject.fontColor || '#000000'}
                  onChange={(e) => handleChange('fontColor', e.target.value)}
                  className="h-8 flex-1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedObject.fontWeight === 'bold' ? 'primary' : 'secondary'}
                size="sm"
                className="flex-1"
                onClick={() => handleChange('fontWeight', selectedObject.fontWeight === 'bold' ? 'normal' : 'bold')}
              >
                <span className="font-bold">B</span>
              </Button>
              <Button
                variant={selectedObject.fontStyle === 'italic' ? 'primary' : 'secondary'}
                size="sm"
                className="flex-1"
                onClick={() => handleChange('fontStyle', selectedObject.fontStyle === 'italic' ? 'normal' : 'italic')}
              >
                <span className="italic">I</span>
              </Button>
            </div>
          </div>
        )}

        {/* Sticker tint */}
        {selectedObject.type === 'sticker' && (
          <div className="space-y-3 border-t border-neutral-200 pt-4">
            <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
              Sticker Tint
            </h4>
            <div className="flex items-center gap-3">
              <Slider
                min={0}
                max={360}
                step={1}
                value={[selectedObject.hueTint || 0]}
                onValueChange={([val]: number[]) => handleChange('hueTint', val)}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right font-mono">
                {selectedObject.hueTint || 0}°
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="border-t border-neutral-200 pt-4 space-y-2">
          <Button variant="secondary" size="sm" className="w-full">
            Duplicate
          </Button>
          <Button variant="ghost" size="sm" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}