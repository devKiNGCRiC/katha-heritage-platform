/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🇮🇳 KATHA Indian Heritage Color Palette
        'katha': {
          // Primary Brand Colors
          'orange': '#FF6B35',
          'blue': '#004E89', 
          'gold': '#FFD700',
          'cream': '#FFF8E7',
          'dark': '#1A1A1A',
          'gray': '#6B7280'
        },
        
        // 🎨 Extended Indian Color Palette
        'indian': {
          // Reds - Fire, Power, Purity
          'blood-red': '#8B0000',
          'bright-red': '#FF0000',
          'red': '#DC2626',
          'maroon': '#800000',
          
          // Saffron - Sacred, Courage, Sacrifice
          'saffron': '#FF9933',
          'deep-saffron': '#FF8C00',
          'light-saffron': '#FFB366',
          
          // Blues - Peace, Truth, Sky
          'light-blue': '#87CEEB',
          'sky-blue': '#00BFFF',
          'royal-blue': '#4169E1',
          'navy-blue': '#000080',
          
          // Greens - Nature, Life, Peace
          'leaf-green': '#228B22',
          'light-green': '#90EE90',
          'forest-green': '#228B22',
          'emerald': '#50C878',
          
          // Earth Tones
          'yellow': '#FFFF00',
          'golden-yellow': '#FFD700',
          'turmeric': '#FDB462',
          'orange': '#FFA500',
          'burnt-orange': '#CC5500',
          
          // Neutrals
          'black': '#000000',
          'charcoal': '#36454F',
          'white': '#FFFFFF',
          'off-white': '#FAF0E6',
          'pearl': '#F8F6F0'
        },
        
        // 🌈 Gradient Base Colors for Indian Flag & Festivals
        'tricolor': {
          'saffron': '#FF9933',
          'white': '#FFFFFF', 
          'green': '#138808'
        },
        
        // 🪔 Festival Colors
        'festival': {
          'diwali-gold': '#FFD700',
          'holi-pink': '#FF69B4',
          'holi-yellow': '#FFFF00',
          'holi-green': '#00FF00',
          'holi-blue': '#0000FF',
          'rangoli-red': '#FF0000',
          'rangoli-orange': '#FFA500'
        }
      },
      
      // 🎨 Gradient Configurations
      backgroundImage: {
        // Indian Flag Inspired
        'tricolor-gradient': 'linear-gradient(to bottom, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%)',
        'saffron-gradient': 'linear-gradient(135deg, #FF9933, #FFB366)',
        'sunset-gradient': 'linear-gradient(135deg, #FF6B35, #FFA500, #FFD700)',
        
        // Cultural Gradients
        'heritage-warm': 'linear-gradient(135deg, #8B0000, #DC2626, #FF6B35)',
        'heritage-cool': 'linear-gradient(135deg, #004E89, #87CEEB, #00BFFF)',
        'nature-green': 'linear-gradient(135deg, #228B22, #90EE90, #50C878)',
        'royal-gold': 'linear-gradient(135deg, #FFD700, #FDB462, #FF9933)',
        
        // Spiritual Gradients
        'temple-gradient': 'linear-gradient(135deg, #800000, #DC2626, #FFD700)',
        'lotus-gradient': 'linear-gradient(135deg, #FF69B4, #FFA500, #FFFF00)',
        'ganges-gradient': 'linear-gradient(135deg, #87CEEB, #00BFFF, #4169E1)',
        
        // Modern KATHA Gradients
        'katha-primary': 'linear-gradient(135deg, #FF6B35, #004E89)',
        'katha-warm': 'linear-gradient(135deg, #FFF8E7, #FFD700)',
        'katha-vibrant': 'linear-gradient(135deg, #FF9933, #228B22, #004E89)'
      },
      
      fontFamily: {
        'hindi': ['Devanagari Sangam MN', 'Arial Unicode MS', 'sans-serif'],
        'english': ['Inter', 'system-ui', 'sans-serif'],
        'decorative': ['Playfair Display', 'serif'] // For cultural headers
      }
    },
  },
  plugins: [],
};

export default config;