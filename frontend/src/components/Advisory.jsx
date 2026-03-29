import React from 'react';
import { Lightbulb, TrendingUp, Shield, Flame } from 'lucide-react';
import { formatIndianCurrency } from '../utils/formatters';

const Advisory = ({ data }) => {
  const { missedDeductions, totalMissedSaving, instruments, summary } = data;

  const getRiskBadge = (riskLevel) => {
    switch (riskLevel) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'High':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Shield className="w-6 h-6 text-green-600" />;
      case 2:
        return <TrendingUp className="w-6 h-6 text-blue-600" />;
      case 3:
        return <Flame className="w-6 h-6 text-orange-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Personalized Tax Advisory</h1>
          <p className="text-lg text-gray-600">Maximize your savings with these recommendations</p>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <Lightbulb className="w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Key Insight</h2>
              <p className="text-lg opacity-95">{summary}</p>
            </div>
          </div>
        </div>

        {/* Missed Deductions */}
        {missedDeductions && missedDeductions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Missed Deductions</h2>
              <div className="bg-red-100 border-2 border-red-300 text-red-800 px-6 py-3 rounded-xl">
                <p className="text-sm font-semibold">Additional Savings Possible</p>
                <p className="text-2xl font-bold" data-testid="total-missed-savings">
                  {formatIndianCurrency(totalMissedSaving)}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Section</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Max Allowed</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">You Claimed</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">You Can Save</th>
                  </tr>
                </thead>
                <tbody>
                  {missedDeductions.map((deduction, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50" data-testid={`missed-deduction-${index}`}>
                      <td className="py-4 px-4">
                        <span className="font-mono font-semibold text-purple-700">
                          {deduction.section}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{deduction.description}</p>
                          <p className="text-sm text-gray-600 mt-1">{deduction.action}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-mono">
                        {formatIndianCurrency(deduction.maxAllowed)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-gray-500">
                        {formatIndianCurrency(deduction.currentlyClaimed)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="inline-flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
                          {formatIndianCurrency(deduction.potentialSaving)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recommended Instruments */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Tax-Saving Instruments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {instruments.map((instrument, index) => (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all hover:border-purple-300"
                data-testid={`instrument-card-${index}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getRankIcon(instrument.rank)}
                    <span className="text-sm font-bold text-gray-500">Rank #{instrument.rank}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskBadge(
                      instrument.riskLevel
                    )}`}
                  >
                    {instrument.riskLevel} Risk
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{instrument.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{instrument.suitability}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Section:</span>
                    <span className="font-mono font-semibold text-purple-700">
                      {instrument.section}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lock-in:</span>
                    <span className="font-semibold text-gray-900">{instrument.lockIn}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Expected Return:</span>
                    <span className="font-semibold text-green-700">{instrument.expectedReturn}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-800 font-semibold mb-1">Your Tax Benefit</p>
                  <p className="text-lg font-bold text-green-900">{instrument.taxBenefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advisory;