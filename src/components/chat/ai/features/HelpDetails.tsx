
import React from 'react';
import { X } from 'lucide-react';

interface HelpDetailsProps {
  details: {
    title: string;
    content: string;
  };
}

export const HelpDetails: React.FC<HelpDetailsProps> = ({ details }) => {
  return (
    <div className="fixed bottom-20 right-4 bg-cyberdark-900 border border-cybergold-500/40 rounded-lg p-4 shadow-lg max-w-sm w-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-cybergold-400">{details.title}</h3>
        <button className="p-1 rounded-full hover:bg-cyberdark-800">
          <X className="w-5 h-5 text-cybergold-400" />
        </button>
      </div>
      
      <div className="prose prose-invert prose-sm max-w-none text-cybergold-300">
        {details.content}
      </div>
    </div>
  );
};
