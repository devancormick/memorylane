'use client';

import React, { useState, useEffect } from 'react';
import { JournalCanvas } from '@/components/canvas/JournalCanvas';
import { KonvaJournalCanvas } from '@/components/canvas/KonvaJournalCanvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertiesPanel } from '@/components/canvas/PropertiesPanel';
import Image from 'next/image';
import { CanvasData, CanvasObject, CanvasObjectType } from '@/lib/canvas/types';

// Sample travel journal data to demonstrate the app
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
      lineHeight: 1.2
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
      lineHeight: 1.5
    },
    {
      id: 'photo-1',
      type: 'image',
      x: 50,
      y: 200,
      width: 300,
      height: 200,
      rotation: -2,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      visible: true,
      src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop'
    },
    {
      id: 'photo-2',
      type: 'image',
      x: 450,
      y: 220,
      width: 280,
      height: 180,
      rotation: 3,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      visible: true,
      src: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop'
    },
    {
      id: 'text-1',
      type: 'text',
      x: 400,
      y: 440,
      width: 700,
      height: 120,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      visible: true,
      text: 'Walking along the Seine at sunset, watching the Eiffel Tower sparkle for the first time — a moment that took my breath away. Paris isn\'t just a city; it\'s a feeling.',
      fontFamily: 'Georgia',
      fontSize: 18,
      fontColor: '#374151',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'center',
      lineHeight: 1.6
    }
  ]
};

const EXAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
  'https://images.unsplash.com/photo-1479030160180-b1860951d696?w=400',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400'
];

