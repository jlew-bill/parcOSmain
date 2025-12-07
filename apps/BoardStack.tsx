import React from 'react';
import { IconLayout } from '../components/Icons';

export const BoardStack = () => {
  return (
    <div className="h-full flex flex-col text-white">
         <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <IconLayout className="text-orange-400" />
            Project Board
         </h2>
         
         <div className="flex-1 flex gap-3 overflow-x-auto pb-2">
             {['To Do', 'In Progress', 'Done'].map(col => (
                 <div key={col} className="w-40 flex-shrink-0 bg-white/5 rounded-lg p-2 border border-white/10 flex flex-col">
                     <div className="text-xs font-bold text-white/40 mb-2 uppercase">{col}</div>
                     <div className="space-y-2">
                         <div className="bg-white/10 p-2 rounded text-xs border border-white/5 hover:bg-white/20 cursor-pointer">
                             Update Metadata
                         </div>
                         <div className="bg-white/10 p-2 rounded text-xs border border-white/5 hover:bg-white/20 cursor-pointer">
                             Review Q3 goals
                         </div>
                     </div>
                 </div>
             ))}
         </div>
    </div>
  );
};
