import React from 'react';
import { AlertCircle } from 'lucide-react';

const DisclaimerBanner = () => {
  return (
    <div className="bg-amber-50 border-t border-amber-200 py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-900">
          <strong>Disclaimer:</strong> This is AI-generated guidance for educational purposes only and does not constitute licensed financial advice under SEBI or RBI regulations. Please consult a SEBI-registered financial advisor before making investment or tax decisions.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerBanner;