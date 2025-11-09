
import React from 'react';
import { StrategicReport } from '../types';

interface StrategicReportDisplayProps {
  report: StrategicReport;
}

export const StrategicReportDisplay: React.FC<StrategicReportDisplayProps> = ({ report }) => (
  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg mt-6 animate-fade-in">
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-green-400 mb-2">✅ Top Success Pattern</h3>
        <p className="text-gray-300 bg-gray-900/50 p-4 rounded-md leading-relaxed">{report.topSuccessPattern}</p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-red-400 mb-2">❌ Core Weakness</h3>
        <p className="text-gray-300 bg-gray-900/50 p-4 rounded-md leading-relaxed">{report.coreWeakness}</p>
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-blue-400 mb-3">🚀 30-Day Action Plan</h3>
        <ul className="space-y-3 text-gray-300 list-inside">
          {report.actionPlan.map((action, index) => (
             <li key={index} className="bg-gray-900/50 p-3 rounded-md flex items-start">
                <span className="text-blue-400 font-bold mr-3">{index + 1}.</span>
                <span>{action}</span>
             </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
