import React from 'react';
import { ViralPackage } from '../types';

interface ResultCardProps {
  viralPackage: ViralPackage;
}

const Hashtag: React.FC<{ tag: string }> = ({ tag }) => (
  <span className="bg-gray-700 text-blue-300 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">{tag}</span>
);

export const ResultCard: React.FC<ResultCardProps> = ({ viralPackage }) => (
  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg hover:shadow-blue-500/20 hover:border-blue-500 transition-all duration-300">
    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Viral Topic Identified:</p>
    <h2 className="text-2xl font-bold text-purple-400 mb-4">{viralPackage.viralTopic}</h2>
    
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-blue-400 mb-2">Shorts Title</h3>
        <p className="text-gray-300 bg-gray-900/50 p-3 rounded-md">{viralPackage.title}</p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-blue-400 mb-2">Video Description</h3>
        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed bg-gray-900/50 p-3 rounded-md">{viralPackage.description}</p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-blue-400 mb-2">Hashtags</h3>
        <div className="bg-gray-900/50 p-3 rounded-md space-y-2">
            <div>
                {viralPackage.primaryHashtags.map(tag => <Hashtag key={tag} tag={tag} />)}
            </div>
            <div>
                {viralPackage.engagementHashtags.map(tag => <Hashtag key={tag} tag={tag} />)}
            </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-bold text-blue-400 mb-2">3-Point Script Outline</h3>
        <div className="space-y-3 text-gray-300 bg-gray-900/50 p-3 rounded-md">
          <div>
            <h4 className="font-semibold text-gray-100">Hook:</h4>
            <p className="text-sm">{viralPackage.outline.hook}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-100">Main Point:</h4>
            <p className="text-sm">{viralPackage.outline.mainPoint}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-100">CTA:</h4>
            <p className="text-sm">{viralPackage.outline.cta}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
