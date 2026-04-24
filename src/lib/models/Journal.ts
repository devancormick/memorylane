import mongoose, { Schema, model, models } from 'mongoose';

const JournalSchema = new Schema(
  {
    title: { type: String, required: true, default: 'Untitled Journal' },
    description: { type: String, default: '' },
    canvasData: { type: Schema.Types.Mixed, required: true },
    thumbnailUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Journal = models.Journal || model('Journal', JournalSchema);
