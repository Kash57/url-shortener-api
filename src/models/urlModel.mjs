import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  totalClicks: { type: Number, default: 0 },
  uniqueUsers: { type: [String], default: [] },
  clicksByDate: [
    {
      date: { type: String },
      count: { type: Number, default: 0 },
    },
  ],
  osType: [
    {
      osName: { type: String },
      uniqueClicks: { type: Number, default: 0 },
      uniqueUsers: { type: [String], default: [] },
    },
  ],
  deviceType: [
    {
      deviceName: { type: String },
      uniqueClicks: { type: Number, default: 0 },
      uniqueUsers: { type: [String], default: [] },
    },
  ],
});

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortAlias: { type: String, unique: true, required: true },
  topic: { type: String, required: false },
  analytics: { type: analyticsSchema, default: () => ({}) },
});

export const Url = mongoose.model('Url', urlSchema);
