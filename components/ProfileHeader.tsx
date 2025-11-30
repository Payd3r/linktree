import React from 'react';
import { Instagram, Linkedin } from 'lucide-react';

// Custom TikTok icon
const TikTokIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    height="24"
    width="24"
    className="w-6 h-6 text-gray-700 hover:text-black transition-colors"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

// Custom Snapchat icon
const SnapchatIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    height="24"
    width="24"
    className="w-6 h-6 text-gray-700 hover:text-black transition-colors"
  >
    <path d="M12.003 3.5c-2.3 0-4.4.9-5.4 2.6a5.7 5.7 0 0 0-.2 1.9c.1 1.2.6 1.8 1 2.2 0 .1.1.2.1.4 0 .4-.3.6-.5.7-.7.4-1.3 1-1.3 2 0 1 .8 1.8 1.8 2.3-1.6 1.1-.3 2.6 1 3 .6.1 1.2.2 1.2.6 0 .3-.2.4-.6.4-1.2.2-2.1.2-2.8-.8-.4-.5-1-.5-1.4-.2-.5.3-.4 1-.1 1.5.5.9 1.6 1.4 3 1.4 1.1 0 2.2-.2 2.7-.4.5-.1.8-.2 1.5-.2 1.1 0 1.5.2 1.5.2.5.2 1.6.4 2.7.4 1.4 0 2.5-.5 3-1.4.3-.5.4-1.2-.1-1.5-.4-.3-1-.3-1.4.2-.7 1-1.6 1-2.8.8-.4 0-.6-.1-.6-.4 0-.4.6-.5 1.2-.6 1.3-.4 2.6-1.9 1-3 .9-.4 1.8-1.3 1.8-2.3 0-1-.6-1.6-1.3-2-.3-.1-.5-.3-.5-.7 0-.1.1-.3.1-.4.4-.4.9-1 1-2.2 0-.6-.1-1.3-.2-1.9-1-1.7-3.1-2.6-5.4-2.6Z" />
  </svg>
);

export const ProfileHeader: React.FC = () => {
  return (
    <div className="relative w-full flex flex-col items-center mb-12">
      {/* Background Image Container */}
      <div className="w-full h-[350px] relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop" 
          alt="Background" 
          className="w-full h-full object-cover animate-zoom-out"
        />
        
        {/* Soft light gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white/90"></div>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center -mt-24 z-10 w-full px-4">
        {/* Profile Image */}
        <div className="w-36 h-36 rounded-full border-4 border-white shadow-xl overflow-hidden mb-5 bg-white animate-scale-in" style={{ animationDelay: '200ms' }}>
          <img 
            src="images/profile.jpg" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Username */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight animate-fade-up" style={{ animationDelay: '300ms' }}>
          @ilariaugc
        </h1>
        
        <p className="text-gray-500 text-sm mb-6 font-medium animate-fade-up" style={{ animationDelay: '400ms' }}>
          Travel Consultant & Australia Expert
        </p>

        {/* Social Icons - Dark Gray for professional look */}
        <div className="flex items-center gap-8 mb-4 animate-fade-up" style={{ animationDelay: '500ms' }}>
          <a href="#" className="hover:scale-110 transition-transform duration-300"><Instagram size={24} className="text-gray-700 hover:text-black" /></a>
          <a href="#" className="hover:scale-110 transition-transform duration-300"><TikTokIcon /></a>
          <a href="#" className="hover:scale-110 transition-transform duration-300"><Linkedin size={24} className="text-gray-700 hover:text-black" /></a>
          <a href="#" className="hover:scale-110 transition-transform duration-300"><SnapchatIcon /></a>
        </div>
      </div>
    </div>
  );
};