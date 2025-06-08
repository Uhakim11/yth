import React from 'react';
import { AdminAnalyticChart } from '../../../types';
import { TrendingUp, BarChart2 } from 'lucide-react'; // Example icons

const AnalyticsChartCard: React.FC<{ chart: AdminAnalyticChart }> = ({ chart }) => {
  const maxValue = Math.max(...chart.data.map(d => d.value), 0) || 1; // Ensure not 0 to avoid division by zero

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1 flex items-center">
        {chart.type === 'bar' ? <BarChart2 size={20} className="mr-2 text-primary-500" /> : <TrendingUp size={20} className="mr-2 text-primary-500" />}
        {chart.title}
      </h3>
      {chart.dataLabel && <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Data shows: {chart.dataLabel}</p>}
      
      <div className="h-64 w-full overflow-x-auto overflow-y-hidden"> {/* Added overflow for many bars */}
        {chart.type === 'bar' && (
          <div className="flex items-end space-x-2 h-full pt-4 px-1"> {/* Added padding for labels */}
            {chart.data.map((point, index) => (
              <div key={index} className="flex flex-col items-center h-full flex-shrink-0 w-10 sm:w-12 group relative">
                <div
                  className="w-full bg-primary-300 dark:bg-primary-700/60 rounded-t-md hover:bg-primary-400 dark:hover:bg-primary-600 transition-all duration-200 ease-in-out relative"
                  style={{ 
                    height: `${(point.value / maxValue) * 100}%`,
                    backgroundColor: point.color // Use point specific color if available
                  }}
                  title={`${point.label}: ${point.value}`}
                >
                   <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 dark:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {point.value}
                    </span>
                </div>
                <span className="mt-1.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate w-full text-center group-hover:font-semibold">
                  {point.label}
                </span>
              </div>
            ))}
          </div>
        )}
        {/* Placeholder for line chart or other types */}
        {chart.type === 'line' && (
          <div className="flex items-center justify-center h-full text-gray-400">
            Line chart for "{chart.title}" not implemented yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsChartCard;