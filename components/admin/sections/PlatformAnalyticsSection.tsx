import React from 'react';
import { MOCK_ANALYTICS_DATA } from '../../../constants';
import AnalyticsChartCard from '../charts/AnalyticsChartCard';
import { BarChart3, Info } from 'lucide-react';

const PlatformAnalyticsSection: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
          <BarChart3 size={28} className="mr-3 text-green-500" /> Platform Analytics
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_ANALYTICS_DATA.map(chartData => (
          <AnalyticsChartCard key={chartData.id} chart={chartData} />
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg text-sm text-blue-700 dark:text-blue-300">
        <Info size={18} className="inline mr-2"/>
        This analytics section displays mock data for demonstration purposes. In a real application, this would be powered by actual user activity and platform metrics.
      </div>
    </div>
  );
};

export default PlatformAnalyticsSection;