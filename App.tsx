import React, { useState } from 'react';
import { generateContentIdeas, generateFeedbackResponse, generateStrategicPlan } from './services/geminiService';
import { ViralPackage, StrategicReport } from './types';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { ResultCard } from './components/ResultCard';
import { GeneratedResponse } from './components/GeneratedResponse';
import { StrategicReportDisplay } from './components/StrategicReportDisplay';

type Tab = 'content' | 'feedback' | 'planner';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('content');
  
  // State for Content Ideation
  const [viralPackage, setViralPackage] = useState<ViralPackage | null>(null);
  
  // State for AI Comment Responder
  const [videoTopic, setVideoTopic] = useState('');
  const [feedback, setFeedback] = useState('');
  const [generatedResponse, setGeneratedResponse] = useState<string | null>(null);

  // State for Strategic Planner
  const [keyMetrics, setKeyMetrics] = useState('');
  const [topVideos, setTopVideos] = useState('');
  const [worstVideos, setWorstVideos] = useState('');
  const [strategicReport, setStrategicReport] = useState<StrategicReport | null>(null);
  const [strategicInsights, setStrategicInsights] = useState<StrategicReport | null>(null); // State to link planner to analyst

  // Common state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContentGeneration = async () => {
    setIsLoading(true);
    setError(null);
    setViralPackage(null);
    try {
      // Pass the learned insights to the content generator
      const idea = await generateContentIdeas(strategicInsights);
      setViralPackage(idea);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponseGeneration = async () => {
    if (!feedback.trim() || !videoTopic.trim()) return;
    setIsLoading(true);
    setError(null);
    setGeneratedResponse(null);
    try {
      const result = await generateFeedbackResponse(videoTopic, feedback);
      setGeneratedResponse(result);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanGeneration = async () => {
    if (!keyMetrics.trim() || !topVideos.trim() || !worstVideos.trim()) return;
    setIsLoading(true);
    setError(null);
    setStrategicReport(null);
    try {
      const result = await generateStrategicPlan(keyMetrics, topVideos, worstVideos);
      setStrategicReport(result);
      // Save the insights for the content analyst
      setStrategicInsights(result); 
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContentIdeation = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-200">Viral Shorts Idea Generator</h2>
      <p className="mb-4 text-gray-400">
        Click the button to find the single most viral topic in the last 48 hours and generate a complete YouTube upload package for it.
      </p>
      {strategicInsights && (
        <div className="mb-4 bg-blue-900/50 border border-blue-700 text-blue-300 px-4 py-2 rounded-lg text-sm">
          <strong>Pro Tip:</strong> Using insights from your latest strategic plan to find content that matches your channel's strengths.
        </div>
      )}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleContentGeneration}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-md flex items-center justify-center transition-colors min-w-[180px]"
        >
          {isLoading && activeTab === 'content' ? <LoadingSpinner /> : 'Analyze & Generate'}
        </button>
      </div>
      {viralPackage && (
        <div className="mt-6 animate-fade-in">
          <ResultCard viralPackage={viralPackage} />
        </div>
      )}
    </div>
  );

  const renderCommentResponder = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-200">AI Comment Responder</h2>
      <p className="mb-4 text-gray-400">Enter your video's topic and paste the comments to generate a single, fun, and conversational response to your audience.</p>
      <div className="space-y-4">
        <input
            type="text"
            value={videoTopic}
            onChange={(e) => setVideoTopic(e.target.value)}
            placeholder="Enter the video topic (e.g., 'The Great Emu War')"
            className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Paste user comments here..."
            rows={8}
            className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <button
        onClick={handleResponseGeneration}
        disabled={isLoading || !feedback.trim() || !videoTopic.trim()}
        className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-md flex items-center justify-center transition-colors min-w-[190px]"
      >
        {isLoading && activeTab === 'feedback' ? <LoadingSpinner /> : 'Generate Response'}
      </button>
      {generatedResponse && (
        <GeneratedResponse response={generatedResponse} />
      )}
    </div>
  );

  const renderStrategicPlanner = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-200">30-Day Strategic Planner</h2>
      <p className="mb-6 text-gray-400">
        Input your key channel metrics, top 5 videos, and worst 5 videos from the last 30 days. The AI will provide a holistic analysis and a concrete action plan.
      </p>
      <div className="space-y-6">
        <div>
          <label htmlFor="keyMetrics" className="block text-lg font-semibold text-gray-300 mb-2">1. Key Metrics (Last 30 Days)</label>
          <textarea
              id="keyMetrics"
              value={keyMetrics}
              onChange={(e) => setKeyMetrics(e.target.value)}
              placeholder={`Views: 987K\nEngaged Views: 650K\nLikes: 45K\nSubscribers Gained: +12K\nAverage View Duration: 0:45\nWatch Time (Hours): 25.5K`}
              rows={6}
              className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="topVideos" className="block text-lg font-semibold text-gray-300 mb-2">2. Top 5 Videos</label>
          <textarea
              id="topVideos"
              value={topVideos}
              onChange={(e) => setTopVideos(e.target.value)}
              placeholder={`- {Title: "Did Ancient Romans Use Memes?", Views: 1.5M, Retention: 75%}\n- {Title: "3 Shocking Facts About Cleopatra", Views: 1.2M, Retention: 68%}`}
              rows={5}
              className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="worstVideos" className="block text-lg font-semibold text-gray-300 mb-2">3. Worst 5 Videos</label>
          <textarea
              id="worstVideos"
              value={worstVideos}
              onChange={(e) => setWorstVideos(e.target.value)}
              placeholder={`- {Title: "Trade Routes of the 14th Century", Views: 80K, Retention: 40%}\n- {Title: "The Importance of Roman Aqueducts", Views: 95K, Retention: 45%}`}
              rows={5}
              className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>
      <button
        onClick={handlePlanGeneration}
        disabled={isLoading || !keyMetrics.trim() || !topVideos.trim() || !worstVideos.trim()}
        className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-md flex items-center justify-center transition-colors min-w-[190px]"
      >
        {isLoading && activeTab === 'planner' ? <LoadingSpinner /> : 'Generate Action Plan'}
      </button>
      {strategicReport && (
        <StrategicReportDisplay report={strategicReport} />
      )}
    </div>
  );

  return (
    <div className="bg-gray-950 min-h-screen text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            AI Content & Feedback Hub
          </h1>
          <p className="text-gray-400 mt-2">Powered by Gemini API</p>
        </header>

        <div className="mb-8 flex justify-center border-b border-gray-700">
          <button
            className={`py-3 px-6 font-semibold text-lg transition-colors ${activeTab === 'content' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => setActiveTab('content')}
          >
            Viral Content Analyst
          </button>
          <button
            className={`py-3 px-6 font-semibold text-lg transition-colors ${activeTab === 'feedback' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => setActiveTab('feedback')}
          >
            AI Comment Responder
          </button>
          <button
            className={`py-3 px-6 font-semibold text-lg transition-colors ${activeTab === 'planner' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => setActiveTab('planner')}
          >
            Strategic Planner
          </button>
        </div>

        <main>
          {error && <div className="mb-6"><ErrorDisplay message={error} /></div>}
          
          <div>
            {activeTab === 'content' && renderContentIdeation()}
            {activeTab === 'feedback' && renderCommentResponder()}
            {activeTab === 'planner' && renderStrategicPlanner()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;