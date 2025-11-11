import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

// Types pour les données de graphiques
interface ChartData {
  [key: string]: string | number;
}

// Couleurs pour les graphiques
const COLORS = {
  primary: '#1c3d8f',
  secondary: '#f59e0b',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  light: '#f3f4f6',
  dark: '#1f2937'
};

const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.success, COLORS.danger, COLORS.warning, COLORS.info];

// Composant BarChart
interface BarChartProps {
  data: ChartData[];
  xKey: string;
  yKey: string;
  title?: string;
  height?: number;
  color?: string;
}

export const CustomBarChart: React.FC<BarChartProps> = ({ 
  data, 
  xKey, 
  yKey, 
  title, 
  height = 300,
  color = COLORS.primary 
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Composant PieChart
interface PieChartProps {
  data: ChartData[];
  dataKey: string;
  nameKey: string;
  title?: string;
  height?: number;
}

export const CustomPieChart: React.FC<PieChartProps> = ({ 
  data, 
  dataKey, 
  nameKey, 
  title, 
  height = 300 
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
            label={({ name, percent }: { name?: string; percent?: number }) => 
              `${name || ''} ${percent ? (percent * 100).toFixed(0) : '0'}%`
            }
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Composant LineChart
interface LineChartProps {
  data: ChartData[];
  xKey: string;
  yKey: string;
  title?: string;
  height?: number;
  color?: string;
}

export const CustomLineChart: React.FC<LineChartProps> = ({ 
  data, 
  xKey, 
  yKey, 
  title, 
  height = 300,
  color = COLORS.primary 
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey={yKey} 
            stroke={color} 
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Composant AreaChart
interface AreaChartProps {
  data: ChartData[];
  xKey: string;
  yKey: string;
  title?: string;
  height?: number;
  color?: string;
}

export const CustomAreaChart: React.FC<AreaChartProps> = ({ 
  data, 
  xKey, 
  yKey, 
  title, 
  height = 300,
  color = COLORS.primary 
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey={yKey} 
            stroke={color} 
            fill={color} 
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Composant multi-lignes
interface MultiLineChartProps {
  data: ChartData[];
  xKey: string;
  lines: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  title?: string;
  height?: number;
}

export const CustomMultiLineChart: React.FC<MultiLineChartProps> = ({ 
  data, 
  xKey, 
  lines, 
  title, 
  height = 300 
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          {lines.map((line, index) => (
            <Line 
              key={index}
              type="monotone" 
              dataKey={line.key} 
              stroke={line.color} 
              strokeWidth={2}
              name={line.name}
              dot={{ fill: line.color, strokeWidth: 2, r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
