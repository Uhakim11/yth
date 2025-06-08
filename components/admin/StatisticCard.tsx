import React from 'react';
import { StatisticCardData } from '../../types';

const StatisticCard: React.FC<StatisticCardData> = ({ title, value, icon: Icon, bgColorClass }) => {
  return (
    <div className={`p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 ${bgColorClass} text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider opacity-80">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="p-3 bg-black/20 rounded-lg">
          <Icon className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

export default StatisticCard;