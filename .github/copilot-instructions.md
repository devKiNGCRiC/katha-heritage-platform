# 🤖 GitHub Copilot Instructions for KATHA Project

## 🎯 Project Context
You are working on **KATHA** - a comprehensive Indian heritage platform that combines:
- Learning platform for Indian history, mythology, and culture
- Social community for cultural enthusiasts
- Interactive maps and travel guides
- Content management system for stories and facts

## 🛠️ Tech Stack
- **Frontend**: React.js with Vite, Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Mobile**: React Native (future)
- **Authentication**: JWT + Passport.js
- **File Storage**: Cloudinary
- **Deployment**: Vercel (Frontend) + Railway (Backend)

## 👨‍🎓 Developer Profile
The developer is:
- 1st year MCA student from India
- Beginner level with basic HTML, CSS, JS, and some MERN knowledge
- Learning-focused approach (explain concepts thoroughly)
- Prefers step-by-step guidance with detailed explanations
- Values cultural authenticity and Indian heritage

## 📝 Code Style Guidelines

### General Principles
- Write clean, readable, and well-commented code
- Use meaningful variable and function names
- Follow consistent naming conventions (camelCase for JS, kebab-case for CSS)
- Include helpful comments explaining complex logic
- Prioritize code readability over cleverness

### React Component Structure
```jsx
// Always include imports at top
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Component with clear naming
const ComponentName = ({ prop1, prop2 }) => {
  // State declarations
  const [state, setState] = useState(initialValue);
  
  // Effects and lifecycle
  useEffect(() => {
    // Logic here
  }, [dependencies]);
  
  // Helper functions
  const handleSomething = () => {
    // Implementation
  };
  
  // JSX return
  return (
    <div className="component-container">
      {/* Content */}
    </div>
  );
};

// PropTypes for type checking
ComponentName.propTypes = {
  prop1: PropTypes.string.required,
  prop2: PropTypes.number,
};

export default ComponentName;
```

### API Endpoint Structure
```javascript
// Clear route naming and structure
router.get('/api/stories', async (req, res) => {
  try {
    // Implementation
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in /api/stories:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});
```

## 🎨 Styling Guidelines

### Tailwind CSS Preferences
- Use semantic class names when possible
- Prefer component-based styling over utility-only
- Use custom CSS classes for complex styling
- Follow mobile-first responsive design

### Color Scheme (KATHA Brand)
```css
/* Use these custom colors */
.text-katha-orange { color: #FF6B35; }
.text-katha-blue { color: #004E89; }
.text-katha-gold { color: #FFD700; }
.bg-katha-cream { background-color: #FFF8E7; }
```

## 📂 File Organization
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components
│   └── pages/           # Page-specific components
├── hooks/               # Custom React hooks
├── services/            # API calls and external services
├── utils/               # Helper functions
├── context/             # React context providers
└── assets/              # Images, icons, etc.
```

## 🌟 Cultural Considerations

### Content Guidelines
- Always respect Indian cultural values and traditions
- Use appropriate Sanskrit/Hindi terms with English explanations
- Include cultural context for historical events
- Ensure accuracy in mythological and historical references
- Use inclusive language that respects all Indian communities

### Feature Naming
- Use meaningful Sanskrit/Hindi names where appropriate
- Provide clear English explanations
- Examples: "Katha" (stories), "Yatra" (journey), "Gyan" (knowledge)

## 🚀 Development Workflow

### Git Commit Messages
```
feat: add new story upload functionality
fix: resolve authentication token expiration
docs: update API documentation
style: improve responsive design for mobile
refactor: optimize database queries
test: add unit tests for user registration
```

### Code Review Checklist
- [ ] Code is well-commented and self-explanatory
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] Responsive design is tested
- [ ] Cultural content is accurate and respectful
- [ ] Security best practices are followed

## 🎓 Learning Approach

### When Providing Code
1. **Explain the concept** before showing code
2. **Break down complex code** into smaller parts
3. **Provide context** for why specific patterns are used
4. **Include helpful comments** in the code
5. **Suggest further reading** or documentation

### Example Explanation Format
```javascript
// 🎯 Purpose: This component handles user authentication
// 📚 Concept: JWT tokens for secure user sessions
// 🔧 How it works: Store token in localStorage, validate on each request

const useAuth = () => {
  // State to track if user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Function to login user
  const login = async (credentials) => {
    // Send credentials to backend
    // Store received token
    // Update authentication state
  };
};
```

## 🎯 Project-Specific Features

### Priority Features for KATHA
1. **Story Management**: Create, edit, categorize Indian stories
2. **User Authentication**: Secure login/registration
3. **Interactive Maps**: Show cultural sites across India
4. **Community Features**: Comments, discussions, sharing
5. **Search & Filter**: Find content by region, category, era
6. **Progressive Web App**: Offline functionality
7. **Multilingual Support**: Hindi, English, regional languages

### Cultural Feature Ideas
- **Panchang Integration**: Hindu calendar with festivals
- **Regional Culture**: State-wise traditions and stories
- **Timeline Visualization**: Interactive historical timelines
- **Audio Stories**: Narrated tales in multiple languages
- **Cultural Quizzes**: Gamified learning experiences

## 🔐 Security Considerations
- Always validate user input
- Use environment variables for sensitive data
- Implement proper authentication middleware
- Sanitize data before database operations
- Use HTTPS in production
- Implement rate limiting for APIs

## 📱 Mobile-First Design
- Design for mobile screens first
- Use touch-friendly UI elements
- Optimize images and assets for mobile
- Implement smooth scrolling and animations
- Consider offline functionality

## 🌐 SEO & Performance
- Use semantic HTML elements
- Implement proper meta tags
- Optimize images with alt text
- Use lazy loading for content
- Implement proper URL structure
- Focus on Core Web Vitals

Remember: Every line of code should contribute to preserving and sharing the rich heritage of India! 🇮🇳