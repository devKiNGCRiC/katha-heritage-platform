# 🚀 Week 1-2: Project Setup & Development Environment

## 📅 Timeline: September 7-20, 2025

### 🎯 Learning Goals
By the end of these 2 weeks, you will:
- Have a fully configured development environment
- Understand the project structure and architecture
- Know basic Git workflow
- Have created your first React component
- Understand the MERN stack fundamentals

---

## 📝 DAY-BY-DAY BREAKDOWN

### **Day 1-2: Project Structure & Git Setup**

#### 🎯 Today's Mission
Set up your development workspace and understand project organization.

#### 📚 Theory Notes (Write in your notebook):

**What is a Full-Stack Application?**
```
Frontend (Client) ←→ Backend (Server) ←→ Database
     React              Express.js        MongoDB
```

**MERN Stack Components:**
- **M** - MongoDB (Database)
- **E** - Express.js (Backend Framework)
- **R** - React.js (Frontend Library)
- **N** - Node.js (Runtime Environment)

**Project Structure Explained:**
```
KATHA/
├── client/          # React frontend (what users see)
├── server/          # Express backend (handles data)
├── mobile/          # React Native mobile app
├── docs/           # Documentation and learning notes
├── .github/        # GitHub workflows and settings
└── package.json    # Project configuration
```

#### 💻 Practical Tasks:

1. **Git Configuration**
```bash
# Check if Git is installed
git --version

# Configure your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Initialize Git in your project
cd "f:\devKiNG_Projects\03_Full_Stack_Projects\Katha"
git init
git add .
git commit -m "Initial project setup"
```

2. **Connect to GitHub**
```bash
# Create a new repository on GitHub (do this on github.com)
# Then connect your local repo
git remote add origin https://github.com/YOUR_USERNAME/katha-heritage-platform.git
git branch -M main
git push -u origin main
```

#### ✅ Day 1-2 Checklist:
- [ ] Understand MERN stack basics
- [ ] Project structure is clear
- [ ] Git is configured
- [ ] Repository is on GitHub
- [ ] Can make commits and push changes

---

### **Day 3-4: Node.js & Package Management**

#### 🎯 Today's Mission
Understand Node.js, npm, and package management fundamentals.

#### 📚 Theory Notes:

**What is Node.js?**
- JavaScript runtime for building server-side applications
- Allows JavaScript to run outside the browser
- Has a package manager called npm (Node Package Manager)

**What are Packages?**
- Pre-written code libraries that add functionality
- Like building blocks for your application
- Examples: express (web server), mongoose (database), react (UI)

**package.json Explained:**
```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "scripts": {
    "dev": "command to start development",
    "build": "command to build for production"
  },
  "dependencies": {
    "react": "^18.0.0"  // Libraries your app needs
  }
}
```

#### 💻 Practical Tasks:

1. **Check Node.js Installation**
```bash
node --version  # Should show v18+ 
npm --version   # Should show v9+
```

2. **Install Project Dependencies**
```bash
# In your project root
npm install

# This creates node_modules folder with all packages
```

3. **Understand npm Commands**
```bash
npm install package-name     # Install a new package
npm uninstall package-name   # Remove a package
npm run dev                  # Run development server
npm run build               # Build for production
```

#### ✅ Day 3-4 Checklist:
- [ ] Node.js and npm are working
- [ ] Understand what packages are
- [ ] Can install and manage dependencies
- [ ] Know basic npm commands

---

### **Day 5-7: React Fundamentals**

#### 🎯 Today's Mission
Create your first React application and understand components.

#### 📚 Theory Notes:

**What is React?**
- A JavaScript library for building user interfaces
- Creates interactive web pages using components
- Components are like reusable pieces of UI

**Component Example:**
```jsx
function WelcomeMessage() {
  return (
    <div>
      <h1>Welcome to KATHA!</h1>
      <p>Discover the beauty of Indian heritage</p>
    </div>
  );
}
```

**JSX (JavaScript XML):**
- Allows writing HTML-like syntax in JavaScript
- Gets converted to regular JavaScript
- Must return single parent element

#### 💻 Practical Tasks:

1. **Create React App with Vite**
```bash
cd client
npm create vite@latest . -- --template react
npm install
npm run dev
```

2. **Create Your First Component**
Create `client/src/components/Hero.jsx`:
```jsx
function Hero() {
  return (
    <div className="hero">
      <h1>🏛️ KATHA</h1>
      <p>The Great Indian Heritage Platform</p>
      <button>Start Exploring</button>
    </div>
  );
}

export default Hero;
```

