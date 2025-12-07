import React from 'react';
import { IconPenTool } from '../components/Icons';

export const CreatorStack = () => {
  return (
    <div className="h-full flex flex-col text-white">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <IconPenTool className="text-purple-400" />
            </div>
            <div>
                <h2 className="font-bold text-lg">Creator Studio</h2>
                <p className="text-xs text-white/40">Powered by Gemini</p>
            </div>
        </div>

        <div className="flex-1 space-y-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-xs font-bold text-white/30 mb-2">SCRIPT GENERATOR</div>
                <div className="text-sm text-white/70 italic">
                    "Hey everyone, welcome back to the channel. Today we're diving into the new ParcOS update..."
                </div>
                <div className="mt-3 flex gap-2">
                    <button className="px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 rounded text-xs transition-colors">Regenerate</button>
                    <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors">Copy</button>
                </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-xs font-bold text-white/30 mb-2">ENGAGEMENT INSIGHTS</div>
                 <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                     <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                 </div>
                 <div className="text-xs text-right text-white/50">75% Audience Retention</div>
            </div>
        </div>
    </div>
  );
};
