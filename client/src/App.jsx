import { useState } from "react";

function App() {
  const [stories, setStories] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-orange-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/katha-logo(svg).svg" alt="KATHA" className="w-8 h-8" />
            <h1 className="text-2xl font-bold">KATHA</h1>
          </div>
          <span className="text-sm">Indian Heritage Platform</span>
        </div>
      </header>

      <main className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Discover Indian Heritage
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Explore stories, traditions, and culture of India
          </p>
          
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-lg font-bold mb-4">Stories Discovered</h3>
            <div className="text-3xl font-bold text-orange-600 mb-4">{stories}</div>
            <button 
              onClick={() => setStories(stories + 1)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            >
              Discover Story
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white p-6 text-center">
        <p>Built with ❤️ for Indian Heritage - Jai Hind! 🇮🇳</p>
      </footer>
    </div>
  );
}

export default App;