export default function Home() {
  const [activeCanvas, setActiveCanvas] = useState<'fabric' | 'konva'>('fabric');
  const [canvasData, setCanvasData] = useState<CanvasData | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedObject, setSelectedObject] = useState<CanvasObject | null>(null);
  const [journalId, setJournalId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

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
          body: JSON.stringify({
            title: 'My Journal',
            canvasData: data,
          }),
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

  const addSampleImage = (index: number) => {
    const url = EXAMPLE_IMAGES[index % EXAMPLE_IMAGES.length];
    // This would need to be connected to canvas ref in production
    console.log('Add image:', url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 brand-gradient rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold font-serif text-neutral-900">MemoryLane</h1>
                <p className="text-xs text-neutral-500">Travel Journal Editor</p>
              </div>
            </div>

            <nav className="flex items-center space-x-4">
              <a href="#" className="text-sm font-medium text-neutral-600 hover:text-primary-500 transition-colors">My Journals</a>
              <a href="#" className="text-sm font-medium text-neutral-600 hover:text-primary-500 transition-colors">Templates</a>
              <Button variant="primary" size="sm">Export →</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <Badge variant="accent" className="mb-4">Canvas Editor v1.0</Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-4">
            Capture Your Journey, Create Your Story
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            Design beautiful travel journals with photos, maps, and memories.
            Drag, drop, and arrange your memories like a pro.
          </p>

          <div className="flex justify-center items-center gap-4 flex-wrap">
            <Button variant="primary" size="lg" className="font-medium">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8l-8-8-8 8" />
              </svg>
              New Journal
            </Button>
            <Button variant="secondary" size="lg">
              View Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Main Editor */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Image Library */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="brand-shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-sans">Photo Library</CardTitle>
                <CardDescription>Click to add a photo to your canvas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {EXAMPLE_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary-400 hover:scale-105 transition-all duration-200"
                      onClick={() => addSampleImage(i)}
                    >
                      <Image
                        src={img}
                        alt={`Sample ${i}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-sans">Quick Add</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="secondary" className="w-full justify-start" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Add Map Location
                </Button>
                <Button variant="secondary" className="w-full justify-start" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Add Text
                </Button>
                <Button variant="secondary" className="w-full justify-start" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Add Sticker
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-sans">Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button className="w-full p-3 rounded-lg border border-neutral-200 hover:border-primary-400 hover:bg-primary-50 transition-colors text-left">
                  <div className="font-medium text-sm">Travel Diary</div>
                  <div className="text-xs text-neutral-500 mt-1">Classic journal layout</div>
                </button>
                <button className="w-full p-3 rounded-lg border border-neutral-200 hover:border-primary-400 hover:bg-primary-50 transition-colors text-left">
                  <div className="font-medium text-sm">Photo Collage</div>
                  <div className="text-xs text-neutral-500 mt-1">Image-focused design</div>
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
              {/* Canvas Toolbar */}
              <div className="border-b border-neutral-200 p-3 bg-neutral-50">
      <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" title="Undo" className="w-8 h-8 p-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    </Button>
                    <Button variant="ghost" size="sm" title="Redo" className="w-8 h-8 p-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                      </svg>
                    </Button>
                    <div className="h-4 w-px bg-neutral-300 mx-2" />
                    <Button variant="ghost" size="sm" title="Toggle Grid" className="w-8 h-8 p-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </Button>
                    <span className="text-xs text-neutral-500 ml-2">Grid: 16px</span>
                  </div>

                  <Tabs value={activeCanvas} onValueChange={(v: string) => setActiveCanvas(v as 'fabric' | 'konva')}>
                    <TabsList className="grid w-auto p-1">
                      <TabsTrigger value="fabric" className="text-xs px-3">Fabric.js</TabsTrigger>
                      <TabsTrigger value="konva" className="text-xs px-3">Konva.js</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {/* Canvas Container */}
              <div className="p-4 flex items-center justify-center bg-neutral-100 min-h-[600px]">
                <div className="relative">
                  {activeCanvas === 'fabric' ? (
                    <JournalCanvas
                      initialData={canvasData ?? SAMPLE_JOURNAL_DATA}
                      onSave={handleSave}
                      onSelectionChange={(objects) => setSelectedObject(objects[0] || null)}
                    />
                  ) : (
                    <KonvaJournalCanvas
                      initialData={canvasData ?? SAMPLE_JOURNAL_DATA}
                      onSave={handleSave}
                      onSelectionChange={(objects) => setSelectedObject(objects[0] || null)}
                    />
                  )}
                </div>
          </div>

            {/* Properties */}
            <div className="lg:col-span-1 space-y-6">
              <PropertiesPanel 
                selectedObject={selectedObject}
                onUpdate={(updates) => {
                  // For now, log updates - in real implementation would update canvas object
                  console.log('Update object:', updates);
                }}
              />

              {/* Export Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-sans">Export</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="primary" className="w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Export PNG
                  </Button>
                  <Button variant="secondary" className="w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export PDF
                  </Button>
                  <Button variant="ghost" className="w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share HTML
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Tip Card */}
              <Card className="bg-primary-50 border-primary-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm">
                      <p className="font-medium text-neutral-900 mb-1">Pro Tip</p>
                      <p className="text-neutral-600">Press Ctrl+Z to undo. Use the Properties panel to fine-tune selected objects.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
              <div className="border-t border-neutral-200 p-2 bg-neutral-50 flex items-center justify-between">
                <div className="text-xs text-neutral-500">
                  <span id="canvas-info">Canvas: 800 × 600</span>
                  <span className="mx-2">•</span>
                  <span id="object-count">5 objects</span>
                </div>
                <div className="flex items-center space-x-2">
                  {saving && <span className="text-xs text-neutral-400">Saving…</span>}
                  {!saving && saveStatus === 'saved' && <span className="text-xs text-green-600">Saved</span>}
                  {!saving && saveStatus === 'error' && <span className="text-xs text-red-500">Save failed</span>}
                  <span className="text-xs text-neutral-500">v1.0</span>
                </div>
              </div>
            </div>

            {/* Canvas Instructions */}
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-neutral-600">
              <div className="flex items-center space-x-2 bg-white p-2 rounded border border-neutral-200">
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Enter image URL above to add</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-2 rounded border border-neutral-200">
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span>Drag corners to resize</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-2 rounded border border-neutral-200">
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Ctrl+Z to undo</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Properties */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-sans">Properties</CardTitle>
                <CardDescription>Adjust selected object</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Position X</label>
                  <Input type="number" value="50" readOnly className="bg-neutral-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Position Y</label>
                  <Input type="number" value="200" readOnly className="bg-neutral-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Rotation</label>
                  <div className="flex items-center space-x-2">
                    <Input type="range" min="0" max="360" className="flex-1" />
                    <span className="text-sm text-neutral-500 w-12 text-right">-2°</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Opacity</label>
                  <div className="flex items-center space-x-2">
                    <Input type="range" min="0" max="100" className="flex-1" />
                    <span className="text-sm text-neutral-500 w-12 text-right">100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-sans">Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="primary" className="w-full">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Export PNG
                </Button>
                <Button variant="secondary" className="w-full">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </Button>
                <Button variant="ghost" className="w-full">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share HTML
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary-50 border-primary-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm">
                    <p className="font-medium text-neutral-900 mb-1">Pro Tip</p>
                    <p className="text-neutral-600">Press Ctrl+Z to undo. Use the Properties panel to fine-tune selected objects.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-neutral-500">
            MemoryLane — Capture Your Journey, Create Your Story
          </p>
          <div className="flex justify-center items-center space-x-6 mt-4">
            <a href="#" className="text-neutral-400 hover:text-primary-500 text-sm">Help</a>
            <a href="#" className="text-neutral-400 hover:text-primary-500 text-sm">Tutorials</a>
            <a href="#" className="text-neutral-400 hover:text-primary-500 text-sm">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}