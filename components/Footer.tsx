import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-10 border-t border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <p className="text-gray-400 text-xs">
          © {new Date().getFullYear()} ilariaugc. All rights reserved.
        </p>
        <div className="flex justify-center gap-4 mt-3">
          <a href="#" className="text-gray-400 hover:text-gray-600 text-xs">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-gray-600 text-xs">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};