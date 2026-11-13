import React from 'react';

export const CycleCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-stone-200 p-3 sm:p-4 animate-pulse">
    <div className="w-full aspect-4/3 bg-stone-200 rounded-xl mb-3" />
    <div className="h-4 bg-stone-200 rounded w-3/4 mb-2" />
    <div className="h-3 bg-stone-200 rounded w-1/2 mb-3" />
    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
      <div className="h-5 bg-stone-200 rounded w-1/3" />
      <div className="h-8 bg-stone-200 rounded-lg w-1/3" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="animate-pulse">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-stone-200 rounded w-full" />
      </td>
    ))}
  </tr>
);
