import React, { useState } from 'react';
//import Register from './Register'; // <-- Import the component
import Dashboard from './components/Dashboard';
import CreateCapsuleForm from './components/CreateCapsuleForm';
import UnlockedCapsuleView from './components/UnlockedCapsuleView'; // New Import




function App() {
  // Can be 'dashboard', 'create', or 'view'
  const [view, setView] = useState('dashboard'); 
  const [selectedCapsuleId, setSelectedCapsuleId] = useState(null);

  const handleCreateNew = () => setView('create');

  const handleCapsuleSubmit = (data) => {
    console.log("Capsule Saved:", data);
    alert(`Capsule "${data.title}" has been created!`);
    setView('dashboard');
  };
  
  // New handler for clicking on a capsule card
  const handleViewCapsule = (id) => {
      setSelectedCapsuleId(id);
      setView('view');
  }

  // Header component updated to reflect the new state logic (same as before)
  const Header = ({ onCreateNew }) => (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700 cursor-pointer" onClick={() => setView('dashboard')}>
          MemoryLane
        </h1>
        <nav>
          <button 
            onClick={onCreateNew}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md ml-4"
          >
            Create Capsule
          </button>
        </nav>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
    <Header onCreateNew={handleCreateNew} />
      <main className=" flex-grow ">
        
      
        

<div className="container mx-auto px-4 py-8">
    {/* 🛑 TEMPORARY CODE FOR API REGISTRATION TEST 🛑 */}
    
    
    
    {/* *** RESTORED ORIGINAL DASHBOARD CODE *** */}
        {view === 'dashboard' && <Dashboard onViewCapsule={handleViewCapsule} />}
        {view === 'create' && <CreateCapsuleForm onCancel={() => setView('dashboard')} onSubmit={handleCapsuleSubmit} />}
        {view === 'view' && <UnlockedCapsuleView onBack={() => setView('dashboard')} />}

</div>
      </main>
      <Footer />
    </div>
  );
}

// Basic Footer Component (same as before)
const Footer = () => (
  <footer className="bg-gray-800 text-white mt-auto">
    <div className="container mx-auto px-4 py-6 text-center text-sm">
      © 2025 MemoryLane Platform. Preserving memories for the future.
    </div>
  </footer>
);

export default App;