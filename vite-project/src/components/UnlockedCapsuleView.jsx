import React, { useState } from 'react';
import { MessageSquare, Heart, Clock, User, Download, Share, PlusCircle, ChevronLeft } from 'lucide-react';

// Mock data for the unlocked capsule
const mockCapsuleData = {
  id: 4,
  title: "First Anniversary Message",
  theme: "Family History",
  unlockDate: "2025-01-20",
  unlockedBy: "Mom (Sarah L.)",
  contents: [
    { type: 'text', title: 'Letter from Dad', content: 'My dearest Sarah, if you are reading this, it means we made it to our first year...', icon: 'FileText' },
    { type: 'photo', title: 'Wedding Photo', content: 'Our favorite photo from the ceremony.', icon: 'Image' },
    { type: 'video', title: 'Anniversary Toast', content: 'A short video message recorded a week before the wedding.', icon: 'Video' },
  ],
  collaboration: {
    contributorCount: 2, // The person who created it and the person who added a reflection
    mode: 'enabled',
  },
  reflections: [ // This handles the Post-Unlock Interaction feature
    { user: 'Sarah L.', timestamp: '2025-01-20 10:30 AM', text: "I can't believe how much time has passed! This is such a beautiful surprise. I love you, honey. ❤️" },
    { user: 'Admin System', timestamp: '2025-01-20 10:31 AM', text: "The capsule contents have been scheduled for email delivery to all recipients. (Email Notification Feature)"},
  ]
};

const CapsuleContentItem = ({ item }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between hover:bg-gray-100 transition duration-150">
    <div className="flex items-center">
      <MessageSquare className="w-5 h-5 text-indigo-500 mr-3" />
      <div>
        <h4 className="font-semibold text-gray-800">{item.title}</h4>
        <p className="text-sm text-gray-600 truncate max-w-sm">{item.content}</p>
      </div>
    </div>
    <div className="space-x-2">
      <button className="text-sm text-indigo-600 hover:text-indigo-800">Preview</button>
      <button className="text-sm text-green-600 hover:text-green-800"><Download className="w-4 h-4 inline-block mr-1" /> Download</button>
    </div>
  </div>
);

const ReflectionEntry = ({ reflection }) => (
    <div className={`p-4 rounded-lg ${reflection.user === 'Admin System' ? 'bg-indigo-50 border-l-4 border-indigo-300 text-sm italic' : 'bg-white shadow-md'}`}>
        <p className="font-medium text-gray-800">{reflection.text}</p>
        <p className="text-xs text-gray-500 mt-2">
            — {reflection.user} at {reflection.timestamp.split(' ')[0]}
        </p>
    </div>
);


const UnlockedCapsuleView = ({ capsule = mockCapsuleData, onBack }) => {
  const [newReflection, setNewReflection] = useState('');

  const handlePostReflection = (e) => {
    e.preventDefault();
    if (!newReflection.trim()) return;

    // Simulate adding a new reflection (Post-Unlock Interaction)
    const newEntry = {
      user: 'You (Current User)', // In a real app, this would be the logged-in user
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      text: newReflection,
    };
    
    // In a real app, you would send this to the backend API.
    console.log("New Reflection Posted:", newEntry);
    alert("Reflection successfully posted!");
    setNewReflection('');
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <button onClick={onBack} className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Dashboard
      </button>

      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <div className="border-b pb-4 mb-6 flex justify-between items-center">
            <div>
                <h2 className="text-4xl font-extrabold text-gray-900">{capsule.title}</h2>
                <p className="text-lg text-indigo-600 mt-1">
                    Theme: {capsule.theme}
                </p>
            </div>
            <div className="text-right">
                <span className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                    <Clock className="w-4 h-4 mr-2" /> UNLOCKED!
                </span>
                <p className="text-sm text-gray-500 mt-1">Opened on: {new Date(capsule.unlockDate).toLocaleDateString()}</p>
            </div>
        </div>

        {/* Capsule Contents Section */}
        <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Download className="w-6 h-6 mr-2 text-indigo-500" /> Capsule Contents
            </h3>
            <div className="space-y-3">
                {capsule.contents.map((item, index) => (
                    <CapsuleContentItem key={index} item={item} />
                ))}
            </div>
        </div>
        
        <hr className="my-8" />

        {/* Post-Unlock Interaction & Collaboration Mode Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <MessageSquare className="w-6 h-6 mr-2 text-indigo-500" /> Family Reflections
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
                    {capsule.reflections.map((r, index) => (
                        <ReflectionEntry key={index} reflection={r} />
                    ))}
                </div>
                
                {/* Add Reflection Form */}
                <form onSubmit={handlePostReflection} className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold mb-2">Add Your Reflection (Collaboration Mode)</h4>
                    <textarea
                        value={newReflection}
                        onChange={(e) => setNewReflection(e.target.value)}
                        rows="3"
                        placeholder="Share your thoughts, feelings, or memories prompted by this capsule..."
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                        type="submit"
                        disabled={!newReflection.trim()}
                        className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition duration-150 flex items-center"
                    >
                        <PlusCircle className="w-5 h-5 mr-1" /> Post Reflection
                    </button>
                </form>
            </div>
            
            {/* Sidebar for Metadata/Actions */}
            <div className="lg:col-span-1 p-6 bg-gray-100 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Capsule Details</h3>
                <div className="space-y-3 text-sm text-gray-700">
                    <p className="flex items-center"><User className="w-4 h-4 mr-2 text-indigo-500" /> **Created By:** Dad (John L.)</p>
                    <p className="flex items-center"><User className="w-4 h-4 mr-2 text-indigo-500" /> **Unlocked By:** {capsule.unlockedBy}</p>
                    <p className="flex items-center"><Share className="w-4 h-4 mr-2 text-indigo-500" /> **Recipients:** Sarah L., Mike J.</p>
                    <p className="flex items-center"><Heart className="w-4 h-4 mr-2 text-indigo-500" /> **Total Interactions:** {capsule.reflections.length} Reflections</p>
                </div>
                
                <hr className="my-4" />
                <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-150">
                    Delete Capsule
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockedCapsuleView;