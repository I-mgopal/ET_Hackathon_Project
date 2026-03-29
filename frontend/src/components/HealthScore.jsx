import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';

const HealthScore = ({ data }) => {
  const { totalScore, dimensions, weakestDimension, topPriority } = data;

  // Prepare data for radial chart
  const chartData = [
    {
      name: 'Score',
      value: totalScore,
      fill: totalScore >= 75 ? '#10b981' : totalScore >= 50 ? '#f59e0b' : '#ef4444'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'warn':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'critical':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <TrendingUp className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'bg-green-50 border-green-200';
      case 'warn':
        return 'bg-amber-50 border-amber-200';
      case 'critical':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Money Health Score</h1>
          <p className="text-lg text-gray-600">Comprehensive financial wellness assessment</p>
        </div>

        {/* Score Gauge */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="relative">
              <ResponsiveContainer width={280} height={280}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="80%"
                  outerRadius="100%"
                  data={chartData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={10}
                    fill={chartData[0].fill}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl font-bold text-gray-900" data-testid="total-health-score">{totalScore}</div>
                <div className="text-2xl text-gray-500">/100</div>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {totalScore >= 75 ? 'Excellent Financial Health!' : totalScore >= 50 ? 'Good Progress' : 'Needs Attention'}
              </h2>
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold text-purple-900 mb-1">Your Biggest Gap</p>
                <p className="text-purple-700">{weakestDimension}</p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-blue-900 mb-1">Top Priority</p>
                <p className="text-blue-700">{topPriority}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dimension Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(dimensions).map(([key, dimension]) => (
            <div
              key={key}
              className={`rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
                getStatusColor(dimension.status)
              } ${
                key === weakestDimension.toLowerCase().replace(/\s+/g, '') 
                  ? 'ring-4 ring-purple-300 ring-opacity-50 animate-pulse'
                  : ''
              }`}
              data-testid={`dimension-card-${key}`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                {getStatusIcon(dimension.status)}
              </div>
              <div className="mb-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900" data-testid={`dimension-score-${key}`}>
                    {dimension.score}
                  </span>
                  <span className="text-xl text-gray-500">/10</span>
                </div>
              </div>
              <p className="text-sm text-gray-700">{dimension.insight}</p>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      dimension.status === 'good'
                        ? 'bg-green-600'
                        : dimension.status === 'warn'
                        ? 'bg-amber-600'
                        : 'bg-red-600'
                    }`}
                    style={{ width: `${(dimension.score / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthScore;