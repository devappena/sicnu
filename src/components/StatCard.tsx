import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color?: string;
  bgColor?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'bg-ena-blue-600',
  bgColor = 'bg-white',
  onClick
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return '↗';
      case 'decrease':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <div 
      className={`${bgColor} rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${getChangeColor()}`}>
                {getChangeIcon()} {change}
              </span>
              <span className="text-sm text-gray-500 ml-1">ce mois</span>
            </div>
          )}
        </div>
        <div className={`${color} rounded-full p-3 ml-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
