import React, { useState, useEffect } from 'react';
import { IconBrain } from '../Icons';

export const SystemBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-black/20 backdrop-blur-md z-50 flex items-center justify-between px-4 text-white/80 text-xs font-medium select-none border-b border-white/5">
      <div className="flex items-center gap-4">
        <span className="font-bold flex items-center gap-1">
            <IconBrain className="w-3 h-3" /> ParcOS
        </span>
        <span className="hover:text-white cursor-pointer transition-colors">File</span>
        <span className="hover:text-white cursor-pointer transition-colors">Edit</span>
        <span className="hover:text-white cursor-pointer transition-colors">View</span>
        <span className="hover:text-white cursor-pointer transition-colors">Window</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500"></div>
           <span>Systems Nominal</span>
        </div>
        <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
};
