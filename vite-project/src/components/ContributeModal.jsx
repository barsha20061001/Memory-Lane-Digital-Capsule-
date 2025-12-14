import React, { useState } from 'react';
import { X, Upload, Plus, Users, Calendar, Send } from 'lucide-react';

const ContributeModal = ({ isOpen, onClose, capsule }) => {
  const [contributions, setContributions] = useState([]);

  if (!isOpen) return null;
  
  const handleFileChange = (e) => {
    // Collect the files for pending contribution
    const newFiles = Array.from(e.target.files).map(f => ({ 
      name: f.name, 
      size: (f.size / 1024 / 1024).toFixed(2), 
      contributor: 'You' 
    }));
    setContributions(prev => [...prev, ...newFiles]);
  };

  const handleSubmit = () => {
    // In a real application, you would send these files and metadata to the server.
    console.log(`Submitting ${contributions.length} files to capsule: ${capsule.title}`);
    alert(`Successfully added ${contributions.length} new item(s) to "${capsule.title}"!`);
    onClose();
    setContributions([]);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full">
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <h3 className="text-2xl font-bold text-indigo-700">Contribute to {capsule.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 space-y-2 text-sm text-gray-600 p-3 bg-indigo-50 rounded-lg">
            <p className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> **Unlocks:** {new Date(capsule.unlockDate).toLocaleDateString()}</p>
            <p className="flex items-center"><Users className="w-4 h-4 mr-2" /> **Contribution Window Open:** Add your files now!</p>
        </div>

        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center hover:border-green-500 transition duration-150 mb-6">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">Upload photos, audio, or video files for this shared capsule.</p>
          <label htmlFor="file-upload-contribute" className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 inline-block transition duration-150">
            Select Files to Add
          </label>
          <input
            id="file-upload-contribute"
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Pending Contributions List */}
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Plus className="w-5 h-5 mr-1 text-green-600" /> New Contributions ({contributions.length})
        </h4>
        <ul className="space-y-2 max-h-40 overflow-y-auto mb-6">
          {contributions.length > 0 ? (
            contributions.map((file, index) => (
              <li key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                <span className="font-medium text-gray-700">{file.name}</span>
                <span className="text-gray-500">{file.size} MB</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic text-sm">No files pending contribution.</li>
          )}
        </ul>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={contributions.length === 0}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
          >
            <Send className="w-4 h-4 mr-2" /> Submit {contributions.length} Contribution(s)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContributeModal;