// 🗄️ KATHA Heritage Platform - Database Models
// 📝 Purpose: Mongoose schemas for all database collections

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 👤 User Schema - Core user information
const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  
  // Profile Information
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/katha/image/upload/v1/avatars/default-avatar.png'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  location: {
    state: String,
    city: String,
    country: { type: String, default: 'India' }
  },
  
  // Cultural Preferences
  preferences: {
    favoriteCategories: [{
      type: String,
      enum: ['mythology', 'history', 'folk-tales', 'geography', 'architecture', 'festivals', 'philosophy']
    }],
    preferredLanguages: [{
      type: String,
      enum: ['hindi', 'english', 'bengali', 'tamil', 'telugu', 'gujarati', 'marathi', 'punjabi', 'kannada', 'malayalam']
    }],
    culturalBackground: String,
    interests: [String]
  },
  
  // Account Status
  role: {
    type: String,
    enum: ['user', 'creator', 'moderator', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Social Authentication
  googleId: String,
  facebookId: String,
  githubId: String,
  provider: {
    type: String,
    enum: ['local', 'google', 'facebook', 'github'],
    default: 'local'
  },
  
  // Security
  twoFactorSecret: String,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  tokenVersion: {
    type: Number,
    default: 0
  },
  
  // Engagement Metrics
  stats: {
    storiesRead: { type: Number, default: 0 },
    storiesCreated: { type: Number, default: 0 },
    commentsPosted: { type: Number, default: 0 },
    likesGiven: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActiveDate: Date
  },
  
  // Subscription Information
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'family'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last active date
userSchema.methods.updateActivity = function() {
  this.stats.lastActiveDate = new Date();
  return this.save();
};

// 📚 Story Schema - Cultural stories and content
const storySchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Story title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  summary: {
    type: String,
    required: [true, 'Story summary is required'],
    maxlength: [500, 'Summary cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Story content is required']
  },
  
  // Categorization
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['mythology', 'history', 'folk-tales', 'geography', 'architecture', 'festivals', 'philosophy']
  },
  subCategory: String,
  tags: [String],
  
  // Cultural Context
  region: {
    type: String,
    required: [true, 'Region is required']
  },
  state: String,
  timeperiod: {
    era: String, // 'ancient', 'medieval', 'modern'
    century: String,
    approximateYear: Number
  },
  culturalSignificance: String,
  moralLesson: String,
  
  // Media
  featuredImage: {
    url: String,
    publicId: String,
    alt: String
  },
  images: [{
    url: String,
    publicId: String,
    caption: String,
    alt: String
  }],
  audioNarration: {
    url: String,
    duration: Number,
    language: String
  },
  
  // Author Information
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contributors: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['writer', 'editor', 'translator', 'researcher']
    },
    contribution: String
  }],
  
  // Content Metadata
  language: {
    type: String,
    default: 'english',
    enum: ['hindi', 'english', 'bengali', 'tamil', 'telugu', 'gujarati', 'marathi', 'punjabi', 'kannada', 'malayalam']
  },
  readingTime: {
    type: Number, // in minutes
    default: 5
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  ageGroup: {
    type: String,
    enum: ['children', 'teens', 'adults', 'all'],
    default: 'all'
  },
  
  // Publishing Status
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,
  featured: {
    type: Boolean,
    default: false
  },
  premium: {
    type: Boolean,
    default: false
  },
  
  // Engagement Metrics
  engagement: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 }
  },
  
  // SEO
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate slug from title
storySchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);
  }
  next();
});

// Calculate reading time based on content
storySchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = this.content.split(' ').length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

// 📍 Place Schema - Cultural sites and locations
const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Place name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  
  // Location
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  
  // Categorization
  type: {
    type: String,
    enum: ['temple', 'monument', 'museum', 'heritage-site', 'natural-wonder', 'cultural-center'],
    required: true
  },
  significance: String,
  historicalPeriod: String,
  
  // Media
  images: [{
    url: String,
    caption: String,
    credit: String
  }],
  
  // Related Content
  relatedStories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  }],
  
  // Visitor Information
  visitingHours: String,
  entryFee: String,
  bestTimeToVisit: String,
  howToReach: String,
  
  // Ratings
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
placeSchema.index({ location: '2dsphere' });

// 💬 Comment Schema - User comments and discussions
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  
  // Engagement
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  
  // Moderation
  isModerated: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true },
  flaggedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Status
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Create the models
const User = mongoose.model('User', userSchema);
const Story = mongoose.model('Story', storySchema);
const Place = mongoose.model('Place', placeSchema);
const Comment = mongoose.model('Comment', commentSchema);

// Export all models as default object
const models = {
  User,
  Story,
  Place,
  Comment
};

export default models;