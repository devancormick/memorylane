export interface CanvasData {
  version: string;
  objects: CanvasObjectType[];
  background?: string;
  size: { width: number; height: number };
}

export interface CanvasObject {
  id: string;
  type: 'image' | 'text' | 'map' | 'sticker';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  visible: boolean;
  lock?: boolean;
}

export interface ImageObject extends CanvasObject {
  type: 'image';
  src: string;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
}

export interface TextObject extends CanvasObject {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
}

export interface MapObject extends CanvasObject {
  type: 'map';
  location: string; // Place name or lat,lng
  mapUrl: string;
  clipShape: 'rectangle' | 'circle' | 'postcard';
}

export interface StickerObject extends CanvasObject {
  type: 'sticker';
  stickerId: string;
  hueTint: number; // 0-360 degrees
}

export type CanvasObjectType = ImageObject | TextObject | MapObject | StickerObject;

export interface JournalCanvasProps {
  initialData?: CanvasData;
  onSave: (data: CanvasData) => void;
  onSelectionChange?: (objects: CanvasObject[]) => void;
  imageLibrary?: string[];
  width?: number;
  height?: number;
}

export interface CanvasHistoryState {
  past: CanvasData[];
  present: CanvasData;
  future: CanvasData[];
}

export interface CanvasSelection {
  objects: CanvasObject[];
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}