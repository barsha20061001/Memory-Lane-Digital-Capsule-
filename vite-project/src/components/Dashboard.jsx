import React, { useState } from 'react';
import ContributeModal from './ContributeModal'; // New Import
import { Send } from 'lucide-react';

// Mock data for demonstration
const mockCapsules = [
  { id: 1, title: "Wedding Day 💍", theme: "Major Life Events", unlockDate: "2028-06-15", daysLeft: 915, isLocked: true,isCollaborative: true },
  { id: 2, title: "Childhood Adventures 🪁", theme: "Childhood", unlockDate: "2027-01-01", daysLeft: 460, isLocked: true ,isCollaborative: true},
  { id: 3, title: "College Years - Graduation 🎓", theme: "College Years", unlockDate: "2026-05-10", daysLeft: 160, isLocked: true ,isCollaborative: false },
  { id: 4, title: "First Anniversary Message", theme: "Family History", unlockDate: "2025-01-20", daysLeft: -300, isLocked: false, isCollaborative: false },
];

const CapsuleCard = ({ capsule, onView , onContribute}) => {
  const isUnlocked = !capsule.isLocked;
  const isCollaborative = capsule.isCollaborative && capsule.isLocked;
  const statusClasses = isUnlocked
    ? "bg-green-100 text-green-800"
    : "bg-yellow-100 text-yellow-800";

  return (
   <div className={`bg-white p-6 rounded-xl shadow-lg transition duration-300 border-t-4 ${isUnlocked ? 'border-green-500 cursor-pointer hover:shadow-xl' :  isCollaborative ? 'hover:shadow-xl' : ''  }`}
      onClick={isUnlocked ? () => onView(capsule.id) : null} // Only clickable if unlocked
      >
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{capsule.title}</h3>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusClasses}`}>
          {isUnlocked ? "Unlocked" : "Locked"}
        </span>
      </div>
      
      <p className="text-sm text-indigo-600 font-medium mb-3">
        Theme: {capsule.theme}
      </p>

      {/* Countdown Timer Feature */}
      <div className="mt-4 border-t pt-4">
        {isUnlocked ? (
          <p className="text-gray-600">
            **Unlocked!** Click to view contents and add reflections.
          </p>
        ) : (
          <p className="text-gray-600">
            **Unlocks on:** {new Date(capsule.unlockDate).toLocaleDateString()}
          </p>
        )}
        <div className="text-2xl font-bold text-indigo-700 mt-1">
          {isUnlocked ? (
            <span className="text-green-600 hover:underline">View Memories</span>
          ) : (
            `${capsule.daysLeft} Days Left`
          )}

          {isCollaborative && (
          <button 
            onClick={(e) => { e.stopPropagation(); onContribute(capsule); }} // IMPORTANT: e.stopPropagation prevents the main card click
            className="mt-3 w-full flex items-center justify-center bg-indigo-100 text-indigo-700 py-2 rounded-lg font-semibold hover:bg-indigo-200 transition duration-150"
          >
            <Send className="w-4 h-4 mr-2" /> Add Your Contribution
          </button>
        )}

        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ onViewCapsule }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState(null);

  const handleContributeOpen = (capsule) => {
    setSelectedCapsule(capsule);
    setIsModalOpen(true);
  };

  const handleContributeClose = () => {
    setIsModalOpen(false);
    setSelectedCapsule(null);
    // You might want to refresh the dashboard data here in a real app
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        🌟 Your Digital Time Capsules
      </h2>
      
      {/* Action Button for 'Create Digital Time Capsules' Feature */}
      <div className="flex justify-end mb-6">
         <button className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition duration-150 shadow-lg">
           + New Time Capsule
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockCapsules.map(capsule => (
          <CapsuleCard key={capsule.id} capsule={capsule} onView={onViewCapsule} onContribute={handleContributeOpen}/>
        ))}

      </div>

      {selectedCapsule && (
        <ContributeModal 
          isOpen={isModalOpen} 
          onClose={handleContributeClose} 
          capsule={selectedCapsule} 
        />
      )}
    </div>
  );
};

export default Dashboard;

