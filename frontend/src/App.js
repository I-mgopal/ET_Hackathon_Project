import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import InputForm from './components/InputForm';
import LoadingAgent from './components/LoadingAgent';
import HealthScore from './components/HealthScore';
import TaxComparison from './components/TaxComparison';
import Advisory from './components/Advisory';
import DisclaimerBanner from './components/DisclaimerBanner';
import { Button } from './components/ui/button';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [step, setStep] = useState('input'); // input, loading, health, tax, advisory
  const [currentAgent, setCurrentAgent] = useState(null); // profiler, scorer, calc, advisory
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setStep('loading');
    setError(null);

    try {
      // Show agent progression
      setCurrentAgent('profiler');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentAgent('scorer');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCurrentAgent('calc');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCurrentAgent('advisory');

      // Call backend API
      const response = await axios.post(`${API}/submit-profile`, formData);
      
      setResults(response.data);
      setStep('health');
    } catch (err) {
      console.error('Error submitting profile:', err);
      setError(err.response?.data?.detail || 'Failed to analyze your financial profile. Please try again.');
      setStep('input');
    }
  };

  const handleRetry = () => {
    setStep('input');
    setResults(null);
    setError(null);
    setCurrentAgent(null);
  };

  const navigateToStep = (newStep) => {
    setStep(newStep);
  };

  return (
    <div className="App">
      {/* Navigation (shown when results are available) */}
      {results && step !== 'input' && step !== 'loading' && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Button
                variant="outline"
                onClick={handleRetry}
                className="gap-2"
                data-testid="start-over-btn"
              >
                <Home className="w-4 h-4" />
                Start Over
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant={step === 'health' ? 'default' : 'outline'}
                  onClick={() => navigateToStep('health')}
                  size="sm"
                  data-testid="nav-health-btn"
                >
                  Health Score
                </Button>
                <Button
                  variant={step === 'tax' ? 'default' : 'outline'}
                  onClick={() => navigateToStep('tax')}
                  size="sm"
                  data-testid="nav-tax-btn"
                >
                  Tax Comparison
                </Button>
                <Button
                  variant={step === 'advisory' ? 'default' : 'outline'}
                  onClick={() => navigateToStep('advisory')}
                  size="sm"
                  data-testid="nav-advisory-btn"
                >
                  Advisory
                </Button>
              </div>

              <div className="flex gap-2">
                {step === 'health' && (
                  <Button onClick={() => navigateToStep('tax')} className="gap-2" data-testid="next-to-tax-btn">
                    Tax Comparison <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
                {step === 'tax' && (
                  <>
                    <Button variant="outline" onClick={() => navigateToStep('health')} className="gap-2">
                      <ChevronLeft className="w-4 h-4" /> Health Score
                    </Button>
                    <Button onClick={() => navigateToStep('advisory')} className="gap-2" data-testid="next-to-advisory-btn">
                      Advisory <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
                {step === 'advisory' && (
                  <Button variant="outline" onClick={() => navigateToStep('tax')} className="gap-2">
                    <ChevronLeft className="w-4 h-4" /> Tax Comparison
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b-4 border-red-500 p-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-red-800 font-semibold">{error}</p>
            <Button onClick={handleRetry} variant="outline" className="mt-2" size="sm">
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pb-16">
        {step === 'input' && <InputForm onSubmit={handleFormSubmit} />}
        {step === 'loading' && <LoadingAgent currentAgent={currentAgent} />}
        {step === 'health' && results && <HealthScore data={results.healthScore} />}
        {step === 'tax' && results && <TaxComparison data={results.taxComparison} />}
        {step === 'advisory' && results && <Advisory data={results.advisory} />}
      </div>

      {/* Disclaimer Banner - Always visible */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <DisclaimerBanner />
      </div>
    </div>
  );
}

export default App;