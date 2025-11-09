import React from 'react';

interface GeneratedResponseProps {
  response: string;
}

export const GeneratedResponse: React.FC<GeneratedResponseProps> = ({ response }) => (
  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg mt-6 animate-fade-in">
    <h3 className="text-xl font-bold text-blue-400 mb-4">Suggested Response:</h3>
    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{response}</p>
  </div>
);

// Add a simple fade-in animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
document.head.append(style);
