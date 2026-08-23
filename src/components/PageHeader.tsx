import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, icon: Icon, children, action }) => {
  return (
    <div 
      className="rounded-lg p-6 text-white"
      style={{
        background: 'linear-gradient(to right, #1c3d8f, #1a3580)'
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Icon className="h-8 w-8 mr-3" />
            {title}
          </h1>
          <p className="text-blue-100">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="bg-white text-cnu-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50"
            >
              {action.label}
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