3. **Use Component in App**
Update `client/src/App.jsx`:
```jsx
import Hero from './components/Hero'

function App() {
  return (
    <div className="App">
      <Hero />
    </div>
  );
}

export default App;
```

#### ✅ Day 5-7 Checklist:
- [ ] React app is running
- [ ] Created first component
- [ ] Understand JSX basics
- [ ] Can see changes in browser

---

### **Day 8-10: Styling & Design Basics**

#### 🎯 Today's Mission
Add beautiful styling to your components using CSS and Tailwind.

#### 📚 Theory Notes:

**CSS in React:**
```jsx
// Inline styles
<div style={{color: 'blue', fontSize: '20px'}}>

// CSS classes
<div className="hero-title">

// CSS modules
<div className={styles.heroTitle}>
```

**Tailwind CSS:**
- Utility-first CSS framework
- Pre-built classes for common styles
- Example: `bg-blue-500 text-white p-4 rounded-lg`

#### 💻 Practical Tasks:

1. **Install Tailwind CSS**
```bash
cd client
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. **Configure Tailwind**
Update `client/tailwind.config.js`:
```js
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'katha-orange': '#FF6B35',
        'katha-blue': '#004E89',
        'katha-gold': '#FFD700'
      }
    },
  },
  plugins: [],
}
```

3. **Style Your Hero Component**
```jsx
function Hero() {
  return (
    <div className="bg-gradient-to-r from-katha-blue to-katha-orange text-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">🏛️ KATHA</h1>
        <p className="text-xl mb-8">The Great Indian Heritage Platform</p>
        <button className="bg-katha-gold text-katha-blue px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-400 transition-colors">
          Start Exploring
        </button>
      </div>
    </div>
  );
}
```

#### ✅ Day 8-10 Checklist:
- [ ] Tailwind CSS is installed and working
- [ ] Hero component looks beautiful
- [ ] Understand basic styling concepts
- [ ] Can modify colors and layout

---

### **Day 11-14: Backend Basics**

#### 🎯 Today's Mission
Create your first Express.js server and understand backend concepts.

#### 📚 Theory Notes:

**What is a Backend?**
- Server that handles data, authentication, and business logic
- Responds to requests from frontend
- Connects to databases

**Express.js:**
- Web framework for Node.js
- Handles HTTP requests (GET, POST, PUT, DELETE)
- Manages routes and middleware

**API (Application Programming Interface):**
- Way for frontend and backend to communicate
- Uses HTTP methods and JSON data

#### 💻 Practical Tasks:

1. **Create Express Server**
```bash
cd server
npm init -y
npm install express cors dotenv
```

Create `server/index.js`:
```js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to KATHA API!' });
});

app.get('/api/stories', (req, res) => {
  res.json([
    { id: 1, title: 'Ramayana', category: 'Mythology' },
    { id: 2, title: 'Mahabharata', category: 'Mythology' },
    { id: 3, title: 'Akbar & Birbal', category: 'Folk Tales' }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

2. **Test Your API**
```bash
cd server
node index.js
```
Visit: http://localhost:5000

#### ✅ Day 11-14 Checklist:
- [ ] Express server is running
- [ ] Can create API endpoints
- [ ] Understand requests and responses
- [ ] Frontend can call backend APIs

---

## 📝 Week 1-2 Summary Notes

**Technical Concepts Learned:**
1. **Project Structure**: How to organize a full-stack application
2. **Git Version Control**: Save and track code changes
3. **React Components**: Building blocks of user interface
4. **Styling**: Making applications look beautiful
5. **Express Server**: Creating backend APIs

**Tools Mastered:**
- VS Code development environment
- Git and GitHub workflow
- npm package management
- Vite for React development
- Express.js for backend

**Key Commands to Remember:**
```bash
# Git
git add .
git commit -m "message"
git push

# npm
npm install
npm run dev
npm run build

# Development
cd client && npm run dev    # Start frontend
cd server && node index.js  # Start backend
```

---

## 🎯 Prepare for Week 3-4

**Next Week Focus:**
- Advanced React concepts (state, props, hooks)
- Component communication
- Routing between pages
- Form handling and user input

**Homework:**
1. Practice creating 2-3 more React components
2. Experiment with different Tailwind styles
3. Try adding more API endpoints to your Express server
4. Start thinking about what content you want to showcase in KATHA

**Questions to Research:**
- What are React Hooks?
- How does component state work?
- What is React Router?

---

*Remember: "धैर्य रखो, सफलता आएगी" (Be patient, success will come)* 🌟

Every expert was once a beginner. You're doing great! 🚀
