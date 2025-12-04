import React from 'react'
import { Instagram, Linkedin } from 'lucide-react'

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
)

const SnapchatIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    height="24"
    width="24"
    className="w-6 h-6 text-gray-700 hover:text-black transition-colors"
  >
    <path d="M21.79755,16.98718c-2.86621-.47223-4.15094-3.40149-4.204-3.52588l-.00544-.01172a1.07048,1.07048,0,0,1-.10223-.89758c.19251-.45361.82935-.6557,1.25134-.78967.10535-.03339.205-.065.28315-.096.76275-.30127.91784-.61316.91406-.8219a.66226.66226,0,0,0-.50134-.54358l-.00568-.00213a.9462.9462,0,0,0-.35632-.06824.7546.7546,0,0,0-.31287.06207,2.54,2.54,0,0,1-.95526.26612.82134.82134,0,0,1-.52954-.17725c.00915-.16992.02-.34522.0318-.53046l.004-.0653a10.10231,10.10231,0,0,0-.24091-4.03449,5.2482,5.2482,0,0,0-4.87311-3.1394q-.20114.0021-.4024.00378A5.23959,5.23959,0,0,0,6.92853,5.75293,10.08988,10.08988,0,0,0,6.68726,9.784q.01941.29872.036.59771a.8483.8483,0,0,1-.5838.17841,2.45322,2.45322,0,0,1-1.014-.26776.57538.57538,0,0,0-.2453-.04895.83387.83387,0,0,0-.81061.53265c-.08191.43061.5329.74256.90668.8902.079.03137.17822.0628.28308.096.42169.13385,1.05908.33606,1.25152.78985a1.07171,1.07171,0,0,1-.10223.89783l-.00537.01154a7.02828,7.02828,0,0,1-1.06915,1.66211,5.21488,5.21488,0,0,1-3.13483,1.86389.23978.23978,0,0,0-.20044.25006.38046.38046,0,0,0,.031.12964c.17578.41113,1.05822.75061,2.55182.981.13964.02161.19873.24927.28027.6222.03259.14929.06634.30426.1134.46423a.29261.29261,0,0,0,.31922.22876,2.48528,2.48528,0,0,0,.42492-.06091,5.52912,5.52912,0,0,1,1.12036-.12677,4.95367,4.95367,0,0,1,.8078.0683,3.87725,3.87725,0,0,1,1.535.78417,4.443,4.443,0,0,0,2.6897,1.06006c.03375,0,.06744-.00122.10009-.004.04114.00195.09522.004.15192.004a4.44795,4.44795,0,0,0,2.69122-1.06079,3.87269,3.87269,0,0,1,1.53351-.78332,4.97275,4.97275,0,0,1,.808-.0683,5.59252,5.59252,0,0,1,1.12037.11871,2.39142,2.39142,0,0,0,.425.05371h.02338a.279.279,0,0,0,.29547-.221c.04645-.15784.08045-.308.11389-.46131.08081-.371.1399-.59759.28009-.61926,1.494-.23078,2.37641-.56976,2.551-.97858a.38487.38487,0,0,0,.03174-.13086A.24.24,0,0,0,21.79755,16.98718Z" />
  </svg>
)

export const ProfileHeader = () => {
  return (
    <div className="relative w-full flex flex-col items-center mb-12">
      <div className="w-full h-[350px] relative overflow-hidden">
        <img
          src="/header-bg.jpg"
          alt="Background"
          className="w-full h-full object-cover animate-zoom-out"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white/90"></div>
      </div>

      <div className="flex flex-col items-center -mt-24 z-10 w-full px-4">
        <div
          className="w-36 h-36 rounded-full border-4 border-white shadow-xl overflow-hidden mb-5 bg-white animate-scale-in"
          style={{ animationDelay: '200ms' }}
        >
          <img src="/profile.jpg" alt="Profile" className="w-full h-full object-cover" />
        </div>

        <h1
          className="text-3xl font-bold text-gray-900 mb-2 tracking-tight animate-fade-up"
          style={{ animationDelay: '300ms' }}
        >
          @ilariaugc
        </h1>

        <p
          className="text-gray-500 text-sm mb-6 font-medium animate-fade-up"
          style={{ animationDelay: '400ms' }}
        >
          Travel Consultant & Australia Expert
        </p>

        <div
          className="flex items-center gap-8 mb-4 animate-fade-up"
          style={{ animationDelay: '500ms' }}
        >
          <a href="https://www.instagram.com/ilariaugc/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
            <Instagram size={24} className="text-gray-700 hover:text-black" />
          </a>
          <a href="https://www.tiktok.com/@ilaria_ugc" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
            <TikTokIcon />
          </a>
          <a href="https://www.linkedin.com/in/ilaria-gatti-598a1b218/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
            <Linkedin size={24} className="text-gray-700 hover:text-black" />
          </a>
          <a href="https://snapchat.com/t/2wu8Ah5q" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
            <SnapchatIcon />
          </a>
        </div>
      </div>
    </div>
  )
}



