// 🗄️ KATHA Heritage Platform - Database Connection Utility
// 🎯 Purpose: MongoDB connection with error handling and logging

import mongoose from 'mongoose';

class DatabaseManager {
  constructor() {
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxRetries = 5;
    this.retryDelay = 5000; // 5 seconds
  }

  async connect() {
    if (this.isConnected) {
      console.log('📊 Database already connected');
      return;
    }

    try {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set');
      }

      console.log('🔄 Connecting to MongoDB Atlas...');
      
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
      });

      this.isConnected = true;
      this.connectionAttempts = 0;

      console.log('🎉 MongoDB Atlas Connected Successfully!');
      console.log(`📊 Database: ${mongoose.connection.name}`);
      console.log(`🌐 Host: ${mongoose.connection.host}`);
      console.log(`📍 Port: ${mongoose.connection.port}`);

      // Test the connection with a simple operation
      await this.testConnection();

    } catch (error) {
      this.isConnected = false;
      this.connectionAttempts++;
      
      console.error('❌ MongoDB connection error:', error.message);
      
      if (this.connectionAttempts < this.maxRetries) {
        console.log(`🔄 Retrying connection in ${this.retryDelay/1000} seconds... (Attempt ${this.connectionAttempts}/${this.maxRetries})`);
        setTimeout(() => this.connect(), this.retryDelay);
      } else {
        console.error('💥 Maximum connection attempts reached. Please check your MongoDB configuration.');
        if (process.env.NODE_ENV === 'production') {
          process.exit(1);
        }
      }
    }
  }

  async testConnection() {
    try {
      // Test if we can perform a simple database operation
      const admin = mongoose.connection.db.admin();
      const result = await admin.ping();
      
      if (result.ok === 1) {
        console.log('✅ Database connection test successful!');
        
        // Show database statistics
        const stats = await mongoose.connection.db.stats();
        console.log(`📈 Database Stats:`);
        console.log(`   📦 Collections: ${stats.collections}`);
        console.log(`   📄 Documents: ${stats.objects}`);
        console.log(`   💾 Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   🗃️ Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
      }
    } catch (error) {
      console.warn('⚠️ Database test failed:', error.message);
    }
  }

  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log('🔌 MongoDB connection closed successfully');
    } catch (error) {
      console.error('❌ Error closing MongoDB connection:', error.message);
    }
  }

  // Get connection status
  getStatus() {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    return {
      isConnected: this.isConnected,
      readyState: states[mongoose.connection.readyState] || 'unknown',
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      collections: Object.keys(mongoose.connection.collections).length
    };
  }

  // Setup connection event listeners
  setupEventListeners() {
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose connected to MongoDB Atlas');
      this.isConnected = true;
    });

    mongoose.connection.on('error', (error) => {
      console.error('❌ Mongoose connection error:', error);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected from MongoDB Atlas');
      this.isConnected = false;
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      console.log('🛑 Application termination signal received');
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('🛑 Application termination signal received');
      await this.disconnect();
      process.exit(0);
    });
  }

  // Create initial indexes for better performance
  async createIndexes() {
    try {
      console.log('🔍 Creating database indexes...');
      
      // User indexes
      await mongoose.connection.collection('users').createIndex({ email: 1 }, { unique: true });
      await mongoose.connection.collection('users').createIndex({ 'stats.totalPoints': -1 });
      
      // Story indexes
      await mongoose.connection.collection('stories').createIndex({ slug: 1 }, { unique: true });
      await mongoose.connection.collection('stories').createIndex({ category: 1, status: 1 });
      await mongoose.connection.collection('stories').createIndex({ 'engagement.views': -1 });
      await mongoose.connection.collection('stories').createIndex({ featured: 1, status: 1 });
      
      // Text search index for stories
      await mongoose.connection.collection('stories').createIndex({
        title: 'text',
        summary: 'text',
        content: 'text',
        tags: 'text'
      });
      
      console.log('✅ Database indexes created successfully!');
    } catch (error) {
      console.warn('⚠️ Error creating indexes:', error.message);
    }
  }

  // Seed initial data (run once)
  async seedInitialData() {
    try {
      const models = await import('../models/index.js');
      const { User, Story } = models.default;
      
      // Check if data already exists
      const userCount = await User.countDocuments();
      if (userCount > 0) {
        console.log('📊 Database already contains data, skipping seed');
        return;
      }

      console.log('🌱 Seeding initial data...');

      // Create admin user
      const adminUser = await User.create({
        name: 'KATHA Admin',
        email: 'admin@katha.in',
        password: 'admin123',
        role: 'admin',
        isVerified: true,
        preferences: {
          favoriteCategories: ['mythology', 'history', 'architecture'],
          preferredLanguages: ['hindi', 'english']
        }
      });

      // Create sample story
      await Story.create({
        title: 'The Legend of Hanuman and the Sanjeevani',
        summary: 'The heroic tale of how Hanuman brought the life-saving Sanjeevani herb to save Lakshmana during the great war.',
        content: `During the epic battle of Lanka, when Lakshmana was gravely wounded by Indrajit's powerful arrow, the entire army of monkeys was filled with despair. The wound was so severe that only the magical Sanjeevani herb from the Himalayan mountains could save his life.

Lord Rama, overwhelmed with grief for his beloved brother, turned to Hanuman - the mighty devotee known for his unwavering loyalty and incredible strength. "Hanuman," Rama said with tears in his eyes, "only you can undertake this impossible task. You must fly to the Dronagiri mountain in the Himalayas and bring back the Sanjeevani herb before dawn, or Lakshmana will not survive."

Without a moment's hesitation, Hanuman bowed before Rama and leaped into the sky with the force of a thunderbolt. He flew across the vast Indian subcontinent, over forests, rivers, and mountains, his heart filled with determination to save Lakshmana's life.

When Hanuman reached the Dronagiri mountain, he faced an unexpected challenge. The mountain was filled with countless herbs and plants, but he could not identify which one was the life-saving Sanjeevani. Time was running out, and dawn was approaching fast.

In a moment of divine inspiration, Hanuman made a decision that would become legendary. Unable to identify the specific herb, he uprooted the entire mountain and carried it back to Lanka. As he flew through the night sky with the massive mountain in his hands, his devotion and strength illuminated the heavens.

The physicians quickly identified the Sanjeevani herb from the mountain that Hanuman had brought. They prepared the medicine, and Lakshmana was miraculously healed, opening his eyes just as the first rays of dawn broke across the sky.

This tale teaches us about unwavering devotion, quick thinking in times of crisis, and the lengths to which love and loyalty can drive us. Hanuman's act of carrying the entire mountain has become a symbol of going beyond the call of duty for those we care about.`,
        category: 'mythology',
        region: 'pan-indian',
        author: adminUser._id,
        status: 'published',
        publishedAt: new Date(),
        featured: true,
        tags: ['hanuman', 'ramayana', 'devotion', 'sanjeevani', 'himalaya'],
        language: 'english',
        timeperiod: {
          era: 'ancient',
          approximateYear: -5000
        },
        culturalSignificance: 'Represents the power of devotion and selfless service',
        moralLesson: 'Dedication and quick thinking can overcome any obstacle',
        engagement: {
          views: 1500,
          likes: 142,
          shares: 45,
          averageRating: 4.8,
          totalRatings: 95
        }
      });

      console.log('✅ Initial data seeded successfully!');
      console.log(`👤 Admin user created: admin@katha.in (password: admin123)`);
      console.log(`📚 Sample story created: The Legend of Hanuman and the Sanjeevani`);
      
    } catch (error) {
      console.error('❌ Error seeding data:', error.message);
    }
  }
}

// Create singleton instance
const dbManager = new DatabaseManager();

export default dbManager;