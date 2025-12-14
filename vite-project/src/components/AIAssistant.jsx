import React, { useState } from 'react';
import { X, Brain, Edit3, MessageSquare, Loader } from 'lucide-react';

const mockFileData = [
  { id: 1, name: 'WeddingDay_Photo.jpg', type: 'image', status: 'ready', action: 'Suggest Caption' },
  { id: 2, name: 'Long_Letter_Dad.txt', type: 'text', status: 'ready', action: 'Generate Summary' },
  { id: 3, name: 'Audio_Recording_1995.mp3', type: 'audio', status: 'transcribe_only', action: 'Transcribe Audio' },
];

const AIAssistant = ({ isOpen, onClose, files }) => {
  const [activeFile, setActiveFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  
  // Use the files prop from the parent form for a real scenario,
  // but use mockFileData for demonstration of AI functions.
  const filesToProcess = mockFileData; 

  if (!isOpen) return null;

  const handleProcessFile = (file) => {
    setActiveFile(file);
    setLoading(true);
    setAiResult('');

    // Simulate API call delay
    setTimeout(() => {
      let result = '';
      if (file.action === 'Suggest Caption') {
        result = "AI Suggestion: 'A beautiful moment captured as the sun set on our first day as a married couple. Pure joy and anticipation.'";
      } else if (file.action === 'Generate Summary') {
        result = "AI Summary: This 5-page letter expresses deep pride in achieving your degree, reminds you of the family values, and outlines three key goals for the next five years. Focuses on career planning and family legacy.";
      } else if (file.action === 'Transcribe Audio') {
        // AI can transcribe audio (Optional Feature 1)
        result = "AI Transcription: [Transcript of audio recording from 1995]: '...and remember, always look after your brother, no matter what happens.'"
      }
      setAiResult(result);
      setLoading(false);
    }, 1500);
  };

  const handleApplyResult = () => {
    if (activeFile) {
      alert(`Applying AI result to ${activeFile.name}:\n${aiResult.substring(0, 50)}...`);
      // In a real app, you would update the file's metadata in the parent state here.
      setActiveFile(null);
      setAiResult('');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <h3 className="text-2xl font-bold text-indigo-700 flex items-center">
            <Brain className="w-6 h-6 mr-2" /> AI Memory Assistant
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          The AI can suggest captions for images, summarize text documents, or transcribe audio files.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* File List for AI Processing */}
          <div className="col-span-1 border-r pr-4 max-h-72 overflow-y-auto">
            <h4 className="font-semibold text-gray-800 mb-2">Files Ready for AI</h4>
            {filesToProcess.map(file => (
              <button
                key={file.id}
                onClick={() => handleProcessFile(file)}
                className={`w-full text-left p-3 rounded-lg my-1 transition duration-150 ${activeFile?.id === file.id ? 'bg-indigo-100 border border-indigo-500' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <p className="font-medium text-sm text-gray-700">{file.name}</p>
                <p className="text-xs text-indigo-600 flex items-center">
                  <Edit3 className="w-3 h-3 mr-1" /> {file.action}
                </p>
              </button>
            ))}
          </div>

          {/* AI Result Area */}
          <div className="col-span-1 pl-4">
            <h4 className="font-semibold text-gray-800 mb-2">AI Output</h4>
            <div className="min-h-[150px] bg-gray-50 p-3 border rounded-lg overflow-y-auto">
              {loading && (
                <div className="text-center text-indigo-500 py-6 flex flex-col items-center">
                  <Loader className="w-6 h-6 animate-spin mb-2" />
                  Generating {activeFile?.action}...
                </div>
              )}
              {aiResult && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{aiResult}</p>
                  <button
                    onClick={handleApplyResult}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 flex items-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" /> Apply & Edit
                  </button>
                </div>
              )}
              {!activeFile && !loading && !aiResult && (
                <p className="text-sm text-gray-500 italic py-6">Select a file from the left to start processing with the AI.</p>
              )}
            </div>
            
            <p className="text-xs text-gray-400 mt-2">
                Powered by Gemini API (Simulated)
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIAssistant;