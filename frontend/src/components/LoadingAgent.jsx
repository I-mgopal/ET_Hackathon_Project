import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingAgent = ({ currentAgent }) => {
  const agents = [
    { id: 1, name: 'Profiling your financial data...', step: 'profiler' },
    { id: 2, name: 'Calculating your Money Health Score...', step: 'scorer' },
    { id: 3, name: 'Running tax calculations for both regimes...', step: 'calc' },
    { id: 4, name: 'Finding your missed deductions...', step: 'advisory' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Finances</h2>
          <p className="text-gray-600">Our AI agents are working on your personalized report</p>
        </div>

        <div className="space-y-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                currentAgent === agent.step
                  ? 'bg-purple-50 border-2 border-purple-300'
                  : currentAgent > agent.step
                  ? 'bg-green-50 border-2 border-green-300'
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  currentAgent === agent.step
                    ? 'bg-purple-600'
                    : currentAgent > agent.step
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`}
              >
                {currentAgent === agent.step ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : currentAgent > agent.step ? (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-white text-sm font-semibold">{agent.id}</span>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    currentAgent === agent.step
                      ? 'text-purple-900'
                      : currentAgent > agent.step
                      ? 'text-green-900'
                      : 'text-gray-600'
                  }`}
                >
                  Agent {agent.id}: {agent.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-full transition-all duration-500"
              style={{
                width: `${((agents.findIndex(a => a.step === currentAgent) + 1) / agents.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAgent;