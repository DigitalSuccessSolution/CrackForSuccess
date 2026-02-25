import React from "react";

export const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div>
        {[...Array(rows)].map((_, i) => (
          <div
            key={i}
            className="flex items-center px-6 py-4 border-b border-gray-100 last:border-0"
          >
            <Skeleton className="h-5 w-5 rounded-full mr-6" />
            <div className="flex-1">
              <Skeleton className="h-5 w-3/4 mb-2" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full mx-4" />
            <Skeleton className="h-6 w-24 mx-4 hidden md:block" />
            <Skeleton className="h-8 w-20 rounded-lg ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const TabsSkeleton = () => {
  return (
    <div className="flex gap-3 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-32 rounded-full flex-shrink-0" />
      ))}
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="flex items-center gap-6">
      <div className="hidden md:flex flex-col items-end gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-32 flex flex-col justify-between"
        >
          <div className="flex justify-between">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
};

export const DetailPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header/Nav Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar Skeleton */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <Skeleton className="h-6 w-1/2 mb-4" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-8 w-full rounded" />
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex gap-3 mb-6">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
              <Skeleton className="h-10 w-3/4 mb-8" />

              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>

          {/* Right Sidebar Skeleton */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <Skeleton className="h-6 w-1/3 mb-4" />
              <div className="flex gap-2 flex-wrap">
                <Skeleton className="h-8 w-16 rounded" />
                <Skeleton className="h-8 w-20 rounded" />
                <Skeleton className="h-8 w-12 rounded" />
              </div>
            </div>
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CodingProblemSkeleton = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
      {/* Header Skeleton */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white shrink-0">
        <div className="flex gap-4 items-center">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-64 rounded" />
        </div>
        <Skeleton className="h-8 w-24 rounded" />
      </div>

      <div className="flex flex-1 flex-col md:flex-row p-4 gap-4 overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-full md:w-3/5 lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-300 p-6 overflow-hidden">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <div className="flex gap-2 mb-6">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>

          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton
                key={i}
                className={`h-4 ${i % 2 === 0 ? "w-full" : "w-5/6"}`}
              />
            ))}
          </div>
        </div>

        {/* Right Panel - Action/Editor */}
        <div className="w-full md:w-2/5 lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-300 p-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm space-y-6">
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
