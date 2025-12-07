import React from 'react';

export const Pricing = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto mt-20">
            <h2 className="text-4xl font-bold mb-8 text-center">Plans for every mind</h2>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
                    <h3 className="text-xl font-bold mb-2">Basic</h3>
                    <div className="text-3xl font-bold mb-4">$0</div>
                    <ul className="text-sm text-white/60 space-y-2 mb-6">
                        <li>• Basic CMFK Tracking</li>
                        <li>• 3 Workspace Apps</li>
                        <li>• Standard Support</li>
                    </ul>
                    <button className="w-full py-2 rounded bg-white/10 hover:bg-white/20">Select</button>
                </div>
                <div className="border border-purple-500/50 rounded-2xl p-6 bg-purple-900/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-purple-500 text-xs font-bold px-2 py-1 rounded-bl">POPULAR</div>
                    <h3 className="text-xl font-bold mb-2">Pro</h3>
                    <div className="text-3xl font-bold mb-4">$29</div>
                    <ul className="text-sm text-white/60 space-y-2 mb-6">
                        <li>• Advanced CMFK Analytics</li>
                        <li>• Unlimited Apps</li>
                        <li>• BILL Runtime Priority</li>
                    </ul>
                    <button className="w-full py-2 rounded bg-purple-600 hover:bg-purple-700">Select</button>
                </div>
            </div>
            <div className="mt-8 text-center">
                <button onClick={() => window.location.hash = ''} className="text-white/40 hover:text-white underline">Back to Home</button>
            </div>
        </div>
    </div>
  );
};
