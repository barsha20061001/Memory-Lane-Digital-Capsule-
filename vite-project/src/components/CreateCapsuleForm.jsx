import React, { useState } from 'react';
import { ChevronLeft, Save, Users, Calendar, Folder, Upload, Lock,Mail, Eye , Brain } from 'lucide-react';
import AIAssistant from './AIAssistant'; // New Import

const THEMES = [
  'Childhood',
  'Family History',
  'College Years',
  'Major Life Events',
  'Personal Goals',
];

const CreateCapsuleForm = ({ onCancel, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    theme: '',
    content: [], // Placeholder for uploaded files
    unlockType: 'date', // 'date' or 'event'
    unlockValue: '', // Date or Event description
    recipients: [], // List of emails/users
    notificationEnabled: true,
    sendFullContent: false,
    privacySetting: 'private',
  });

  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false); // New state for AI Modal

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    // In a real app, you would handle file uploads to a server here.
    // For now, we'll just track the number of files.
    setFormData(prev => ({
      ...prev,
      content: [...prev.content, ...Array.from(e.target.files).map(f => f.name)]
    }));
  };

  const handleRecipientChange = (e) => {
    const emails = e.target.value
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    // Simple comma-separated list for demo
    setFormData(prev => ({ ...prev, recipients: emails }));
  }

  const handleNext = () => {
    console.log(`Advancing from Step ${step} to Step ${step + 1}`);
    setStep(prev => prev + 1);
  };
  const handlePrev = () => setStep(prev => prev - 1);
  const handleFinalSubmit = () => {
    // Basic validation and submission logic
    console.log("Submitting Capsule with Notifications Enabled:", formData.notificationEnabled);
    onSubmit(formData);
  };
    const handleAIOpen = () => {
      if (formData.content.length === 0) {
          alert("Please upload some files first before using the AI Assistant.");
          return;
      }
      setIsAIAssistantOpen(true);
  };
   const handleAIClose = () => setIsAIAssistantOpen(false);

  const StepIndicator = ({ number, title }) => (
    <div className={`flex items-center space-x-2 ${step === number ? 'text-indigo-600 font-bold' : 'text-gray-500'}`}>
      <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step === number ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 bg-white'}`}>
        {number}
      </div>
      <span className="hidden sm:inline">{title}</span>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          // Step 1: Basic Info & Themed Memory Collections
          <section>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">1. Basic Capsule Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Capsule Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Message to my 50-year-old self"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Folder className="w-4 h-4 mr-2" /> Themed Memory Collections
                </label>
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="">Select a Theme (Optional)</option>
                  {THEMES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        );

      case 2:
        return (
          // Step 2: Create Digital Time Capsules (Content Upload)
          <section>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">2. Add Memories</h3>
            <p className="text-sm text-gray-500 mb-4">Upload photos, videos, letters, and messages.</p>
            
            <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center hover:border-indigo-500 transition duration-150">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Drag and drop files here, or</p>
              <label htmlFor="file-upload" className="cursor-pointer bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 inline-block transition duration-150">
                Browse Files
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {formData.content.length > 0 && (
                        <button
                            type="button"
                            onClick={handleAIOpen}
                            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-150 flex items-center mx-auto shadow-md"
                        >
                            <Brain className="w-5 h-5 mr-2" /> Use AI Memory Assistant
                        </button>
                    )}
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-700">Files Added ({formData.content.length})</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 max-h-40 overflow-y-auto mt-2 p-2 bg-gray-50 rounded-md">
                {formData.content.length > 0 ? (
                  formData.content.map((name, index) => <li key={index}>{name}</li>)
                ) : (
                  <li>No files added yet.</li>
                )}
              </ul>
            </div>

            {isAIAssistantOpen && (
                        <AIAssistant 
                            isOpen={isAIAssistantOpen} 
                            onClose={handleAIClose} 
                            files={formData.content} // Pass uploaded files to the assistant
                        />
                    )}

          </section>
        );

      case 3:
        return (
          // Step 3: Unlock Conditions & Countdown Timer (implied)
          <section>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">3. Set Unlock Condition</h3>
            <p className="text-sm text-gray-500 mb-6">Choose when this capsule will open for your loved ones.</p>
            
            <div className="flex space-x-4 mb-6">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, unlockType: 'date' }))}
                className={`flex-1 p-4 rounded-lg border-2 transition duration-150 ${formData.unlockType === 'date' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
              >
                <Calendar className="w-6 h-6 mb-2 text-indigo-600" />
                <span className="font-medium">Specific Date</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, unlockType: 'event' }))}
                className={`flex-1 p-4 rounded-lg border-2 transition duration-150 ${formData.unlockType === 'event' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
              >
                <Lock className="w-6 h-6 mb-2 text-indigo-600" />
                <span className="font-medium">Major Life Event</span>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {formData.unlockType === 'date' ? 'Unlock Date' : 'Life Event Description'}
              </label>
              <input
                type={formData.unlockType === 'date' ? 'date' : 'text'}
                name="unlockValue"
                value={formData.unlockValue}
                onChange={handleChange}
                placeholder={formData.unlockType === 'date' ? 'Select a date' : 'e.g., Graduation from University'}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </section>
        );

      case 4:
        return (
          // Step 4: Recipient Assignment & Privacy Controls (implied)
          <section>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">4. Assign Recipients</h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter the email addresses of the people who will receive the capsule when it unlocks.
            </p>
            
            <label className="block text-sm font-medium text-gray-700 flex items-center">
                <Users className="w-4 h-4 mr-2" /> Recipient Emails (Comma Separated)
            </label>
            <textarea
              name="recipients"
              value={formData.recipients.join(', ')}
              onChange={handleRecipientChange}
              rows="4"
              placeholder="e.g., mom@family.com, brother@mail.com"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
            
            {/* Privacy Controls (Optional Feature - basic implementation) */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-gray-800">Privacy Control</h4>
                <p className="text-sm text-gray-600">
                    This capsule is currently set to be **Private** (visible only to assigned recipients). Advanced visibility options can be set later.
                </p>
            </div>
            <p className="mt-2 text-sm text-indigo-600 font-medium">
                        {formData.recipients.length} Recipient(s) Added.
                    </p>
          </section>
        );

        case 5:
            return (
                // Step 5: Email Notifications & Privacy Controls
                <section>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">5. Final Settings</h3>

                    {/* Email Notifications (REQUIRED FEATURE 4) */}
                    <div className="p-6 bg-green-50 rounded-lg border border-green-200 mb-6 space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="notificationEnabled"
                                checked={formData.notificationEnabled}
                                onChange={(e) => setFormData(prev => ({ ...prev, notificationEnabled: e.target.checked }))}
                                className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <Mail className="w-5 h-5 text-green-700" />
                            <span className="font-semibold text-gray-800">
                                Automatically notify recipients when capsule unlocks
                            </span>
                        </label>
                        <p className="text-sm text-gray-600 mt-2 ml-8">
                            We will send an email notification to all assigned recipients ({formData.recipients.length} user(s)) on the unlock date/event.
                        </p>

                        {/* NEW: Scheduled Email Delivery Control */}
                        {formData.notificationEnabled && (
                            <label className="flex items-center space-x-3 cursor-pointer ml-4 pt-3 border-t border-green-100">
                                <input
                                    type="checkbox"
                                    name="sendFullContent"
                                    checked={formData.sendFullContent}
                                    onChange={(e) => setFormData(prev => ({ ...prev, sendFullContent: e.target.checked }))}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className="font-semibold text-gray-800 flex items-center">
                                    <Save className="w-4 h-4 mr-2 text-indigo-500" /> 2. **Scheduled Email Delivery** (Send full content)
                                </span>
                            </label>
                        )}
                        <p className="text-xs text-gray-500 ml-12">
                            If checked, the full capsule contents (files/text) will be delivered directly via email. (Only links if content size is too large.)
                        </p>


                    </div>

                    {/* Privacy Controls (OPTIONAL FEATURE 4) */}
                    <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-200">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <Eye className="w-5 h-5 mr-2 text-indigo-700" /> Privacy Control
                        </h4>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-1">
                                <input
                                    type="radio"
                                    name="privacySetting"
                                    value="private"
                                    checked={formData.privacySetting === 'private'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">Private (Only recipients can view)</span>
                            </label>
                            <label className="flex items-center space-x-1">
                                <input
                                    type="radio"
                                    name="privacySetting"
                                    value="public"
                                    checked={formData.privacySetting === 'public'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">Public (Viewable by link, read-only)</span>
                            </label>
                        </div>
                    </div>
                </section>
            );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 flex items-center">
        Create New Time Capsule
      </h2>
      
      {/* Progress Tracker */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <StepIndicator number={1} title="Details & Theme" />
        <div className="flex-1 border-t-2 mx-2"></div>
        <StepIndicator number={2} title="Add Memories" />
        <div className="flex-1 border-t-2 mx-2"></div>
        <StepIndicator number={3} title="Unlock Condition" />
        <div className="flex-1 border-t-2 mx-2"></div>
        <StepIndicator number={4} title="Recipients" />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="min-h-72">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          <button
            type="button"
            onClick={step === 1 ? onCancel : handlePrev}
            className="flex items-center text-gray-600 hover:text-gray-800 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-150"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {step === 1 ? 'Cancel' : 'Previous'}
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={(step === 1 && !formData.title) ||
                (step === 3 && !formData.unlockValue) || // Basic validation for unlock date
                (step === 4 && formData.recipients.length === 0) // Validation for recipients
              } // Simple validation
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-150 flex items-center shadow-lg"
            >
              <Save className="w-5 h-5 mr-2" />
              Finalize & Save Capsule
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateCapsuleForm;