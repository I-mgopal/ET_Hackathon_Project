import React from 'react';
import { Check, TrendingUp } from 'lucide-react';
import { formatIndianCurrency, formatPercentage } from '../utils/formatters';

const TaxComparison = ({ data }) => {
  const { oldRegime, newRegime, winner, savings, recommendation } = data;

  const RegimeColumn = ({ title, regimeData, isWinner }) => (
    <div
      className={`rounded-xl p-6 transition-all ${
        isWinner
          ? 'bg-gradient-to-br from-green-50 to-teal-50 border-4 border-green-400 shadow-lg'
          : 'bg-white border-2 border-gray-200'
      }`}
      data-testid={`regime-column-${title.toLowerCase().replace(' ', '-')}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        {isWinner && (
          <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Winner</span>
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="space-y-3 mb-6">
        {regimeData.steps.map((step, index) => {
          const isDeduction = step.label.toLowerCase().includes('less');
          const isTaxable = step.label.toLowerCase().includes('taxable');
          const isTax = step.label.toLowerCase().includes('tax') && !isTaxable;
          const isTotal = step.label.toLowerCase().includes('total tax payable');

          return (
            <div
              key={index}
              className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                isTotal
                  ? 'bg-gray-900 text-white font-bold text-lg'
                  : isTaxable
                  ? 'bg-blue-100 font-semibold'
                  : isDeduction
                  ? 'bg-green-50'
                  : isTax
                  ? 'bg-amber-50'
                  : 'bg-gray-50'
              }`}
              data-testid={`step-${index}`}
            >
              <span className="text-sm">{step.label}</span>
              <span
                className={`font-mono ${
                  isDeduction && step.amount > 0 ? 'text-green-700' : ''
                }`}
              >
                {isDeduction && step.amount > 0 ? '-' : ''}
                {formatIndianCurrency(Math.abs(step.amount))}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="border-t-2 border-gray-300 pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-600">Total Tax:</span>
          <span className="text-2xl font-bold text-gray-900" data-testid={`total-tax-${title.toLowerCase().replace(' ', '-')}`}>
            {formatIndianCurrency(regimeData.totalTax)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Effective Rate:</span>
          <span className="text-lg font-semibold text-gray-700">
            {formatPercentage(regimeData.effectiveRate)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tax Regime Comparison</h1>
          <p className="text-lg text-gray-600">FY 2025-26 Complete Breakdown</p>
        </div>

        {/* Savings Banner */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-center gap-3">
            <TrendingUp className="w-8 h-8" />
            <div className="text-center">
              <p className="text-sm font-semibold opacity-90">You can save</p>
              <p className="text-4xl font-bold" data-testid="total-savings">{formatIndianCurrency(savings)}</p>
              <p className="text-sm opacity-90 mt-1">by choosing the {winner === 'old' ? 'Old' : 'New'} Regime</p>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">Recommendation</h3>
          <p className="text-blue-800">{recommendation}</p>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RegimeColumn
            title="Old Regime"
            regimeData={oldRegime}
            isWinner={winner === 'old'}
          />
          <RegimeColumn
            title="New Regime"
            regimeData={newRegime}
            isWinner={winner === 'new'}
          />
        </div>
      </div>
    </div>
  );
};

export default TaxComparison;