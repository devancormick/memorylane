'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  JournalCanvas,
  JournalCanvasHandle,
} from '@/components/canvas/JournalCanvas';
import { KonvaJournalCanvas } from '@/components/canvas/KonvaJournalCanvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SuiteNav } from '@/components/layout/SuiteNav';
import { PropertiesPanel } from '@/components/canvas/PropertiesPanel';
import { CanvasData, CanvasObject } from '@/lib/canvas/types';
import { STICKER_LIST } from '@/lib/stickers';

const SAMPLE_JOURNAL_DATA: CanvasData = {
  version: '1.0',
  size: { width: 800, height: 600 },
  objects: [
    {
      id: 'title-1',
      type: 'text',
      x: 400,
      y: 80,
      width: 600,
      height: 60,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      visible: true,
      text: 'My Paris Adventure',
      fontFamily: 'Merriweather',
      fontSize: 42,
      fontColor: '#111827',
      fontWeight: 'bold',
      fontStyle: 'normal',
      textAlign: 'center',
      lineHeight: 1.2,
    },
    {
      id: 'subtitle-1',
      type: 'text',
      x: 400,
      y: 140,
      width: 500,
      height: 30,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 0.8,
      visible: true,
      text: 'June 2024 • 5 Days in the City of Light',
      fontFamily: 'Inter',
      fontSize: 16,
      fontColor: '#6B7280',
      fontWeight: 'normal',
      fontStyle: 'italic',
      textAlign: 'center',
      lineHeight: 1.5,
    },
    {
      id: 'photo-1',
      type: 'image',
      x: 200,
      y: 310,
      width: 300,
      height: 200,
      rotation: -2,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      visible: true,
      src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
    },
    {
      id: 'photo-2',
      type: 'image',
      x: 590,
      y: 310,
      width: 280,
      height: 180,
      rotation: 3,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      visible: true,
      src: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop',
    },
    {
      id: 'text-1',
      type: 'text',
      x: 400,
      y: 510,
      width: 700,
      height: 80,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      visible: true,
      text: 'Walking along the Seine at sunset — a moment that took my breath away.',
      fontFamily: 'Georgia',
      fontSize: 18,
      fontColor: '#374151',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'center',
      lineHeight: 1.6,
    },
  ],
};

const EXAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
  'https://images.unsplash.com/photo-1479030160180-b1860951d696?w=400',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400',
];

export default function Home() {
  const canvasRef = useRef<JournalCanvasHandle>(null);
  const [activeCanvas, setActiveCanvas] = useState<'fabric' | 'konva'>('fabric');
  const [canvasData, setCanvasData] = useState<CanvasData | null>(null);
  const [selectedObject, setSelectedObject] = useState<CanvasObject | null>(null);
  const [journalId, setJournalId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  const [showMapInput, setShowMapInput] = useState(false);
  const [mapInput, setMapInput] = useState('');
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [libraryImages, setLibraryImages] = useState<string[]>(EXAMPLE_IMAGES);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLocalFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        setLibraryImages((prev) => [...prev, src]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    setLibraryImages((prev) => [...prev, url]);
    setUrlInput('');
  };

  useEffect(() => {
    fetch('/api/journals')
      .then((r) => r.json())
      .then((journals) => {
        if (journals.length > 0) {
          setJournalId(journals[0]._id);
          setCanvasData(journals[0].canvasData);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (data: CanvasData) => {
    setCanvasData(data);
    setSaving(true);
    setSaveStatus('idle');
    try {
      if (journalId) {
        await fetch(`/api/journals/${journalId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ canvasData: data }),
        });
      } else {
        const res = await fetch('/api/journals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'My Journal', canvasData: data }),
        });
        const created = await res.json();
        setJournalId(created._id);
      }
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectionChange = (objects: CanvasObject[]) => {
    setSelectedObject(objects[0] ?? null);
  };

  const handlePropertyUpdate = (updates: Record<string, unknown>) => {
    canvasRef.current?.updateSelected(updates);
    if (selectedObject) {
      setSelectedObject({ ...selectedObject, ...updates } as CanvasObject);
    }
  };

  const handleAddMap = () => {
    if (!mapInput.trim()) return;
    canvasRef.current?.addMap(mapInput.trim());
    setMapInput('');
    setShowMapInput(false);
  };

  const exportSlot = (
    <Button variant="primary" size="sm" onClick={() => canvasRef.current?.exportPDF()}>
      Export PDF →
    </Button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-orange-50">
      <SuiteNav rightSlot={exportSlot} />

      {/* Hero */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto text-center mb-8">
          <Badge variant="accent" className="mb-4">Canvas Editor v1.0</Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-4">
            Capture Your Journey, Create Your Story
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-6">
            Design beautiful travel journals with photos, maps, and memories.
          </p>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <Button variant="primary" size="lg" onClick={() => canvasRef.current?.addText()}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8l-8-8-8 8" />
              </svg>
              New Journal
            </Button>
            <Button variant="secondary" size="lg" onClick={() => canvasRef.current?.exportPNG()}>
              Export PNG
            </Button>
          </div>
        </div>
      </section>

      {/* Main Editor — 4-column grid */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-4 gap-6">

          {/* ── Left Sidebar ── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Photo Library */}
            <Card className="brand-shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-sans">Photo Library</CardTitle>
                <CardDescription className="text-xs">Click or drag onto canvas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Thumbnails */}
                <div className="grid grid-cols-2 gap-2">
                  {libraryImages.map((img, i) => (
                    <div key={i} className="relative group aspect-square">
                      <button
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', img)}
                        className="w-full h-full rounded-lg overflow-hidden border-2 border-transparent group-hover:border-primary-400 transition-all duration-200 cursor-grab active:cursor-grabbing"
                        onClick={() => canvasRef.current?.addImage(img)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                      <button
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        onClick={() => setLibraryImages((prev) => prev.filter((_, idx) => idx !== i))}
                        title="Remove from library"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Local file upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleLocalFiles(e.target.files)}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload from device
                </Button>

                {/* Online URL */}
                <div className="flex gap-1">
                  <Input
                    placeholder="Paste image URL…"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddUrl(); }}
                    className="h-8 text-xs"
                  />
                  <Button size="sm" variant="primary" className="h-8 px-2 shrink-0" onClick={handleAddUrl}>
                    Add
                  </Button>
                </div>

                {/* Drop zone */}
                <div
                  className="border-2 border-dashed border-neutral-300 rounded-lg p-3 text-center text-xs text-neutral-400 hover:border-primary-400 hover:text-primary-500 transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleLocalFiles(e.dataTransfer.files);
                  }}
                >
                  Drop images here to add to library
                </div>
              </CardContent>
            </Card>

            {/* Quick Add */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-sans">Quick Add</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">

                {/* Add Map */}
                <div className="space-y-1">
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => { setShowMapInput(v => !v); setShowStickerPicker(false); }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Add Map Location
                  </Button>
                  {showMapInput && (
                    <div className="flex gap-1">
                      <Input
                        placeholder="e.g. Paris, France"
                        value={mapInput}
                        onChange={(e) => setMapInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddMap(); }}
                        className="h-8 text-sm"
                        autoFocus
                      />
                      <Button size="sm" variant="primary" className="h-8 px-2 shrink-0" onClick={handleAddMap}>
                        Add
                      </Button>
                    </div>
                  )}
                </div>

                {/* Add Text */}
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  size="sm"
                  onClick={() => canvasRef.current?.addText()}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Add Text
                </Button>

                {/* Add Sticker */}
                <div className="space-y-1">
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => { setShowStickerPicker(v => !v); setShowMapInput(false); }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Add Sticker
                  </Button>
                  {showStickerPicker && (
                    <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-50 rounded-lg border border-neutral-200">
                      {STICKER_LIST.map((sticker) => (
                        <button
                          key={sticker.id}
                          title={sticker.name}
                          className="p-1 rounded hover:bg-primary-50 hover:border-primary-300 border border-transparent transition-colors text-center"
                          onClick={() => {
                            canvasRef.current?.addSticker(sticker.id);
                            setShowStickerPicker(false);
                          }}
                        >
                          <div
                            className="w-10 h-10 mx-auto"
                            dangerouslySetInnerHTML={{ __html: sticker.svg }}
                          />
                          <span className="text-xs text-neutral-500 leading-none">{sticker.name.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Templates */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-sans">Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  className="w-full p-3 rounded-lg border border-neutral-200 hover:border-primary-400 hover:bg-primary-50 transition-colors text-left"
                  onClick={() => setCanvasData(SAMPLE_JOURNAL_DATA)}
                >
                  <div className="font-medium text-sm">Travel Diary</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Classic journal layout</div>
                </button>
                <button
                  className="w-full p-3 rounded-lg border border-neutral-200 hover:border-primary-400 hover:bg-primary-50 transition-colors text-left"
                  onClick={() => canvasRef.current?.addImage(EXAMPLE_IMAGES[0])}
                >
                  <div className="font-medium text-sm">Photo Collage</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Image-focused design</div>
                </button>
              </CardContent>
            </Card>
          </div>

          {/* ── Canvas Column ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden">

              {/* Toolbar */}
              <div className="border-b border-neutral-200 p-3 bg-neutral-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Undo (Ctrl+Z)"
                      className="w-8 h-8 p-0"
                      onClick={() => canvasRef.current?.undo()}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Redo (Ctrl+Shift+Z)"
                      className="w-8 h-8 p-0"
                      onClick={() => canvasRef.current?.redo()}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                      </svg>
                    </Button>
                    <div className="h-4 w-px bg-neutral-300 mx-1" />
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Add Text"
                      className="w-8 h-8 p-0"
                      onClick={() => canvasRef.current?.addText()}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </Button>
                  </div>

                  <Tabs value={activeCanvas} onValueChange={(v: string) => setActiveCanvas(v as 'fabric' | 'konva')}>
                    <TabsList className="grid grid-cols-2 w-auto p-1">
                      <TabsTrigger value="fabric" className="text-xs px-3">Fabric.js</TabsTrigger>
                      <TabsTrigger value="konva" className="text-xs px-3">Konva.js</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {/* Canvas */}
              <div className="p-4 flex items-center justify-center bg-neutral-100 min-h-[620px]">
                <div className="relative">
                  {activeCanvas === 'fabric' ? (
                    <JournalCanvas
                      ref={canvasRef}
                      initialData={canvasData ?? SAMPLE_JOURNAL_DATA}
                      onSave={handleSave}
                      onSelectionChange={handleSelectionChange}
                    />
                  ) : (
                    <KonvaJournalCanvas
                      initialData={canvasData ?? SAMPLE_JOURNAL_DATA}
                      onSave={handleSave}
                      onSelectionChange={handleSelectionChange}
                    />
                  )}
                </div>
              </div>

              {/* Status bar */}
              <div className="border-t border-neutral-200 p-2 bg-neutral-50 flex items-center justify-between">
                <div className="text-xs text-neutral-500">
                  <span>Canvas: 800 × 600</span>
                  <span className="mx-2">•</span>
                  <span>{canvasData?.objects.length ?? SAMPLE_JOURNAL_DATA.objects.length} objects</span>
                </div>
                <div className="flex items-center space-x-2">
                  {saving && <span className="text-xs text-neutral-400">Saving…</span>}
                  {!saving && saveStatus === 'saved' && (
                    <span className="text-xs text-green-600">Saved</span>
                  )}
                  {!saving && saveStatus === 'error' && (
                    <span className="text-xs text-red-500">Save failed</span>
                  )}
                  <span className="text-xs text-neutral-400">v1.0</span>
                </div>
              </div>
            </div>

            {/* Tips row */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-neutral-600">
              {[
                { icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12', label: 'Drag corners to resize' },
                { icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122', label: 'Double-click text to edit' },
                { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', label: 'Ctrl+Z to undo' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center space-x-2 bg-white p-2 rounded border border-neutral-200">
                  <svg className="w-4 h-4 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Properties Panel */}
            <PropertiesPanel
              selectedObject={selectedObject}
              onUpdate={handlePropertyUpdate}
              onDelete={() => canvasRef.current?.deleteSelected()}
              onDuplicate={() => canvasRef.current?.duplicateSelected()}
            />

            {/* Export */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-sans">Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => canvasRef.current?.exportPNG()}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Export PNG
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => canvasRef.current?.exportPDF()}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tip */}
            <Card className="bg-primary-50 border-primary-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm">
                    <p className="font-medium text-neutral-900 mb-1">Tips</p>
                    <ul className="text-neutral-600 space-y-1 text-xs">
                      <li>• Double-click text to start editing</li>
                      <li>• Delete key removes selected objects</li>
                      <li>• Use Quick Add to embed live map tiles</li>
                      <li>• Export PNG renders at 2× resolution</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-neutral-500">MemoryLane — Capture Your Journey, Create Your Story</p>
          <div className="flex justify-center items-center space-x-6 mt-3">
            <a href="#" className="text-neutral-400 hover:text-primary-500 text-sm">Help</a>
            <a href="#" className="text-neutral-400 hover:text-primary-500 text-sm">Tutorials</a>
            <a href="#" className="text-neutral-400 hover:text-primary-500 text-sm">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
