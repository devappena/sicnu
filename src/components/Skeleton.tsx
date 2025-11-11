import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 4 }) => (
  <div className="w-full">
    {/* Header skeleton */}
    <div className="flex space-x-4 mb-4">
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} className="h-6 flex-1" />
      ))}
    </div>
    
    {/* Rows skeleton */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4 mb-3">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-8 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

interface CardSkeletonProps {
  count?: number;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow p-6">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    ))}
  </div>
);

interface ListSkeletonProps {
  count?: number;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-1/3 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
    ))}
  </div>
);
