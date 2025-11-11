import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface AnimatedBarChartProps {
  data: DataPoint[];
  title: string;
  unit?: string;
}

export function AnimatedBarChart({ data, title, unit = '' }: AnimatedBarChartProps) {
  const { isDarkMode } = useTheme();
  const [animatedData, setAnimatedData] = useState(data.map(d => ({ ...d, value: 0 })));
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedData(data);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [data]);

  const maxValue = Math.max(...data.map(d => d.value));
  
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-yellow-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-orange-500'
  ];

  return (
    <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
      <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      
      <div className="space-y-4">
        {animatedData.map((item, index) => (
          <div key={item.name} className="flex items-center space-x-4">
            <div className={`w-24 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              {item.name}
            </div>
            
            <div className="flex-1 relative">
              <div className={`h-8 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                <div
                  className={`h-8 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3 ${
                    item.color || colors[index % colors.length]
                  }`}
                  style={{ 
                    width: `${(item.value / maxValue) * 100}%`,
                    minWidth: item.value > 0 ? '2rem' : '0'
                  }}
                >
                  <span className="text-white text-sm font-medium">
                    {item.value}{unit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface AnimatedPieChartProps {
  data: DataPoint[];
  title: string;
  size?: number;
}

export function AnimatedPieChart({ data, title, size = 200 }: AnimatedPieChartProps) {
  const { isDarkMode } = useTheme();
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(1);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#ef4444', // red
    '#6366f1', // indigo
    '#ec4899', // pink
    '#f97316'  // orange
  ];

  return (
    <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
      <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      
      <div className="flex items-center space-x-6">
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 20}
              fill="none"
              stroke={isDarkMode ? '#374151' : '#e5e7eb'}
              strokeWidth="4"
            />
            
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage * progress * 0.01 * Math.PI * (size - 40)} ${Math.PI * (size - 40)}`;
              const strokeDashoffset = -currentAngle * 0.01 * Math.PI * (size - 40);
              
              const result = (
                <circle
                  key={item.name}
                  cx={size / 2}
                  cy={size / 2}
                  r={size / 2 - 20}
                  fill="none"
                  stroke={item.color || colors[index % colors.length]}
                  strokeWidth="16"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              );
              
              currentAngle += percentage;
              return result;
            })}
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {total}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Total
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color || colors[index % colors.length] }}
              />
              <div>
                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.name}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface AnimatedLineChartProps {
  data: Array<{ name: string; [key: string]: number | string }>;
  lines: Array<{ key: string; color: string; name: string }>;
  title: string;
  height?: number;
}

export function AnimatedLineChart({ data, lines, title, height = 300 }: AnimatedLineChartProps) {
  const { isDarkMode } = useTheme();
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(1);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const width = 600;
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  // Calculer les valeurs min/max pour l'échelle
  const allValues = data.flatMap(d => lines.map(line => d[line.key])).filter(v => typeof v === 'number');
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const range = maxValue - minValue;

  const getY = (value: number) => {
    return chartHeight - ((value - minValue) / range) * chartHeight;
  };

  const getX = (index: number) => {
    return (index / (data.length - 1)) * chartWidth;
  };

  return (
    <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
      <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      
      <div className="flex items-start space-x-6">
        <svg width={width} height={height} className="overflow-visible">
          {/* Grille */}
          {[0, 1, 2, 3, 4].map(i => (
            <g key={i}>
              <line
                x1={padding}
                y1={padding + (i * chartHeight / 4)}
                x2={padding + chartWidth}
                y2={padding + (i * chartHeight / 4)}
                stroke={isDarkMode ? '#374151' : '#e5e7eb'}
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={padding + (i * chartHeight / 4) + 4}
                textAnchor="end"
                className={`text-xs ${isDarkMode ? 'fill-slate-400' : 'fill-gray-500'}`}
              >
                {Math.round(maxValue - (i * range / 4))}
              </text>
            </g>
          ))}

          {/* Lignes de données */}
          {lines.map(line => {
            const points = data.map((d, i) => {
              const value = typeof d[line.key] === 'number' ? d[line.key] : 0;
              return `${padding + getX(i)},${padding + getY(value as number)}`;
            }).join(' ');
            const pathLength = points.length * 2; // Approximation
            
            return (
              <g key={line.key}>
                <polyline
                  points={points}
                  fill="none"
                  stroke={line.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={pathLength}
                  strokeDashoffset={pathLength * (1 - progress)}
                  className="transition-all duration-2000 ease-out"
                />
                {/* Points */}
                {data.map((d, i) => {
                  const value = typeof d[line.key] === 'number' ? d[line.key] : 0;
                  return (
                    <circle
                      key={i}
                      cx={padding + getX(i)}
                      cy={padding + getY(value as number)}
                      r="4"
                      fill={line.color}
                      className="opacity-0 animate-pulse"
                      style={{ 
                        opacity: progress,
                        animationDelay: `${i * 100}ms`
                      }}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Axe X */}
          {data.map((d, i) => (
            <text
              key={i}
              x={padding + getX(i)}
              y={height - 10}
              textAnchor="middle"
              className={`text-xs ${isDarkMode ? 'fill-slate-400' : 'fill-gray-500'}`}
            >
              {d.name}
            </text>
          ))}
        </svg>
        
        {/* Légende */}
        <div className="space-y-2">
          {lines.map(line => (
            <div key={line.key} className="flex items-center space-x-2">
              <div 
                className="w-4 h-0.5 rounded"
                style={{ backgroundColor: line.color }}
              />
              <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                {line.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
